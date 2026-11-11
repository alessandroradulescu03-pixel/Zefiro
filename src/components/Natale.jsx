/* WINTER EDITION 🎄 — neve leggera su tutta la pagina e cartellino regalo
   in basso a sinistra con il conto alla rovescia e l'interruttore della neve.
   Montato da App.jsx solo quando il tema è acceso (vedi lib/natale.js). */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useMotion.js";
import { messaggioNatale } from "../lib/natale.js";
import "./Natale.css";

const KEY = "ds-neve";
function nevePref() {
  try { return localStorage.getItem(KEY) !== "0"; } catch { return true; }
}

/* fiocco disegnato una volta sola: bianco con un'ombra d'inchiostro,
   così si vede sia sulla carta chiara sia sulle sezioni scure */
function fiocco() {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const x = c.getContext("2d");
  x.shadowColor = "rgba(23, 24, 28, 0.5)";
  x.shadowBlur = 5;
  x.fillStyle = "#ffffff";
  x.beginPath();
  x.arc(16, 16, 7, 0, Math.PI * 2);
  x.fill();
  return c;
}

function Neve() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const sprite = fiocco();
    let w = 0, h = 0, id = 0, fiocchi = [];
    const nuovo = (dallAlto) => ({
      x: Math.random() * w,
      y: dallAlto ? -20 : Math.random() * h,
      r: 5 + Math.random() * 11,          // dimensione disegnata
      v: 0.25 + Math.random() * 0.7,      // velocità di caduta
      d: Math.random() * Math.PI * 2,     // fase dell'oscillazione
      a: 0.45 + Math.random() * 0.5,
    });
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, Math.max(26, w / 22)));
      fiocchi = Array.from({ length: n }, () => nuovo(false));
    };
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of fiocchi) {
        f.y += f.v;
        f.d += 0.008;
        f.x += Math.sin(f.d) * 0.35;
        if (f.y > h + 20) Object.assign(f, nuovo(true));
        ctx.globalAlpha = f.a;
        ctx.drawImage(sprite, f.x, f.y, f.r, f.r);
      }
      id = requestAnimationFrame(frame);
    };
    const vis = () => {
      cancelAnimationFrame(id);
      if (!document.hidden) id = requestAnimationFrame(frame);
    };
    resize();
    id = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", vis);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);
  return <canvas ref={ref} className="xm-neve" aria-hidden="true" />;
}

export default function Natale() {
  const reduced = useReducedMotion();
  const [neve, setNeve] = useState(nevePref);
  const { testo, giorni } = messaggioNatale();

  useEffect(() => {
    document.documentElement.classList.add("natale");
    return () => document.documentElement.classList.remove("natale");
  }, []);

  const toggle = () => {
    setNeve(v => {
      try { localStorage.setItem(KEY, v ? "0" : "1"); } catch { /* storage non disponibile */ }
      return !v;
    });
  };

  return (
    <>
      {neve && !reduced && <Neve />}
      <aside className="xm-tag" aria-label="Winter edition">
        <span className="xm-tag__foro" aria-hidden="true" />
        <span className="xm-tag__txt">
          <span className="xm-tag__k">Winter edition</span>
          <span className="xm-tag__v">{giorni != null && <b>{giorni}</b>} {testo}</span>
        </span>
        {!reduced && (
          <button type="button" className="xm-tag__btn" aria-pressed={neve} onClick={toggle} title={neve ? "Ferma la neve" : "Fai nevicare"}>
            <span aria-hidden="true">❄</span>
            <span className="sr-only">Neve</span>
          </button>
        )}
      </aside>
    </>
  );
}
