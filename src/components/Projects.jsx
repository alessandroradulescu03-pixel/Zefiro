/* Progetti: card con screenshot reali; in home e nella pagina /progetti.
   Distingue sempre i progetti per clienti dai concept dimostrativi. */
import { useMemo, useState } from "react";
import { useApp } from "../lib/app-context.js";
import { allProjects, asset, TYPE_LABEL, STATUS_LABEL } from "../data/projects.js";
import { Button, Icon, Reveal, SectionHead } from "./ui.jsx";
import "./Projects.css";

export function Badge({ project }) {
  return (
    <span className={`badge badge--${project.type}`}>
      <i aria-hidden="true" />
      {TYPE_LABEL[project.type]}
      {project.type === "client" && project.status && <span className="badge__st"> · {STATUS_LABEL[project.status]}</span>}
    </span>
  );
}

const shots = p => {
  const g = p.gallery || [];
  const desk = g.filter(x => x.device !== "mobile");
  return { a: desk[0], b: desk[1], m: g.find(x => x.device === "mobile") };
};

export function ProjectCard({ project: p, index }) {
  const { go } = useApp();
  const { a, b, m } = shots(p);
  return (
    <Reveal as="article" className="pc" delay={(index % 2) * 100}>
      <a
        className="pc__link"
        href={`#/progetti/${p.id}`}
        onClick={e => { e.preventDefault(); go(`/progetti/${p.id}`, { title: p.title }); }}
      >
        <div className="pc__media" style={{ "--tint": p.colors?.bg || "#0b1e44" }}>
          <div className="pc__browser">
            <div className="pc__bar" aria-hidden="true"><i /><i /><i /></div>
            <div className="pc__shots">
              {a && <img src={asset(a.src)} alt={a.alt} loading="lazy" decoding="async" width="1440" height="900" />}
              {b && <img className="pc__alt" src={asset(b.src)} alt="" loading="lazy" decoding="async" width="1440" height="900" />}
            </div>
          </div>
          {m && (
            <div className="pc__phone" aria-hidden="true">
              <img src={asset(m.src)} alt="" loading="lazy" decoding="async" width="585" height="1266" />
            </div>
          )}
        </div>
        <div className="pc__info">
          <span className="pc__n mono">{p.number}</span>
          <div className="pc__main">
            <h3 className="display pc__title">{p.title}</h3>
            <p className="pc__cat">{p.category}</p>
          </div>
          <Badge project={p} />
          <span className="pc__go" aria-hidden="true">{Icon.arrow}</span>
        </div>
        <p className="pc__desc">{p.description}</p>
      </a>
    </Reveal>
  );
}

const FILTERS = [
  { id: "all", label: "Tutti" },
  { id: "client", label: "Progetti cliente" },
  { id: "concept", label: "Concept" },
];

export default function Projects({ page = false }) {
  const { navTo } = useApp();
  const [filter, setFilter] = useState("all");
  const counts = useMemo(() => {
    const c = { all: allProjects.length };
    allProjects.forEach(p => (c[p.type] = (c[p.type] || 0) + 1));
    return c;
  }, []);
  const list = allProjects.filter(p => filter === "all" || p.type === filter);

  return (
    <section id="progetti" className={`section tone-ice projects ${page ? "projects--page" : ""}`} aria-labelledby="projects-title">
      <div className="container">
        <SectionHead
          index={page ? "Case studies" : "(02)"}
          label="Progetti"
          as={page ? "h1" : "h2"}
          id="projects-title"
          title={["Progetti", "selezionati."]}
          aside={
            <p>
              Lavori per attività reali e concept dimostrativi, sempre indicati come tali. Ogni progetto ha il suo case study, con la demo consultabile in anteprima riservata.
            </p>
          }
        />

        <div className="projects__bar">
          <div className="projects__legend">
            <span className="badge badge--client"><i aria-hidden="true" />Progetto cliente</span>
            <span className="label">realizzato per un'attività reale</span>
            <span className="badge badge--concept"><i aria-hidden="true" />Concept dimostrativo</span>
            <span className="label">proposta di nostra iniziativa</span>
          </div>
          {page && (
            <div className="projects__filters" role="group" aria-label="Filtra i progetti">
              {FILTERS.filter(f => f.id === "all" || counts[f.id]).map(f => (
                <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                  {f.label} <span className="mono">{counts[f.id] || 0}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="projects__grid" aria-live="polite">
          {list.map((p, i) => <ProjectCard key={`${filter}-${p.id}`} project={p} index={i} />)}
        </div>

        {!page && (
          <div className="projects__more">
            <Button variant="ghost" href="#/progetti" onClick={e => { e.preventDefault(); navTo({ to: "/progetti", label: "Progetti" }); }}>
              Tutti i case study
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
