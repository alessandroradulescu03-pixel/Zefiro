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
    <section className="container" style={{ minHeight: "90svh", display: "grid", alignContent: "center", gap: 24, paddingBlock: "140px 80px" }}>
      <span className="label label--lime">Error 404</span>
      <h1 className="display" style={{ fontSize: "clamp(80px, 20vw, 320px)" }}>
        Lost<span className="lime">.</span>
      </h1>
      <p style={{ margin: 0, color: "var(--muted)", maxWidth: "40ch" }}>Questa pagina non esiste o il progetto è stato rinominato.</p>
      <div>
        <Button href="#/work" onClick={e => { e.preventDefault(); go("/work", { title: "Case studies" }); }}>Back to case studies</Button>
      </div>
    </section>
  );
}
