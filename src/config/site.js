/* ==========================================================
   CONFIGURAZIONE PERSONALE
   Tutti i tuoi dati sono qui. Un campo vuoto ("") viene nascosto
   in automatico: nessun link finto finisce online.
   ========================================================== */
export const site = {
  name: "Alessandro Radulescu",
  firstName: "Alessandro",
  monogram: "A.",
  role: "Digital Developer",
  positioning: "Independent Digital Developer",
  tagline: "Creative Web Experiences",

  city: "Bergamo",
  country: "Italia",
  coords: "45.69°N — 9.67°E",
  timeZone: "Europe/Rome",

  // true = mostra "Available for new projects"
  available: true,

  email: "alessandro.radulescu03@gmail.com",

  socials: {
    // TODO: es. "https://www.instagram.com/tuonome/"
    instagram: "",
    // TODO: es. "https://www.linkedin.com/in/tuonome/"
    linkedin: "",
    github: "https://github.com/alessandroradulescu03-pixel",
    // TODO: numero con prefisso, solo cifre, es. "393331234567"
    whatsapp: "",
  },

  // Foto profilo: metti il file in public/about/ e scrivi es. "about/ritratto.webp"
  // Vuoto = monogramma grafico.
  photo: "",

  /* Form contatti
     Per ricevere i messaggi nella tua casella:
     1. crea un account gratuito su https://formspree.io
     2. crea un form e copia l'indirizzo, es. "https://formspree.io/f/abcdwxyz"
     3. incollalo qui sotto.
     Finché è vuoto, il form apre l'app email del visitatore con il messaggio già scritto. */
  formEndpoint: "",
};

export const whatsappUrl = n => (n ? `https://wa.me/${String(n).replace(/\D/g, "")}` : "");
