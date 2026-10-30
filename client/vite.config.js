import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { appendFileSync, copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve(import.meta.dirname, "dist");
const INDEXED = ["/", "/privacy", "/terms"]; // public pages listed in sitemap.xml

/** Ships dist/404.html (the same app, which renders its 404 page): Vercel serves it with status 404 for unknown paths. */
const notFoundPage = () => ({
  name: "not-found-page",
  apply: "build",
  closeBundle() { copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html")); }
});

/**
 * With VITE_SITE_URL (the live domain, e.g. https://www.example.com): absolute share-image URLs in the HTML,
 * plus sitemap.xml and a Sitemap line in robots.txt. Without it the build still works, just without those.
 */
const siteUrl = (url) => ({
  name: "site-url",
  transformIndexHtml: (html) => url ? html.replaceAll('"/logo.png"', `"${url}/logo.png"`).replace('"logo":', `"url":"${url}/","logo":`) : html,
  closeBundle() {
    if (!url) return;
    const today = new Date().toISOString().slice(0, 10);
    writeFileSync(resolve(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${INDEXED.map((p) => `  <url><loc>${url}${p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
    appendFileSync(resolve(dist, "robots.txt"), `\nSitemap: ${url}/sitemap.xml\n`);
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(import.meta.dirname, ".."), "VITE_");
  const url = (env.VITE_SITE_URL || "").replace(/\/+$/, "");
  if (url && !/^https:\/\/[^/]+$/.test(url)) throw new Error(`VITE_SITE_URL must look like https://www.example.com (got "${url}")`);
  return {
    plugins: [react(), siteUrl(url), notFoundPage()],
    server: { port: 5173, proxy: { "/api": { target: "http://localhost:4000", changeOrigin: false } } },
    envDir: "..", // read VITE_* from the project-root .env
    build: { outDir: "dist", sourcemap: false }
  };
});
