import { useEffect } from "react";
import { site } from "../config/site.js";
import Projects from "../components/Projects.jsx";

export default function ProjectsPage() {
  useEffect(() => {
    document.title = `Progetti — ${site.name}`;
  }, []);
  return <Projects page />;
}
