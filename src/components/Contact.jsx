/* 08 — Contact experience */
import { useState } from "react";
import { site, whatsappUrl } from "../config/site.js";
import { scrollToTarget } from "../lib/smooth.js";
import { useMagnetic } from "../hooks/useMotion.js";
import { Reveal, SplitLines, Icon } from "./ui.jsx";
import ContactForm from "./ContactForm.jsx";
import "./Contact.css";

export default function Contact({ page = false }) {
  const mag = useMagnetic(0.35);
  const [copied, setCopied] = useState(false);
  const links = [
    { label: "Instagram", href: site.socials.instagram },
    { label: "LinkedIn", href: site.socials.linkedin },
    { label: "WhatsApp", href: whatsappUrl(site.socials.whatsapp) },
    { label: "GitHub", href: site.socials.github },
  ].filter(l => l.href);

  const start = () => {
    scrollToTarget("contact-form", { offset: -110 });
    setTimeout(() => document.getElementById("cf-name")?.focus({ preventScroll: true }), 900);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const r = document.createRange();
      const el = document.getElementById("contact-mail");
      if (!el) return;
      r.selectNodeContents(el);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    }
  };

  return (
    <section id="contact" className={`contact ${page ? "contact--page" : ""}`} aria-labelledby="contact-title">
      <div className="contact__glow" aria-hidden="true" />
      <div className="container">
        <Reveal as="header" className="contact__head">
          <span className="label label--lime">Contact</span>
          <SplitLines as={page ? "h1" : "h2"} id="contact-title" className="display contact__title" lines={["Hai un'idea?", <span key="u" className="lime">Diamole forma.</span>]} lineClass={["", "contact__l2", ""]} />
          <button ref={mag} type="button" className="contact__start" onClick={start}>
            <span className="contact__start-ring" aria-hidden="true">
              <svg viewBox="0 0 200 200"><defs><path id="cs" d="M100 100 m-80 0 a80 80 0 1 1 160 0 a80 80 0 1 1 -160 0" /></defs>
                <text><textPath href="#cs">Start a project • Start a project • Start a project • </textPath></text></svg>
            </span>
            <span className="contact__start-ico">{Icon.down}</span>
            <span className="sr-only">Start a project: vai al modulo di contatto</span>
          </button>
        </Reveal>

        <div className="contact__grid">
          <Reveal className="contact__info">
            <div className="contact__block">
              <span className="label">Email</span>
              <a className="contact__mail" id="contact-mail" href={`mailto:${site.email}`}>{site.email}</a>
              <button type="button" className="contact__copy" onClick={copy}>{copied ? "Copiata ✓" : "Copia email"}</button>
            </div>
            {links.length > 0 && (
              <ul className="contact__links" aria-label="Social">
                {links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      <span>{l.label}</span>
                      {Icon.out}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p className="contact__note">Raccontami la tua attività e cosa ti serve: ti rispondo con un'idea concreta su come procedere.</p>
          </Reveal>
          <Reveal className="contact__form" delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
