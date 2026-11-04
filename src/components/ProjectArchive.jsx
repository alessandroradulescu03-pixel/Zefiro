/* Archivio a elenco con anteprima che segue il puntatore */
import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/app-context.js";
import { TYPE_LABEL } from "../data/projects.js";
import { useFinePointer, useReducedMotion } from "../hooks/useMotion.js";
import ProjectCover from "./ProjectCover.jsx";
import { Reveal } from "./ui.jsx";

export default function ProjectArchive({ projects }) {
  const { go } = useApp();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(null);
  const pv = useRef(null);
  const pos = useRef({ x: 0, y: 0, cx: 0, cy: 0 });

  useEffect(() => {
    if (!fine || hover === null) return;
    let raf;
    const loop = () => {
      const p = pos.current;
      p.cx += (p.x - p.cx) * (reduced ? 1 : 0.15);
      p.cy += (p.y - p.cy) * (reduced ? 1 : 0.15);
      if (pv.current) pv.current.style.transform = `translate3d(${p.cx + 28}px, ${p.cy - 110}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fine, hover, reduced]);

  const current = projects.find(p => p.id === hover);

  return (
    <Reveal className="archive">
      <div className="archive__head">
        <span className="label label--lime">Archive</span>
        <span className="label">{projects.length} more projects</span>
      </div>
      <ul
        className="archive__list"
        onPointerMove={e => {
          pos.current.x = e.clientX;
          pos.current.y = e.clientY;
        }}
        onPointerLeave={() => setHover(null)}
      >
        {projects.map(p => (
          <li key={p.id}>
            <a
              href={`#/work/${p.id}`}
              onClick={e => {
                e.preventDefault();
                go(`/work/${p.id}`, { title: p.title });
              }}
              onPointerEnter={e => {
                if (hover === null) {
                  pos.current.cx = e.clientX;
                  pos.current.cy = e.clientY;
                }
                setHover(p.id);
              }}
            >
              <span className="archive__n mono">{p.number}</span>
              <span className="archive__t">{p.title}</span>
              <span className="archive__c">{p.category}</span>
              <span className="archive__ty">{TYPE_LABEL[p.type]}</span>
              <span className="archive__y mono">{p.year}</span>
            </a>
          </li>
        ))}
      </ul>
      {fine && (
        <div className={`archive__pv ${current ? "is-on" : ""}`} ref={pv} aria-hidden="true">
          {current && <ProjectCover project={current} />}
        </div>
      )}
    </Reveal>
  );
}
