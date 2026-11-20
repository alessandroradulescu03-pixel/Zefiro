import { useEffect } from "react";
import { site } from "../config/site.js";
import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import Method from "../components/Method.jsx";
import Projects from "../components/Projects.jsx";
import Studio from "../components/Studio.jsx";
import Contact from "../components/Contact.jsx";

export default function Home() {
  useEffect(() => {
    document.title = `${site.name} — Web Design & Development a ${site.city}`;
  }, []);
  return (
    <>
      <Hero />
      <Services />
      <Method />
      <Projects />
      <Studio />
      <Contact />
    </>
  );
}
