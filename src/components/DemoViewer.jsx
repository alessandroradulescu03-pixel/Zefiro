/* Anteprima protetta della demo: il sito si apre dentro il portfolio,
   in una cornice senza barra degli indirizzi. Il link non viene mostrato,
   non si apre in una nuova scheda e non passa il referrer. */
import { useEffect, useRef, useState } from "react";
import { lockScroll } from "../lib/smooth.js";
import "./DemoViewer.css";

export default function DemoViewer({ project, onClose }) {
  const [device, setDevice] = useState("desktop");
  const [loaded, setLoaded] = useState(false);
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
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={() => setLoaded(true)}
          />
        </div>
        <p className="demo__note">Anteprima riservata del progetto, visibile solo qui.</p>
      </div>
    </div>
  );
}
