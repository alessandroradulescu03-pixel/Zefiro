/* Transizione tra pagine: due pannelli (lime + carbone) coprono e scoprono lo schermo */
import "./PageTransition.css";

export default function PageTransition({ phase, label }) {
  return (
    <div className={`ptrans is-${phase}`} aria-hidden="true">
      <div className="ptrans__p ptrans__p--lime" />
      <div className="ptrans__p ptrans__p--main">
        <span className="ptrans__label">{label}</span>
      </div>
    </div>
  );
}
