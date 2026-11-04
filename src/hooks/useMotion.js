import { useEffect, useRef, useState } from "react";
import { addParallax, observeReveal } from "../lib/motion.js";

const RM = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && matchMedia(RM).matches);
  useEffect(() => {
    const mq = matchMedia(RM);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function useFinePointer() {
  const [fine] = useState(() => typeof window !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches);
  return fine;
}

/* [ref, visibile]: diventa true la prima volta che l'elemento entra nello schermo */
export function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => observeReveal(ref.current, () => setInView(true)), []);
  return [ref, inView];
}

export function useParallax(speed = 0.1) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => (reduced ? undefined : addParallax(ref.current, speed)), [reduced, speed]);
  return ref;
}

/* pulsanti magnetici: solo con mouse e senza "riduci movimento" */
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !fine) return;
    const move = e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduced, fine, strength]);
  return ref;
}

export function useLocalTime(timeZone) {
  const fmt = () => {
    try {
      return new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone }).format(new Date());
    } catch {
      return new Date().toLocaleTimeString("it-IT");
    }
  };
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}
