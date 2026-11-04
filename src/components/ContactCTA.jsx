/* Chiusura della home: invito alla pagina contatti */
import { useApp } from "../lib/app-context.js";
import { site } from "../config/site.js";
import { useMagnetic } from "../hooks/useMotion.js";
import { Button, Reveal, SectionHead } from "./ui.jsx";
import "./ContactCTA.css";

export default function ContactCTA() {
  const { go } = useApp();
  const mag = useMagnetic(0.3);
  const toContact = e => {
    e.preventDefault();
    go("/contact", { title: "Contact" });
  };
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container">
        <SectionHead
          index="07"
          label="Hai un progetto in mente?"
          meta={site.email}
          id="cta-title"
          title={["Let's create", "something", <span key="u" className="lime">unforgettable.</span>]}
          className="cta__head"
        />
        <Reveal className="cta__row">
          <p>Raccontami la tua attività: ti rispondo con un'idea concreta su come procedere.</p>
          <div className="cta__btns">
            <Button href="#/contact" onClick={toContact}>Start a project</Button>
            <Button href={`mailto:${site.email}`} variant="ghost" icon="">Scrivimi un'email</Button>
          </div>
          <a ref={mag} href="#/contact" onClick={toContact} className="cta__disc" aria-label="Vai alla pagina contatti">
            <span>Let's<br />talk</span>
            <i aria-hidden="true">→</i>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
