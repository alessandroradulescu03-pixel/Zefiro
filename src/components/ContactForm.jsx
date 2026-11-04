/* Form di contatto reale:
   - con site.formEndpoint (Formspree) invia davvero il messaggio e mostra l'esito
   - senza endpoint apre l'app email del visitatore con il messaggio già scritto, e lo dice chiaramente */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { site } from "../config/site.js";
import { Button } from "./ui.jsx";

const TYPES = ["Sito vetrina", "E-commerce", "Web app", "Restyling di un sito esistente", "Altro"];
const EMPTY = { name: "", email: "", type: "", message: "", consent: false, company: "" };

const RULES = {
  name: v => v.trim().length >= 2 || "Scrivi il tuo nome.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Inserisci un indirizzo email valido.",
  type: v => !!v || "Scegli il tipo di progetto.",
  message: v => v.trim().length >= 10 || "Raccontami qualcosa in più (almeno 10 caratteri).",
  consent: v => v === true || "Serve il consenso per poterti rispondere.",
};

export default function ContactForm() {
  const location = useLocation();
  const asked = location.state && location.state.data && location.state.data.project;
  const [data, setData] = useState(() => (asked ? { ...EMPTY, message: `Ciao, vorrei vedere la demo di ${asked}.` } : EMPTY));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const direct = !!site.formEndpoint;

  const check = (name, value) => {
    const res = RULES[name](value);
    return res === true ? "" : res;
  };
  const set = (name, value) => {
    setData(d => ({ ...d, [name]: value }));
    if (touched[name]) setErrors(e => ({ ...e, [name]: check(name, value) }));
  };
  const blur = name => {
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(e => ({ ...e, [name]: check(name, data[name]) }));
  };

  async function submit(e) {
    e.preventDefault();
    if (status.state === "sending") return;
    const errs = {};
    Object.keys(RULES).forEach(k => {
      const m = check(k, data[k]);
      if (m) errs[k] = m;
    });
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(RULES).map(k => [k, true])));
    const first = Object.keys(RULES).find(k => errs[k]);
    if (first) {
      document.getElementById(`cf-${first}`)?.focus();
      setStatus({ state: "error", msg: "Controlla i campi evidenziati." });
      return;
    }
    if (data.company) return; // campo anti-spam compilato: è un bot

    if (!direct) {
      const body = `Ciao ${site.firstName},\n\n${data.message.trim()}\n\nTipo di progetto: ${data.type}\n\n${data.name.trim()}\n${data.email.trim()}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Nuovo progetto: " + data.type)}&body=${encodeURIComponent(body)}`;
      setStatus({ state: "info", msg: `Ho aperto la tua app email con il messaggio pronto: premi Invia da lì. Se non si è aperta, scrivimi a ${site.email}.` });
      return;
    }

    setStatus({ state: "sending", msg: "Invio in corso…" });
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Nome: data.name.trim(),
          email: data.email.trim(),
          "Tipo di progetto": data.type,
          Messaggio: data.message.trim(),
          _replyto: data.email.trim(),
          _subject: `Portfolio · nuovo messaggio da ${data.name.trim()}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || String(out.success) === "false") throw new Error(out.message || String(res.status));
      setData(EMPTY);
      setTouched({});
      setStatus({ state: "success", msg: "Messaggio inviato. Ti rispondo entro 24-48 ore." });
    } catch {
      setStatus({ state: "error", msg: `Invio non riuscito. Riprova tra poco o scrivimi direttamente a ${site.email}.` });
    }
  }

  const field = (name, label, el) => (
    <div className={`cf__field ${errors[name] ? "is-error" : ""}`}>
      <label htmlFor={`cf-${name}`}>{label}</label>
      {el}
      <span className="cf__err" id={`cf-${name}-err`} aria-live="polite">{errors[name] || ""}</span>
    </div>
  );
  const aria = name => ({ "aria-invalid": errors[name] ? "true" : "false", "aria-describedby": `cf-${name}-err` });

  return (
    <form className="cf" id="contact-form" noValidate onSubmit={submit} aria-labelledby="cf-title">
      <div className="cf__head">
        <span className="label label--lime" id="cf-title">Start a project</span>
        <span className="label">{direct ? "Risposta in 24-48 h" : "Si apre la tua app email"}</span>
      </div>
      <div className="cf__row">
        {field("name", "Nome", <input id="cf-name" name="name" autoComplete="name" value={data.name} onChange={e => set("name", e.target.value)} onBlur={() => blur("name")} {...aria("name")} />)}
        {field("email", "Email", <input id="cf-email" name="email" type="email" autoComplete="email" value={data.email} onChange={e => set("email", e.target.value)} onBlur={() => blur("email")} {...aria("email")} />)}
      </div>
      {field("type", "Tipo di progetto", (
        <select id="cf-type" name="type" value={data.type} onChange={e => { set("type", e.target.value); setTouched(t => ({ ...t, type: true })); }} onBlur={() => blur("type")} {...aria("type")}>
          <option value="">Scegli…</option>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      ))}
      {field("message", "Messaggio", <textarea id="cf-message" name="message" rows="5" value={data.message} onChange={e => set("message", e.target.value)} onBlur={() => blur("message")} {...aria("message")} />)}

      <div className="cf__hp" aria-hidden="true">
        <label htmlFor="cf-company">Azienda</label>
        <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" value={data.company} onChange={e => setData(d => ({ ...d, company: e.target.value }))} />
      </div>

      <div className={`cf__check ${errors.consent ? "is-error" : ""}`}>
        <input id="cf-consent" type="checkbox" checked={data.consent} onChange={e => { set("consent", e.target.checked); setTouched(t => ({ ...t, consent: true })); }} {...aria("consent")} />
        <label htmlFor="cf-consent">Acconsento a essere ricontattato all'indirizzo email indicato.</label>
        <span className="cf__err" id="cf-consent-err" aria-live="polite">{errors.consent || ""}</span>
      </div>

      <div className="cf__foot">
        <Button type="submit" aria-busy={status.state === "sending" ? "true" : undefined}>
          {status.state === "sending" ? "Sending…" : direct ? "Send message" : "Send via email"}
        </Button>
        <p className={`cf__status is-${status.state}`} role="status" aria-live="polite">{status.msg}</p>
      </div>
    </form>
  );
}
