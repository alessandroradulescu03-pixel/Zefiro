/* ==========================================================
   DATABASE PROGETTI
   Per aggiungere un lavoro copia un blocco { ... }, incollalo nella
   lista e cambia i valori: compare in galleria e ottiene il suo
   case study (indirizzo: #/work/<id>). L'ordine qui è l'ordine sul sito.

   CAMPI
   id              identificativo unico, minuscolo-con-trattini
   number          numero mostrato ("01"). Vuoto = calcolato dall'ordine
   title           nome del progetto
   category        settore, es. "Automotive / Events"
   description     1-2 frasi per la galleria
   type            "client"   = lavoro per un cliente reale
                   "concept"  = proposta / demo non commissionata
                   "personal" = progetto personale
   status          "live" | "in-development" | "demo"
   published       true = visibile sul sito · false = nascosto (resta salvato qui)
   year, location, role
   cover           immagine in public/, es. "projects/padania-tuning/cover.webp"
                   (vuoto = copertina grafica generata con i colori)
   gallery         [{ src, alt, device: "desktop" | "mobile" }]
   colors          bg / fg / accent: colori del cliente, usati per la copertina generata
   demoUrl         indirizzo della demo. NON viene mai mostrato come link:
                   la demo si apre dentro il sito, in una finestra di anteprima
   demoMode        "embed"   = pulsante "Guarda la demo" (anteprima interna)
                   "request" = pulsante "Demo su richiesta" (porta ai contatti)
                   Se demoUrl è vuoto vale automaticamente "request"
   technologies    elenco tecnologie
   overview        "Di cosa si tratta" (case study)
   objective       obiettivo del progetto
   visualDirection direzione visiva
   features        funzionalità implementate
   ========================================================== */
export const projects = [
  {
    id: "padania-tuning",
    number: "",
    title: "Padania Tuning",
    category: "Automotive / Events",
    description:
      "Piattaforma dedicata agli eventi automotive, alla community e alla gestione delle candidature.",
    type: "client",
    status: "in-development",
    published: true,
    year: 2026,
    location: "Covo (BG)",
    role: "Design & development",
    cover: "",
    gallery: [
      { src: "projects/padania-tuning/desktop.webp", alt: "Padania Tuning — home, desktop", device: "desktop" },
      { src: "projects/padania-tuning/mobile.webp", alt: "Padania Tuning — home, smartphone", device: "mobile" },
      { src: "projects/padania-tuning/desktop-2.webp", alt: "Padania Tuning — sezione interna", device: "desktop" },
    ],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/PadaniaTuning/",
    demoMode: "embed",
    colors: { bg: "#0E0F12", fg: "#E7EAEE", accent: "#B9C0CA" },
    technologies: ["HTML", "CSS", "JavaScript", "Stripe", "GitHub Pages"],
    overview:
      "Padania Tuning è una community e un evento dedicato alle auto modificate nella bassa bergamasca. Il sito è il punto di riferimento per chi vuole partecipare: presenta l'evento, raccoglie le iscrizioni e vende il merchandise ufficiale. Il vecchio sito era su WordPress: il nuovo è statico, più veloce e senza costi di piattaforma.",
    objective:
      "Portare il sito fuori da WordPress senza perdere le funzioni che servono all'organizzazione, e rendere la versione mobile impeccabile, perché quasi tutto il pubblico arriva da smartphone.",
    visualDirection:
      "Tema scuro con l'argento del brand come unico colore. Superfici metalliche, contrasti netti e spaziature studiate prima sul telefono e poi sul desktop.",
    features: [
      "Form di iscrizione all'evento con email di conferma automatica",
      "Esportazione degli iscritti in Excel",
      "Shop di magliette, felpe e accessori con carrello e pagamento Stripe dentro il sito, senza pagine esterne",
      "Christmas Edition per il raduno di dicembre: neve, luminarie e conto alla rovescia, che si spegne da sola dopo le feste",
      "Web app di check-in per il giorno dell'evento: scansione QR, import da Excel, ricerca rapida e salvataggio automatico",
    ],
  },
  {
    id: "mery-drift",
    number: "",
    title: "Mery Drift",
    category: "Motorsport / Drift Experience",
    description:
      "Sito multipagina per una nuova realtà di drift su pista: scuola, noleggio auto e accessi.",
    type: "concept",
    status: "in-development",
    published: false,
    year: 2026,
    location: "Covo (BG)",
    role: "Design & development",
    cover: "",
    gallery: [
      { src: "projects/mery-drift/desktop.webp", alt: "Mery Drift — home, desktop", device: "desktop" },
      { src: "projects/mery-drift/mobile.webp", alt: "Mery Drift — home, smartphone", device: "mobile" },
      { src: "projects/mery-drift/desktop-2.webp", alt: "Mery Drift — sezione interna", device: "desktop" },
    ],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/MeryDrift/",
    demoMode: "embed",
    colors: { bg: "#120A1A", fg: "#F6EEF8", accent: "#E8188C" },
    technologies: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    overview:
      "Mery Drift è un'attività di drift appena nata dentro il circuito MXE.45 di Covo, con una pista a forma di 8. Il sito presenta la scuola con istruttori qualificati, il noleggio auto, il noleggio pista e gli accessi. È una proposta in attesa di conferma.",
    objective:
      "Far capire in pochi secondi cosa si può fare in pista e quanto costa, con i prezzi sempre visibili, e trasmettere l'energia del drift fin dal primo schermo.",
    visualDirection:
      "Colori del brand: rosa e viola su fondo scuro, con accenti blu. Titoli condensati e corsivi che richiamano il movimento in traverso.",
    features: [
      "Struttura su più pagine: scuola, noleggio, pista, orari",
      "Prezzi chiari e sempre visibili",
      "Orari condivisi con il circuito MXE.45",
      "Pensato prima per lo smartphone",
    ],
  },
  {
    id: "mxe45",
    number: "",
    title: "MXE.45",
    category: "Motorsport / Motocross",
    description:
      "Sito per un circuito di motocross: orari della settimana, pista, info e come arrivare.",
    type: "concept",
    status: "in-development",
    published: false,
    year: 2026,
    location: "Covo (BG)",
    role: "Design & development",
    cover: "",
    gallery: [
      { src: "projects/mxe45/desktop.webp", alt: "MXE.45 — home, desktop", device: "desktop" },
      { src: "projects/mxe45/mobile.webp", alt: "MXE.45 — home, smartphone", device: "mobile" },
      { src: "projects/mxe45/desktop-2.webp", alt: "MXE.45 — sezione interna", device: "desktop" },
    ],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/Mxe/",
    demoMode: "embed",
    colors: { bg: "#EEF0F3", fg: "#0D0F14", accent: "#1F3FD6" },
    technologies: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    overview:
      "MXE.45 è la pista di motocross di Covo, nella stessa struttura di Mery Drift. Il sito raccoglie in un posto solo le informazioni che i piloti chiedono di continuo: quando si gira, com'è la pista e come arrivare. È una proposta in attesa di conferma.",
    objective:
      "Rispondere subito alla domanda principale, cioè se oggi la pista è aperta, e ridurre le richieste ripetute via messaggio.",
    visualDirection:
      "Fondo chiaro, nero e blu racing, tipografia larga e inclinata con bande diagonali che ricordano le grafiche delle moto da cross.",
    features: [
      "Stato della pista in evidenza (aperta o chiusa) con gli orari della settimana",
      "Pagine dedicate a pista, orari, info e come arrivare",
      "Collegamento a Mery Drift, dentro la stessa struttura",
      "Contatti diretti via WhatsApp e social",
    ],
  },
  {
    id: "lunar-detailing",
    number: "",
    title: "Lunar Detailing Lab",
    category: "Automotive / Detailing",
    description:
      "One-page per un laboratorio di pellicolatura e cura estetica dell'auto.",
    type: "concept",
    status: "demo",
    published: false,
    year: 2026,
    location: "Cortenuova (BG)",
    role: "Concept, design & development",
    cover: "",
    gallery: [
      { src: "projects/lunar-detailing/desktop.webp", alt: "Lunar Detailing Lab — home, desktop", device: "desktop" },
      { src: "projects/lunar-detailing/mobile.webp", alt: "Lunar Detailing Lab — home, smartphone", device: "mobile" },
      { src: "projects/lunar-detailing/desktop-2.webp", alt: "Lunar Detailing Lab — sezione interna", device: "desktop" },
    ],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/LunarDetailing/",
    demoMode: "embed",
    colors: { bg: "#0B1A33", fg: "#E9ECF2", accent: "#C7CCD6" },
    technologies: ["React", "TypeScript", "Vite", "Framer Motion", "GitHub Pages"],
    overview:
      "Lunar Detailing Lab si occupa di pellicolatura, oscuramento vetri e cura estetica dell'auto, ma non aveva un sito. Ho preparato questo concept di mia iniziativa da proporre al titolare. Le foto sono dimostrative.",
    objective:
      "Presentare i servizi come un lavoro di precisione e portare il visitatore alla richiesta di preventivo.",
    visualDirection:
      "Identità «Fasi»: sezioni blu notte alternate a sezioni argento lunare, titoli in Bodoni e un menu a dock in basso, come in un'app.",
    features: [
      "Servizi: pellicolatura, oscuramento vetri, cura estetica",
      "Animazioni allo scroll con Framer Motion",
      "Menu a dock fisso in basso",
      "Contenuti tutti in un unico file dati, facili da aggiornare",
    ],
  },
  {
    id: "ssw",
    number: "",
    title: "SSW — Stay Sideways",
    category: "Fashion / Streetwear",
    description:
      "E-commerce per un brand streetwear nato dal drift: drop in edizione limitata, lookbook e carrello.",
    type: "concept",
    status: "demo",
    published: false,
    year: 2026,
    location: "Italia",
    role: "Concept, design & development",
    cover: "",
    // TODO: gli screenshot in public/projects/ssw/ sono ancora della vecchia bozza verde.
    // Sostituiscili con quelli del sito nuovo (stessi nomi) e rimetti queste tre righe dentro gallery:
    //   { src: "projects/ssw/desktop.webp", alt: "SSW — home, desktop", device: "desktop" },
    //   { src: "projects/ssw/mobile.webp", alt: "SSW — home, smartphone", device: "mobile" },
    //   { src: "projects/ssw/desktop-2.webp", alt: "SSW — sezione interna", device: "desktop" },
    gallery: [],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/SSW/",
    demoMode: "embed",
    colors: { bg: "#0A0A0A", fg: "#FFFFFF", accent: "#FF1FA9" },
    technologies: ["HTML", "CSS", "JavaScript"],
    overview:
      "SSW Motorsport — Stay Sideways è un brand streetwear italiano nato tra traversi e paddock, con capi in edizione limitata pensati per lei e per lui. La prima bozza era elegante e minimal; dopo il confronto con il referente l'ho rifatta da capo, con un carattere più deciso e fedele al logo.",
    objective:
      "Far uscire il Drop 01 come un vero lancio: pochi pezzi, un percorso d'acquisto semplice da telefono e un motivo per tornare al drop successivo.",
    visualDirection:
      "Nero pieno e bianco, con il fucsia della prima S del logo come unico accento e il tricolore della scritta Motorsport. Titoli in Archivo stretto e maiuscolo, con qualche nota scritta a mano.",
    features: [
      "Drop 01 in edizione limitata, con il traguardo dei 1000 follower che lo ha sbloccato",
      "Scheda prodotto con taglie, guida alle taglie, vestibilità e resi",
      "Carrello con subtotale e soglia per la spedizione gratuita",
      "Lookbook lei e lui e storia del brand",
      "Iscrizione alla newsletter per il Drop 02, con privacy policy",
    ],
  },
  {
    id: "soprani-trasporti",
    number: "",
    title: "Soprani Trasporti",
    category: "Logistics / Transport",
    description:
      "Concept per un'azienda di autotrasporto e logistica: servizi, flotta e richiesta di preventivo.",
    type: "concept",
    status: "demo",
    published: false,
    year: 2026,
    location: "Cortenuova (BG)",
    role: "Concept, design & development",
    cover: "",
    gallery: [
      { src: "projects/soprani-trasporti/desktop.webp", alt: "Soprani Trasporti — home, desktop", device: "desktop" },
      { src: "projects/soprani-trasporti/mobile.webp", alt: "Soprani Trasporti — home, smartphone", device: "mobile" },
      { src: "projects/soprani-trasporti/desktop-2.webp", alt: "Soprani Trasporti — sezione interna", device: "desktop" },
    ],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/sopraniTrasporti/",
    demoMode: "embed",
    colors: { bg: "#0A1A3F", fg: "#F2F5FA", accent: "#2A6DF4" },
    technologies: ["HTML", "CSS", "JavaScript"],
    overview:
      "Soprani Trasporti fa autotrasporto merci in Italia e in Europa dal 1996, con magazzino a Cortenuova. Il sito attuale è poco più di un biglietto da visita: ho preparato questo concept per mostrare come potrebbe presentarsi un'azienda con quella storia.",
    objective:
      "Spiegare in modo chiaro i due servizi, trasporto e deposito, e trasformare le visite in richieste di preventivo. In più, uno spazio per cercare autisti.",
    visualDirection:
      "Blu notte e blu elettrico, una trama di punti che richiama le rotte e una tipografia solida, da azienda affidabile.",
    features: [
      "Servizi di trasporto nazionale, internazionale e deposito",
      "Sezione flotta e mezzi propri",
      "Richiesta di preventivo",
      "Sezione «Lavora con noi» per gli autisti",
    ],
  },
  {
    id: "padania-checkin",
    number: "",
    title: "Padania Tuning — Check-in",
    category: "Events / Web App",
    description:
      "Web app per gestire gli ingressi il giorno dell'evento: scansione QR, lista iscritti e statistiche.",
    type: "client",
    status: "in-development",
    published: false,
    year: 2026,
    location: "Covo (BG)",
    role: "Design & development",
    cover: "",
    gallery: [
      { src: "projects/padania-checkin/desktop.webp", alt: "Check-in Padania Tuning — home, desktop", device: "desktop" },
      { src: "projects/padania-checkin/mobile.webp", alt: "Check-in Padania Tuning — home, smartphone", device: "mobile" },
      { src: "projects/padania-checkin/desktop-2.webp", alt: "Check-in Padania Tuning — sezione interna", device: "desktop" },
    ],
    demoUrl: "",
    demoMode: "request",
    colors: { bg: "#0B0B0C", fg: "#EDEDED", accent: "#B9C0CA" },
    technologies: ["HTML", "CSS", "JavaScript", "PWA", "SheetJS"],
    overview:
      "Lo strumento che lo staff di Padania Tuning usa all'ingresso dell'evento, collegato alle iscrizioni del sito. Funziona dal telefono come un'app e salva tutto sul dispositivo. Contiene dati degli iscritti, per questo l'accesso è protetto e la demo è su richiesta.",
    objective:
      "Far entrare tante auto in poco tempo, senza fogli di carta e senza perdere il conto di chi è già arrivato.",
    visualDirection:
      "Interfaccia scura e sobria, coerente con il brand, con pulsanti grandi pensati per l'uso con una mano.",
    features: [
      "Scansione dei QR code con la fotocamera",
      "Import degli iscritti da Excel ed export in Excel e JSON",
      "Ricerca per iniziali, filtri e barra di avanzamento",
      "Salvataggio automatico e annullamento dell'ultima azione",
    ],
  },
  {
    id: "mrc-automotive",
    number: "",
    title: "MRC Automotive",
    category: "Automotive / Performance",
    description:
      "Concept web premium per un'attività specializzata in BMW, manutenzione, meccanica e preparazioni sportive.",
    type: "concept",
    status: "demo",
    published: true,
    year: 2026,
    location: "Grumello del Monte (BG)",
    role: "Concept, design & development",
    cover: "",
    gallery: [
      { src: "projects/mrc-automotive/desktop.webp", alt: "MRC Automotive — home, desktop", device: "desktop" },
      { src: "projects/mrc-automotive/mobile.webp", alt: "MRC Automotive — home, smartphone", device: "mobile" },
      { src: "projects/mrc-automotive/desktop-2.webp", alt: "MRC Automotive — sezione interna", device: "desktop" },
    ],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/MRC/",
    demoMode: "embed",
    colors: { bg: "#0A0C0E", fg: "#EEF2F2", accent: "#2FC4B7" },
    technologies: ["HTML", "CSS", "JavaScript"],
    overview:
      "MRC Automotive è un'officina che unisce manutenzione e diagnostica alle preparazioni sportive, con vendita di componenti racing e un servizio di compravendita e importazione auto. Abbiamo realizzato questo concept di nostra iniziativa, per mostrare ai titolari come l'attività potrebbe presentarsi online.",
    objective:
      "Dare all'officina un'immagine all'altezza delle preparazioni che realizza e portare il visitatore al contatto diretto in pochi tocchi.",
    visualDirection:
      "Due direzioni: una tecnica da specialista BMW, con toni petrolio e turchese; una seconda più ricca, costruita su tutti i servizi reali dell'attività.",
    features: [
      "Due proposte grafiche alternative",
      "Servizi: diagnostica, preparazioni, pneumatici, ricambi racing nuovi e usati",
      "Sezione compravendita e importazione auto",
      "Telefono e Instagram sempre in evidenza",
    ],
  },
  {
    id: "district-lab",
    number: "",
    title: "District Lab",
    category: "Fashion / Streetwear",
    description:
      "Concept e-commerce dedicato a un brand streetwear, con un'esperienza visiva urbana e moderna.",
    type: "concept",
    status: "demo",
    published: true,
    year: 2026,
    location: "Romano di Lombardia (BG)",
    role: "Concept, design & development",
    cover: "",
    gallery: [
      { src: "projects/district-lab/desktop.webp", alt: "District Lab — home, desktop", device: "desktop" },
      { src: "projects/district-lab/mobile.webp", alt: "District Lab — home, smartphone", device: "mobile" },
      { src: "projects/district-lab/desktop-2.webp", alt: "District Lab — sezione interna", device: "desktop" },
    ],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/DistrictLab/",
    demoMode: "embed",
    colors: { bg: "#ECECE8", fg: "#0B0B0B", accent: "#0B0B0B" },
    technologies: ["React", "Vite", "GitHub Actions", "GitHub Pages"],
    overview:
      "District Lab è un negozio streetwear aperto da poco, con abbigliamento, accessori e profumi tra brand emergenti e nomi internazionali. Era presente su Instagram e TikTok ma non aveva un sito: abbiamo realizzato questo concept di e-commerce da mostrare ai titolari.",
    objective:
      "Raccontare l'identità urbana del negozio e preparare la base per la vendita online, con un percorso d'acquisto semplice da telefono.",
    visualDirection:
      "Bianco e nero, tipografia larga e prodotti in primo piano. Lo streetwear raccontato come linguaggio, con pochissimi elementi e tanto spazio.",
    features: [
      "Catalogo per categorie: abbigliamento, accessori, profumi",
      "Scheda prodotto e carrello",
      "Ricostruito da zero in React e Vite, con pieno controllo sul codice",
      "Pubblicazione automatica su GitHub Pages con GitHub Actions",
    ],
  },
  {
    id: "zclean",
    number: "",
    title: "zClean",
    category: "Cleaning / Professional Services",
    description:
      "Esperienza web per un'attività di pulizie professionali, con focus sui servizi e sulla generazione di contatti.",
    type: "concept",
    status: "demo",
    published: true,
    year: 2026,
    location: "Romano di Lombardia (BG)",
    role: "Concept, design & development",
    cover: "",
    gallery: [
      { src: "projects/zclean/desktop.webp", alt: "ZClean — home, desktop", device: "desktop" },
      { src: "projects/zclean/mobile.webp", alt: "ZClean — home, smartphone", device: "mobile" },
      { src: "projects/zclean/desktop-2.webp", alt: "ZClean — sezione interna", device: "desktop" },
    ],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/zClean/",
    demoMode: "embed",
    colors: { bg: "#F5F8FC", fg: "#0A2A5E", accent: "#F5C21B" },
    technologies: ["HTML", "CSS", "JavaScript"],
    overview:
      "ZClean è un'impresa di pulizie professionali della bassa bergamasca. Abbiamo progettato un concept per presentare i servizi in modo più moderno e trasformare le visite in richieste di preventivo.",
    objective:
      "Spiegare i servizi in modo semplice e rendere la richiesta di preventivo il passo più naturale della visita.",
    visualDirection:
      "Bianco pulito, blu del logo e un giallo deciso per le azioni. Piccole animazioni a tema: spruzzini, spugna e bolle di sapone che si muovono con lo scroll.",
    features: [
      "Loader con un tergivetro che pulisce lo schermo mentre la pagina si carica",
      "Slider prima/dopo da trascinare",
      "Calcolatore del prezzo per le case, con prenotazione su WhatsApp già compilata",
      "Calcolatore per le aziende: tipo di locale, metri quadri e passaggi a settimana",
      "Zone servite, FAQ e richiesta di sopralluogo",
    ],
  },
];

/* ---------- etichette e helper (non serve modificarli) ---------- */
export const TYPE_LABEL = { client: "Progetto cliente", concept: "Concept dimostrativo", personal: "Progetto personale" };
export const STATUS_LABEL = { live: "Online", "in-development": "In sviluppo", demo: "Demo" };

export const allProjects = projects
  .filter(p => p && p.id && p.title && p.published !== false)
  .map((p, i) => ({ ...p, number: p.number || String(i + 1).padStart(2, "0") }));

export const findProject = id => allProjects.findIndex(p => p.id === id);
export const asset = path => (path ? import.meta.env.BASE_URL + path.replace(/^\//, "") : "");
