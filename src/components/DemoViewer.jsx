/* Anteprima protetta della demo: il sito si apre dentro il portfolio,
   in una cornice senza barra degli indirizzi. Il link non viene mostrato,
   non si apre in una nuova scheda e non passa il referrer.
   SOLO VISUALIZZAZIONE: si può scorrere e guardare, ma niente è cliccabile
   (link, pulsanti, form, menu disattivati). Le demo stanno sullo stesso dominio
   del portfolio, quindi la pagina interna si può "bloccare" dall'esterno; se per
   qualche motivo non fosse possibile, un velo trasparente copre tutta la demo. */

const LOCK_CSS = `
a, button, input, select, textarea, label, summary, form, video, audio, iframe,
[role="button"], [role="link"], [role="tab"], [onclick], [contenteditable] { pointer-events: none !important; }
* { cursor: default !important; -webkit-user-select: none !important; user-select: none !important; }
`;

function lockFrame(frame) {
  try {
    const w = frame.contentWindow;
    const d = w.document;
    if (!d || !d.head) return false;
    if (!d.getElementById("__view-only")) {
      const st = d.createElement("style");
      st.id = "__view-only";
      st.textContent = LOCK_CSS;
      d.head.appendChild(st);
      const stop = e => { e.preventDefault(); e.stopImmediatePropagation(); };
      ["click", "auxclick", "dblclick", "submit", "contextmenu", "dragstart", "mousedown", "pointerdown", "focusin"].forEach(t =>
        d.addEventListener(t, stop, true)
      );
      // tastiera: solo i tasti per scorrere
      const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      d.addEventListener("keydown", e => { if (!scrollKeys.includes(e.key)) stop(e); }, true);
      d.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach(el => el.setAttribute("tabindex", "-1"));
      w.open = () => null;
    }
    return true;
  } catch {
    return false; // cornice non accessibile: resta il velo
  }
}
import { useEffect, useRef, useState } from "react";
import { lockScroll } from "../lib/smooth.js";
import "./DemoViewer.css";

export default function DemoViewer({ project, onClose }) {
  const [device, setDevice] = useState("desktop");
  const [loaded, setLoaded] = useState(false);
  const [locked, setLocked] = useState(false);
  const frame = useRef(null);
  const closeBtn = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    lockScroll(true);
    closeBtn.current && closeBtn.current.focus();
    const key = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", key);
      prev && prev.focus && prev.focus();
    };
  }, [onClose]);

  return (
    <div className="demo" role="dialog" aria-modal="true" aria-label={`Demo di ${project.title}`} data-lenis-prevent>
      <div className="demo__backdrop" onClick={onClose} />
      <div className="demo__panel">
        <div className="demo__bar">
          <span className="demo__dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="demo__title"><span className="demo__lock" aria-hidden="true">●</span> Demo privata — {project.title}</span>
          <div className="demo__tools" role="group" aria-label="Dispositivo">
            <button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button>
            <button type="button" aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>Mobile</button>
          </div>
          <button ref={closeBtn} type="button" className="demo__close" onClick={onClose} aria-label="Chiudi la demo">✕</button>
        </div>
        <div className={`demo__stage is-${device}`}>
          {!loaded && <span className="demo__loading label">Caricamento della demo…</span>}
          <iframe
            className="demo__frame"
            src={project.demoUrl}
            title={`Demo di ${project.title}`}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin"
            ref={frame}
            onLoad={() => { setLocked(lockFrame(frame.current)); setLoaded(true); }}
          />
          {!locked && <div className="demo__veil" aria-hidden="true" />}
        </div>
        <p className="demo__note">Solo visualizzazione · anteprima riservata del progetto, visibile solo qui.</p>
      </div>
    </div>
  );
}
