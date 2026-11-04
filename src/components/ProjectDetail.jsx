/* 05 — Case study: generato dai dati in src/data/projects.js */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../lib/app-context.js";
import { useParallax } from "../hooks/useMotion.js";
import { allProjects, findProject, asset, TYPE_LABEL, STATUS_LABEL } from "../data/projects.js";
import { site } from "../config/site.js";
import ProjectMockup from "./ProjectMockup.jsx";
import { TypeBadges } from "./ProjectCard.jsx";
import { Button, Reveal, SplitLines } from "./ui.jsx";
import NotFound from "../pages/NotFound.jsx";
import DemoViewer from "./DemoViewer.jsx";
import "./ProjectDetail.css";

function Block({ n, label, title, children, className = "" }) {
  return (
    <Reveal as="section" className={`cs-block ${className}`}>
      <span className="cs-block__rule" aria-hidden="true" />
      <div className="cs-block__side">
        <span className="cs-block__lab"><span className="mono">({n})</span><span className="label">{label}</span></span>
        {title && <h2 className="display cs-block__title">{title}</h2>}
      </div>
      <div className="cs-block__body">{children}</div>
    </Reveal>
  );
}

function Screens({ project }) {
  if (project.gallery && project.gallery.length) {
    return (
      <div className="cs-gallery" style={{ "--tint": project.colors?.bg || "var(--surface)" }}>
        {project.gallery.map((g, i) => (
          <Reveal as="figure" key={g.src} delay={i * 80} className={`cs-shot cs-shot--${g.device || "desktop"}`}>
            <div className="cs-shot__frame">
              <img src={asset(g.src)} alt={g.alt || project.title} loading="lazy" decoding="async" />
            </div>
          </Reveal>
        ))}
      </div>
    );
  }
  // nessuno screenshot ancora: schermate stilizzate nei colori del cliente
  return (
    <div className="cs-screens">
      <Reveal className="cs-screens__wide"><ProjectMockup project={project} layout="browser" /></Reveal>
      <Reveal className="cs-screens__tall" delay={120}><ProjectMockup project={project} layout="phone" /></Reveal>
      <div className="cs-screens__cap">
        <span className="label">Fig. A — Desktop</span>
        <span className="label">Fig. B — Mobile</span>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { go } = useApp();
  const i = findProject(id);
  const p = allProjects[i];
  const coverPar = useParallax(0.06);
  const [shown, setShown] = useState(false);
  const [demo, setDemo] = useState(false);
  const closeDemo = useCallback(() => setDemo(false), []);

  useEffect(() => {
    setShown(false);
    const t = setTimeout(() => setShown(true), 120);
    return () => clearTimeout(t);
  }, [id]);

  useEffect(() => {
    if (!p) return;
    document.title = `${p.title} — ${site.name}`;
    const d = document.querySelector('meta[name="description"]');
    const prev = d ? d.content : "";
    if (d) d.content = p.description;
    return () => {
      document.title = `${site.name} — ${site.positioning}`;
      if (d) d.content = prev;
    };
  }, [p]);

  if (!p) return <NotFound />;

  const prev = allProjects[(i - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(i + 1) % allProjects.length];
  const nav = (e, proj) => {
    e.preventDefault();
    go(`/work/${proj.id}`, { title: proj.title });
  };
  const canEmbed = !!p.demoUrl && p.demoMode !== "request";
  const requestDemo = e => {
    e.preventDefault();
    go("/contact", { title: "Contact", data: { project: p.title } });
  };
  const demoBtn = canEmbed ? (
    <Button onClick={() => setDemo(true)} icon="out">Guarda la demo</Button>
  ) : (
    <Button href="#/contact" onClick={requestDemo}>Demo su richiesta</Button>
  );

  return (
    <article className="cs">
      <header className={`cs-hero ${shown ? "is-ready" : ""}`}>
        <div className="container">
          <div className="cs-hero__top">
            <a className="cs-back label" href="#/work" onClick={e => { e.preventDefault(); go("/work", { title: "Case studies" }); }}>
              ← Case studies
            </a>
            <span className="label">Case study {p.number} / {String(allProjects.length).padStart(2, "0")}</span>
          </div>
          <div className="cs-hero__grid">
            <div className="cs-hero__head">
              <span className="cs-hero__num mono">({p.number})</span>
              <SplitLines as="h1" className="display cs-hero__title" lines={p.title.split(" ")} />
              <span className="label">{p.category}</span>
            </div>
            <dl className="cs-facts">
              <div><dt>Type</dt><dd>{TYPE_LABEL[p.type]}</dd></div>
              <div><dt>Status</dt><dd>{STATUS_LABEL[p.status] || "—"}</dd></div>
              <div><dt>Year</dt><dd>{p.year}</dd></div>
              {p.role && <div><dt>Role</dt><dd>{p.role}</dd></div>}
              {p.location && <div><dt>Location</dt><dd>{p.location}</dd></div>}
            </dl>
          </div>
        </div>
        <div className="cs-hero__stage container">
          <div className="cs-hero__frame">
            <div className="cs-hero__par" ref={coverPar}>
              <ProjectMockup project={p} layout="duo" />
            </div>
          </div>
        </div>
      </header>

      <div className="container cs-body">
        <Reveal className="cs-intro">
          <TypeBadges project={p} />
          <p className="cs-intro__lead">{p.description}</p>
          <div className="cs-intro__actions">{demoBtn}</div>
          {p.type === "concept" && (
            <p className="cs-intro__note">Concept realizzato di mia iniziativa: non è un sito commissionato né pubblicato dall'attività.</p>
          )}
        </Reveal>

        <Block n="01" label="Overview" title="Il progetto">
          <p className="cs-text">{p.overview}</p>
        </Block>

        <Block n="02" label="Objective" title="Obiettivo">
          <p className="cs-text cs-text--big">{p.objective}</p>
        </Block>

        <Block n="03" label="Visual direction" title="Direzione visiva">
          <p className="cs-text">{p.visualDirection}</p>
        </Block>

        <Block n="04" label="Features" title="Funzionalità">
          <ol className="cs-features">
            {p.features.map((f, k) => (
              <li key={f}><span className="mono">F.{String(k + 1).padStart(2, "0")}</span><p>{f}</p></li>
            ))}
          </ol>
        </Block>

        <Block n="05" label="Technologies" title="Stack">
          <ul className="cs-tech">
            {p.technologies.map(t => <li key={t}>{t}</li>)}
          </ul>
        </Block>

        <Block n="06" label="Screens" title={null} className="cs-block--wide">
          <Screens project={p} />
          <div className="cs-demo-cta">
            <p>{canEmbed ? "Puoi navigare la demo completa qui, in anteprima riservata." : "La demo completa è disponibile su richiesta."}</p>
            {demoBtn}
          </div>
        </Block>
      </div>

      {allProjects.length > 1 && (
        <nav className="cs-pn" aria-label="Altri progetti">
          <a href={`#/work/${prev.id}`} onClick={e => nav(e, prev)} className="cs-pn__item cs-pn__item--prev" data-cursor="Prev">
            <span className="label">← Previous project</span>
            <span className="cs-pn__title display">{prev.title}</span>
            <span className="cs-pn__thumb" aria-hidden="true"><ProjectMockup project={prev} interactive={false} /></span>
          </a>
          <a href={`#/work/${next.id}`} onClick={e => nav(e, next)} className="cs-pn__item cs-pn__item--next" data-cursor="Next">
            <span className="label">Next project →</span>
            <span className="cs-pn__title display">{next.title}</span>
            <span className="cs-pn__thumb" aria-hidden="true"><ProjectMockup project={next} interactive={false} /></span>
          </a>
        </nav>
      )}
      {demo && canEmbed && <DemoViewer project={p} onClose={closeDemo} />}
    </article>
  );
}
