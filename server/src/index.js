// Long-running server: local development, and any host that runs a Node process (Render, Fly, a VM, Docker).
// On Vercel the same app is exported from /api/index.js instead.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { storeFromEnv } from "./store.js";
import { createApp, adminTokenFromEnv } from "./app.js";

const here = dirname(fileURLToPath(import.meta.url));
// Optional project-root .env (loaded here, not with --env-file, because `node --watch` crashes when that file is missing).
// Variables already set in the environment win.
const envFile = resolve(here, "../../.env");
if (existsSync(envFile)) process.loadEnvFile(envFile);
const prod = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 4000);
// A missing ADMIN_TOKEN never falls back to a fixed, guessable value: outside production a random one is made per run.
let adminToken = adminTokenFromEnv();
if (!adminToken && !prod) { adminToken = randomBytes(24).toString("base64url"); console.warn(`[admin] ADMIN_TOKEN not set — using a one-off development token for this run: ${adminToken}`); }
if (!adminToken && prod) console.warn("[admin] ADMIN_TOKEN missing or too short (32+ characters) — the admin API is disabled.");

const store = await storeFromEnv();
console.log(`[store] ${store.kind}`);
await store.pruneSessions().catch((e) => console.warn("[store] prune skipped:", e.message));
setInterval(() => store.pruneSessions().catch(() => {}), 6 * 3600_000).unref();

const app = createApp({ store, adminToken, staticDir: resolve(here, process.env.CLIENT_DIST || "../../client/dist"), trustProxy: process.env.TRUST_PROXY === "1", notifyUrl: process.env.ENQUIRY_WEBHOOK_URL });
const server = app.listen(port, () => console.log(`Industryhead API listening on http://localhost:${port}${prod ? "" : " (dev)"}`));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => server.close(async () => { await store.close(); process.exit(0); }));
