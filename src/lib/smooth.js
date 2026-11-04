/* Smooth scrolling (Lenis) con fallback nativo.
   Un solo punto di accesso per scroll, ascoltatori e blocco dello scroll. */
import Lenis from "lenis";

let lenis = null;
const listeners = new Set();
const emit = () => listeners.forEach(fn => fn(window.scrollY));

export function initSmooth(reduced) {
  window.addEventListener("resize", emit);
  if (reduced) {
    window.addEventListener("scroll", emit, { passive: true });
    return () => {
      window.removeEventListener("scroll", emit);
      window.removeEventListener("resize", emit);
    };
  }
  lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on("scroll", emit);
  let id = requestAnimationFrame(function raf(time) {
    lenis.raf(time);
    id = requestAnimationFrame(raf);
  });
  return () => {
    cancelAnimationFrame(id);
    window.removeEventListener("resize", emit);
    lenis.destroy();
    lenis = null;
  };
}

export const onScroll = fn => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/* target: id di una sezione, elemento o numero di pixel */
export function scrollToTarget(target, { immediate = false, offset = 0 } = {}) {
  const el = typeof target === "string" ? document.getElementById(target) : target;
  if (lenis) {
    lenis.scrollTo(el ?? 0, { immediate, offset, duration: 1.4, force: true });
    return;
  }
  const top = typeof el === "number" ? el : el ? el.getBoundingClientRect().top + window.scrollY + offset : 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: immediate || reduce ? "auto" : "smooth" });
}

export function lockScroll(lock) {
  document.documentElement.classList.toggle("is-locked", lock);
  if (lenis) lock ? lenis.stop() : lenis.start();
}
