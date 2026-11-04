/* 01 — Opening experience: breve, una volta per sessione, saltabile */
import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/app-context.js";
import { lockScroll } from "../lib/smooth.js";
import { useReducedMotion } from "../hooks/useMotion.js";
import { site } from "../config/site.js";
import "./Loader.css";

const WORDS = ["Digital design", "Development", "Experiences"];
const DURATION = 1700;
const KEY = "ds-intro-seen";

function seen() {
  try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; }
}

export default function Loader() {
  const { setReady } = useApp();
  const reduced = useReducedMotion();
  const [show] = useState(() => !seen() && !matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [phase, setPhase] = useState(show ? "run" : "gone"); // run → exit → gone
  const [count, setCount] = useState(0);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    try { sessionStorage.setItem(KEY, "1"); } catch { /* storage non disponibile */ }
    setPhase("exit");
    setReady(true);
    setTimeout(() => {
      setPhase("gone");
      lockScroll(false);
    }, 1000);
  };

  useEffect(() => {
    if (!show || reduced) {
      setReady(true);
      setPhase("gone");
      return;
    }
    lockScroll(true);
    const t0 = performance.now();
    let id = requestAnimationFrame(function step(now) {
      const k = Math.min(1, (now - t0) / DURATION);
      setCount(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) id = requestAnimationFrame(step);
      else finish();
    });
    const key = e => e.key === "Escape" && finish();
    window.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone") return null;
  const step = Math.min(WORDS.length - 1, Math.floor((count / 100) * WORDS.length));

  return (
    <div className={`loader is-${phase}`} role="status" aria-live="polite" aria-label="Caricamento del portfolio">
      <div className="loader__panel loader__panel--lime" aria-hidden="true" />
      <div className="loader__panel loader__panel--main">
        <div className="loader__top container">
          <span className="loader__brand"><b>{site.monogram}</b> / {site.role}</span>
          <button type="button" className="loader__skip" onClick={finish}>Skip intro</button>
        </div>
        <div className="loader__words container" aria-hidden="true">
          {WORDS.map((w, i) => (
            <span key={w} className={`loader__word ${i <= step ? "is-on" : ""} ${i === step ? "is-current" : ""}`}>
              <span>{w}</span>
            </span>
          ))}
        </div>
        <div className="loader__bottom container">
          <span className="loader__count mono">{String(count).padStart(3, "0")}</span>
          <span className="loader__bar" aria-hidden="true"><i style={{ transform: `scaleX(${count / 100})` }} /></span>
          <span className="label">The Digital Signature — {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
