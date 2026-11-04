/* 07 — Digital philosophy: le parole si accendono mentre scorri */
import { useEffect, useRef, useState } from "react";
import { addProgress } from "../lib/motion.js";
import { useReducedMotion } from "../hooks/useMotion.js";
import "./Philosophy.css";

const LINES = [
  ["Good", "design", "gets", "attention."],
  ["Great", "experiences", "make", "it", "last."],
];
const WORDS = LINES.flat().length;
const PRINCIPLES = ["Bello", "Funzionale", "Veloce", "Comunicativo"];

export default function Philosophy() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(reduced ? WORDS : 0);

  useEffect(() => {
    if (reduced) {
      setLit(WORDS);
      return;
    }
    return addProgress(ref.current, p => {
      // la sezione resta ferma da p≈0.48 a p=1: le parole si accendono in quel tratto
      const k = Math.min(1, Math.max(0, (p - 0.4) / 0.45));
      setLit(Math.round(k * WORDS));
    });
  }, [reduced]);

  let w = 0;
  return (
    <section className="philo" ref={ref} aria-labelledby="philo-title">
      <div className="philo__sticky">
        <div className="container philo__in">
          <div className="philo__top">
            <span className="label"><span className="mono philo__idx">(05)</span> Digital philosophy</span>
            <span className="label mono">{String(lit).padStart(2, "0")} / {WORDS}</span>
          </div>
          <h2 className="display philo__title" id="philo-title">
            {LINES.map((line, li) => (
              <span className="philo__line" key={li}>
                {line.map(word => {
                  const i = w++;
                  return (
                    <span key={i} className={`philo__w ${i < lit ? "is-lit" : ""}`}>
                      {word}{" "}
                    </span>
                  );
                })}
              </span>
            ))}
          </h2>
          <div className="philo__bottom">
            <p>Ogni progetto deve essere bello, funzionale, veloce e progettato per comunicare il valore dell'attività.</p>
            <ul aria-label="Principi">
              {PRINCIPLES.map((p, i) => (
                <li key={p}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
