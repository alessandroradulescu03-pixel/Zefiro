/* Elemento interattivo del footer: chi visita lascia la sua firma.
   Rimane solo nel browser di chi disegna, non viene inviato da nessuna parte. */
import { useEffect, useRef, useState } from "react";

export default function SignaturePad() {
  const canvas = useRef(null);
  const [signed, setSigned] = useState(false);
  const signedRef = useRef(false);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    let dpr = 1;
    const size = () => {
      const img = signedRef.current && cv.width ? ctx.getImageData(0, 0, cv.width, cv.height) : null;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#C6FF45";
      if (img) ctx.putImageData(img, 0, 0);
    };
    size();
    let drawing = false, lx = 0, ly = 0, lw = 3;
    const pt = e => {
      const r = cv.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const down = e => {
      drawing = true;
      cv.setPointerCapture(e.pointerId);
      [lx, ly] = pt(e);
      lw = 3;
    };
    const move = e => {
      if (!drawing) return;
      const [x, y] = pt(e);
      const d = Math.hypot(x - lx, y - ly);
      const w = Math.max(1.4, Math.min(5, 6 - d * 0.18));
      lw += (w - lw) * 0.35;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.quadraticCurveTo(lx, ly, (lx + x) / 2, (ly + y) / 2);
      ctx.lineTo(x, y);
      ctx.stroke();
      lx = x;
      ly = y;
      if (!signedRef.current) {
        signedRef.current = true;
        setSigned(true);
      }
    };
    const up = () => (drawing = false);
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    window.addEventListener("resize", size);
    return () => {
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", size);
    };
  }, []);

  const clear = () => {
    const cv = canvas.current;
    cv.getContext("2d").clearRect(0, 0, cv.width, cv.height);
    signedRef.current = false;
    setSigned(false);
  };

  return (
    <div className="sigpad">
      <div className="sigpad__head">
        <span className="label">Leave your signature</span>
        <button type="button" className="sigpad__clear label" onClick={clear} disabled={!signed}>Clear ✕</button>
      </div>
      <div className="sigpad__area" data-lenis-prevent>
        <canvas ref={canvas} role="img" aria-label="Area in cui disegnare la propria firma con mouse o dito" data-cursor="Sign" />
        {!signed && <span className="sigpad__hint" aria-hidden="true">Sign here</span>}
        <span className="sigpad__x" aria-hidden="true">✕</span>
        <span className="sigpad__line" aria-hidden="true" />
      </div>
    </div>
  );
}
