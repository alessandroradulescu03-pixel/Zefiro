/* Testata delle pagine interne: stessa famiglia visiva della hero in home
   (navy, griglia, linee del vento che si disegnano una volta) ma più compatta. */
import { useEffect, useState } from "react";
import { useApp } from "../lib/app-context.js";
import { STAR_PATH } from "./Logo.jsx";
import { SplitLines } from "./ui.jsx";
import "./PageHero.css";

export default function PageHero({ n, crumb, title, lead, meta = [], stack = false }) {
  const { go } = useApp();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className={`phero tone-dark ${stack ? "phero--stack" : ""} ${ready ? "is-ready" : ""}`}>
      <div className="phero__grid" aria-hidden="true" />
      <svg className="phero__wind" viewBox="0 0 600 400" aria-hidden="true" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <linearGradient id="phw" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#1765E8" stopOpacity="0" />
            <stop offset="0.45" stopColor="#1765E8" />
            <stop offset="1" stopColor="#39B8F4" />
          </linearGradient>
        </defs>
        <path className="pw pw1" pathLength="1" d="M40 420 C140 330 230 280 330 262 C430 244 500 210 572 70" />
        <path className="pw pw2" pathLength="1" d="M10 400 C120 300 200 240 300 222 C390 206 460 170 540 92" />
        <path className="pw pw3" pathLength="1" d="M120 430 C220 370 300 340 390 326 C480 312 540 270 600 170" />
        <path d={STAR_PATH} className="phero__star" transform="translate(572 70) scale(0.9) translate(-181 -39)" />
      </svg>

      <div className="container phero__in">
        <nav className="phero__crumb label" aria-label="Percorso">
          <a href="#/" onClick={e => { e.preventDefault(); go("/", { title: "Home" }); }}>ZEFIRO</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <div className="phero__row">
          <div>
            <span className="phero__n mono">{n}</span>
            <SplitLines as="h1" className="display phero__title" lines={title} />
          </div>
          {lead && <p className="phero__lead">{lead}</p>}
        </div>
        {meta.length > 0 && (
          <ul className="phero__meta">
            {meta.map(m => <li key={m} className="label">{m}</li>)}
          </ul>
        )}
      </div>
    </header>
  );
}
