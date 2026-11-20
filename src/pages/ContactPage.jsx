import { useEffect } from "react";
import { site } from "../config/site.js";
import Contact from "../components/Contact.jsx";

export default function ContactPage() {
  useEffect(() => {
    document.title = `Contatti — ${site.name}`;
  }, []);
  return <Contact page />;
}
