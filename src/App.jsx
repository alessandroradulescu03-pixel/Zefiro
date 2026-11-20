import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { HashRouter, MemoryRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "./lib/app-context.js";
import { initSmooth, scrollToTarget, lockScroll } from "./lib/smooth.js";
import { useReducedMotion } from "./hooks/useMotion.js";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./components/ProjectDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

/* vecchi indirizzi del portfolio (#/work/..., #/contact): restano validi */
function LegacyProject() {
  const { id } = useParams();
  return <Navigate to={`/progetti/${id}`} replace />;
}

/* HashRouter: indirizzi tipo #/progetti/padania-tuning, perfetti su GitHub Pages.
   Se il browser non permette di cambiare l'indirizzo (anteprime incorporate), usa la memoria. */
function canUseHistory() {
  try {
    window.history.replaceState(window.history.state, "");
    return true;
  } catch {
    return false;
  }
}

function Shell() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(true);
  const [phase, setPhase] = useState("idle"); // idle → cover → reveal
  const [label, setLabel] = useState("");
  const busy = useRef(false);

  useEffect(() => initSmooth(reduced), [reduced]);

  /* posizione dopo un cambio pagina */
  useLayoutEffect(() => {
    const section = location.state && location.state.section;
    if (section) requestAnimationFrame(() => scrollToTarget(section, { immediate: true }));
    else scrollToTarget(0, { immediate: true });
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = useCallback(
    (to, { section, title = "", data } = {}) => {
      if (busy.current) return;
      const state = section || data ? { section, data } : null;
      if (reduced) {
        navigate(to, { state });
        return;
      }
      busy.current = true;
      setLabel(title);
      setPhase("cover");
      lockScroll(true);
      setTimeout(() => {
        navigate(to, { state });
        lockScroll(false);
        setPhase("reveal");
        setTimeout(() => {
          setPhase("idle");
          busy.current = false;
        }, 900);
      }, 750);
    },
    [navigate, reduced]
  );

  /* navigazione dai menu: { to, section, label } */
  const navTo = useCallback(
    ({ to = "/", section, label = "" }) => {
      if (location.pathname === to) {
        scrollToTarget(section || 0);
      } else {
        go(to, { section, title: label });
      }
    },
    [go, location.pathname]
  );
  const goSection = useCallback(id => navTo({ to: "/", section: id === "home" ? undefined : id, label: "Home" }), [navTo]);

  const ctx = useMemo(() => ({ ready, setReady, go, goSection, navTo }), [ready, go, goSection, navTo]);

  return (
    <AppContext.Provider value={ctx}>
      <a className="skip-link" href="#main" onClick={e => { e.preventDefault(); const m = document.getElementById("main"); m && m.focus(); scrollToTarget("main", { immediate: true }); }}>
        Vai al contenuto
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progetti" element={<ProjectsPage />} />
          <Route path="/progetti/:id" element={<ProjectDetail />} />
          <Route path="/contatti" element={<ContactPage />} />
          <Route path="/work" element={<Navigate to="/progetti" replace />} />
          <Route path="/work/:id" element={<LegacyProject />} />
          <Route path="/contact" element={<Navigate to="/contatti" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <PageTransition phase={phase} label={label} />
    </AppContext.Provider>
  );
}

export default function App() {
  const Router = canUseHistory() ? HashRouter : MemoryRouter;
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Shell />
    </Router>
  );
}
