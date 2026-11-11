/* 09 — Footer editoriale */
import { useApp } from "../lib/app-context.js";
import { scrollToTarget } from "../lib/smooth.js";
import { site, whatsappUrl } from "../config/site.js";
import { NAV } from "./Navbar.jsx";
import { Icon } from "./ui.jsx";
import { NATALE } from "../lib/natale.js";
import "./Footer.css";

export default function Footer() {
  const { navTo } = useApp();
  const socials = [
    ["Instagram", site.socials.instagram],
    ["LinkedIn", site.socials.linkedin],
    ["WhatsApp", whatsappUrl(site.socials.whatsapp)],
    ["GitHub", site.socials.github],
  ].filter(([, u]) => u);

  return (
    <footer className="footer tone-dark">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="footer__logo"><b>{site.monogram}</b> / {site.role}</span>
            <p>{site.positioning}. {site.tagline} da {site.city}.</p>
            {NATALE && (
              <p className="xm-auguri">
                <svg viewBox="0 0 16 18" aria-hidden="true"><path d="M8 0l4 5H9.6l3.4 4.5h-2.6L14 14H9v4H7v-4H2l3.6-4.5H3L6.4 5H4z" fill="currentColor" /></svg>
                Buone feste da {site.city}
              </p>
            )}
          </div>

          <nav className="footer__col" aria-label="Navigazione nel footer">
            <span className="label">Index</span>
            <ul>
              {NAV.map(i => (
                <li key={i.id}>
                  <a href={`#${i.to}`} onClick={e => { e.preventDefault(); navTo(i); }}>
                    <span className="mono">{i.n}</span> {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <span className="label">Social</span>
            <ul>
              {socials.map(([l, u]) => (
                <li key={l}><a href={u} target="_blank" rel="noopener noreferrer">{l} ↗</a></li>
              ))}
              <li><a href={`mailto:${site.email}`}>Email</a></li>
            </ul>
          </div>

        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {site.name}. Designed &amp; developed by me.</span>
          <span className="mono footer__concept">The Digital Signature</span>
          <button type="button" className="footer__top" onClick={() => scrollToTarget(0)}>
            Back to top {Icon.up}
          </button>
        </div>
      </div>
    </footer>
  );
}
