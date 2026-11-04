/* Cursore personalizzato: solo con mouse, mai con "riduci movimento".
   Il cursore di sistema resta sempre visibile, quindi non toglie accessibilità. */
import { useEffect, useRef, useState } from "react";
import { useFinePointer, useReducedMotion } from "../hooks/useMotion.js";
import "./Cursor.css";

export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef(null);
  const ring = useRef(null);
  const [label, setLabel] = useState("");
  const [state, setState] = useState("hidden");

  useEffect(() => {
    if (!fine || reduced) return;
    let x = -100, y = -100, rx = -100, ry = -100, raf;
    const move = e => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      setState(s => (s === "hidden" ? "" : s));
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const over = e => {
      const lab = e.target.closest("[data-cursor]");
      const hov = e.target.closest("a, button, input, textarea, select, label, [role='button'], canvas");
      setLabel(lab ? lab.dataset.cursor : "");
      setState(lab ? "label" : hov ? "hover" : "");
    };
    const leave = () => setState("hidden");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div className={`cursor ${state ? "is-" + state : ""}`} aria-hidden="true">
      <div className="cursor__ring" ref={ring}>
        <span className="cursor__label">{label}</span>
      </div>
      <div className="cursor__dot" ref={dot} />
    </div>
  );
}
