import { useEffect } from "react";
import { site } from "../config/site.js";
import Projects from "../components/Projects.jsx";
import CtaBand from "../components/CtaBand.jsx";

export default function ProjectsPage() {
  useEffect(() => {
    document.title = `Progetti — ${site.name}`;
  }, []);
  return (
    <>
      <Projects page />
      <CtaBand secondary={{ to: "/servizi", label: "Scopri i servizi" }} />
    </>
  );
}
