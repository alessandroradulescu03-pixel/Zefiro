/* Contatti: titolo, recapiti e modulo reale. Usato in home e nella pagina /contatti */
import { site } from "../config/site.js";
import ContactForm from "./ContactForm.jsx";
import { Reveal, SplitLines } from "./ui.jsx";
import { useReveal } from "../hooks/useMotion.js";
import "./Contact.css";

export default function Contact({ page = false }) {
  const [ref, inView] = useReveal();
  const socials = [
    ["Instagram", site.socials.instagram],
    ["LinkedIn", site.socials.linkedin],
  ].filter(([, url]) => url);

  return (
    <section id="contatti" className={`section tone-dark contact ${page ? "contact--page" : ""}`} aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div ref={ref} className={`contact__head ${inView ? "is-in" : ""}`}>
          <p className="label contact__idx"><span className="mono">{page ? "Contatti" : "(05)"}</span> — Nuovo progetto</p>
          <SplitLines
            as={page ? "h1" : "h2"}
            id="contact-title"
            className="display h2 contact__title"
            lines={["Il prossimo progetto", "potrebbe iniziare qui."]}
          />
          <p className="contact__lead">
            Raccontaci la tua attività e cosa vorresti ottenere. Leggiamo ogni richiesta con attenzione e ti rispondiamo per email con i prossimi passi.
          </p>
          <dl className="contact__facts">
            <div>
              <dt className="label">Email</dt>
              <dd><a href={`mailto:${site.email}`}>{site.email}</a></dd>
            </div>
            <div>
              <dt className="label">Sede</dt>
              <dd>{site.city}, {site.country}</dd>
            </div>
            {socials.length > 0 && (
              <div>
                <dt className="label">Social</dt>
                <dd className="contact__social">
                  {socials.map(([n, url]) => <a key={n} href={url} target="_blank" rel="noopener noreferrer">{n}</a>)}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <Reveal className="contact__form" delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
