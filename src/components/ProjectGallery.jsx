/* 04 — Selected Works: progetti "featured" in composizioni alternate,
   tutti gli altri nell'archivio a elenco (regge 30+ progetti) */
import { useMemo, useState } from "react";
import { allProjects, TYPE_LABEL } from "../data/projects.js";
import { SectionHead } from "./ui.jsx";
import ProjectCard from "./ProjectCard.jsx";
import ProjectArchive from "./ProjectArchive.jsx";
import "./ProjectGallery.css";

const VARIANTS = ["a", "b", "c"];
const FILTERS = [
  { id: "all", label: "All" },
  { id: "client", label: "Client projects" },
  { id: "concept", label: "Concepts" },
  { id: "personal", label: "Personal" },
];

export default function ProjectGallery({ page = false }) {
  const [filter, setFilter] = useState("all");
  const counts = useMemo(() => {
    const c = { all: allProjects.length };
    allProjects.forEach(p => (c[p.type] = (c[p.type] || 0) + 1));
    return c;
  }, []);
  const list = allProjects.filter(p => filter === "all" || p.type === filter);
  const featured = list.filter(p => p.featured !== false);
  const archive = list.filter(p => p.featured === false);
  const filters = FILTERS.filter(f => f.id === "all" || counts[f.id]);

  return (
    <section id="work" className={`works ${page ? "works--page" : ""}`} aria-labelledby="works-title">
      <div className="container">
        <SectionHead
          index={page ? "CS" : "03"}
          label="Case studies"
          meta={`(${String(allProjects.length).padStart(2, "0")}) Projects · ${new Date().getFullYear()}`}
          as={page ? "h1" : "h2"}
          id="works-title"
          title={["Selected", <span key="w" className="lime">works.</span>]}
          aside={<p>Progetti per clienti e concept realizzati di mia iniziativa. Ogni demo si guarda qui, in anteprima riservata.</p>}
        />

        {filters.length > 2 && (
          <div className="works__filters" role="group" aria-label="Filtra i progetti per tipologia">
            {filters.map(f => (
              <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label} <span>{counts[f.id] || 0}</span>
              </button>
            ))}
          </div>
        )}

        <div className="works__legend label">
          {Object.entries(TYPE_LABEL).filter(([k]) => counts[k]).map(([k, v]) => (
            <span key={k} className={`works__key works__key--${k}`}>{v}</span>
          ))}
        </div>

        <div className="works__list" aria-live="polite">
          {featured.map((p, i) => (
            <ProjectCard key={`${filter}-${p.id}`} project={p} variant={VARIANTS[i % VARIANTS.length]} />
          ))}
          {!list.length && <p className="works__empty">Nessun progetto in questa categoria.</p>}
        </div>

        {archive.length > 0 && <ProjectArchive projects={archive} />}
      </div>
    </section>
  );
}
