# Industryhead

Decision intelligence for manufacturing — marketing site and product tour. **React (Vite)** client + **Node (Express)** API,
deployable on **Vercel**.

```
client/        React 19 + Vite  (src/components, src/hooks, src/styles.css, src/editorial.css)
server/src/    Express 5 API    (app.js routes · content.js site copy · store.js persistence · validate.js)
api/index.js   Vercel serverless entry (wraps the same Express app)
vercel.json    build, rewrites, security headers
index.html     the original static page, kept for reference
```

## Local development

Requires Node 22.5+.

```bash
npm run install:all
npm run dev        # API :4000 + Vite :5173 (proxies /api)  →  http://localhost:5173   (admin: /admin — see below for the token)
npm test           # API tests: SQLite and Postgres (in-process PGlite)
```

Without `DATABASE_URL` the API stores data in a local SQLite file (`server/data/`, git-ignored). The API reads a project-root `.env`
if present. Without an `ADMIN_TOKEN`, development runs print a one-off random admin token to the console.

## Deploy on Vercel

0. **Check locally:** `npm run check` (tests + production build). Push to GitHub (`industryhead/industryhead-website`).
1. **Import** the repository in Vercel. The framework preset can stay *Other*; `vercel.json` sets the install (`npm ci`) and build commands,
   the output directory (`client/dist`) and the function region (`iad1`, next to a Neon us-east-1 database — change it if your database
   lives elsewhere). Node 22 is selected from `package.json`.
2. **Add a Postgres database** (Vercel → Storage → *Neon* or any Postgres) and make sure `DATABASE_URL` (or `POSTGRES_URL`) is set for the project — the integration usually adds it for you.
   Tables are created on first use.
3. **Set environment variables** (Production + Preview): `DATABASE_URL` and `ADMIN_TOKEN` (any length; long and random is safest — an empty value
   or the `.env.example` placeholder leave admin disabled). Recommended once the domain is connected: `VITE_SITE_URL` (e.g.
   `https://www.example.com`; adds canonical links, absolute share images and `sitemap.xml` — redeploy after setting it, as it is read at
   build time). Optional: `ENQUIRY_WEBHOOK_URL` (https; notified of each new enquiry), `VITE_CONTACT_EMAIL` (public contact address on the
   footer and legal pages), `PGSSL_NO_VERIFY=1` (only for a database with a private CA). See `.env.example`.
4. Deploy. The site is served from the CDN; `/api/*` runs as a serverless function; `/admin` is the enquiries dashboard.
   Check `https://<deployment>/api/health?db=1` → `"db":"ok"`.
5. **Custom domain:** Vercel → Project → Settings → Domains → add `example.com` and `www.example.com` (redirect one to the other), then
   create the DNS records Vercel shows at your registrar.

Without `DATABASE_URL`, the site and `/api/content` still work, but the enquiry form and the stored product-tour state answer
`503 Storage is not configured`. Without `ADMIN_TOKEN`, the admin API answers 503.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | liveness + which store is active |
| GET | `/api/content` | platform layers, method stages, supply chain, comparison, industries, services, steps, trust, form options |
| GET | `/api/cost` | illustrative cost-of-stops figure + per-second rate (the client ticks from it) |
| GET/POST/PATCH | `/api/tour…` | product-tour state, private to a visitor (`X-Demo-Session` header) |
| POST | `/api/enquiries` | demo enquiry — validated, stored, rate-limited, honeypot field |
| GET | `/api/admin/enquiries[?status=]` | list — `Authorization: Bearer $ADMIN_TOKEN` |
| PATCH | `/api/admin/enquiries/:id` | status: `new` · `contacted` · `scheduled` · `closed` |
| DELETE | `/api/admin/enquiries/:id` | delete an enquiry (data-subject erasure requests) |
| GET | `/api/admin/enquiries.csv` | CSV export (spreadsheet formulas neutralised) |

Pages: `/` (site), `/privacy`, `/terms`, `/admin`; anything else shows a 404 page. `robots.txt` keeps `/admin` and `/api/` out of search.

## Things to know

- **Enquiries are stored, not emailed.** Check `/admin`, or set `ENQUIRY_WEBHOOK_URL` to get a message (Slack/Teams/Zapier) for each one. No calendar is connected;
  the form collects a *preferred* slot only.
- **Rate limits are per serverless instance** (in-memory), so they slow abuse but are not a hard cap on Vercel. Put Vercel's Firewall /
  WAF rate limiting in front for a hard limit.
- Figures in the hero and product tour are illustrative sample data, as labelled on the page.
- Running on your own host instead: `npm start` builds the client and serves everything from one Node process (`server/src/index.js`).
- The enquiry form requires consent to the privacy notice. The privacy notice and terms in `client/src/components/Pages.jsx` are a
  plain-language starting point: have them reviewed for your jurisdiction and add your legal entity details.
- The Postgres connection verifies TLS certificates. If your provider uses a private CA, prefer `NODE_EXTRA_CA_CERTS` over `PGSSL_NO_VERIFY=1`.
