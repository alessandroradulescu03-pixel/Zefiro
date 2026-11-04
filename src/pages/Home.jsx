import { useEffect } from "react";
import { site } from "../config/site.js";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Services from "../components/Services.jsx";
import Philosophy from "../components/Philosophy.jsx";
import WorkTeaser from "../components/WorkTeaser.jsx";
import ContactCTA from "../components/ContactCTA.jsx";

export default function Home() {
  useEffect(() => {
    document.title = `${site.name} — ${site.positioning}`;
  }, []);
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Philosophy />
      <WorkTeaser />
      <ContactCTA />
    </>
  );
}
