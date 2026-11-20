/* Servizi: quattro competenze, ognuna con un disegno dedicato che si anima al passaggio */
import { Reveal, SectionHead } from "./ui.jsx";
import "./Services.css";

const ArtDesign = () => (
  <svg viewBox="0 0 220 132" className="sv-art sv-art--design" aria-hidden="true">
    {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} className="col" x={14 + i * 33} y="10" width="27" height="112" rx="2" style={{ "--i": i }} />)}
    <rect className="blk blk--a" x="14" y="22" width="126" height="40" rx="3" />
    <rect className="blk blk--b" x="146" y="22" width="60" height="40" rx="3" />
    <rect className="blk blk--c" x="14" y="72" width="60" height="38" rx="3" />
    <rect className="blk blk--d" x="80" y="72" width="60" height="38" rx="3" />
    <rect className="blk blk--e" x="146" y="72" width="60" height="38" rx="3" />
    <rect className="bar" x="24" y="34" width="70" height="6" rx="3" />
    <rect className="bar bar--soft" x="24" y="46" width="48" height="4" rx="2" />
  </svg>
);

const ArtDev = () => (
  <svg viewBox="0 0 220 132" className="sv-art sv-art--dev" aria-hidden="true">
    <rect className="win" x="10" y="10" width="200" height="112" rx="6" />
    <circle cx="24" cy="22" r="3" className="dot" /><circle cx="34" cy="22" r="3" className="dot" /><circle cx="44" cy="22" r="3" className="dot" />
    {[
      [22, 42, 44, "k"], [70, 42, 60, ""], [34, 56, 36, "k"], [74, 56, 80, ""], [34, 70, 56, "s"], [94, 70, 40, ""],
      [46, 84, 72, ""], [34, 98, 30, "k"], [22, 110, 40, "k"],
    ].map(([x, y, w, t], i) => <rect key={i} className={`ln ${t ? "ln--" + t : ""}`} x={x} y={y - 3} width={w} height="6" rx="3" style={{ "--i": i }} />)}
    <rect className="caret" x="122" y="81" width="2" height="10" />
    <path className="tick" d="M168 98l8 8 16-18" />
  </svg>
);

const ArtShop = () => (
  <svg viewBox="0 0 220 132" className="sv-art sv-art--shop" aria-hidden="true">
    {[0, 1, 2].map(i => (
      <g key={i} className={`prod prod--${i}`}>
        <rect x={14 + i * 52} y="18" width="44" height="58" rx="4" className="prod__img" />
        <rect x={14 + i * 52} y="84" width="30" height="5" rx="2.5" className="prod__t" />
        <rect x={14 + i * 52} y="94" width="18" height="5" rx="2.5" className="prod__p" />
      </g>
    ))}
    <g className="cart">
      <rect x="172" y="44" width="38" height="40" rx="6" className="cart__box" />
      <path d="M180 56h4l4 14h14l3-10h-19" className="cart__ico" />
      <circle cx="190" cy="75" r="1.8" className="cart__w" /><circle cx="200" cy="75" r="1.8" className="cart__w" />
      <circle cx="207" cy="46" r="7" className="cart__badge" />
      <text x="207" y="49.5" textAnchor="middle" className="cart__n">1</text>
    </g>
    <rect x="14" y="110" width="148" height="12" rx="6" className="checkout" />
  </svg>
);

const ArtIdentity = () => (
  <svg viewBox="0 0 220 132" className="sv-art sv-art--id" aria-hidden="true">
    {["#07152F", "#1765E8", "#39B8F4", "#F3F6FB"].map((c, i) => (
      <rect key={c} className="sw" x={20 + i * 26} y="26" width="56" height="80" rx="6" fill={c} style={{ "--i": i }} />
    ))}
    <text x="170" y="78" textAnchor="middle" className="aa">Aa</text>
    <rect x="146" y="92" width="48" height="4" rx="2" className="aa-l" />
    <rect x="152" y="100" width="36" height="4" rx="2" className="aa-l" />
  </svg>
);

const SERVICES = [
  {
    n: "01",
    title: "Web Design",
    short: "Progettazione di interfacce moderne, curate e intuitive.",
    text: "Struttura dei contenuti, gerarchie e interfacce pensate per chi le userà davvero. Ogni pagina ha un obiettivo e ogni elemento è al suo posto, prima sullo smartphone e poi sul desktop.",
    tags: ["UX & architettura", "UI design", "Prototipi", "Mobile first"],
    Art: ArtDesign,
  },
  {
    n: "02",
    title: "Web Development",
    short: "Sviluppo di siti web performanti, responsive e personalizzati.",
    text: "Codice scritto su misura, senza temi preconfezionati: siti veloci, accessibili e facili da aggiornare. Dalla pagina vetrina alla web app, con SEO tecnica e pubblicazione inclusi.",
    tags: ["HTML · CSS · JS", "React", "WordPress", "SEO tecnica"],
    Art: ArtDev,
  },
  {
    n: "03",
    title: "E-commerce",
    short: "Esperienze di acquisto digitali progettate per valorizzare prodotti e brand.",
    text: "Cataloghi chiari, schede prodotto curate e un percorso d'acquisto semplice da telefono. Pagamenti sicuri integrati nel sito, pensati per vendere senza complicare la gestione.",
    tags: ["Catalogo", "Carrello", "Pagamenti Stripe", "Drop & lanci"],
    Art: ArtShop,
  },
  {
    n: "04",
    title: "Digital Identity",
    short: "Identità visive digitali, coerenza grafica e presenza online.",
    text: "Colori, caratteri e linguaggio visivo che rendono un brand riconoscibile ovunque: sul sito, sui social e nei materiali digitali. Un'identità coerente, non un insieme di pezzi.",
    tags: ["Palette & tipografia", "Linee guida", "Kit social", "Coerenza grafica"],
    Art: ArtIdentity,
  },
];

export default function Services() {
  return (
    <section id="servizi" className="section tone-light services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead
          index="(01)"
          label="Servizi"
          id="services-title"
          title={["Quattro competenze,", "un unico progetto."]}
          aside={<p>Dalla strategia al codice, ogni parte del progetto nasce nello stesso studio. Per questo design, sviluppo e identità parlano la stessa lingua.</p>}
        />
        <div className="services__grid">
          {SERVICES.map(({ n, title, short, text, tags, Art }, i) => (
            <Reveal as="article" key={n} className="sv" delay={(i % 2) * 90} tabIndex={0} aria-labelledby={`sv-${n}`}>
              <div className="sv__top">
                <span className="sv__n mono">{n}</span>
                <span className="sv__line" aria-hidden="true" />
              </div>
              <div className="sv__art"><Art /></div>
              <h3 className="display h3 sv__title" id={`sv-${n}`}>{title}</h3>
              <p className="sv__short">{short}</p>
              <p className="sv__text">{text}</p>
              <ul className="sv__tags">
                {tags.map(t => <li key={t} className="mono">{t}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
