/* Metodo: quattro fasi su una linea che si riempie con lo scroll.
   Ogni fase si accende quando la linea la raggiunge. */
import { useEffect, useRef, useState } from "react";
import { addProgress } from "../lib/motion.js";
import { useReducedMotion } from "../hooks/useMotion.js";
import { SectionHead } from "./ui.jsx";
import "./Method.css";

const STEPS = [
  { n: "01", title: "Discovery", text: "Comprensione dell'attività, degli obiettivi e delle esigenze.", detail: "Ascoltiamo come lavori, chi sono i tuoi clienti e cosa deve ottenere il sito.", out: "Brief di progetto" },
  { n: "02", title: "Strategy & Design", text: "Definizione della direzione creativa e progettazione dell'esperienza.", detail: "Struttura delle pagine, direzione visiva e interfacce, condivise e approvate con te.", out: "Wireframe & UI" },
  { n: "03", title: "Development", text: "Realizzazione tecnica e ottimizzazione.", detail: "Sviluppo su misura, responsive e veloce, con contenuti, SEO di base e prestazioni curate.", out: "Sito ottimizzato" },
  { n: "04", title: "Launch", text: "Test, pubblicazione e consegna del progetto.", detail: "Controlli su ogni dispositivo, messa online e consegna con tutto ciò che serve per gestirlo.", out: "Sito online" },
];

export default function Method() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [p, setP] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) { setP(1); return; }
    // la linea parte quando la sezione è a metà schermo e finisce poco prima del fondo
    return addProgress(ref.current, v => setP(Math.min(1, Math.max(0, (v - 0.32) / 0.42))));
  }, [reduced]);

  const active = Math.min(STEPS.length, Math.floor(p * STEPS.length + 0.35));

  return (
    <section id="metodo" className="section tone-dark method" aria-labelledby="method-title">
      <div className="container">
        <SectionHead
          index="Metodo"
          label="Come lavoriamo"
          id="method-title"
          title={["Un metodo chiaro,", "dall'idea al lancio."]}
          aside={<p>Quattro fasi, sempre le stesse, perché ogni progetto abbia tempi chiari e nessuna sorpresa. Sai sempre a che punto siamo e cosa succede dopo.</p>}
        />
        <div className="tl" ref={ref} style={{ "--p": p }}>
          <div className="tl__track" aria-hidden="true"><span className="tl__fill" /></div>
          <ol className="tl__steps">
            {STEPS.map((s, i) => (
              <li key={s.n} className={`tl__step ${i < active ? "is-on" : ""}`}>
                <span className="tl__node" aria-hidden="true" />
                <span className="tl__n mono">{s.n}</span>
                <h3 className="display tl__title">{s.title}</h3>
                <p className="tl__text">{s.text}</p>
                <p className="tl__detail">{s.detail}</p>
                <span className="tl__out label"><span aria-hidden="true">→</span> {s.out}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
