import { useEffect } from "react";
import { site } from "../config/site.js";
import { allProjects } from "../data/projects.js";
import PageHero from "../components/PageHero.jsx";
import Projects from "../components/Projects.jsx";
import CtaBand from "../components/CtaBand.jsx";

const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export default function ProjectsPage() {
  useEffect(() => {
    document.title = `Progetti — ${site.name}`;
  }, []);
  const clients = allProjects.filter(p => p.type === "client").length;
  const concepts = allProjects.filter(p => p.type === "concept").length;
  return (
    <>
      <PageHero
        n="02 — Progetti"
        crumb="Progetti"
        title={["Progetti", "selezionati."]}
        lead="Lavori per attività reali e concept dimostrativi, sempre indicati come tali. Ogni progetto ha il suo case study, con la demo in anteprima riservata."
        meta={[
          count(allProjects.length, "case study", "case study"),
          count(clients, "progetto cliente", "progetti cliente"),
          count(concepts, "concept dimostrativo", "concept dimostrativi"),
        ].filter(m => !m.startsWith("0 "))}
      />
      <Projects page />
      <CtaBand secondary={{ to: "/servizi", label: "Scopri i servizi" }} />
    </>
  );
}
