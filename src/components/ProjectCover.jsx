/* Copertina di un progetto: immagine reale se presente,
   altrimenti una composizione grafica generata dai colori del progetto */
import { asset } from "../data/projects.js";
import "./ProjectCover.css";

function hash(s) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const SHAPES = ["ring", "grid", "slab", "lines", "orb"];
const SCHEMES = [
  { bg: "#17181C", fg: "#F3F1EC", accent: "#2C46C4" },
  { bg: "#E8E4DC", fg: "#17181C", accent: "#2C46C4" },
  { bg: "#2C46C4", fg: "#F3F1EC", accent: "#17181C" },
  { bg: "#2F5D50", fg: "#F3F1EC", accent: "#E8E4DC" },
];

export default function ProjectCover({ project, eager = false, variant = "" }) {
  if (project.cover) {
    return (
      <img
        className="pcover__img"
        src={asset(project.cover)}
        alt={`Anteprima del sito ${project.title}`}
        width="1600"
        height="1000"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }
  // copertina con i colori del cliente (se mancano, una combinazione del portfolio)
  const h = hash(project.id);
  const c = project.colors || SCHEMES[h % SCHEMES.length];
  const a = SHAPES[h % SHAPES.length];
  const b = SHAPES[(h >> 5) % SHAPES.length];
  return (
    <div
      className={`pcover ${variant}`}
      style={{ "--c-bg": c.bg, "--c-fg": c.fg, "--c-ac": c.accent }}
      role="img"
      aria-label={`Copertina del progetto ${project.title}`}
    >
      <span className={`pcover__shape pcover__shape--${a}`} />
      {b !== a && <span className={`pcover__shape pcover__shape--${b}`} />}
      <span className="pcover__meta">
        <span>{project.number}</span>
        <span>{project.category}</span>
        <span>{project.year}</span>
      </span>
      <span className="pcover__title">{project.title}</span>
      <span className="pcover__grain" />
    </div>
  );
}
