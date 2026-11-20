import { useApp } from "../lib/app-context.js";
import { NAV, site } from "../config/site.js";
import { scrollToTarget } from "../lib/smooth.js";
import Logo from "./Logo.jsx";
import { Icon } from "./ui.jsx";
import "./Footer.css";

export default function Footer() {
  const { navTo } = useApp();
  const socials = [
    ["Instagram", site.socials.instagram],
    ["LinkedIn", site.socials.linkedin],
  ].filter(([, url]) => url);
  const year = new Date().getFullYear();

  return (
    <footer className="foot tone-dark">
      <div className="container">
        <div className="foot__top">
          <div className="foot__brand">
            <Logo tone="dark" />
            <p className="foot__payoff display">{site.payoff}</p>
          </div>

          <nav className="foot__col" aria-label="Navigazione nel footer">
            <span className="label">Navigazione</span>
            <ul>
              {NAV.map(item => (
                <li key={item.id}>
                  <a href={`#${item.to}`} onClick={e => { e.preventDefault(); navTo({ to: item.to, section: item.section, label: item.label }); }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="foot__col">
            <span className="label">Contatti</span>
            <ul>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li>{site.city}, {site.country}</li>
              {socials.map(([n, url]) => (
                <li key={n}><a href={url} target="_blank" rel="noopener noreferrer">{n} {Icon.out}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="foot__base">
          <span>© {year} {site.brand}. Tutti i diritti riservati.</span>
          <span>{site.name} — {site.city}, {site.country}</span>
          <button type="button" className="foot__up" onClick={() => scrollToTarget(0)}>
            Torna su {Icon.up}
          </button>
        </div>
      </div>
    </footer>
  );
}
