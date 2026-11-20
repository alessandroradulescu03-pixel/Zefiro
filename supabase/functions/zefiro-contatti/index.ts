// ============================================================
// ZEFIRO — invio delle richieste dal modulo contatti
// Supabase Edge Function (Deno) + Resend, come per Mery Drift.
//
// A ogni richiesta:
//   1. salva la richiesta nella tabella "richieste_zefiro" (se attivo)
//   2. manda a te l'email di avviso, con "Rispondi" già indirizzato al cliente
//   3. manda al cliente l'email di conferma (serve un dominio verificato su Resend)
//
// Variabili (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY      obbligatoria — chiave API di Resend
//   OWNER_EMAIL         dove ricevi le richieste (predefinita: la tua Gmail)
//   FROM_EMAIL          mittente, es. "ZEFIRO <ciao@tuodominio.it>"
//                       (senza dominio verificato resta "ZEFIRO <onboarding@resend.dev>")
//   SEND_CONFIRMATION   "true" per mandare la conferma al cliente (solo con dominio verificato)
//   SAVE_TO_DB          "false" per non salvare le richieste nel database
//   SITE_URL            indirizzo del sito, per il logo nelle email
//   ALLOWED_ORIGINS     siti da cui si accettano richieste, separati da virgola
// ============================================================

const env = (k: string, d = "") => Deno.env.get(k) ?? d;

const RESEND_URL = env("RESEND_API_URL", "https://api.resend.com/emails");
const OWNER = env("OWNER_EMAIL", "alessandro.radulescu03@gmail.com");
const FROM = env("FROM_EMAIL", "ZEFIRO <onboarding@resend.dev>");
const SITE = env("SITE_URL", "https://alessandroradulescu03-pixel.github.io/Portfolio/").replace(/\/?$/, "/");
const ORIGINS = env("ALLOWED_ORIGINS", "https://alessandroradulescu03-pixel.github.io,http://localhost:5173,http://localhost:4173")
  .split(",").map(s => s.trim()).filter(Boolean);
const CONFIRM = env("SEND_CONFIRMATION", FROM.includes("resend.dev") ? "false" : "true") === "true";
const SAVE = env("SAVE_TO_DB", "true") !== "false";

const TYPES = ["Sito vetrina", "E-commerce", "Web app", "Restyling di un sito esistente", "Digital identity", "Altro"];
const BUDGETS = ["Preferisco parlarne", "Fino a 1.500 €", "1.500 – 3.000 €", "3.000 – 6.000 €", "Oltre 6.000 €"];

function cors(origin: string | null) {
  const allow = origin && ORIGINS.includes(origin) ? origin : ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    Vary: "Origin",
  };
}

const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });

const esc = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const nl = (s: string) => esc(s).replace(/\n/g, "<br>");
const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

type Req = { nome: string; email: string; azienda: string; tipologia: string; budget: string; descrizione: string };

function validate(b: Record<string, unknown>): Req | string {
  if (clip(b.website, 200)) return "spam"; // campo nascosto compilato: è un bot
  const r: Req = {
    nome: clip(b.nome, 120),
    email: clip(b.email, 200),
    azienda: clip(b.azienda, 160),
    tipologia: clip(b.tipologia, 80),
    budget: clip(b.budget, 80),
    descrizione: clip(b.descrizione, 5000),
  };
  if (r.nome.length < 2) return "Nome mancante";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(r.email)) return "Email non valida";
  if (!TYPES.includes(r.tipologia)) return "Tipologia non valida";
  if (r.budget && !BUDGETS.includes(r.budget)) return "Budget non valido";
  if (r.descrizione.length < 20) return "Descrizione troppo corta";
  if (b.consenso !== true) return "Consenso mancante";
  return r;
}

/* ---------- email: guscio comune nello stile del sito ---------- */
function shell(preheader: string, inner: string) {
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>ZEFIRO</title></head>
<body style="margin:0;padding:0;background:#F3F6FB;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6FB;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:12px;overflow:hidden;">
<tr><td style="background:#07152F;padding:28px 36px;">
  <img src="${SITE}brand/zefiro-email-logo.png" width="168" height="40" alt="ZEFIRO" style="display:block;border:0;width:168px;height:40px;">
</td></tr>
${inner}
<tr><td style="background:#07152F;padding:24px 36px;font:500 12px/1.6 Arial,Helvetica,sans-serif;color:#B9C7E0;">
  <span style="color:#FFFFFF;font-weight:700;">ZEFIRO Digital Studio</span> — Bergamo, Italia<br>
  <span style="color:#39B8F4;letter-spacing:1px;">Digital ideas. Real impact.</span>
</td></tr>
</table></td></tr></table></body></html>`;
}

const row = (k: string, v: string) =>
  `<tr><td style="padding:12px 0;border-top:1px solid #E3E9F3;font:600 11px/1.4 'Courier New',monospace;letter-spacing:1.5px;text-transform:uppercase;color:#53647F;width:150px;vertical-align:top;">${k}</td>
   <td style="padding:12px 0;border-top:1px solid #E3E9F3;font:600 15px/1.5 Arial,Helvetica,sans-serif;color:#07152F;">${v}</td></tr>`;

function ownerMail(r: Req) {
  const first = r.nome.split(" ")[0];
  return shell(`${r.nome} · ${r.tipologia}`, `
<tr><td style="padding:36px 36px 8px;">
  <p style="margin:0 0 10px;font:600 11px/1.4 'Courier New',monospace;letter-spacing:2px;text-transform:uppercase;color:#1765E8;">Nuova richiesta dal sito</p>
  <h1 style="margin:0;font:700 26px/1.2 Arial,Helvetica,sans-serif;color:#07152F;letter-spacing:-0.5px;">${esc(r.nome)} vuole parlare di un progetto</h1>
</td></tr>
<tr><td style="padding:16px 36px 8px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row("Nome", esc(r.nome))}
    ${row("Email", `<a href="mailto:${esc(r.email)}" style="color:#1765E8;text-decoration:none;">${esc(r.email)}</a>`)}
    ${row("Azienda", esc(r.azienda || "—"))}
    ${row("Tipologia", esc(r.tipologia))}
    ${row("Budget", esc(r.budget || "Non indicato"))}
  </table>
</td></tr>
<tr><td style="padding:8px 36px 0;">
  <p style="margin:0 0 8px;font:600 11px/1.4 'Courier New',monospace;letter-spacing:1.5px;text-transform:uppercase;color:#53647F;">Descrizione</p>
  <div style="background:#F3F6FB;border-left:3px solid #1765E8;border-radius:6px;padding:16px 18px;font:400 15px/1.6 Arial,Helvetica,sans-serif;color:#07152F;">${nl(r.descrizione)}</div>
</td></tr>
<tr><td style="padding:28px 36px 36px;">
  <a href="mailto:${esc(r.email)}?subject=${encodeURIComponent("Re: il tuo progetto con ZEFIRO")}" style="display:inline-block;background:#1765E8;color:#FFFFFF;text-decoration:none;font:700 15px/1 Arial,Helvetica,sans-serif;padding:16px 26px;border-radius:999px;">Rispondi a ${esc(first)} →</a>
</td></tr>`);
}

function clientMail(r: Req) {
  const first = r.nome.split(" ")[0];
  return shell("Abbiamo ricevuto la tua richiesta: ti rispondiamo presto.", `
<tr><td style="padding:40px 36px 8px;">
  <p style="margin:0 0 10px;font:600 11px/1.4 'Courier New',monospace;letter-spacing:2px;text-transform:uppercase;color:#1765E8;">Richiesta ricevuta</p>
  <h1 style="margin:0;font:700 28px/1.2 Arial,Helvetica,sans-serif;color:#07152F;letter-spacing:-0.5px;">Ciao ${esc(first)}, grazie per averci scritto.</h1>
</td></tr>
<tr><td style="padding:16px 36px 0;font:400 16px/1.65 Arial,Helvetica,sans-serif;color:#53647F;">
  Abbiamo ricevuto la tua richiesta e la leggeremo con attenzione. Ti risponderemo a questo indirizzo email con i prossimi passi.
</td></tr>
<tr><td style="padding:24px 36px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6FB;border-radius:10px;"><tr><td style="padding:8px 20px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td colspan="2" style="padding:12px 0 4px;font:600 11px/1.4 'Courier New',monospace;letter-spacing:2px;text-transform:uppercase;color:#07152F;">Riepilogo</td></tr>
      ${row("Tipologia", esc(r.tipologia))}
      ${r.azienda ? row("Attività", esc(r.azienda)) : ""}
      ${r.budget ? row("Budget", esc(r.budget)) : ""}
      ${row("Messaggio", nl(r.descrizione.length > 400 ? r.descrizione.slice(0, 400) + "…" : r.descrizione))}
    </table>
  </td></tr></table>
</td></tr>
<tr><td style="padding:28px 36px 0;font:400 16px/1.65 Arial,Helvetica,sans-serif;color:#53647F;">
  Nel frattempo puoi dare un'occhiata ai nostri progetti.
</td></tr>
<tr><td style="padding:20px 36px 8px;">
  <a href="${SITE}#/progetti" style="display:inline-block;background:#1765E8;color:#FFFFFF;text-decoration:none;font:700 15px/1 Arial,Helvetica,sans-serif;padding:16px 26px;border-radius:999px;">Guarda i progetti →</a>
</td></tr>
<tr><td style="padding:28px 36px 40px;font:400 15px/1.6 Arial,Helvetica,sans-serif;color:#07152F;">
  A presto,<br><strong>Alessandro Radulescu</strong><br><span style="color:#53647F;">Founder — ZEFIRO Digital Studio</span>
</td></tr>`);
}

const text = (r: Req) =>
  `Nome: ${r.nome}\nEmail: ${r.email}\nAzienda: ${r.azienda || "—"}\nTipologia: ${r.tipologia}\nBudget: ${r.budget || "Non indicato"}\n\n${r.descrizione}`;

async function send(payload: Record<string, unknown>) {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

async function save(r: Req) {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!SAVE || !url || !key) return;
  const res = await fetch(`${url}/rest/v1/richieste_zefiro`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(r),
  });
  if (!res.ok) console.error("[zefiro] salvataggio non riuscito:", res.status, await res.text());
}

Deno.serve(async req => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return json({ ok: false, error: "Metodo non consentito" }, 405, origin);
  if (origin && !ORIGINS.includes(origin)) return json({ ok: false, error: "Origine non consentita" }, 403, origin);
  if (!env("RESEND_API_KEY")) return json({ ok: false, error: "RESEND_API_KEY mancante" }, 500, origin);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Richiesta non valida" }, 400, origin);
  }
  const r = validate(body);
  if (r === "spam") return json({ ok: false, error: "Richiesta bloccata" }, 400, origin);
  if (typeof r === "string") return json({ ok: false, error: r }, 400, origin);

  try {
    await save(r);
    // 1) avviso a te: è quello che conta, se fallisce l'invio è fallito
    await send({
      from: FROM,
      to: [OWNER],
      reply_to: r.email,
      subject: `Nuova richiesta — ${r.nome} · ${r.tipologia}`,
      html: ownerMail(r),
      text: text(r),
    });
    // 2) conferma al cliente: solo con dominio verificato; se fallisce non blocca
    let confirmation = false;
    if (CONFIRM) {
      try {
        await send({
          from: FROM,
          to: [r.email],
          reply_to: OWNER,
          subject: "Abbiamo ricevuto la tua richiesta — ZEFIRO",
          html: clientMail(r),
          text: `Ciao ${r.nome.split(" ")[0]},\n\nabbiamo ricevuto la tua richiesta e ti risponderemo a questo indirizzo email con i prossimi passi.\n\nA presto,\nAlessandro Radulescu\nZEFIRO Digital Studio`,
        });
        confirmation = true;
      } catch (e) {
        console.error("[zefiro] conferma al cliente non inviata:", e);
      }
    }
    return json({ ok: true, confirmation }, 200, origin);
  } catch (e) {
    console.error("[zefiro] invio non riuscito:", e);
    return json({ ok: false, error: "Invio non riuscito" }, 502, origin);
  }
});

