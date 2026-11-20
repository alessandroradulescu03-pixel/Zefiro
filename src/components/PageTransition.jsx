/* Transizione tra pagine: due pannelli (blu e navy) coprono e scoprono lo schermo */
import { Symbol } from "./Logo.jsx";
import "./PageTransition.css";

export default function PageTransition({ phase, label }) {
  return (
    <div className={`ptrans is-${phase}`} aria-hidden="true">
      <div className="ptrans__p ptrans__p--blue" />
      <div className="ptrans__p ptrans__p--main">
        <div className="ptrans__in">
          <Symbol className="ptrans__sym" />
          <span className="ptrans__label">{label}</span>
        </div>
      </div>
    </div>
  );
}
