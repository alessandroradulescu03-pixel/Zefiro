/* Anteprima dei case study in home, con mockup su sfondo scuro */
import { useApp } from "../lib/app-context.js";
import { allProjects, TYPE_LABEL } from "../data/projects.js";
import ProjectMockup from "./ProjectMockup.jsx";
import { Button, Reveal, SectionHead } from "./ui.jsx";
import "./WorkTeaser.css";

export default function WorkTeaser() {
  const { go } = useApp();
  const list = allProjects.filter(p => p.featured !== false).slice(0, 3);
  const open = (e, p) => {
    e.preventDefault();
    go(`/work/${p.id}`, { title: p.title });
  };
  return (
    <section className="teaser tone-dark" aria-labelledby="teaser-title">
      <div className="container">
        <SectionHead
          index="06"
          label="Case studies"
          meta={`${String(allProjects.length).padStart(2, "0")} progetti`}
          id="teaser-title"
          title={["Selected", <span key="w">works<span className="lime">.</span></span>]}
          aside={<p>A selection of ideas turned into digital experiences.</p>}
        />
        <div className="teaser__grid">
          {list.map((p, i) => (
            <Reveal as="article" key={p.id} delay={i * 90} className={`tcard tcard--${i}`}>
              <a href={`#/work/${p.id}`} onClick={e => open(e, p)} data-cursor="View">
                <div className="tcard__media">
                  <ProjectMockup project={p} layout={i === 1 ? "phone" : "duo"} />
                </div>
                <div className="tcard__meta">
                  <span className="mono tcard__n">{p.number}</span>
                  <span className="label">{p.category}</span>
                  <span className="label tcard__type">{TYPE_LABEL[p.type]}</span>
                </div>
                <h3 className="tcard__title display">{p.title} <span className="tcard__arrow" aria-hidden="true">→</span></h3>
              </a>
            </Reveal>
          ))}
        </div>
        <div className="teaser__cta">
          <span className="label">Altri progetti, concept e demo</span>
          <Button href="#/work" onClick={e => { e.preventDefault(); go("/work", { title: "Case studies" }); }}>All case studies</Button>
        </div>
      </div>
    </section>
  );
}
