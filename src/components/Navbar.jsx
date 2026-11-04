/* 02 — Navigation: trasparente in cima, vetro scorrendo, si nasconde scendendo */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../lib/app-context.js";
import { onScroll, lockScroll } from "../lib/smooth.js";
import { site } from "../config/site.js";
import { Button } from "./ui.jsx";
import "./Navbar.css";

export const NAV = [
  { n: "01", label: "Home", id: "home", to: "/" },
  { n: "02", label: "About", id: "about", to: "/", section: "about" },
  { n: "03", label: "Case studies", id: "work", to: "/work" },
  { n: "04", label: "Contact", id: "contact", to: "/contact" },
];

export default function Navbar() {
  const { navTo } = useApp();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const burger = useRef(null);
  const firstLink = useRef(null);

  /* stato barra in base allo scroll */
  useEffect(() => {
    let last = window.scrollY;
    return onScroll(y => {
      setScrolled(y > 40);
      setHidden(y > last && y > window.innerHeight * 0.7);
      last = y;
    });
  }, []);

  /* sezione attiva */
  useEffect(() => {
    if (!isHome) {
      setActive(pathname.startsWith("/work") ? "work" : pathname.startsWith("/contact") ? "contact" : "");
      return;
    }
    setActive("home");
    const els = ["home", "about"].map(id => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [isHome, pathname]);

  /* menu mobile */
  useEffect(() => {
    lockScroll(open);
    if (open) setTimeout(() => firstLink.current && firstLink.current.focus(), 350);
    const key = e => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        burger.current && burger.current.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);

  const goTo = (e, item) => {
    e.preventDefault();
    if (open) {
      // prima si chiude il menu e si sblocca lo scroll, poi si naviga
      setOpen(false);
      setTimeout(() => navTo(item), 80);
    } else navTo(item);
  };

  return (
    <>
      <header className={`nav ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""} ${open ? "is-open" : ""}`}>
        <div className="nav__in container">
          <a className="nav__logo" href="#/" onClick={e => goTo(e, NAV[0])} aria-label={`${site.name}, torna all'inizio`}>
            <b>{site.monogram}</b>
            <span className="nav__slash">/</span>
            <span className="nav__role">{site.role}</span>
          </a>

          <nav className="nav__menu" aria-label="Principale">
            <ul>
              {NAV.map(item => (
                <li key={item.id}>
                  <a href={`#${item.to}`} onClick={e => goTo(e, item)} aria-current={active === item.id ? "true" : undefined}>
                    <span className="nav__n">{item.n}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__right">
            <Button href="#/contact" onClick={e => goTo(e, NAV[3])} size="sm" className="nav__cta">Let's talk</Button>
            <button
              ref={burger}
              type="button"
              className="nav__burger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Chiudi il menu" : "Apri il menu"}
              onClick={() => setOpen(o => !o)}
            >
              <i /><i />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mmenu ${open ? "is-open" : ""}`} inert={open ? undefined : ""} aria-label="Menu">
        <div className="mmenu__in container">
          <ul>
            {NAV.map((item, i) => (
              <li key={item.id} style={{ "--i": i }}>
                <a ref={i === 0 ? firstLink : undefined} href={`#${item.to}`} onClick={e => goTo(e, item)} aria-current={active === item.id ? "true" : undefined}>
                  <span className="mmenu__n">{item.n}</span>
                  <span className="mmenu__l">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mmenu__foot">
            <span className="label">Email</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span className="label" style={{ marginTop: 10 }}>{site.city} — {site.coords}</span>
          </div>
        </div>
      </div>
    </>
  );
}
