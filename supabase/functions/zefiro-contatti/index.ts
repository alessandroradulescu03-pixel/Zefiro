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
//   SITE_URL            indirizzo del sito (pulsante "Guarda i progetti" nella conferma)
//   ALLOWED_ORIGINS     siti da cui si accettano richieste, separati da virgola
// ============================================================

const env = (k: string, d = "") => Deno.env.get(k) ?? d;

const RESEND_URL = env("RESEND_API_URL", "https://api.resend.com/emails");
const OWNER = env("OWNER_EMAIL", "alessandro.radulescu03@gmail.com");
const FROM = env("FROM_EMAIL", "ZEFIRO <onboarding@resend.dev>");
const SITE = env("SITE_URL", "https://alessandroradulescu03-pixel.github.io/Zefiro/").replace(/\/?$/, "/");
const ORIGINS = env("ALLOWED_ORIGINS", "https://alessandroradulescu03-pixel.github.io,http://localhost:5173,http://localhost:4173")
  .split(",").map(s => s.trim()).filter(Boolean);
const CONFIRM = env("SEND_CONFIRMATION", FROM.includes("resend.dev") ? "false" : "true") === "true";
const SAVE = env("SAVE_TO_DB", "true") !== "false";

// Logo incorporato nell'email (immagine "inline", cid:zefiro-logo):
// si vede sempre, anche se il sito cambia indirizzo.
const LOGO_PNG = "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";
const LOGO = [{ filename: "zefiro-logo.png", content: LOGO_PNG, content_id: "zefiro-logo" }];

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
  <img src="cid:zefiro-logo" width="168" height="40" alt="ZEFIRO" style="display:block;border:0;width:168px;height:40px;">
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
      attachments: LOGO,
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
          attachments: LOGO,
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

