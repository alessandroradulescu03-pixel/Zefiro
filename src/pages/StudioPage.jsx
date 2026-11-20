import { useEffect } from "react";
import { site } from "../config/site.js";
import Studio from "../components/Studio.jsx";
import CtaBand from "../components/CtaBand.jsx";

export default function StudioPage() {
  useEffect(() => {
    document.title = `Studio — ${site.name}`;
  }, []);
  return (
    <>
      <Studio page />
      <CtaBand secondary={{ to: "/progetti", label: "Guarda i progetti" }} />
    </>
  );
}
