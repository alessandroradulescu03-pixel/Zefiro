/* Cosa faccio: impaginazione divisa. Titolo fisso a sinistra, servizi a destra. */
import { useReveal } from "../hooks/useMotion.js";
import { Reveal, SplitLines } from "./ui.jsx";
import "./Services.css";

const SERVICES = [
  { n: "01", t: "Siti vetrina", d: "Per attività che vogliono farsi trovare e farsi scegliere: servizi, orari e contatti chiari, prima di tutto da telefono.", tags: ["Design su misura", "Mobile first", "SEO di base"] },
  { n: "02", t: "E-commerce", d: "Negozi online con catalogo, schede prodotto, carrello e pagamenti, pensati per vendere senza complicazioni.", tags: ["Catalogo", "Carrello", "Pagamenti"] },
  { n: "03", t: "Web app", d: "Strumenti su misura per lavorare meglio: iscrizioni, check-in, gestione dati, import ed export Excel.", tags: ["Form", "Gestione dati", "Excel"] },
  { n: "04", t: "Restyling", d: "Rifaccio siti esistenti per renderli più moderni, più veloci e più semplici da aggiornare.", tags: ["Migrazione", "Performance", "Nuova identità"] },
];

export default function Services() {
  const [head, headIn] = useReveal();
  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="container services__grid">
        <div className="services__aside">
          <div ref={head} className={`services__head ${headIn ? "is-in" : ""}`}>
            <span className="shead__rule" aria-hidden="true" />
            <div className="services__meta">
              <span className="shead__idx mono">(04)</span>
              <span className="label">Cosa faccio</span>
            </div>
            <SplitLines as="h2" id="services-title" className="display services__title" lines={["What I", <span key="d">do<span className="lime">.</span></span>]} />
            <p className="services__intro">Dalla prima idea alla pubblicazione, seguo tutto io: progetto, design, sviluppo e messa online.</p>
            <span className="services__count mono" aria-hidden="true">04 / Servizi</span>
          </div>
        </div>
        <ol className="services__list">
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 60} className="service">
              <div className="service__top">
                <span className="service__n mono">{s.n}</span>
                <span className="service__arrow" aria-hidden="true">↗</span>
              </div>
              <h3 className="service__t display">{s.t}</h3>
              <p className="service__d">{s.d}</p>
              <ul className="service__tags">{s.tags.map(t => <li key={t}>{t}</li>)}</ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
