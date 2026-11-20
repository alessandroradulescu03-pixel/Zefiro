/* Progetti: card con screenshot reali; in home e nella pagina /progetti.
   Distingue sempre i progetti per clienti dai concept dimostrativi. */
import { useEffect, useMemo, useRef, useState } from "react";
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

/* immagine che compare con una dissolvenza quando è caricata, invece di "spuntare" */
export function Img({ className = "", ...rest }) {
  const ref = useRef(null);
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth) setOk(true);
  }, []);
  return <img ref={ref} className={`fadeimg ${ok ? "is-loaded" : ""} ${className}`} onLoad={() => setOk(true)} {...rest} />;
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
              {a && <Img src={asset(a.src)} alt={a.alt} loading="lazy" decoding="async" width="1440" height="900" />}
              {b && <Img className="pc__alt" src={asset(b.src)} alt="" loading="lazy" decoding="async" width="1440" height="900" />}
            </div>
          </div>
          <span className="pc__badge"><Badge project={p} /></span>
          {m && (
            <div className="pc__phone" aria-hidden="true">
              <Img src={asset(m.src)} alt="" loading="lazy" decoding="async" width="585" height="1266" />
            </div>
          )}
        </div>
        <div className="pc__info">
          <span className="pc__n mono">{p.number}</span>
          <div className="pc__main">
            <h3 className="display pc__title">{p.title}</h3>
            <p className="pc__cat">{p.category}</p>
          </div>
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
    <section id="progetti" className="section tone-ice projects" aria-label="Progetti">
      <div className="container">
        {!page && (
          <SectionHead
            index="(02)"
            label="Progetti"
            id="projects-title"
            title={["Progetti", "selezionati."]}
            aside={<p>Lavori per attività reali e concept dimostrativi, sempre indicati come tali. Ogni progetto ha il suo case study, con la demo in anteprima riservata.</p>}
          />
        )}

        <div className="projects__bar">
          <ul className="projects__legend" aria-label="Legenda">
            <li><span className="dot dot--client" aria-hidden="true" /><strong>Progetto cliente</strong> realizzato per un'attività reale</li>
            <li><span className="dot dot--concept" aria-hidden="true" /><strong>Concept</strong> proposta dimostrativa di nostra iniziativa</li>
          </ul>
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
