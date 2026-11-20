/* Fascia finale di invito al contatto, in fondo alle pagine */
import { useApp } from "../lib/app-context.js";
import { site } from "../config/site.js";
import { Button, SplitLines } from "./ui.jsx";
import { useReveal } from "../hooks/useMotion.js";
import "./CtaBand.css";

export default function CtaBand({ secondary }) {
  const { go } = useApp();
  const [ref, inView] = useReveal();
  return (
    <section className="cta tone-dark" aria-labelledby="cta-title">
      <div ref={ref} className={`container cta__in ${inView ? "is-in" : ""}`}>
        <p className="label cta__k">{site.payoff}</p>
        <SplitLines as="h2" id="cta-title" className="display h2 cta__t" lines={["Hai un progetto", "in mente?"]} />
        <p className="cta__p">Raccontaci la tua attività: ti rispondiamo per email con i prossimi passi.</p>
        <div className="cta__btns">
          <Button href="#/contatti" onClick={e => { e.preventDefault(); go("/contatti", { title: "Contatti" }); }}>
            Parliamo del tuo progetto
          </Button>
          {secondary && (
            <Button variant="ghost" href={`#${secondary.to}`} onClick={e => { e.preventDefault(); go(secondary.to, { title: secondary.label }); }}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
