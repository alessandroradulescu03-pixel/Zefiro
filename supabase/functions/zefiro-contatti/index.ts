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
//   OWNER_EMAIL         dove ricevi le richieste (predefinita: zefiro.webagency@gmail.com)
//   FROM_EMAIL          mittente, es. "ZEFIRO <ciao@tuodominio.it>"
//                       (senza dominio verificato resta "ZEFIRO <onboarding@resend.dev>")
//   SEND_CONFIRMATION   "true" per mandare la conferma al cliente (solo con dominio verificato)
//   SAVE_TO_DB          "false" per non salvare le richieste nel database
//   SITE_URL            indirizzo del sito (pulsante "Guarda i progetti" nella conferma)
//   ALLOWED_ORIGINS     siti da cui si accettano richieste, separati da virgola
// ============================================================

const env = (k: string, d = "") => Deno.env.get(k) ?? d;

const RESEND_URL = env("RESEND_API_URL", "https://api.resend.com/emails");
const OWNER = env("OWNER_EMAIL", "zefiro.webagency@gmail.com");
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

