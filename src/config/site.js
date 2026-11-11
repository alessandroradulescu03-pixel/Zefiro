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

  /* Winter edition 🎄: tema natalizio. Si accende da solo dal 1° novembre
     e si spegne dopo il 6 gennaio. Metti false per spegnerlo subito. */
  natale: { attivo: true },

  // true = mostra "Available for new projects"
  available: true,

  email: "alessandro.radulescu03@gmail.com",

  socials: {
    instagram: "https://www.instagram.com/radulescualessandro/",
    // TODO: es. "https://www.linkedin.com/in/tuonome/"
    linkedin: "",
    github: "",
    // TODO: numero con prefisso, solo cifre, es. "393331234567"
    whatsapp: "",
  },

  // Foto profilo: metti il file in public/about/ e scrivi es. "about/ritratto.webp"
  // Vuoto = monogramma grafico.
  photo: "",

  /* Form contatti: i messaggi arrivano alla tua email.
     - Così com'è usa FormSubmit (gratis, senza account): la prima volta ti arriva
       un'email "Activate Form" da cliccare una volta sola.
     - Più affidabile: vai su https://web3forms.com, inserisci la tua email,
       copia la "Access Key" che ti arriva e incollala in web3formsKey qui sotto.
       Se è compilata, il sito usa Web3Forms al posto di FormSubmit. */
  formEndpoint: "https://formsubmit.co/alessandro.radulescu03@gmail.com",
  web3formsKey: "",
};

export const whatsappUrl = n => (n ? `https://wa.me/${String(n).replace(/\D/g, "")}` : "");
