/* Hero: a sinistra il messaggio, a destra la composizione "Flusso → Struttura":
   le linee del vento (le stesse curve del simbolo) attraversano una griglia
   e mettono in ordine i moduli di una pagina. Si disegna una volta sola all'apertura;
   con il mouse i livelli si spostano di pochi pixel. */
import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/app-context.js";
import { useFinePointer, useReducedMotion } from "../hooks/useMotion.js";
import { site } from "../config/site.js";
import { STAR_PATH } from "./Logo.jsx";
import { Button, Icon, SplitLines } from "./ui.jsx";
import "./Hero.css";

const COLS = Array.from({ length: 13 }, (_, i) => 88 + i * 40);
const ROWS = Array.from({ length: 12 }, (_, i) => 72 + i * 40);

function Composition() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !fine) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const layers = [...el.querySelectorAll("[data-depth]")];
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      layers.forEach(l => {
        const d = Number(l.dataset.depth);
        l.style.transform = `translate(${(cx * d).toFixed(2)}px, ${(cy * d).toFixed(2)}px)`;
      });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.01 ? requestAnimationFrame(loop) : 0;
    };
    const move = e => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [reduced, fine]);

  return (
    <div className="hero__art" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 640 600" xmlns="http://www.w3.org/2000/svg" className="comp">
        <defs>
          <linearGradient id="wind" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#1765E8" stopOpacity="0" />
            <stop offset="0.35" stopColor="#1765E8" />
            <stop offset="1" stopColor="#39B8F4" />
          </linearGradient>
          <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#123DAD" />
            <stop offset="0.6" stopColor="#1765E8" />
            <stop offset="1" stopColor="#39B8F4" />
          </linearGradient>
        </defs>

        {/* 1 — griglia di progetto */}
        <g className="comp__grid" data-depth="2">
          {COLS.map(x => <line key={"c" + x} x1={x} y1="56" x2={x} y2="544" />)}
          {ROWS.map(y => <line key={"r" + y} x1="72" y1={y} x2="584" y2={y} />)}
          {[[88, 72], [568, 72], [88, 512], [568, 512]].map(([x, y]) => (
            <path key={x + "-" + y} className="comp__cross" d={`M${x - 7} ${y}h14M${x} ${y - 7}v14`} />
          ))}
        </g>

        {/* 2 — moduli della pagina, allineati alla griglia */}
        <g className="comp__mods" data-depth="5">
          <g className="comp__mod" style={{ "--m": 0 }}>
            <rect x="88" y="88" width="480" height="32" rx="4" className="m-line" />
            <rect x="100" y="100" width="40" height="8" rx="2" className="m-fill-strong" />
            <rect x="408" y="100" width="28" height="8" rx="2" className="m-fill" />
            <rect x="448" y="100" width="28" height="8" rx="2" className="m-fill" />
            <rect x="488" y="97" width="68" height="14" rx="7" className="m-blue" />
          </g>
          <g className="comp__mod" style={{ "--m": 1 }}>
            <rect x="88" y="136" width="288" height="176" rx="6" className="m-panel" />
            <rect x="108" y="164" width="200" height="16" rx="3" className="m-fill-strong" />
            <rect x="108" y="188" width="152" height="16" rx="3" className="m-fill-strong" />
            <rect x="108" y="220" width="216" height="6" rx="3" className="m-fill" />
            <rect x="108" y="234" width="180" height="6" rx="3" className="m-fill" />
            <rect x="108" y="262" width="96" height="28" rx="14" className="m-blue" />
            <rect x="214" y="262" width="76" height="28" rx="14" className="m-line" />
          </g>
          <g className="comp__mod" style={{ "--m": 2 }}>
            <rect x="392" y="136" width="176" height="176" rx="6" fill="url(#panel)" opacity="0.9" />
            <path d={STAR_PATH} transform="translate(480 224) scale(1.5) translate(-181 -39)" fill="#fff" opacity="0.92" />
          </g>
          {[88, 248, 408].map((x, i) => (
            <g key={x} className="comp__mod" style={{ "--m": 3 + i }}>
              <rect x={x} y="328" width="160" height="120" rx="6" className="m-line m-card" />
              <rect x={x + 14} y="342" width="132" height="54" rx="3" className="m-fill" />
              <rect x={x + 14} y="408" width="84" height="8" rx="2" className="m-fill-strong" />
              <rect x={x + 14} y="424" width="112" height="5" rx="2.5" className="m-fill" />
            </g>
          ))}
          <g className="comp__mod" style={{ "--m": 6 }}>
            <rect x="88" y="464" width="480" height="40" rx="4" className="m-line" />
            <rect x="100" y="480" width="64" height="8" rx="2" className="m-fill" />
            <rect x="496" y="480" width="60" height="8" rx="2" className="m-fill" />
          </g>
        </g>

        {/* 3 — selezione da strumento di design sul pannello immagine */}
        <g className="comp__sel" data-depth="7">
          <rect x="386" y="130" width="188" height="188" className="sel-box" />
          {[[386, 130], [574, 130], [386, 318], [574, 318]].map(([x, y]) => (
            <rect key={x + "-" + y} x={x - 4} y={y - 4} width="8" height="8" className="sel-handle" />
          ))}
          <g transform="translate(386 330)">
            <rect width="122" height="22" rx="4" className="sel-chip" />
            <text x="10" y="15" className="sel-txt">DIGITAL IDENTITY</text>
          </g>
          <path d="M88 126v-6M376 126v-6M88 123h288" className="dim" />
          <text x="232" y="116" className="dim-txt" textAnchor="middle">288</text>
        </g>

        {/* 4 — linee del vento */}
        <g className="comp__wind" data-depth="10">
          <path className="w w1" pathLength="1" d="M-20 590 C80 470 170 380 290 352 C390 330 470 330 600 70" />
          <path className="w w2" pathLength="1" d="M-20 560 C70 440 150 330 260 300 C350 276 430 250 560 96" />
          <path className="w w3" pathLength="1" d="M10 600 C120 520 230 470 340 452 C450 434 530 380 620 220" />
          <path className="w w4" pathLength="1" d="M-30 520 C40 420 120 290 230 256 C300 234 360 214 470 120" />
          <path d={STAR_PATH} className="comp__star" transform="translate(600 70) scale(1.1) translate(-181 -39)" />
        </g>

        {/* 5 — annotazioni tecniche */}
        <g className="comp__notes">
          <text x="88" y="40">GRID — 12 COL / 40</text>
          <text x="568" y="40" textAnchor="end">BUILD 01</text>
          <text x="88" y="572">{site.coords}</text>
          <text x="568" y="572" textAnchor="end">ZEFIRO / STUDIO</text>
        </g>
      </svg>
    </div>
  );
}

export default function Hero() {
  const { navTo } = useApp();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={`hero tone-dark ${ready ? "is-ready" : ""}`} aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__text">
          <p className="hero__eyebrow label">
            {Icon.spark}
            <span>{site.name}</span>
            <span className="hero__sep" aria-hidden="true" />
            <span>{site.city}</span>
          </p>
          <SplitLines
            as="h1"
            id="hero-title"
            className="display hero__title"
            lines={[
              <span key="a" className="hero__soft">Non realizziamo semplicemente siti web.</span>,
              "Costruiamo",
              "esperienze digitali.",
            ]}
          />
          <p className="hero__lead">
            Progettiamo e sviluppiamo esperienze digitali su misura per aziende, professionisti e brand che vogliono distinguersi online.
          </p>
          <div className="hero__ctas">
            <Button href="#/progetti" onClick={e => { e.preventDefault(); navTo({ to: "/progetti", label: "Progetti" }); }}>
              Scopri i progetti
            </Button>
            <Button variant="ghost" href="#/contatti" onClick={e => { e.preventDefault(); navTo({ to: "/contatti", label: "Contatti" }); }}>
              Parliamo del tuo progetto
            </Button>
          </div>
        </div>
        <Composition />
      </div>

      <div className="container hero__base">
        <span className="label">Web Design · Web Development · E-commerce · Digital Identity</span>
        <span className="label hero__payoff">{site.payoff}</span>
        <button type="button" className="hero__scroll label" onClick={() => navTo({ to: "/", section: "servizi" })}>
          Scorri {Icon.down}
        </button>
      </div>
    </section>
  );
}
