import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../lib/app-context.js";
import { onScroll } from "../lib/smooth.js";
import { NAV, site } from "../config/site.js";
import Logo from "./Logo.jsx";
import { Button } from "./ui.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { navTo } = useApp();
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => onScroll(y => setSolid(y > 24)), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("is-menu", open);
    if (!open) return;
    const key = e => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);

  const isActive = item =>
    item.section ? false : item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

  const click = (e, item) => {
    e.preventDefault();
    setOpen(false);
    navTo({ to: item.to, section: item.section, label: item.label });
  };
  const href = item => `#${item.to === "/" ? "/" : item.to}`;
  const contact = NAV.find(n => n.id === "contatti");

  return (
    <header className={`nav ${solid || open ? "is-solid" : ""} ${open ? "is-open" : ""}`}>
      <div className="nav__bar container">
        <a className="nav__logo" href="#/" onClick={e => click(e, NAV[0])} aria-label="ZEFIRO — torna alla home">
          <Logo tone="dark" />
        </a>

        <nav className="nav__links" aria-label="Navigazione principale">
          <ul>
            {NAV.map(item => (
              <li key={item.id}>
                <a href={href(item)} onClick={e => click(e, item)} aria-current={isActive(item) ? "page" : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__cta">
          <Button size="sm" href={href(contact)} onClick={e => click(e, contact)}>Parliamo del tuo progetto</Button>
        </div>

        <button
          type="button"
          className="nav__burger"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen(o => !o)}
        >
          <span className="sr-only">{open ? "Chiudi il menu" : "Apri il menu"}</span>
          <i /><i />
        </button>
      </div>

      <div className="nav__menu" id="nav-menu" hidden={!open} data-lenis-prevent>
        <div className="container nav__menu-in">
          <ul>
            {NAV.map((item, i) => (
              <li key={item.id} style={{ "--i": i }}>
                <a href={href(item)} onClick={e => click(e, item)} aria-current={isActive(item) ? "page" : undefined}>
                  <span className="mono">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav__menu-foot">
            <Button href={href(contact)} onClick={e => click(e, contact)}>Parliamo del tuo progetto</Button>
            <a className="nav__mail" href={`mailto:${site.email}`}>{site.email}</a>
            <span className="label">{site.city}, {site.country}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
