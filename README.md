# ZEFIRO Digital Studio — sito istituzionale

**Digital ideas. Real impact.**
Sito di ZEFIRO Digital Studio in **React + Vite**, pubblicato su **GitHub Pages**.

---

## 1. Avviarlo sul Mac

Serve [Node.js](https://nodejs.org) (versione 20 o più recente). Dal Terminale, nella cartella del progetto:

```bash
npm install      # la prima volta e dopo questo aggiornamento (dipendenze cambiate)
npm run dev      # sito in locale con aggiornamento automatico
```

Per provare la versione finale: `npm run build` e poi `npm run preview`.

## 2. Dove si modifica cosa

```
src/config/site.js     ← DATI DEL BRAND: email, Instagram, LinkedIn, modulo contatti, menu
src/data/projects.js   ← PROGETTI (database)
public/projects/       ← screenshot dei progetti
public/brand/          ← file ufficiali del logo ZEFIRO
public/favicon.svg     ← favicon ufficiale (+ favicon-32.png e apple-touch-icon.png)
public/og-image.png    ← anteprima quando condividi il link (1200 × 630)
src/components/        ← sezioni del sito, ognuna con il suo .jsx e .css
src/styles/tokens.css  ← palette ufficiale, font, spaziature
```

I punti da completare sono segnati con `TODO` (Instagram e LinkedIn di ZEFIRO).

## 3. Pagine

Ogni voce del menu apre una pagina vera, con la transizione tra pagine:

- `#/` Home: hero, anteprima dei servizi, progetti selezionati, invito al contatto
- `#/servizi` i quattro servizi e il metodo di lavoro
- `#/progetti` tutti i case study, `#/progetti/<id>` il singolo progetto
- `#/studio` lo studio, il fondatore e i principi
- `#/contatti` pagina contatti con il modulo

I vecchi indirizzi del portfolio (`#/work`, `#/work/<id>`, `#/contact`) rimandano automaticamente a quelli nuovi.

## 4. Progetti

Ogni progetto è un blocco `{ ... }` in `src/data/projects.js`.

- **`published`**: `true` = visibile sul sito, `false` = nascosto ma salvato. Oggi sono visibili Padania Tuning, MRC Automotive, District Lab e zClean; gli altri (Mery Drift, MXE.45, Lunar Detailing, SSW, Soprani Trasporti, Check-in) sono nascosti: per mostrarli basta mettere `published: true`.
- **`type`**: `client` = progetto per un'attività reale · `concept` = concept dimostrativo di nostra iniziativa. Card e case study lo dichiarano sempre in modo chiaro.
- **`status`**: `live`, `in-development` oppure `demo`.
- **`gallery`**: screenshot in `public/projects/<id>/` (`desktop.webp`, `desktop-2.webp`, `mobile.webp`).
- **`demoUrl`**: non viene mai mostrato come link. "Guarda la demo" apre il sito dentro ZEFIRO, in un'anteprima riservata in cui invii, pagamenti e link esterni sono disattivati. Con `demoMode: "request"` compare "Demo su richiesta".

## 5. Modulo contatti (invio reale)

Campi: nome, email, azienda o attività, tipologia di progetto, budget indicativo (facoltativo), descrizione, consenso. Il sito legge la risposta del servizio di invio e mostra l'esito vero: se l'invio fallisce lo dice e propone l'email diretta. Non simula mai un invio riuscito.

- **Così com'è** usa **FormSubmit** (gratis, senza account) verso `formEmail` in `src/config/site.js`. Al **primo invio** arriva un'email "Activate Form": cliccala una volta sola, poi i messaggi arrivano normalmente.
- **In alternativa**, [web3forms.com](https://web3forms.com): inserisci la tua email, copia la "Access Key" e incollala in `web3formsKey`. Se è compilata, il sito usa Web3Forms.

## 5b. Email come Mery Drift (Supabase + Resend) — consigliato

Con questa configurazione, a ogni richiesta dal sito:

1. **tu ricevi un'email con il brand ZEFIRO** con tutti i dati, e il pulsante "Rispondi" scrive già al cliente;
2. **il cliente riceve un'email di conferma** con il riepilogo (serve un dominio, vedi sotto);
3. **la richiesta resta salvata** nella tabella `richieste_zefiro` su Supabase.

File: `supabase/functions/zefiro-contatti/index.ts` (la funzione) e `supabase/richieste_zefiro.sql` (la tabella).

**Attivazione (una volta sola, circa 10 minuti):**

1. **Supabase**: puoi usare lo stesso account di Mery Drift. Crea un nuovo progetto `zefiro` (meglio tenerlo separato dai dati di Mery Drift).
2. **Tabella**: SQL Editor → incolla il contenuto di `supabase/richieste_zefiro.sql` → **Run**.
3. **Funzione**: Edge Functions → **Deploy a new function** → **Via Editor** → nome `zefiro-contatti` → incolla tutto `index.ts` → **Deploy**.
4. **Chiavi** (Edge Functions → **Secrets**):
   - `RESEND_API_KEY` = una chiave nuova da Resend → API Keys (puoi chiamarla "zefiro")
   - `OWNER_EMAIL` = dove vuoi ricevere le richieste. Finché non hai un dominio, **deve essere l'email del tuo account Resend** (quella dell'account GitHub con cui ti sei registrato).
5. **Sito**: in `src/config/site.js` compila
   - `contactEndpoint`: `https://<id-progetto>.supabase.co/functions/v1/zefiro-contatti`
   - `supabaseAnonKey`: Project Settings → API → chiave **anon public** (è pubblica per natura, va bene metterla nel sito)
6. Fai il push e prova il modulo: l'email ti arriva in pochi secondi.

**Conferma al cliente (quando avrai un dominio):** senza dominio, Resend permette di scrivere solo a te stesso, quindi all'inizio arriva solo l'avviso a te. Quando compri un dominio (es. su Aruba, come per Mery Drift):
Resend → Domains → aggiungi il dominio → copia i record DNS su Aruba → aspetta la verifica. Poi nei Secrets di Supabase aggiungi
`FROM_EMAIL` = `ZEFIRO <ciao@tuodominio.it>` e la conferma al cliente parte da sola.

Altre impostazioni facoltative: `SITE_URL` (indirizzo del sito, per il logo nelle email), `ALLOWED_ORIGINS` (siti da cui accettare richieste, separati da virgola: aggiungi il dominio quando lo avrai), `SAVE_TO_DB=false` per non salvare le richieste.

Le richieste le trovi in Supabase → Table Editor → `richieste_zefiro`; la colonna `stato` la puoi cambiare tu (nuova, in corso, chiusa).

## 6. Pubblicare su GitHub Pages

Il workflow `.github/workflows/deploy.yml` costruisce e pubblica il sito a ogni push sul ramo `main` (Settings → Pages → Source: GitHub Actions).
I percorsi sono relativi (`base: "./"`). Se cambi indirizzo o colleghi un dominio, aggiorna i link in `index.html` (canonical, og, JSON-LD), `public/robots.txt` e `public/sitemap.xml`.

## 7. Cosa c'è dentro

- **Hero "Flusso → Struttura"**: le linee del vento (le stesse curve del simbolo) attraversano una griglia di progetto e mettono in ordine i moduli di una pagina. Si disegna una volta all'apertura; con il mouse i livelli si spostano di pochi pixel.
- **Servizi** con un disegno dedicato per ognuno, che si anima al passaggio.
- **Metodo** con timeline che si riempie con lo scroll e accende le fasi.
- **Card progetto** con screenshot reali, cambio immagine e telefono al passaggio.
- Smooth scrolling (Lenis), reveal allo scroll, transizioni tra pagine con il simbolo ZEFIRO.
- **Accessibilità**: navigazione da tastiera, "Vai al contenuto", focus visibili, menu chiudibile con Esc. Con "Riduci movimento" attivo, animazioni e smooth scroll si spengono.
- **SEO**: title e description per pagina, Open Graph, dati strutturati (ProfessionalService), sitemap e robots.

## 8. Dipendenze

React, React Router, Lenis e i font **Sora** (titoli), **Manrope** (testi) e **JetBrains Mono** (dettagli tecnici), installati in locale tramite Fontsource: nessuna richiesta a servizi esterni per i caratteri.
