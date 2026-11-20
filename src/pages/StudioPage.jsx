import { useEffect } from "react";
import { site } from "../config/site.js";
import PageHero from "../components/PageHero.jsx";
import Studio from "../components/Studio.jsx";
import CtaBand from "../components/CtaBand.jsx";

export default function StudioPage() {
  useEffect(() => {
    document.title = `Studio — ${site.name}`;
  }, []);
  return (
    <>
      <PageHero
        stack
        n="03 — Studio"
        crumb="Studio"
        title={["Design with purpose.", "Development with vision."]}
        lead={`Uno studio digitale indipendente con sede a ${site.city}, fondato da ${site.founder}.`}
        meta={[`${site.city}, ${site.country}`, `Fondato da ${site.founder}`, site.payoff]}
      />
      <Studio page />
      <CtaBand secondary={{ to: "/progetti", label: "Guarda i progetti" }} />
    </>
  );
}
