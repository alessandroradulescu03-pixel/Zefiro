/* Motore delle animazioni legate allo scroll:
   - reveal: aggiunge .is-in quando l'elemento entra nello schermo
   - parallax: sposta un elemento in base alla posizione del suo contenitore
   - progress: callback con l'avanzamento (0→1) di una sezione */
import { onScroll } from "./smooth.js";

/* ---------- reveal ----------
   Un solo IntersectionObserver per tutto il sito. Il risultato passa a React
   tramite callback, così una nuova render non cancella mai lo stato "visibile". */
let io = null;
const callbacks = new WeakMap();
export function observeReveal(el, onIn) {
  if (!el) return () => {};
  if (typeof IntersectionObserver === "undefined") {
    onIn();
    return () => {};
  }
  if (!io) {
    io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            const cb = callbacks.get(e.target);
            io.unobserve(e.target);
            callbacks.delete(e.target);
            cb && cb();
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );
  }
  callbacks.set(el, onIn);
  io.observe(el);
  return () => {
    callbacks.delete(el);
    io && io.unobserve(el);
  };
}

/* ---------- loop condiviso per parallax e progress ---------- */
const items = new Set();
let raf = 0;
function tick() {
  raf = 0;
  const vh = window.innerHeight;
  items.forEach(item => {
    const box = (item.measure || item.el).getBoundingClientRect();
    if (box.bottom < -vh * 0.5 || box.top > vh * 1.5) return;
    item.run(box, vh);
  });
}
const schedule = () => {
  if (!raf) raf = requestAnimationFrame(tick);
};
let bound = false;
function bind() {
  if (bound) return;
  bound = true;
  onScroll(schedule);
  window.addEventListener("resize", schedule);
}

/* el si muove; viene misurato il suo genitore, così la trasformazione non falsa la misura */
export function addParallax(el, speed = 0.1) {
  if (!el) return () => {};
  bind();
  const item = {
    el,
    measure: el.parentElement,
    run(box, vh) {
      const mid = box.top + box.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-mid * speed).toFixed(1)}px, 0)`;
    },
  };
  items.add(item);
  schedule();
  return () => {
    items.delete(item);
    el.style.transform = "";
  };
}

/* progress: 0 quando la cima della sezione tocca il fondo dello schermo,
   1 quando il fondo della sezione tocca il fondo dello schermo */
export function addProgress(el, cb) {
  if (!el) return () => {};
  bind();
  const item = {
    el,
    run(box, vh) {
      const total = box.height;
      const p = Math.min(1, Math.max(0, (vh - box.top) / total));
      cb(p);
    },
  };
  items.add(item);
  schedule();
  return () => items.delete(item);
}
