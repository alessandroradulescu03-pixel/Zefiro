/* Case study: generato dai dati in src/data/projects.js */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../lib/app-context.js";
import { useParallax } from "../hooks/useMotion.js";
import { allProjects, findProject, asset, TYPE_LABEL, STATUS_LABEL } from "../data/projects.js";
import { site } from "../config/site.js";
import { Badge, Img } from "./Projects.jsx";
import { Button, Icon, Reveal, SplitLines } from "./ui.jsx";
import NotFound from "../pages/NotFound.jsx";
import DemoViewer from "./DemoViewer.jsx";
import "./Projects.css";
import "./ProjectDetail.css";

function Block({ n, label, children, className = "" }) {
  return (
    <Reveal as="section" className={`cs-block ${className}`}>
      <div className="cs-block__side">
        <span className="mono cs-block__n">{n}</span>
        <h2 className="label cs-block__label">{label}</h2>
      </div>
      <div className="cs-block__body">{children}</div>
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { go } = useApp();
  const i = findProject(id);
  const p = allProjects[i];
  const par = useParallax(0.05);
  const [shown, setShown] = useState(false);
  const [demo, setDemo] = useState(false);
  const closeDemo = useCallback(() => setDemo(false), []);

  useEffect(() => {
    setShown(false);
    const t = setTimeout(() => setShown(true), 80);
    return () => clearTimeout(t);
  }, [id]);

  useEffect(() => {
    if (!p) return;
    document.title = `${p.title} — Case study — ${site.name}`;
    const d = document.querySelector('meta[name="description"]');
    const prev = d ? d.content : "";
    if (d) d.content = p.description;
    return () => {
      if (d) d.content = prev;
    };
  }, [p]);

  if (!p) return <NotFound />;

  const desk = (p.gallery || []).filter(g => g.device !== "mobile");
  const mob = (p.gallery || []).find(g => g.device === "mobile");
  const next = allProjects[(i + 1) % allProjects.length];
  const canEmbed = !!p.demoUrl && p.demoMode !== "request";
  const demoBtn = canEmbed ? (
    <Button onClick={() => setDemo(true)} icon="out">Guarda la demo</Button>
  ) : (
    <Button href="#/contatti" onClick={e => { e.preventDefault(); go("/contatti", { title: "Contatti", data: { project: p.title } }); }}>
      Demo su richiesta
    </Button>
  );

  return (
    <article className="cs">
      <header className={`cs-hero tone-dark ${shown ? "is-ready" : ""}`}>
        <div className="container">
          <div className="cs-hero__top">
            <a className="cs-back label" href="#/progetti" onClick={e => { e.preventDefault(); go("/progetti", { title: "Progetti" }); }}>
              {Icon.back} Tutti i progetti
            </a>
            <span className="label">Case study {p.number} / {String(allProjects.length).padStart(2, "0")}</span>
          </div>
          <div className="cs-hero__grid">
            <div>
              <p className="cs-hero__cat label">{p.category}</p>
              <SplitLines as="h1" className="display h1 cs-hero__title" lines={[p.title]} />
              <p className="cs-hero__lead">{p.description}</p>
              <div className="cs-hero__actions">
                <Badge project={p} />
                {demoBtn}
              </div>
            </div>
            <dl className="cs-facts">
              <div><dt className="label">Tipologia</dt><dd>{TYPE_LABEL[p.type]}</dd></div>
              <div><dt className="label">Stato</dt><dd>{STATUS_LABEL[p.status] || "—"}</dd></div>
              <div><dt className="label">Anno</dt><dd>{p.year}</dd></div>
              {p.location && <div><dt className="label">Luogo</dt><dd>{p.location}</dd></div>}
              {p.role && <div><dt className="label">Lavoro svolto</dt><dd>{p.role}</dd></div>}
            </dl>
          </div>
        </div>
        {desk[0] && (
          <div className="container cs-hero__stage">
            <div className="cs-hero__par" ref={par}>
              <div className="cs-frame">
                <div className="cs-frame__bar" aria-hidden="true"><i /><i /><i /></div>
                <Img src={asset(desk[0].src)} alt={desk[0].alt} width="1440" height="900" decoding="async" />
              </div>
              {mob && (
                <div className="cs-phone">
                  <Img src={asset(mob.src)} alt={mob.alt} width="585" height="1266" decoding="async" loading="lazy" />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="cs-body tone-light">
        <div className="container">
          {p.type === "concept" && (
            <Reveal className="cs-note">
              <span className="badge badge--concept"><i aria-hidden="true" />Concept dimostrativo</span>
              <p>Proposta realizzata di nostra iniziativa per mostrare all'attività una possibile presenza online: non è un sito commissionato né pubblicato dall'attività.</p>
            </Reveal>
          )}
          {p.type === "client" && (
            <Reveal className="cs-note cs-note--client">
              <span className="badge badge--client"><i aria-hidden="true" />Progetto cliente{p.status ? ` · ${STATUS_LABEL[p.status]}` : ""}</span>
              <p>Progetto realizzato per un'attività reale.{p.status === "in-development" ? " Il lavoro è ancora in corso: alcune parti possono cambiare prima della pubblicazione definitiva." : ""}</p>
            </Reveal>
          )}

          <Block n="01" label="Il progetto">
            <p className="cs-text cs-text--big">{p.overview}</p>
          </Block>
          <Block n="02" label="Obiettivo">
            <p className="cs-text">{p.objective}</p>
          </Block>
          <Block n="03" label="Direzione visiva">
            <p className="cs-text">{p.visualDirection}</p>
            {p.colors && (
              <ul className="cs-swatches" aria-label="Colori principali del progetto">
                {[p.colors.bg, p.colors.fg, p.colors.accent].filter((c, k, a) => c && a.indexOf(c) === k).map(c => (
                  <li key={c}><span style={{ background: c }} /><span className="mono">{c.toUpperCase()}</span></li>
                ))}
              </ul>
            )}
          </Block>
          <Block n="04" label="Funzionalità">
            <ol className="cs-features">
              {p.features.map((f, k) => (
                <li key={f}><span className="mono">{String(k + 1).padStart(2, "0")}</span><p>{f}</p></li>
              ))}
            </ol>
          </Block>
          <Block n="05" label="Tecnologie">
            <ul className="cs-tech">{p.technologies.map(t => <li key={t} className="mono">{t}</li>)}</ul>
          </Block>
        </div>

        {desk.length > 1 && (
          <div className="container cs-gallery">
            {desk.slice(1).map((g, k) => (
              <Reveal as="figure" key={g.src} delay={k * 80} className="cs-frame cs-frame--wide">
                <div className="cs-frame__bar" aria-hidden="true"><i /><i /><i /></div>
                <Img src={asset(g.src)} alt={g.alt} loading="lazy" decoding="async" width="1440" height="900" />
              </Reveal>
            ))}
          </div>
        )}

        <div className="container">
          <Reveal className="cs-demo">
            <div>
              <p className="label">Demo</p>
              <p className="cs-demo__t display">
                {canEmbed ? "Naviga la demo completa in anteprima riservata." : "La demo completa è disponibile su richiesta."}
              </p>
            </div>
            {demoBtn}
          </Reveal>
        </div>
      </div>

      {allProjects.length > 1 && (
        <nav className="cs-next tone-dark" aria-label="Progetto successivo">
          <a
            className="container cs-next__in"
            href={`#/progetti/${next.id}`}
            onClick={e => { e.preventDefault(); go(`/progetti/${next.id}`, { title: next.title }); }}
          >
            <span className="label">Progetto successivo</span>
            <span className="cs-next__title display">{next.title}</span>
            <span className="cs-next__cat">{next.category}</span>
            <span className="cs-next__go" aria-hidden="true">{Icon.arrow}</span>
          </a>
        </nav>
      )}
      {demo && canEmbed && <DemoViewer project={p} onClose={closeDemo} />}
    </article>
  );
}
