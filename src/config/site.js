/* ==========================================================
   CONFIGURAZIONE ZEFIRO
   Tutti i dati del brand sono qui. Un campo vuoto ("") viene nascosto
   in automatico: nessun link finto finisce online.
   ========================================================== */
export const site = {
  brand: "ZEFIRO",
  name: "ZEFIRO Digital Studio",
  payoff: "Digital ideas. Real impact.",
  sector: "Web Design, Web Development, Digital Experiences",
  founder: "Alessandro Radulescu",

  city: "Bergamo",
  country: "Italia",
  coords: "45.69°N — 9.67°E",

  email: "alessandro.radulescu03@gmail.com",

  socials: {
    // TODO: indirizzo del profilo Instagram di ZEFIRO, es. "https://www.instagram.com/zefiro.studio/"
    instagram: "",
    // TODO: es. "https://www.linkedin.com/in/tuonome/"
    linkedin: "",
  },

  /* ---------- Modulo contatti ----------
     I messaggi arrivano davvero alla tua email, e il sito mostra l'esito reale
     dell'invio (se qualcosa va storto, lo dice).
     - Così com'è usa FormSubmit (gratis, senza account): al PRIMO invio ti arriva
       un'email "Activate Form" da confermare una volta sola. Finché non la confermi,
       il sito avvisa che il modulo è in attesa di attivazione.
     - Alternativa: vai su https://web3forms.com, inserisci la tua email, copia la
       "Access Key" che ti arriva e incollala qui sotto. Se è compilata, il sito
       usa Web3Forms al posto di FormSubmit. */
  formEmail: "alessandro.radulescu03@gmail.com",
  web3formsKey: "",
};

export const NAV = [
  { id: "home", label: "Home", to: "/" },
  { id: "servizi", label: "Servizi", to: "/", section: "servizi" },
  { id: "progetti", label: "Progetti", to: "/progetti" },
  { id: "studio", label: "Studio", to: "/", section: "studio" },
  { id: "contatti", label: "Contatti", to: "/contatti" },
];
