/* Modulo contatti reale.
   Invia tramite Web3Forms (se site.web3formsKey è compilata) oppure FormSubmit (endpoint AJAX):
   in entrambi i casi legge la risposta del servizio e mostra l'esito vero,
   senza mai simulare un invio riuscito. */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { site } from "../config/site.js";
import { Button } from "./ui.jsx";

const TYPES = ["Sito vetrina", "E-commerce", "Web app", "Restyling di un sito esistente", "Digital identity", "Altro"];
const BUDGETS = ["Preferisco parlarne", "Fino a 1.500 €", "1.500 – 3.000 €", "3.000 – 6.000 €", "Oltre 6.000 €"];
const EMPTY = { name: "", email: "", company: "", type: "", budget: "", message: "", consent: false, website: "" };

const RULES = {
  name: v => v.trim().length >= 2 || "Scrivi il tuo nome.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Inserisci un indirizzo email valido.",
  type: v => !!v || "Scegli la tipologia di progetto.",
  message: v => v.trim().length >= 20 || "Raccontaci qualcosa in più (almeno 20 caratteri).",
  consent: v => v === true || "Serve il consenso per poterti rispondere.",
};

async function send(fields, subject, raw) {
  if (site.contactEndpoint) {
    // Supabase Edge Function + Resend (come Mery Drift)
    const headers = { "Content-Type": "application/json" };
    if (site.supabaseAnonKey) {
      headers.Authorization = `Bearer ${site.supabaseAnonKey}`;
      headers.apikey = site.supabaseAnonKey;
    }
    const res = await fetch(site.contactEndpoint, { method: "POST", headers, body: JSON.stringify(raw) });
    const out = await res.json().catch(() => ({}));
    if (!res.ok || out.ok !== true) throw new Error(out.error || `HTTP ${res.status}`);
    return { confirmation: !!out.confirmation };
  }
  if (site.web3formsKey) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: site.web3formsKey, subject, from_name: site.name, replyto: fields.Email, ...fields }),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok || out.success === false) throw new Error(out.message || `HTTP ${res.status}`);
    return {};
  }
  if (!site.formEmail) throw new Error("Nessun servizio di invio configurato");
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(site.formEmail)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...fields, _replyto: fields.Email, _subject: subject, _template: "table", _captcha: "false" }),
  });
  const out = await res.json().catch(() => ({}));
  // FormSubmit risponde { success: "true" | "false", message }
  if (!res.ok || String(out.success) !== "true") throw new Error(out.message || `HTTP ${res.status}`);
  return {};
}

export default function ContactForm() {
  const location = useLocation();
  const asked = location.state && location.state.data && location.state.data.project;
  const [data, setData] = useState(() => (asked ? { ...EMPTY, message: `Buongiorno, vorrei vedere la demo del progetto ${asked}.` } : EMPTY));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const check = (name, value) => {
    const res = RULES[name] ? RULES[name](value) : true;
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
    if (data.website) {
      // campo nascosto compilato: è un bot, non inviamo nulla
      setStatus({ state: "error", msg: "Invio bloccato dal filtro anti-spam." });
      return;
    }

    setStatus({ state: "sending", msg: "Invio in corso…" });
    const fields = {
      Nome: data.name.trim(),
      Email: data.email.trim(),
      "Azienda o attività": data.company.trim() || "—",
      "Tipologia di progetto": data.type,
      "Budget indicativo": data.budget || "Non indicato",
      Descrizione: data.message.trim(),
    };
    try {
      const raw = {
        nome: fields.Nome,
        email: fields.Email,
        azienda: data.company.trim(),
        tipologia: data.type,
        budget: data.budget,
        descrizione: fields.Descrizione,
        consenso: data.consent,
        website: data.website,
      };
      const out = await send(fields, `ZEFIRO · nuova richiesta da ${fields.Nome}`, raw);
      setData(EMPTY);
      setTouched({});
      setStatus({
        state: "success",
        msg: out.confirmation
          ? "Richiesta inviata. Ti abbiamo mandato un'email di conferma: controlla anche nello spam."
          : "Richiesta inviata. Ti risponderemo all'indirizzo email che hai indicato.",
      });
    } catch (err) {
      console.error("[ZEFIRO] invio modulo non riuscito:", err);
      setStatus({ state: "error", msg: "fail" });
    }
  }

  const field = (name, label, el, opt = false) => (
    <div className={`cf__field ${errors[name] ? "is-error" : ""}`}>
      <label htmlFor={`cf-${name}`}>
        {label} {opt && <span className="cf__opt">facoltativo</span>}
      </label>
      {el}
      <span className="cf__err" id={`cf-${name}-err`} aria-live="polite">{errors[name] || ""}</span>
    </div>
  );
  const aria = name => ({ "aria-invalid": errors[name] ? "true" : "false", "aria-describedby": `cf-${name}-err` });

  return (
    <form className="cf" id="contact-form" noValidate onSubmit={submit} aria-label="Modulo di richiesta progetto">
      <div className="cf__row">
        {field("name", "Nome", <input id="cf-name" name="name" autoComplete="name" value={data.name} onChange={e => set("name", e.target.value)} onBlur={() => blur("name")} {...aria("name")} />)}
        {field("email", "Email", <input id="cf-email" name="email" type="email" autoComplete="email" inputMode="email" value={data.email} onChange={e => set("email", e.target.value)} onBlur={() => blur("email")} {...aria("email")} />)}
      </div>
      {field("company", "Azienda o attività", <input id="cf-company" name="company" autoComplete="organization" value={data.company} onChange={e => set("company", e.target.value)} />, true)}
      <div className="cf__row">
        {field("type", "Tipologia di progetto", (
          <select id="cf-type" name="type" value={data.type} onChange={e => { set("type", e.target.value); setTouched(t => ({ ...t, type: true })); }} onBlur={() => blur("type")} {...aria("type")}>
            <option value="">Scegli…</option>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        ))}
        {field("budget", "Budget indicativo", (
          <select id="cf-budget" name="budget" value={data.budget} onChange={e => set("budget", e.target.value)}>
            <option value="">Scegli…</option>
            {BUDGETS.map(t => <option key={t}>{t}</option>)}
          </select>
        ), true)}
      </div>
      {field("message", "Descrizione del progetto", <textarea id="cf-message" name="message" rows="5" placeholder="Di cosa si occupa la tua attività e cosa vorresti ottenere dal sito?" value={data.message} onChange={e => set("message", e.target.value)} onBlur={() => blur("message")} {...aria("message")} />)}

      <div className="cf__hp" aria-hidden="true">
        <label htmlFor="cf-website">Sito web</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={e => setData(d => ({ ...d, website: e.target.value }))} />
      </div>

      <div className={`cf__check ${errors.consent ? "is-error" : ""}`}>
        <input id="cf-consent" type="checkbox" checked={data.consent} onChange={e => { set("consent", e.target.checked); setTouched(t => ({ ...t, consent: true })); }} {...aria("consent")} />
        <label htmlFor="cf-consent">Acconsento a essere ricontattato all'indirizzo email indicato per questa richiesta.</label>
        <span className="cf__err" id="cf-consent-err" aria-live="polite">{errors.consent || ""}</span>
      </div>

      <div className="cf__foot">
        <Button type="submit" aria-busy={status.state === "sending" ? "true" : undefined}>
          {status.state === "sending" ? "Invio in corso…" : "Invia la richiesta"}
        </Button>
        <p className={`cf__status is-${status.state}`} role="status" aria-live="polite">
          {status.msg === "fail" ? (
            <>Invio non riuscito. Riprova tra poco oppure scrivici direttamente a <a href={`mailto:${site.email}`}>{site.email}</a>.</>
          ) : status.msg}
        </p>
      </div>
    </form>
  );
}
