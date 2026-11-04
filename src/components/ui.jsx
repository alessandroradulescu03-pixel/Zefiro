/* Componenti di base riutilizzabili: pulsanti, reveal, testo diviso in righe, icone */
import { createElement } from "react";
import { useMagnetic, useReveal } from "../hooks/useMotion.js";
import "./ui.css";

export const Icon = {
  arrow: (
    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  ),
  out: (
    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  ),
  down: (
    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 4v16M6 14l6 6 6-6" />
    </svg>
  ),
  up: (
    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 20V4M6 10l6-6 6 6" />
    </svg>
  ),
};

/* Pulsante con testo che rotola e attrazione magnetica.
   href esterno → <a target=_blank>; onClick senza href → <button>; disabled → <span> non cliccabile */
export function Button({ children, href, onClick, variant = "lime", size = "", icon = "arrow", external = false, disabled = false, type = "button", className = "", ...rest }) {
  const mag = useMagnetic(0.25);
  const cls = `btn btn--${variant} ${size ? "btn--" + size : ""} ${className}`;
  const inner = (
    <>
      <span className="btn__roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon && Icon[icon]}
    </>
  );
  if (disabled)
    return (
      <span className={`${cls} is-disabled`} aria-disabled="true" {...rest}>
        <span className="btn__roll"><span>{children}</span></span>
      </span>
    );
  if (href)
    return (
      <a ref={mag} className={cls} href={href} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {inner}
        {external && <span className="sr-only"> (si apre in una nuova scheda)</span>}
      </a>
    );
  return (
    <button ref={mag} className={cls} type={type} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}

export function Reveal({ as = "div", className = "", delay = 0, style, children, ...rest }) {
  const [ref, inView] = useReveal();
  return createElement(as, { ref, className: `reveal ${inView ? "is-in" : ""} ${className}`, style: { ...style, "--d": `${delay}ms` }, ...rest }, children);
}

/* Titolo diviso in righe che salgono una dopo l'altra.
   lines: array di stringhe o nodi. Parte quando il genitore ha .is-in o .is-ready */
export function SplitLines({ as = "h2", lines, className = "", lineClass = [], ...rest }) {
  return createElement(
    as,
    { className: `split ${className}`, ...rest },
    lines.map((l, i) => (
      <span className={`split__line ${lineClass[i] || ""}`} key={i}>
        <span className="split__in" style={{ "--i": i }}>{l}</span>
      </span>
    ))
  );
}

export function Label({ children, className = "", ...rest }) {
  return <span className={`label ${className}`} {...rest}>{children}</span>;
}

/* Intestazione di sezione in stile editoriale svizzero:
   regola che si disegna, indice "(01)", etichetta, meta a destra,
   titolo monumentale e un testo a margine allineato al fondo. */
export function SectionHead({ index, label, meta = "", title, as = "h2", id, aside, className = "" }) {
  const [ref, inView] = useReveal();
  return (
    <header ref={ref} className={`shead ${inView ? "is-in" : ""} ${className}`}>
      <span className="shead__rule" aria-hidden="true" />
      <div className="shead__meta">
        <span className="shead__idx mono">({index})</span>
        <span className="label">{label}</span>
        {meta && <span className="label shead__right">{meta}</span>}
      </div>
      <SplitLines as={as} id={id} className="display shead__title" lines={title} lineClass={title.map((_, i) => (i % 2 ? "shead__indent" : ""))} />
      {aside && <div className="shead__aside">{aside}</div>}
    </header>
  );
}
