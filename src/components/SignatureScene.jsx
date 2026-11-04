/* Contenitore dell'elemento 3D: carica three.js solo qui, con alternativa SVG */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useMotion.js";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function SignatureScene() {
  const host = useRef(null);
  const reduced = useReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!hasWebGL()) {
      setFallback(true);
      return;
    }
    let cancelled = false;
    let dispose = () => {};
    import("../lib/signature3d.js")
      .then(m => {
        if (!cancelled && host.current) dispose = m.mountSignature(host.current, { reduced });
      })
      .catch(() => !cancelled && setFallback(true));
    return () => {
      cancelled = true;
      dispose();
    };
  }, [reduced]);

  return (
    <div ref={host} className="scene" aria-hidden="true">
      {fallback && <img className="scene__img" src={`${import.meta.env.BASE_URL}signature.svg`} alt="" />}
    </div>
  );
}
