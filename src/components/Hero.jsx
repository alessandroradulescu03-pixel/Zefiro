/* Hero: la firma 3D è protagonista, al centro della composizione.
   Sopra una riga di meta-informazioni su griglia svizzera, sotto il manifesto e le azioni. */
import { useApp } from "../lib/app-context.js";
import { useLocalTime } from "../hooks/useMotion.js";
import { site } from "../config/site.js";
import { allProjects } from "../data/projects.js";
import { Button, SplitLines } from "./ui.jsx";
import SignatureScene from "./SignatureScene.jsx";
import "./Hero.css";

export default function Hero() {
  const { ready, goSection, go } = useApp();
  const time = useLocalTime(site.timeZone);
  const count = String(allProjects.length).padStart(2, "0");

  return (
    <section id="home" className={`hero ${ready ? "is-ready" : ""}`} aria-labelledby="hero-title">
      <div className="hero__in container">
        <div className="hero__meta">
          <div><span className="label">Portfolio</span><span className="hero__mv">©{new Date().getFullYear()}</span></div>
          <div><span className="label">Practice</span><span className="hero__mv">{site.positioning}</span></div>
          <div className="hero__geo"><span className="label">Based in</span><span className="hero__mv">{site.city}, IT — {site.coords}</span></div>
          <div className="hero__clock"><span className="label">Local time</span><span className="hero__mv mono">{time}</span></div>
        </div>

        <figure className="hero__stage">
          <span className="hero__mark hero__mark--tl" aria-hidden="true" />
          <span className="hero__mark hero__mark--tr" aria-hidden="true" />
          <span className="hero__mark hero__mark--bl" aria-hidden="true" />
          <span className="hero__mark hero__mark--br" aria-hidden="true" />
          <div className="hero__scene"><SignatureScene /></div>
          <figcaption className="hero__cap">
            <span className="label">Fig. 01 — The Digital Signature</span>
            <button type="button" className="hero__resign label" onClick={() => window.dispatchEvent(new Event("signature:redraw"))}>
              ↻ Re-sign
            </button>
          </figcaption>
        </figure>

        <div className="hero__main">
          <SplitLines
            as="h1"
            id="hero-title"
            className="display hero__title"
            lines={["I don't just", "build websites.", "I build digital", <span className="lime" key="e">experiences.</span>]}
            lineClass={["", "hero__ind", "", "hero__ind"]}
          />
          <div className="hero__side">
            {site.available && (
              <p className="hero__badge"><i aria-hidden="true" />Available for new projects</p>
            )}
            <p className="hero__sub">Trasformo idee e identità aziendali in esperienze digitali progettate per distinguersi.</p>
            <div className="hero__cta">
              <Button href="#/work" onClick={e => { e.preventDefault(); go("/work", { title: "Case studies" }); }}>Explore my work</Button>
              <Button href="#/contact" onClick={e => { e.preventDefault(); go("/contact", { title: "Contact" }); }} variant="ghost" icon="">Let's talk</Button>
            </div>
          </div>
        </div>

        <div className="hero__bottom">
          <a className="hero__scroll" href="#/" onClick={e => { e.preventDefault(); goSection("about"); }}>
            <span className="hero__scroll-line" aria-hidden="true" />
            <span className="label">Scroll to explore</span>
          </a>
          <span className="label hero__index">Case studies 01 — {count}</span>
        </div>
      </div>
    </section>
  );
}
