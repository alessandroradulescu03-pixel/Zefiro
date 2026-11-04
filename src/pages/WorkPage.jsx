import { useEffect } from "react";
import { site } from "../config/site.js";
import ProjectGallery from "../components/ProjectGallery.jsx";

export default function WorkPage() {
  useEffect(() => {
    document.title = `Case studies — ${site.name}`;
  }, []);
  return <ProjectGallery page />;
}
