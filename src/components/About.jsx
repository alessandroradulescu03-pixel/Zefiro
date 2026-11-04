/* Chi sono: ritratto fisso a sinistra, testo e dati a destra,
   competenze come tabella svizzera, metodo come linea del tempo. */
import { site } from "../config/site.js";
import { allProjects, asset } from "../data/projects.js";
import { useReveal } from "../hooks/useMotion.js";
import { Reveal, SectionHead } from "./ui.jsx";
import "./About.css";

const SKILLS = [
  ["HTML", "Struttura"],
  ["CSS", "Stile e layout"],
  ["JavaScript", "Interazione"],
  ["PHP", "Lato server"],
  ["WordPress", "CMS"],
  ["MySQL", "Database"],
  ["GitHub", "Versioni e deploy"],
];
const PROCESS = [
  { n: "01", t: "Discover", d: "Studio l'attività, il suo pubblico e i concorrenti. Il sito parte da cosa vendi e a chi.", icon: "discover" },
  { n: "02", t: "Design", d: "Definisco identità visiva, struttura e percorsi, a partire dalla versione per smartphone.", icon: "design" },
  { n: "03", t: "Develop", d: "Sviluppo codice pulito e leggero, con animazioni che hanno uno scopo e tempi di caricamento rapidi.", icon: "develop" },
  { n: "04", t: "Deliver", d: "Pubblico il sito, controllo ogni dettaglio su più dispositivi e ti consegno tutto il necessario.", icon: "deliver" },
];

function ProcessIcon({ type }) {
  return (
    <span className={`picon picon--${type}`} aria-hidden="true">
      <i /><i />
    </span>
  );
}

export default function About() {
  const ring = "Independent Digital Developer • " + site.city + " • The Digital Signature • ";
  const [tl, tlIn] = useReveal();
  const stats = [
    [String(allProjects.length).padStart(2, "0"), "progetti nel portfolio"],
    [String(SKILLS.length).padStart(2, "0"), "tecnologie nello stack"],
    ["01", "persona, dall'idea alla pubblicazione"],
  ];

  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead
          index="01"
          label="Chi sono"
          meta={`${site.name} — ${site.city}`}
          id="about-title"
          title={["The person", "behind the", <span key="p">pixels<span className="lime">.</span></span>]}
        />

        <div className="about__grid">
          <div className="about__left">
            <figure className="about__fig">
              <div className="about__photo">
                {site.photo ? (
                  <img src={asset(site.photo)} alt={`Ritratto di ${site.name}`} loading="lazy" decoding="async" width="900" height="1125" />
                ) : (
                  <div className="about__mono" role="img" aria-label={`Monogramma di ${site.name}`}>
                    <span className="about__mono-a">{site.monogram}</span>
                    <span className="about__mono-grid" aria-hidden="true" />
                  </div>
                )}
              </div>
              <figcaption>
                <span className="label">Fig. 02 — {site.photo ? "Ritratto" : "Monogramma"}</span>
                <span className="label">{site.coords}</span>
              </figcaption>
              <div className="about__badge" aria-hidden="true">
                <svg viewBox="0 0 200 200">
                  <defs><path id="ring" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
                  <text><textPath href="#ring">{ring}</textPath></text>
                </svg>
                <b>{site.monogram}</b>
              </div>
            </figure>
          </div>

          <div className="about__right">
            <Reveal as="p" className="about__lead">
              Sono uno sviluppatore web appassionato di design, tecnologia e comunicazione digitale. <span className="about__muted">Mi piace progettare e sviluppare esperienze online capaci di valorizzare le attività, raccontarne l'identità e trasformare un'idea in qualcosa di concreto.</span>
            </Reveal>

            <Reveal className="about__stats" delay={100}>
              {stats.map(([n, l]) => (
                <div key={l}>
                  <span className="about__num">{n}</span>
                  <span className="label">{l}</span>
                </div>
              ))}
            </Reveal>

            <Reveal as="dl" className="about__facts" delay={160}>
              <div><dt>Base</dt><dd>{site.city}, {site.country}</dd></div>
              <div><dt>Focus</dt><dd>Web design &amp; development</dd></div>
              <div><dt>Stato</dt><dd><i className="about__dot" aria-hidden="true" />{site.available ? "Disponibile per nuovi progetti" : "Agenda piena al momento"}</dd></div>
            </Reveal>
          </div>
        </div>

        <div className="skills">
          <div className="skills__head">
            <span className="shead__idx mono">(02)</span>
            <span className="label">Skills / Stack</span>
          </div>
          <ul className="skills__grid">
            {SKILLS.map(([s, k], i) => (
              <Reveal as="li" key={s} delay={i * 50} className="skill">
                <span className="skill__n mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="skill__name">{s}</span>
                <span className="skill__k label">{k}</span>
              </Reveal>
            ))}
            <li className="skill skill--note" aria-hidden="true">
              <span className="label">Sempre in aggiornamento</span>
              <span className="skill__plus">+</span>
            </li>
          </ul>
        </div>

        <div className="process">
          <div className="skills__head">
            <span className="shead__idx mono">(03)</span>
            <span className="label">Il mio metodo</span>
            <p className="process__intro">Quattro fasi, sempre le stesse. Così sai in ogni momento a che punto siamo.</p>
          </div>
          <div ref={tl} className={`process__track ${tlIn ? "is-in" : ""}`}>
          <span className="process__line" aria-hidden="true" />
          <ol className="process__list">
            {PROCESS.map((p, i) => (
              <li key={p.n} className="process__item" style={{ "--i": i }}>
                <span className="process__node" aria-hidden="true" />
                <span className="process__n mono">{p.n}</span>
                <ProcessIcon type={p.icon} />
                <h3 className="process__t">{p.t}</h3>
                <p>{p.d}</p>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
