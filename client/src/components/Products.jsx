import { useEffect, useState } from "react";
import { Reveal } from "../hooks/useReveal.jsx";
import { PRODUCTS, STORY, bySlug } from "../products.js";

const Check = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const Plug = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 01-12 0V8zM12 17v4" /></svg>;

const Badges = () => (
  <div className="mode-badges">
    <span className="mode-badge solo"><Check /> Works on its own</span>
    <span className="mode-badge core"><Plug /> Connects to Factory Head Core</span>
  </div>
);

const VERBS = { "factory-kaizen": "Improve", "skill-matrix": "Skill up", sop: "Standardise", audit: "Verify" };

/** The four modules on the Core backbone. The switch plugs them in or out so the difference is visible. */
function Rack() {
  const [core, setCore] = useState(false);
  return (
    <div className="rack" data-core={core ? "on" : "off"}>
      <div className="rack-ctl">
        <div className="switch" role="group" aria-label="How the products run">
          <button type="button" aria-pressed={!core} onClick={() => setCore(false)}>On their own</button>
          <button type="button" aria-pressed={core} onClick={() => setCore(true)}>Connected to the Core</button>
        </div>
        <p className="rack-status" aria-live="polite">
          {core
            ? "Plugged into Factory Head, each product works from live plant events and shares results and learning with the others. Needs the Core."
            : "Each product runs by itself and is bought separately. Your records stay inside the product."}
        </p>
      </div>
      <div className="bus">
        <img src="/logos/factoryhead.png" alt="Factory Head Core" />
        <span className="bus-led"><i></i>{core ? "Products connected" : "No products connected"}</span>
      </div>
      <div className="mods">
        {PRODUCTS.map((p) => (
          <a className="mod" href={`/products/${p.slug}`} key={p.slug}>
            <i className="plug" aria-hidden="true"></i>
            <img src={`/logos/${p.logo}.png`} alt={p.name} loading="lazy" />
            <span className="mono">{p.module}</span>
            <h3>{p.question}</h3>
            <p>{p.card}</p>
            <div className="mod-lists">
              <div className="solo" aria-hidden={core}><small>Works on its own</small><ul>{p.standalone.slice(0, 3).map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div className="core" aria-hidden={!core}><small>Adds with the Core</small><ul>{p.core.slice(0, 3).map(([t]) => <li key={t}>{t}</li>)}</ul></div>
            </div>
            <span className="mod-go">Open {p.name} <Arrow /></span>
          </a>
        ))}
      </div>
    </div>
  );
}

/** Homepage: what Factory Excellence is, the four products on the Core, and how one problem passes through them. */
export default function Suite() {
  return (
    <>
      <section id="suite" className="fx" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Factory Excellence</span>
            <h2>Improve, train, standardise, verify.<br /><em>Use one, or all four.</em></h2>
            <p className="lead">Factory Excellence is four products, one for each discipline of running a good plant. Each works on its own and can be bought separately. Connect them to the Factory Head Core and they share the same plant data.</p>
          </Reveal>
          <Reveal><Rack /></Reveal>
        </div>
      </section>

      <section id="fx-system" className="fx-system dark">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">One problem, four products</span>
            <h2>Each fix feeds the <em>next.</em></h2>
            <p className="lead">A factory has frequent defects. This is the path the problem takes. With the Core connected, each result starts the next step without anyone carrying it across.</p>
          </Reveal>
          <ol className="seq">
            {STORY.map(bySlug).map((p, k) => (
              <Reveal as="li" delay={k * 0.06} key={p.slug}>
                <span className="seq-dot" aria-hidden="true"></span>
                <small className="mono">Step {k + 1} · {VERBS[p.slug]}</small>
                <a href={`/products/${p.slug}`}><b>{p.name}</b></a>
                <p>{p.scenario}</p>
              </Reveal>
            ))}
          </ol>
          <p className="seq-return">The next audit checks the fix held, and the cycle starts again.</p>
          <div className="fx-cta"><a className="btn btn-gold" href="/#demo">Talk to us about your plant <Arrow /></a><a className="btn btn-line" href="/#platform">What the Core does</a></div>
        </div>
      </section>
    </>
  );
}

function Hero({ p }) {
  return (
    <section className="pp-hero dark" id="top" style={{ "--accent": p.accent }}>
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/products">Products</a><span>/</span><b>{p.name}</b></nav>
        <div className="pp-hero-grid">
          <div>
            <span className="logo-chip"><img src={`/logos/${p.logo}.png`} alt={p.name} /></span>
            <span className="eyebrow">{p.module}</span>
            <h1>{p.headline}</h1>
            <p className="lead">{p.intro}</p>
            <div className="hero-ctas">
              <a className="btn btn-gold" href="/#demo">Get {p.name} <Arrow /></a>
              <a className="btn btn-line" href="#modes">Standalone vs. with Core</a>
            </div>
            <Badges />
          </div>
          <aside className="keyq" aria-label="The question this product answers">
            <span>The question it answers</span>
            <p>“{p.question}”</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

const SECTIONS = [["overview", "What it does"], ["modes", "Standalone vs. Core"], ["value", "Business value"], ["together", "Better together"]];

function SubNav({ p }) {
  const [cur, setCur] = useState("overview");
  useEffect(() => {
    const on = () => {
      let c = "";
      SECTIONS.forEach(([id]) => { const e = document.getElementById(id); if (e && e.getBoundingClientRect().top < innerHeight * 0.4) c = id; });
      setCur(c);
    };
    on(); addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <div className="subnav" style={{ "--accent": p.accent }}>
      <div className="wrap">
        <b>{p.name}</b>
        <nav aria-label="On this page">{SECTIONS.map(([id, t]) => <a key={id} href={`#${id}`} className={cur === id ? "on" : undefined}>{t}</a>)}</nav>
        <a className="btn btn-primary btn-sm" href="/#demo">Get started</a>
      </div>
    </div>
  );
}

function Overview({ p }) {
  return (
    <section id="overview" style={{ "--accent": p.accent }}>
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">What it does</span>
          <h2>Purpose and <em>functionality.</em></h2>
          <p className="lead">{p.purpose}</p>
        </Reveal>
        <div className="cap-grid">
          {p.capabilities.map(([t, x], k) => (
            <Reveal className="cap" delay={(k % 3) * 0.06} key={t}><span className="cap-n mono">{String(k + 1).padStart(2, "0")}</span><h3>{t}</h3><p>{x}</p></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modes({ p }) {
  const [mode, setMode] = useState("solo");
  return (
    <section id="modes" className="modes" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Standalone or connected</span>
          <h2>Two ways to run {p.name}. <em>You choose.</em></h2>
          <p className="lead">{p.name} is a full product by itself. Connecting it to the Factory Head Core is optional, and adds the capabilities on the right.</p>
        </Reveal>

        <div className="mode-switch" role="tablist" aria-label="Choose how to view the product">
          <button role="tab" aria-selected={mode === "solo"} className={mode === "solo" ? "on" : ""} onClick={() => setMode("solo")}><Check /> Standalone</button>
          <button role="tab" aria-selected={mode === "core"} className={mode === "core" ? "on" : ""} onClick={() => setMode("core")}><Plug /> Connected to Core</button>
        </div>
        <div className="mode-cols" data-mode={mode}>
          <Reveal className="mode-col solo">
            <header><span className="mode-badge solo"><Check /> Standalone</span><h3>{p.name} on its own</h3><p>Buy and use it separately, with no Core required.</p></header>
            <ul>{p.standalone.map((x) => <li key={x}><Check />{x}</li>)}</ul>
            <footer>Your data lives in {p.name}. You can connect to the Core later without starting over.</footer>
          </Reveal>

          <Reveal className="mode-col core" delay={0.08}>
            <header><span className="mode-badge core"><Plug /> Connected to Core</span><h3>{p.name} + Factory Head</h3><p>Everything in standalone, plus:</p></header>
            <ul>{p.core.map(([t, x]) => <li key={t}><Plug /><span><b>{t}</b>{x}</span></li>)}</ul>
            <footer>Requires the Factory Head Core.</footer>
          </Reveal>
        </div>

        <Reveal className="link-diagram" aria-label={`How ${p.name} connects to the Core`}>
          <div className="node core-node"><img src="/logos/factoryhead.png" alt="Factory Head Core" loading="lazy" /><small>Core platform</small></div>
          <div className="wires">
            <p><span>Events, losses, orders and baselines</span><Arrow /></p>
            <p className="back"><Arrow /><span>Records, actions and verified outcomes</span></p>
          </div>
          <div className="node"><img src={`/logos/${p.logo}.png`} alt={p.name} loading="lazy" /><small>{p.module}</small></div>
        </Reveal>
      </div>
    </section>
  );
}

function Value({ p }) {
  return (
    <section id="value" className="value dark">
      <div className="wrap val-grid">
        <Reveal>
          <span className="eyebrow">Business value</span>
          <h2>What you get from <em>{p.name}.</em></h2>
          <ul className="val-list">{p.value.map((x) => <li key={x}><Check />{x}</li>)}</ul>
        </Reveal>
        <Reveal delay={0.08}>
          <span className="eyebrow">Use cases</span>
          <div className="uc-list">{p.useCases.map(([t, x]) => <div key={t}><h3>{t}</h3><p>{x}</p></div>)}</div>
        </Reveal>
      </div>
    </section>
  );
}

function Together({ p }) {
  const order = STORY.map(bySlug);
  return (
    <section id="together">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Better together</span>
          <h2>One factory problem, <em>four products.</em></h2>
          <p className="lead">Take a factory with frequent production defects. Each product plays its part, and the Core links them so each step triggers the next.</p>
        </Reveal>
        <ol className="story">
          {order.map((s, k) => (
            <Reveal as="li" className={`story-step${s.slug === p.slug ? " here" : ""}`} delay={k * 0.07} key={s.slug} style={{ "--accent": s.accent }}>
              <span className="story-n mono">{k + 1}</span>
              <a href={`/products/${s.slug}`}><b>{s.name}</b><small>{s.module}</small></a>
              <p>{s.scenario}</p>
            </Reveal>
          ))}
        </ol>
        <p className="story-result"><b>Result:</b> the factory identifies the problem, standardises the process, builds competency and keeps improving performance.</p>

        <h3 className="others-h">Other Factory Excellence products</h3>
        <div className="others">
          {PRODUCTS.filter((x) => x.slug !== p.slug).map((x) => (
            <a href={`/products/${x.slug}`} className="other" key={x.slug} style={{ "--accent": x.accent }}>
              <img src={`/logos/${x.logo}.png`} alt={x.name} loading="lazy" />
              <span>{x.question}</span>
              <Arrow />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({ p }) {
  return (
    <section className="cta dark pp-cta">
      <div className="wrap">
        <Reveal>
          <h2>Start with {p.name}. <em>Connect the Core when you're ready.</em></h2>
          <p className="lead">Tell us which product you need and whether you'd like it standalone or connected. We'll walk you through both.</p>
          <div className="hero-ctas"><a className="btn btn-gold" href="/#demo">Request pricing &amp; demo <Arrow /></a><a className="btn btn-line" href="/#suite">All products</a></div>
        </Reveal>
      </div>
    </section>
  );
}

export function ProductPage({ slug }) {
  const p = bySlug(slug);
  useEffect(() => { document.title = p ? `${p.name} · ${p.module} | Industryhead` : "Product not found | Industryhead"; }, [p]);
  if (!p) {
    return (
      <section className="pp-missing"><div className="wrap">
        <h1>We couldn't find that product.</h1>
        <p className="lead">Choose one of the four Factory Excellence products.</p>
        <div className="others">{PRODUCTS.map((x) => <a href={`/products/${x.slug}`} className="other" key={x.slug}><img src={`/logos/${x.logo}.png`} alt={x.name} /><span>{x.module}</span><Arrow /></a>)}</div>
      </div></section>
    );
  }
  return <><Hero p={p} /><SubNav p={p} /><Overview p={p} /><Modes p={p} /><Value p={p} /><Together p={p} /><Cta p={p} /></>;
}

export function ProductsIndex() {
  useEffect(() => { document.title = "Factory Excellence products | Industryhead"; }, []);
  return <div className="products-index"><Suite /></div>;
}
