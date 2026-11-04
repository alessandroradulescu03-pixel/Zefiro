/* Anteprima protetta della demo: il sito si apre dentro il portfolio,
   in una cornice senza barra degli indirizzi. Il link non viene mostrato,
   non si apre in una nuova scheda e non passa il referrer.
   MODALITÀ DEMO: si naviga liberamente (pagine, menu, slider, calcolatori),
   ma le azioni vere sono disattivate: invio di form, pagamenti, acquisti,
   richieste al server, link verso WhatsApp/email/telefono o altri siti.
   Le demo stanno sullo stesso dominio del portfolio, quindi la pagina interna
   si può controllare dall'esterno; se non fosse possibile, un velo trasparente
   copre la demo (si vede, ma non si tocca). */
import { useEffect, useRef, useState } from "react";
import { lockScroll } from "../lib/smooth.js";
import "./DemoViewer.css";

const demoBase = u => { try { return new URL(u, location.href).pathname.replace(/[^/]*$/, ""); } catch { return "/"; } };

const ACTION_WORDS = /(invia|inviare|acquista|compra|paga|pagamento|checkout|ordina|conferma (l'|)ordine|procedi all|prenota|iscriviti|registrati|send|submit|buy|pay|order)/i;

function toast(d, msg) {
  let el = d.getElementById("__demo-toast");
  if (!el) {
    el = d.createElement("div");
    el.id = "__demo-toast";
    el.style.cssText =
      "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;padding:10px 16px;border-radius:999px;background:#17181c;color:#f3f1ec;font:500 13px/1.3 system-ui,sans-serif;box-shadow:0 12px 30px -10px rgba(0,0,0,.5);pointer-events:none;transition:opacity .3s;opacity:0";
    d.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = "1";
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.style.opacity = "0"), 2200);
}

function lockFrame(frame, base, onEsc) {
  try {
    const w = frame.contentWindow;
    const d = w.document;
    if (!d || !d.body) return false;
    if (w.__demoLocked) return true;
    w.__demoLocked = true;
    const block = (e, msg = "Demo: questa azione è disattivata") => {
      e.preventDefault();
      e.stopImmediatePropagation();
      toast(d, msg);
    };

    // Esc chiude l'anteprima anche quando il focus è dentro la demo
    d.addEventListener("keydown", e => { if (e.key === "Escape") onEsc(); }, true);

    // 1. form: niente invio
    d.addEventListener("submit", e => block(e, "Demo: l'invio dei moduli è disattivato"), true);

    d.addEventListener("click", e => {
      const t = e.target instanceof w.Element ? e.target : null;
      if (!t) return;
      // 2. link: dentro la demo sì, fuori no
      const a = t.closest("a[href]");
      if (a) {
        const href = a.getAttribute("href") || "";
        if (/^(mailto:|tel:|sms:|whatsapp:|javascript:)/i.test(href)) return block(e, "Demo: contatti disattivati");
        let url;
        try { url = new URL(href, d.baseURI); } catch { return block(e); }
        const inside = url.origin === w.location.origin && url.pathname.startsWith(base);
        if (!inside || /stripe|paypal|checkout/i.test(url.href)) return block(e, "Demo: link esterni disattivati");
        if (a.target && a.target !== "_self") { e.preventDefault(); w.location.href = url.href; }
        return;
      }
      // 3. pulsanti d'azione (invia, acquista, paga, prenota…)
      const btn = t.closest('button, [role="button"], input[type="submit"], input[type="button"]');
      if (btn) {
        const label = `${btn.textContent || ""} ${btn.value || ""} ${btn.getAttribute("aria-label") || ""}`;
        if ((btn.type === "submit" && btn.form) || ACTION_WORDS.test(label)) return block(e);
      }
    }, true);

    // 4. nessuna richiesta al server che modifichi qualcosa
    const of = w.fetch && w.fetch.bind(w);
    if (of) {
      w.fetch = (input, init = {}) => {
        const m = (init.method || (input && input.method) || "GET").toUpperCase();
        if (m !== "GET" && m !== "HEAD") { toast(d, "Demo: invio disattivato"); return Promise.reject(new Error("demo")); }
        return of(input, init);
      };
    }
    const XO = w.XMLHttpRequest && w.XMLHttpRequest.prototype.open;
    if (XO) {
      w.XMLHttpRequest.prototype.open = function (m, ...r) {
        if (!/^(GET|HEAD)$/i.test(m)) { toast(d, "Demo: invio disattivato"); throw new Error("demo"); }
        return XO.call(this, m, ...r);
      };
    }
    if (w.navigator.sendBeacon) w.navigator.sendBeacon = () => false;
    w.open = () => { toast(d, "Demo: link esterni disattivati"); return null; };
    return true;
  } catch {
    return false; // cornice non accessibile: resta il velo
  }
}

export default function DemoViewer({ project, onClose }) {
  const [device, setDevice] = useState("desktop");
  const [loaded, setLoaded] = useState(false);
  const [locked, setLocked] = useState(false);
  const frame = useRef(null);
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
            sandbox="allow-scripts allow-same-origin"
            ref={frame}
            onLoad={() => { setLocked(lockFrame(frame.current, demoBase(project.demoUrl), onClose)); setLoaded(true); }}
          />
          {!locked && <div className="demo__veil" aria-hidden="true" />}
        </div>
        <p className="demo__note">Modalità demo: puoi navigare e guardare tutto, ma invii, acquisti e contatti sono disattivati.</p>
      </div>
    </div>
  );
}
