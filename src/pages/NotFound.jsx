import { useEffect } from "react";
import { useApp } from "../lib/app-context.js";
import { site } from "../config/site.js";
import { Button } from "../components/ui.jsx";

export default function NotFound() {
  const { go } = useApp();
  useEffect(() => {
    document.title = `Pagina non trovata — ${site.name}`;
  }, []);
  return (
    <section className="tone-dark nf">
      <div className="container" style={{ minHeight: "100svh", display: "grid", alignContent: "center", gap: 24, paddingBlock: "140px 80px" }}>
        <span className="label label--accent">Errore 404</span>
        <h1 className="display h1" style={{ maxWidth: "14ch" }}>
          Questa pagina è volata via<span className="accent">.</span>
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "40ch" }}>L'indirizzo non esiste o il progetto è stato rinominato.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Button href="#/" onClick={e => { e.preventDefault(); go("/", { title: "Home" }); }}>Torna alla home</Button>
          <Button variant="ghost" href="#/progetti" onClick={e => { e.preventDefault(); go("/progetti", { title: "Progetti" }); }}>Vedi i progetti</Button>
        </div>
      </div>
    </section>
  );
}
