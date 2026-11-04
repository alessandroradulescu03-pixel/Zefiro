# The Digital Signature — Portfolio di Alessandro Radulescu

Portfolio in **React + Vite**, pronto per **GitHub Pages**.
Concept: la tua firma diventa un nastro 3D lime che si disegna all'apertura del sito.

---

## 1. Avviarlo sul Mac

Serve [Node.js](https://nodejs.org) (versione 20 o più recente). Dal Terminale, nella cartella del progetto:

```bash
npm install      # solo la prima volta
npm run dev      # apre il sito in locale con aggiornamento automatico
```

Per provare la versione finale: `npm run build` e poi `npm run preview`.

## 2. Dove si modifica cosa

```
src/config/site.js     ← I TUOI DATI: nome, email, social, WhatsApp, foto, form
src/data/projects.js   ← I TUOI PROGETTI (database)
public/projects/       ← screenshot dei progetti
public/about/          ← la tua foto profilo (cartella da creare)
public/og-image.png    ← anteprima quando condividi il link (1200 × 630)
src/components/        ← sezioni del sito, ognuna con il suo .jsx e .css
src/styles/tokens.css  ← colori, font, spaziature
```

Tutti i punti da completare sono segnati con `TODO`.

## 3. Aggiungere un progetto

1. Apri `src/data/projects.js`.
2. Copia un blocco `{ ... },` e incollalo nella lista, nella posizione in cui vuoi vederlo.
3. Cambia i valori. L'`id` deve essere unico, minuscolo, con i trattini: `mery-drift`.
4. Salva. Il progetto compare in galleria con il suo numero e ha il suo case study su `#/work/mery-drift`.

**Tipologia (`type`)** — viene mostrata in modo chiaro su card e case study:

| valore | significato |
| --- | --- |
| `client` | lavoro per un cliente reale |
| `concept` | proposta o demo fatta di tua iniziativa (il case study lo dichiara) |
| `personal` | progetto personale |

**Stato (`status`)**: `live`, `in-development` oppure `demo`.

**`featured`**: `true` = composizione grande in galleria; `false` = va nell'**archivio a elenco** sotto la galleria. Con 20-30 progetti, tieni 4-6 featured e il resto in archivio.

### Screenshot

1. Crea `public/projects/<id>/` (es. `public/projects/padania-tuning/`).
2. Metti la copertina in formato **.webp**, circa 1600 × 1000 px.
3. Nel progetto: `cover: "projects/padania-tuning/cover.webp"`.
4. Galleria del case study:
   ```js
   gallery: [
     { src: "projects/padania-tuning/home.webp", alt: "Home page", device: "desktop" },
     { src: "projects/padania-tuning/mobile.webp", alt: "Versione mobile", device: "mobile" },
   ],
   ```

Finché `cover` è vuota, il sito genera una copertina grafica con i `colors` del progetto. Finché `gallery` è vuota, il case study mostra la copertina dentro un computer e un telefono.

Per convertire in .webp sul Mac: apri l'immagine con Anteprima → Esporta, oppure usa [squoosh.app](https://squoosh.app).

### Demo (link nascosto)

- `demoUrl` è l'indirizzo della demo. **Non viene mai mostrato**: nel case study il pulsante "Guarda la demo" apre il sito dentro il portfolio, in una finestra senza barra degli indirizzi, senza aprire nuove schede.
- `demoMode: "request"` (o `demoUrl` vuoto) mostra invece "Demo su richiesta": porta alla pagina Contatti con il messaggio già scritto.
- Onestamente: chi sa usare gli strumenti per sviluppatori del browser può comunque risalire all'indirizzo. Per proteggere davvero il codice, tieni privati i repository delle demo su GitHub.

## Pagine

- `#/` Home: chi sei, cosa fai, metodo, filosofia, anteprima dei case study
- `#/work` Case studies, `#/work/<id>` il singolo progetto
- `#/contact` Contatti con il form

## 4. Form contatti

Il form controlla i campi e mostra gli errori. Per l'invio:

- **Senza configurazione**: apre l'app email del visitatore con il messaggio già scritto, e lo dice chiaramente sul pulsante ("Send via email").
- **Per ricevere i messaggi direttamente nella tua casella** (consigliato):
  1. crea un account gratuito su [formspree.io](https://formspree.io);
  2. crea un nuovo form e copia l'indirizzo, tipo `https://formspree.io/f/abcdwxyz`;
  3. incollalo in `formEndpoint` dentro `src/config/site.js`.

  Il pulsante diventa "Send message", il messaggio arriva per email e il visitatore vede la conferma.
  Il form ha anche un campo nascosto anti-spam.

## 5. Pubblicare su GitHub Pages

Il progetto contiene già il workflow `.github/workflows/deploy.yml`, che costruisce e pubblica il sito da solo a ogni push.

1. Crea un repository su GitHub, per esempio `portfolio`.
2. Carica la cartella con GitHub Desktop (Commit → Push). La cartella `node_modules` è esclusa in automatico.
3. Su GitHub: **Settings → Pages → Source: GitHub Actions**.
4. Nella scheda **Actions** vedi la pubblicazione; dopo un paio di minuti il sito è su
   `https://alessandroradulescu03-pixel.github.io/portfolio/`.

I percorsi sono relativi, quindi il sito funziona con qualsiasi nome di repository.
Se il nome **non** è `portfolio`, aggiorna gli indirizzi in `index.html` (canonical e og), `public/robots.txt` e `public/sitemap.xml`.

## 6. Cosa c'è dentro

- **Loader** con animazione tipografica, una volta per sessione, con "Skip intro" (o Esc).
- **Firma 3D** in Three.js: è la tua firma, ricalcata e salvata in `src/lib/signature.json` (copia piatta in `public/signature.svg`), caricata solo dopo la pagina; si ridisegna con "↻ Re-sign"; senza WebGL diventa un'immagine SVG.
- **Smooth scrolling** (Lenis), reveal allo scroll, image reveal, parallax leggero, transizioni tra pagine, cursore personalizzato solo con il mouse, pulsanti magnetici.
- **Filosofia** con le parole che si accendono scorrendo.
- **Footer** con orologio di Bergamo e un riquadro dove chi visita può lasciare la sua firma.
- **Accessibilità**: navigazione da tastiera, link "Vai al contenuto", focus visibili, menu chiudibile con Esc. Con "Riduci movimento" attivo nel sistema, loader, cursore, smooth scroll e animazioni si disattivano.
- **SEO**: title e description per ogni pagina, Open Graph, dati strutturati, sitemap e robots.

## 7. Dipendenze

React, React Router, Three.js, Lenis e i font (Unbounded, Manrope, JetBrains Mono) installati in locale tramite Fontsource: nessuna richiesta a servizi esterni per i caratteri.
