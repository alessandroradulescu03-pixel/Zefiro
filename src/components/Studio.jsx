/* Studio: chi è ZEFIRO, senza numeri inventati */
import { site } from "../config/site.js";
import { Symbol } from "./Logo.jsx";
import { Reveal, SectionHead } from "./ui.jsx";
import "./Studio.css";

const PRINCIPLES = [
  { k: "Identità", t: "Ogni progetto ha una personalità propria", d: "Colori, caratteri e linguaggio nascono dall'attività, non da un tema già pronto. Due nostri siti non si assomigliano." },
  { k: "Metodo", t: "Ordine prima della forma", d: "Griglie, gerarchie e contenuti vengono prima degli effetti. La creatività lavora dentro una struttura solida." },
  { k: "Tecnica", t: "Codice su misura, pensato per durare", d: "Siti veloci, responsive e facili da aggiornare, progettati partendo dallo smartphone." },
];

const STACK = ["HTML", "CSS", "JavaScript", "React", "Vite", "PHP", "WordPress", "MySQL", "GitHub"];

export default function Studio({ page = false }) {
  return (
    <section id="studio" className="section tone-light studio" aria-label="Lo studio">
      <div className="container">
        {!page && (
          <SectionHead index="(03)" label="Studio" id="studio-title" title={["Design with purpose.", "Development with vision."]} />
        )}

        <div className="studio__grid">
          <Reveal className="studio__intro">
            <p className="studio__lead">
              ZEFIRO nasce dall'idea che ogni attività meriti una presenza digitale progettata con attenzione, personalità e visione. Uniamo creatività, tecnologia e cura dei dettagli per trasformare idee in esperienze web concrete.
            </p>
            <p className="studio__name">
              Il nome viene da Zefiro, il vento dell'ovest che nella mitologia greca porta la primavera: per noi è l'aria nuova che un buon progetto porta a un'attività.
            </p>
          </Reveal>

          <Reveal className="studio__card tone-dark" delay={120}>
            <Symbol className="studio__sym" />
            <dl className="studio__facts">
              <div><dt className="label">Studio</dt><dd>{site.name}</dd></div>
              <div><dt className="label">Fondatore</dt><dd>{site.founder}</dd></div>
              <div><dt className="label">Ruolo</dt><dd>Design &amp; Development</dd></div>
              <div><dt className="label">Sede</dt><dd>{site.city}, {site.country}</dd></div>
            </dl>
            <p className="studio__payoff mono">{site.payoff}</p>
          </Reveal>
        </div>

        <ol className="studio__principles">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.k} delay={i * 90} className="pr">
              <span className="pr__k label">{String(i + 1).padStart(2, "0")} — {p.k}</span>
              <h3 className="display pr__t">{p.t}</h3>
              <p className="pr__d">{p.d}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="studio__stack">
          <span className="label">Strumenti</span>
          <ul>{STACK.map(s => <li key={s} className="mono">{s}</li>)}</ul>
        </Reveal>
      </div>
    </section>
  );
}
