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
   featured        true = grande in galleria · false = nell'archivio a elenco
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
    featured: true,
    year: 2026,
    location: "Covo (BG)",
    role: "Design & development",
    cover: "",
    gallery: [],
    demoUrl: "", // TODO: indirizzo della demo (non viene mai mostrato)
    demoMode: "embed",
    colors: { bg: "#0E0F12", fg: "#E7EAEE", accent: "#B9C0CA" },
    technologies: ["HTML", "CSS", "JavaScript", "Stripe", "GitHub Pages"],
    overview:
      "Padania Tuning è una community e un evento dedicato alle auto modificate nella bassa bergamasca. Il sito è il punto di riferimento per chi vuole partecipare: presenta l'evento, raccoglie le iscrizioni e vende il merchandise ufficiale. Il vecchio sito era su WordPress; il nuovo è statico, più veloce e senza costi di piattaforma.",
    objective:
      "Portare il sito fuori da WordPress senza perdere le funzioni che servono all'organizzazione, e rendere la versione mobile impeccabile, perché quasi tutto il pubblico arriva da smartphone.",
    visualDirection:
      "Tema scuro con l'argento del brand come unico colore. Superfici metalliche, contrasti netti e spaziature studiate prima sul telefono e poi sul desktop.",
    features: [
      "Form di iscrizione all'evento con email di conferma automatica",
      "Esportazione degli iscritti in Excel",
      "Shop di magliette, felpe e accessori con carrello e pagamenti Stripe",
      "Web app di check-in per il giorno dell'evento: scansione QR, import da Excel, ricerca rapida e salvataggio automatico",
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
    featured: true,
    year: 2026,
    location: "Grumello del Monte (BG)",
    role: "Concept, design & development",
    cover: "",
    gallery: [],
    demoUrl: "", // TODO: indirizzo della demo (non viene mai mostrato)
    demoMode: "embed",
    colors: { bg: "#051416", fg: "#D5EFED", accent: "#2FC4B7" },
    technologies: ["HTML", "CSS", "JavaScript"],
    overview:
      "MRC Automotive è un'officina che unisce manutenzione e diagnostica alle preparazioni sportive, con vendita di componenti racing e un servizio di compravendita e importazione auto. Ho preparato questo concept di mia iniziativa, per mostrare ai titolari come l'attività potrebbe presentarsi online.",
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
    featured: true,
    year: 2026,
    location: "Romano di Lombardia (BG)",
    role: "Concept, design & development",
    cover: "",
    gallery: [],
    demoUrl: "https://alessandroradulescu03-pixel.github.io/DistrictLab/",
    demoMode: "embed",
    colors: { bg: "#ECECE8", fg: "#0B0B0B", accent: "#0B0B0B" },
    technologies: ["React", "Vite", "GitHub Actions", "GitHub Pages"],
    overview:
      "District Lab è un negozio streetwear aperto da poco, con abbigliamento, accessori e profumi tra brand emergenti e nomi internazionali. Era presente su Instagram e TikTok ma non aveva un sito: ho realizzato questo concept di e-commerce da mostrare ai titolari.",
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
    title: "ZClean",
    category: "Cleaning / Professional Services",
    description:
      "Esperienza web per un'attività di pulizie professionali, con focus sui servizi e sulla generazione di contatti.",
    type: "concept",
    status: "demo",
    featured: true,
    year: 2026,
    location: "Romano di Lombardia (BG)",
    role: "Concept, design & development",
    cover: "",
    gallery: [],
    demoUrl: "", // TODO: indirizzo della demo (non viene mai mostrato)
    demoMode: "embed",
    colors: { bg: "#E6F4FF", fg: "#06275A", accent: "#15A9E0" },
    technologies: ["HTML", "CSS", "JavaScript"],
    // TODO: controlla che questi testi corrispondano alla demo che hai realizzato
    overview:
      "ZClean è un'impresa di pulizie professionali della bassa bergamasca. Ho progettato un concept per presentare i servizi in modo più moderno e trasformare le visite in richieste di preventivo.",
    objective:
      "Spiegare i servizi in modo semplice e rendere la richiesta di preventivo il passo più naturale della visita.",
    visualDirection:
      "Palette fresca di azzurri, layout arioso e ordinato, coerente con il lavoro dell'azienda.",
    features: [
      "Pagine servizi chiare, senza termini tecnici",
      "Richiesta di contatto sempre a portata di mano",
      "Design responsive pensato per lo smartphone",
    ],
  },
];

/* ---------- etichette e helper (non serve modificarli) ---------- */
export const TYPE_LABEL = { client: "Client project", concept: "Concept", personal: "Personal project" };
export const STATUS_LABEL = { live: "Live", "in-development": "In development", demo: "Demo" };

export const allProjects = projects
  .filter(p => p && p.id && p.title)
  .map((p, i) => ({ ...p, number: p.number || String(i + 1).padStart(2, "0") }));

export const findProject = id => allProjects.findIndex(p => p.id === id);
export const asset = path => (path ? import.meta.env.BASE_URL + path.replace(/^\//, "") : "");
