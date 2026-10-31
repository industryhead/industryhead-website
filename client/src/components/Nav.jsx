import { useEffect, useState } from "react";

const LINKS = [["#transform", "Before & after"], ["#tour", "Product tour"], ["#platform", "Platform"], ["#suite", "Products"], ["#method", "Our method"], ["#compare", "Compare"], ["#team", "Team"]];

export function BrandLockup() {
  return (
    <a className="brand" href="#top" aria-label="Industryhead home">
      <img src="/logo.png" alt="Industryhead" className="brand-logo" />
    </a>
  );
}

export default function Nav({ scrolled, active, home = "" }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = matchMedia("(min-width: 1025px)"), onMq = (m) => m.matches && setOpen(false);
    addEventListener("keydown", onKey); mq.addEventListener("change", onMq);
    return () => { removeEventListener("keydown", onKey); mq.removeEventListener("change", onMq); };
  }, []);
  const links = LINKS.map(([h, t]) => ({ h: home + h, id: h.slice(1), t }));
  return (
    <header className={`nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`} id="nav">
      <div className="wrap">
        <a className="brand" href={home + "#top"} aria-label="Industryhead home">
          <img src="/logo.png" alt="Industryhead" className="brand-logo" />
        </a>
        <nav className="menu" aria-label="Sections">
          {links.map((l) => <a key={l.h} href={l.h} className={active === l.id ? "on" : undefined}>{l.t}</a>)}
        </nav>
        <a className="btn btn-primary nav-cta btn-sm" href={home + "#demo"}>Explore a demo</a>
        <button className="burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="drawer" onClick={() => setOpen((o) => !o)}><span></span></button>
        <div className="drawer" id="drawer">
          {links.map((l) => <a key={l.h} href={l.h} onClick={() => setOpen(false)}>{l.t}</a>)}
          <a className="btn btn-primary" href={home + "#demo"} onClick={() => setOpen(false)}>Explore a demo</a>
        </div>
      </div>
    </header>
  );
}
