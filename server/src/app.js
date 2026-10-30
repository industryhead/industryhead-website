import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { join } from "node:path";
import * as content from "./content.js";
import { STATUSES } from "./store.js";
import { validateEnquiry, SESSION_RE } from "./validate.js";

const clone = (o) => JSON.parse(JSON.stringify(o));
const safeEqual = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
const ID_RE = /^[1-9]\d{0,9}$/;
// Client-side pages (keep in step with PAGES in client/src/App.jsx and the rewrites in vercel.json)
export const PAGES = new Set(["", "/admin", "/privacy", "/terms"]);

/** ADMIN_TOKEN, unless it is short enough to guess or still the placeholder from .env.example (then admin stays disabled). */
export function adminTokenFromEnv(env = process.env) {
  const t = (env.ADMIN_TOKEN || "").trim();
  return t.length >= 32 && !/change-me/i.test(t) ? t : undefined;
}

/** Posts a short notice about a new enquiry to a webhook (Slack, Teams, Zapier, …). Never fails the request. */
async function notify(url, e, reference) {
  if (!url) return;
  const text = `New demo enquiry ${reference}: ${e.name} (${e.role}, ${e.company}, ${e.country}) — ${e.sites}; preferred ${e.date} ${e.time} ${e.timezone}.`;
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, reference }), signal: AbortSignal.timeout(3000), redirect: "error" });
    if (!r.ok) console.warn(`[notify] webhook answered ${r.status}`);
  } catch (err) { console.warn("[notify] webhook failed:", err.name); }
}

export function createApp({ store, adminToken, staticDir, trustProxy = false, notifyUrl, now = () => Date.now() }) {
  if (notifyUrl && !/^(https:\/\/|http:\/\/(127\.0\.0\.1|localhost)[:/])/i.test(notifyUrl)) { console.warn("[notify] ENQUIRY_WEBHOOK_URL must be https:// — notifications disabled."); notifyUrl = undefined; }
  const app = express();
  if (trustProxy) app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet({
    contentSecurityPolicy: { directives: { "default-src": ["'self'"], "style-src": ["'self'", "'unsafe-inline'"], "img-src": ["'self'", "data:"], "connect-src": ["'self'"], "object-src": ["'none'"], "frame-ancestors": ["'none'"], "upgrade-insecure-requests": null } },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  }));
  app.use((_req, res, next) => { res.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()"); next(); });
  app.use(express.json({ limit: "20kb" }));

  // ---------- public content ----------
  const publicContent = {
    features: content.features, stages: content.stages, chain: content.chain, comparison: content.comparison,
    industries: content.industries, services: content.services, steps: content.steps, trust: content.trust,
    form: { timezones: content.timezones, sites: content.sitesOptions, durations: content.durations }
  };
  // /api/health is a liveness check; /api/health?db=1 also tries the database and reports the failure code (never the connection string)
  app.get("/api/health", async (req, res) => {
    const out = { ok: true, store: store.kind };
    if (req.query.db) { try { await store.ping(); out.db = "ok"; } catch (e) { out.db = "error"; out.detail = e.message; } }
    res.json(out);
  });
  app.get("/api/content", (_req, res) => { res.set("Cache-Control", "public, max-age=300"); res.json(publicContent); });

  // ---------- illustrative cost ticker ----------
  // A pure function of the wall clock, so every serverless instance agrees. The client syncs once and then ticks locally.
  const cost = () => {
    const at = now(), sec = Math.floor(at / 1000) % 3600; // wraps hourly so the demo figure never grows without bound
    const { baseCost: b } = content.tourStatic;
    return { total: b.total + b.perSecond * sec, stop: b.stop + b.perSecond * sec, perSecond: b.perSecond, at };
  };
  app.get("/api/cost", (_req, res) => { res.set("Cache-Control", "no-store"); res.json(cost()); });

  // ---------- product tour: state is private to each visitor's session ----------
  const tourLimiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false });
  const tour = express.Router();
  tour.use(tourLimiter, async (req, res, next) => {
    const s = req.get("x-demo-session");
    if (!s || !SESSION_RE.test(s)) return res.status(400).json({ error: "Missing or invalid X-Demo-Session header." });
    req.session = s;
    req.state = (await store.loadSession(s)) ?? clone(content.tourSeed);
    next();
  });
  const view = (state) => ({ ...clone(content.tourStatic), machines: state.machines, actions: state.actions });
  tour.get("/", (req, res) => res.json(view(req.state)));
  tour.post("/machines/:id/reason", async (req, res) => {
    const m = req.state.machines.find((x) => x.id === req.params.id);
    if (!m) return res.status(404).json({ error: "Unknown machine." });
    if (m.st !== "stop") return res.status(409).json({ error: "Only a stopped machine has a stop reason." });
    const reason = req.body?.reason;
    if (!content.tourStatic.reasons.includes(reason)) return res.status(422).json({ error: "Unknown reason." });
    m.note = reason; await store.saveSession(req.session, req.state);
    res.json(view(req.state));
  });
  tour.post("/actions", async (req, res) => {
    const m = req.state.machines.find((x) => x.id === req.body?.machineId);
    if (!m) return res.status(404).json({ error: "Unknown machine." });
    if (req.state.actions.length >= 25) return res.status(409).json({ error: "Demo limit reached." });
    const id = Math.max(0, ...req.state.actions.map((a) => a.id)) + 1;
    req.state.actions.unshift({ id, title: `${m.id}: ${m.note}`, owner: "Owner assigned · due Thu", cost: m.st === "stop" ? `₹${cost().stop.toLocaleString("en-IN")}` : "—", stage: 0 });
    await store.saveSession(req.session, req.state);
    res.status(201).json(view(req.state));
  });
  tour.patch("/actions/:id", async (req, res) => {
    const a = req.state.actions.find((x) => x.id === Number(req.params.id));
    if (!a) return res.status(404).json({ error: "Unknown action." });
    const stage = req.body?.stage;
    if (!Number.isInteger(stage) || stage < 0 || stage > 3) return res.status(422).json({ error: "Stage must be 0-3." });
    a.stage = stage; await store.saveSession(req.session, req.state);
    res.json(view(req.state));
  });
  app.use("/api/tour", tour);

  // ---------- demo enquiries ----------
  const enquiryLimiter = rateLimit({ windowMs: 60 * 60_000, limit: 8, standardHeaders: true, legacyHeaders: false, message: { error: "Too many enquiries from this address. Please try again later." } });
  app.post("/api/enquiries", enquiryLimiter, async (req, res) => {
    if (req.body?.website) return res.status(201).json({ id: 0, reference: "IH-RECEIVED" }); // honeypot: quietly accept, store nothing
    const r = validateEnquiry(req.body);
    if (r.errors) return res.status(422).json({ error: "Please check the highlighted fields.", errors: r.errors });
    const created = await store.createEnquiry(r.value);
    await notify(notifyUrl, r.value, created.reference); // awaited: a serverless function may be frozen once it has responded
    res.status(201).json(created);
  });

  // ---------- admin ----------
  const admin = express.Router();
  // a general cap, plus a much tighter one that only counts failed sign-ins (slows token guessing)
  const adminFailLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: true, legacyHeaders: false, skipSuccessfulRequests: true, message: { error: "Too many failed attempts. Try again later." } });
  admin.use(rateLimit({ windowMs: 15 * 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }), adminFailLimiter, (req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (!adminToken) return res.status(503).json({ error: "Admin is disabled: set ADMIN_TOKEN." });
    const h = req.get("authorization") || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : "";
    if (!token || !safeEqual(token, adminToken)) return res.status(401).json({ error: "Invalid admin token." });
    next();
  });
  admin.get("/enquiries", async (req, res) => {
    const status = req.query.status;
    if (status && !STATUSES.includes(status)) return res.status(422).json({ error: "Unknown status." });
    res.json({ statuses: STATUSES, items: await store.listEnquiries(status) });
  });
  admin.patch("/enquiries/:id", async (req, res) => {
    if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Enquiry not found." });
    if (!STATUSES.includes(req.body?.status)) return res.status(422).json({ error: "Unknown status." });
    const row = await store.setEnquiryStatus(Number(req.params.id), req.body.status);
    row ? res.json(row) : res.status(404).json({ error: "Enquiry not found." });
  });
  admin.delete("/enquiries/:id", async (req, res) => {
    if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Enquiry not found." });
    (await store.deleteEnquiry(Number(req.params.id))) ? res.status(204).end() : res.status(404).json({ error: "Enquiry not found." });
  });
  admin.get("/enquiries.csv", async (_req, res) => {
    const cols = ["reference", "created_at", "status", "name", "email", "company", "role", "country", "sites", "date", "time", "timezone", "duration", "priority"];
    // quote every cell; neutralise spreadsheet formulas
    const cell = (v) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replaceAll('"', '""') + '"'; };
    const csv = [cols.join(","), ...(await store.listEnquiries()).map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
    res.set({ "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="industryhead-enquiries.csv"' }).send(csv);
  });
  app.use("/api/admin", admin);

  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));

  // ---------- built client (production) ----------
  if (staticDir && existsSync(join(staticDir, "index.html"))) {
    app.use(express.static(staticDir, { index: false, maxAge: "1h", setHeaders: (res, p) => { if (p.includes("/assets/")) res.set("Cache-Control", "public, max-age=31536000, immutable"); } }));
    // Any other path still gets the app (it renders the 404 page) but with a real 404 status, so it is never indexed as a page.
    app.get("/{*splat}", (req, res) => res.status(PAGES.has(req.path.replace(/\/+$/, "")) ? 200 : 404).sendFile(join(staticDir, "index.html")));
  }

  app.use((err, _req, res, _next) => {
    if (err.status === 503) return res.status(503).json({ error: err.dbCode ? "The demo is temporarily unavailable. Please try again shortly." : err.message });
    if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON." });
    if (err.type === "entity.too.large") return res.status(413).json({ error: "Request too large." });
    if (err.status >= 400 && err.status < 500) return res.status(err.status).json({ error: err.expose ? err.message : "Bad request." });
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  });
  return app;
}
