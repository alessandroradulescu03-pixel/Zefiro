/* Home: anteprima dei servizi. Ogni riga porta alla pagina /servizi */
import { useApp } from "../lib/app-context.js";
import { SERVICES } from "./Services.jsx";
import { Button, Icon, Reveal, SectionHead } from "./ui.jsx";
import "./ServicesTeaser.css";

export default function ServicesTeaser() {
  const { go } = useApp();
  const open = e => {
    e.preventDefault();
    go("/servizi", { title: "Servizi" });
  };
  return (
    <section id="home-servizi" className="section tone-light steaser" aria-labelledby="steaser-title">
      <div className="container">
        <SectionHead
          index="(01)"
          label="Servizi"
          id="steaser-title"
          title={["Quattro competenze,", "un unico progetto."]}
          aside={<p>Dalla strategia al codice, ogni parte del progetto nasce nello stesso studio. Per questo design, sviluppo e identità parlano la stessa lingua.</p>}
        />
        <ul className="steaser__list">
          {SERVICES.map(({ n, title, short }, i) => (
            <Reveal as="li" key={n} delay={i * 70}>
              <a className="steaser__row" href="#/servizi" onClick={open}>
                <span className="steaser__n mono">{n}</span>
                <span className="steaser__t display">{title}</span>
                <span className="steaser__d">{short}</span>
                <span className="steaser__go" aria-hidden="true">{Icon.arrow}</span>
              </a>
            </Reveal>
          ))}
        </ul>
        <div className="steaser__more">
          <Button variant="ghost" href="#/servizi" onClick={open}>Servizi e metodo di lavoro</Button>
        </div>
      </div>
    </section>
  );
}
