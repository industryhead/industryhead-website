import { Component, useEffect } from "react";
import { site } from "../site.js";
import { Footer } from "./Sections.jsx";

const contact = site.contactEmail
  ? <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
  : <>the <a href="/#demo">enquiry form</a> on our home page</>;

/** Shared frame for the standalone pages: a slim header, the body and the site footer. */
export function PageShell({ title, eyebrow, children }) {
  useEffect(() => { document.title = `${title} | ${site.name}`; }, [title]);
  return (
    <>
      <header className="pg-top">
        <div className="wrap">
          <a className="brand" href="/" aria-label={`${site.name} home`}><img src="/logo.png" alt={site.name} className="brand-logo" /></a>
          <a className="btn btn-sm btn-primary" href="/#demo">Explore a demo</a>
        </div>
      </header>
      <main id="main" className="pg">
        <div className="wrap pg-body">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {children}
        </div>
      </main>
      <Footer home="/" />
    </>
  );
}

export function Privacy() {
  return (
    <PageShell title="Privacy notice" eyebrow={`Last updated ${site.updated}`}>
      <p className="lead">This notice explains what we collect through this website, why, and the choices you have.</p>

      <h2>What we collect</h2>
      <p><b>Demo and pricing enquiries.</b> When you send the enquiry form we store your name, work email, company, role, country,
        number of sites, what you would like to improve, and your preferred meeting date, time, time zone and duration, together
        with a reference number and the time it was received.</p>
      <p><b>Product tour.</b> The interactive tour keeps a random identifier in your browser's local storage so that your changes to the
        sample data are kept between visits. The identifier is not linked to you, and tour data is deleted after 24 hours of inactivity.</p>
      <p><b>Technical data.</b> Our hosting provider processes your IP address to deliver the site and to limit abusive traffic. We do not
        use advertising or analytics cookies, and we do not track you across other websites.</p>

      <h2>Why we use it</h2>
      <ul>
        <li>To reply to your enquiry, arrange a demo and prepare a proposal — the reason you contacted us.</li>
        <li>To keep the website secure and available.</li>
      </ul>
      <p>We do not sell your information or use it for unrelated marketing.</p>

      <h2>Who can see it</h2>
      <p>Enquiries are visible only to authorised members of our team. They are held with our hosting and database providers, who process
        them on our behalf under their own security commitments.</p>

      <h2>How long we keep it</h2>
      <p>We keep an enquiry for as long as we need it to deal with your request and any relationship that follows, and delete it when it is
        no longer needed or when you ask us to.</p>

      <h2>Your choices</h2>
      <p>You can ask to see, correct or delete the information we hold about you, or object to how we use it, by contacting us through {contact}.
        Please include your enquiry reference if you have one. You may also have the right to complain to your local data protection authority.</p>

      <h2>Changes</h2>
      <p>If we change this notice we will update the date at the top of this page.</p>
    </PageShell>
  );
}

export function Terms() {
  return (
    <PageShell title="Terms of use" eyebrow={`Last updated ${site.updated}`}>
      <p className="lead">By using this website you agree to these terms.</p>

      <h2>About the content</h2>
      <p>This site describes {site.name} and its services. Figures shown in the hero, the product tour and the comparison are illustrative
        sample data, not measurements from any real plant, and comparisons describe typical approaches rather than specific products.
        Nothing on the site is an offer or a guarantee of results; pricing and scope are agreed in writing.</p>

      <h2>Demo enquiries</h2>
      <p>Choosing a preferred time in the enquiry form does not book a meeting. A meeting is confirmed only when our team replies.</p>

      <h2>Acceptable use</h2>
      <p>Please do not try to disrupt the site, access areas that are not meant for you, send automated or misleading enquiries, or
        use the site in a way that breaks the law.</p>

      <h2>Intellectual property</h2>
      <p>The {site.name} name, logos, text, design and software on this site belong to us or our licensors. You may view and share pages for
        your own evaluation, but not copy or reuse them commercially without our permission.</p>

      <h2>Liability</h2>
      <p>The site is provided “as is”. To the extent the law allows, we are not liable for losses arising from its use or from relying on
        its illustrative content.</p>

      <h2>Contact</h2>
      <p>Questions about these terms are welcome through {contact}. See also our <a href="/privacy">privacy notice</a>.</p>
    </PageShell>
  );
}

const DESTINATIONS = [
  { href: "/", label: "Home", keys: ["home", "index"] },
  { href: "/#tour", label: "Product tour", keys: ["tour", "product"] },
  { href: "/#platform", label: "Platform", keys: ["platform", "features"] },
  { href: "/#method", label: "Our method", keys: ["method"] },
  { href: "/#compare", label: "Compare approaches", keys: ["compare", "comparison"] },
  { href: "/#demo", label: "Pricing & demo", keys: ["demo", "pricing", "price", "contact", "book"] },
  { href: "/privacy", label: "Privacy notice", keys: ["privacy", "gdpr"] },
  { href: "/terms", label: "Terms of use", keys: ["terms", "legal", "tos"] }
];

/** Edit distance, for "did you mean" on mistyped URLs. */
function distance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
}

/** The destination whose keyword is closest to the last segment of the wrong path, if it is close enough. */
function closest(path) {
  const word = decodeURIComponent(path).toLowerCase().split("/").filter(Boolean).pop()?.replace(/\.html?$/, "") ?? "";
  if (!word) return null;
  let best = null, bestD = Infinity;
  for (const d of DESTINATIONS) for (const k of d.keys) { const n = distance(word, k); if (n < bestD) { best = d; bestD = n; } }
  return bestD <= Math.max(1, Math.floor(word.length / 3)) ? best : null;
}

export function NotFound() {
  const path = location.pathname;
  const guess = closest(path);
  const cameFromSite = document.referrer.startsWith(location.origin) && history.length > 1;
  useEffect(() => {
    const m = document.createElement("meta"); m.name = "robots"; m.content = "noindex";
    document.head.appendChild(m); return () => m.remove();
  }, []);
  return (
    <PageShell title="Page not found" eyebrow="Error 404">
      <p className="nf-mark" aria-hidden="true">404</p>
      <p className="lead">We couldn't find <code className="nf-path">{path}</code>. The link may be mistyped or out of date, or the page may have moved.</p>
      {guess && <p className="nf-guess">Were you looking for <a href={guess.href}>{guess.label}</a>?</p>}
      <p className="pg-actions">
        <a className="btn btn-primary" href="/">Back to the home page</a>
        {cameFromSite && <button type="button" className="btn mt-btn" onClick={() => history.back()}>Go back</button>}
      </p>
      <h2>Popular pages</h2>
      <ul className="nf-links">
        {DESTINATIONS.map((d) => <li key={d.href}><a href={d.href}>{d.label}</a></li>)}
      </ul>
    </PageShell>
  );
}

/** Last line of defence: a render error shows a way out instead of a blank page. */
export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error, info) { console.error(error, info.componentStack); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="pg"><div className="wrap pg-body" role="alert">
        <h1>Something went wrong</h1>
        <p className="lead">This page hit an unexpected error. Reloading usually fixes it.</p>
        <p className="pg-actions"><button className="btn btn-primary" onClick={() => location.reload()}>Reload the page</button><a className="btn mt-btn" href="/">Home page</a></p>
      </div></main>
    );
  }
}
