/* Un progetto in galleria. variant: "a" | "b" | "c" — tre composizioni che si alternano */
import { useApp } from "../lib/app-context.js";
import { useParallax, useReveal } from "../hooks/useMotion.js";
import { TYPE_LABEL, STATUS_LABEL } from "../data/projects.js";
import ProjectMockup from "./ProjectMockup.jsx";
import { Button } from "./ui.jsx";
import "./ProjectCard.css";

export function TypeBadges({ project }) {
  return (
    <span className="badges">
      <span className={`badge badge--${project.type}`}>{TYPE_LABEL[project.type] || project.type}</span>
      {project.status && <span className={`badge badge--st badge--${project.status}`}>{STATUS_LABEL[project.status] || project.status}</span>}
    </span>
  );
}

export default function ProjectCard({ project, variant = "a" }) {
  const { go } = useApp();
  const [reveal, mediaIn] = useReveal();
  const [info, infoIn] = useReveal();
  const par = useParallax(0.06);
  const num = useParallax(-0.14);
  const to = `/work/${project.id}`;
  const open = e => {
    e.preventDefault();
    go(to, { title: project.title });
  };

  return (
    <article className={`work work--${variant}`} aria-labelledby={`w-${project.id}`}>
      <div className="work__num-wrap" aria-hidden="true">
        <span className="work__num" ref={num}>{project.number}</span>
      </div>

      <a className={`work__media ${mediaIn ? "is-in" : ""}`} ref={reveal} href={`#${to}`} onClick={open} data-cursor="View" tabIndex={-1} aria-hidden="true">
        <div className="work__reveal">
          <div className="work__par" ref={par}>
            <div className="work__zoom">
              <ProjectMockup project={project} layout={variant === "b" ? "phone" : "duo"} />
            </div>
          </div>
        </div>
        <span className="work__tag">Case study ↗</span>
      </a>

      <div className={`work__info reveal ${infoIn ? "is-in" : ""}`} ref={info}>
        <div className="work__meta">
          <span className="label">{project.number} — {project.category}</span>
          <span className="label">{project.year}</span>
        </div>
        <h3 className="work__title display" id={`w-${project.id}`}>
          <a href={`#${to}`} onClick={open}>{project.title}</a>
        </h3>
        <TypeBadges project={project} />
        <p className="work__desc">{project.description}</p>
        <ul className="work__tech" aria-label="Tecnologie">
          {project.technologies.map(t => <li key={t}>{t}</li>)}
        </ul>
        <div className="work__actions">
          <Button href={`#${to}`} onClick={open} size="sm">View case study</Button>
          <span className="work__demo label">{project.demoUrl && project.demoMode !== "request" ? "● Demo visibile nel case study" : "Demo su richiesta"}</span>
        </div>
      </div>
    </article>
  );
}
