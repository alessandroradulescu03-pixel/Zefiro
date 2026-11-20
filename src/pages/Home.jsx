import { useEffect } from "react";
import { site } from "../config/site.js";
import Hero from "../components/Hero.jsx";
import ServicesTeaser from "../components/ServicesTeaser.jsx";
import Projects from "../components/Projects.jsx";
import CtaBand from "../components/CtaBand.jsx";

export default function Home() {
  useEffect(() => {
    document.title = `${site.name} — Web Design & Development a ${site.city}`;
  }, []);
  return (
    <>
      <Hero />
      <ServicesTeaser />
      <Projects />
      <CtaBand secondary={{ to: "/studio", label: "Scopri lo studio" }} />
    </>
  );
}
