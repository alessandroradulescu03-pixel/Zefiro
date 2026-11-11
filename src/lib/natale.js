/* ==========================================================
   WINTER EDITION 🎄 — interruttore del tema natalizio
   Si accende da solo dal 1° novembre e si spegne dopo l'Epifania (6 gennaio).
   Per spegnerlo a mano: in src/config/site.js metti  natale: { attivo: false }
   Tutto il tema sta in: questo file, components/Natale.jsx e components/Natale.css
   ========================================================== */
import { site } from "../config/site.js";

export function isNatale(oggi = new Date()) {
  if (!site.natale || !site.natale.attivo) return false;
  const m = oggi.getMonth();
  const g = oggi.getDate();
  return m >= 10 || (m === 0 && g <= 6);
}

/* testo dell'etichetta in basso: conto alla rovescia, poi gli auguri */
export function messaggioNatale(oggi = new Date()) {
  const anno = oggi.getFullYear();
  if (oggi.getMonth() === 0) return { testo: `Buon ${anno}`, giorni: null };
  const giorni = Math.round((new Date(anno, 11, 25) - new Date(anno, oggi.getMonth(), oggi.getDate())) / 864e5);
  if (giorni < 0) return { testo: `Buone feste e buon ${anno + 1}`, giorni: null };
  if (giorni === 0) return { testo: "Buon Natale!", giorni: null };
  if (giorni === 1) return { testo: "Domani è Natale", giorni: null };
  return { testo: "giorni a Natale", giorni };
}

export const NATALE = isNatale();
