/* Mockup realistico di un progetto: finestra browser + smartphone.
   - Se nel progetto ci sono screenshot (gallery con device "desktop"/"mobile", o cover),
     vengono mostrati quelli.
   - Altrimenti viene disegnata una schermata di sito stilizzata nei colori del cliente.
   Al passaggio del mouse la composizione si inclina leggermente (con fallback statico). */
import { useRef } from "react";
import { asset } from "../data/projects.js";
import { useFinePointer, useReducedMotion } from "../hooks/useMotion.js";
import "./ProjectMockup.css";

export function SiteScreen({ project, device = "desktop" }) {
  const c = project.colors || { bg: "#17181C", fg: "#F3F1EC", accent: "#2C46C4" };
  const words = project.title.split(" ");
  return (
    <div className={`site site--${device}`} style={{ "--s-bg": c.bg, "--s-fg": c.fg, "--s-ac": c.accent }} aria-hidden="true">
      <div className="site__nav">
        <span className="site__logo">{words[0]}</span>
        {device === "desktop" ? (
          <span className="site__menu"><i /><i /><i /><i /></span>
        ) : (
          <span className="site__burger"><i /><i /></span>
        )}
        {device === "desktop" && <span className="site__cta" />}
      </div>
      <div className="site__hero">
        <div className="site__copy">
          <span className="site__eyebrow">{project.category}</span>
          <span className="site__title">{project.title}</span>
          <span className="site__lines"><i /><i /></span>
          <span className="site__btns"><b /><b /></span>
        </div>
        <div className="site__visual"><span /></div>
      </div>
      <div className="site__cards">
        <i /><i /><i />
      </div>
    </div>
  );
}

function Screen({ project, device }) {
  const shot = (project.gallery || []).find(g => (g.device || "desktop") === device);
  const src = shot ? shot.src : device === "desktop" ? project.cover : "";
  if (src) return <img className="mock__img" src={asset(src)} alt="" loading="lazy" decoding="async" />;
  return <SiteScreen project={project} device={device} />;
}

export default function ProjectMockup({ project, layout = "duo", interactive = true, className = "" }) {
  const stage = useRef(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const tilt = interactive && fine && !reduced;
  const c = project.colors || {};

  const move = e => {
    const el = stage.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
    el.style.setProperty("--px", `${(x * 14).toFixed(1)}px`);
    el.style.setProperty("--py", `${(y * 14).toFixed(1)}px`);
  };
  const leave = () => {
    const el = stage.current;
    if (!el) return;
    ["--rx", "--ry", "--px", "--py"].forEach(k => el.style.removeProperty(k));
  };

  return (
    <div
      ref={stage}
      className={`mock mock--${layout} ${className}`}
      style={{ "--m-tint": c.bg || "#17181C", "--m-ac": c.accent || "#2C46C4" }}
      onPointerMove={tilt ? move : undefined}
      onPointerLeave={tilt ? leave : undefined}
      role="img"
      aria-label={`Anteprima del progetto ${project.title} su computer e smartphone`}
    >
      <div className="mock__floor" aria-hidden="true" />
      <div className="mock__scene">
        {layout !== "phone" && (
          <div className="mock__browser">
            <div className="mock__bar">
              <span className="mock__dots"><i /><i /><i /></span>
              <span className="mock__addr">{project.title}</span>
            </div>
            <div className="mock__screen"><Screen project={project} device="desktop" /></div>
          </div>
        )}
        {layout !== "browser" && (
          <div className="mock__phone">
            <span className="mock__island" />
            <div className="mock__pscreen"><Screen project={project} device="mobile" /></div>
          </div>
        )}
      </div>
    </div>
  );
}
