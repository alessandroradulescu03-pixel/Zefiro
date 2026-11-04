import { useEffect } from "react";
import { site } from "../config/site.js";
import { useApp } from "../lib/app-context.js";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Services from "../components/Services.jsx";
import Philosophy from "../components/Philosophy.jsx";
import "./Home.css";

/* La home parla solo di me. Le altre pagine si raggiungono dal menu:
   qui c'è al massimo un rimando, senza ripeterne i contenuti. */
export default function Home() {
  const { go } = useApp();
  useEffect(() => {
    document.title = `${site.name} — ${site.positioning}`;
  }, []);
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Philosophy />
      <section className="next">
        <div className="container next__in">
          <span className="label">Prossima pagina</span>
          <a
            className="next__link display"
            href="#/work"
            onClick={e => { e.preventDefault(); go("/work", { title: "Case studies" }); }}
          >
            Case studies <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
