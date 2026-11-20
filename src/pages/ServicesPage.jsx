import { useEffect } from "react";
import { site } from "../config/site.js";
import PageHero from "../components/PageHero.jsx";
import Services from "../components/Services.jsx";
import Method from "../components/Method.jsx";
import CtaBand from "../components/CtaBand.jsx";

export default function ServicesPage() {
  useEffect(() => {
    document.title = `Servizi — ${site.name}`;
  }, []);
  return (
    <>
      <PageHero
        n="01 — Servizi"
        crumb="Servizi"
        title={["Quattro competenze,", "un unico progetto."]}
        lead="Dalla strategia al codice, ogni parte del progetto nasce nello stesso studio. Per questo design, sviluppo e identità parlano la stessa lingua."
        meta={["Web Design", "Web Development", "E-commerce", "Digital Identity"]}
      />
      <Services page />
      <Method />
      <CtaBand secondary={{ to: "/progetti", label: "Guarda i progetti" }} />
    </>
  );
}
