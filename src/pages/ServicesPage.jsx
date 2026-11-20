import { useEffect } from "react";
import { site } from "../config/site.js";
import Services from "../components/Services.jsx";
import Method from "../components/Method.jsx";
import CtaBand from "../components/CtaBand.jsx";

export default function ServicesPage() {
  useEffect(() => {
    document.title = `Servizi — ${site.name}`;
  }, []);
  return (
    <>
      <Services page />
      <Method />
      <CtaBand secondary={{ to: "/progetti", label: "Guarda i progetti" }} />
    </>
  );
}
