// Site-wide settings. VITE_* values come from the project-root .env at build time (see .env.example).
export const site = {
  name: "Industryhead",
  url: (import.meta.env.VITE_SITE_URL || "").replace(/\/+$/, ""), // live domain, for canonical links
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || "",
  updated: "30 October 2026" // last revision of the privacy notice and terms
};
