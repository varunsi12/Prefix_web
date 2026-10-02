import { Reveal } from '../components/Reveal';
import { site } from '../config/site';
import styles from './About.module.css';

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.head}>
          <p className="eyebrow">About</p>
          <h2 id="about-title">The idea behind Pre:Fix</h2>
        </Reveal>

        <Reveal className={styles.body} delay={80}>
          <p className={styles.big}>
            People are multidimensional, but most social products force connection into separate categories — a date
            here, a friend there, a contact somewhere else.
          </p>
          <p>
            Pre:Fix starts with a shared real-world experience and lets the relationship develop naturally. The
            concert, the museum, the Tuesday-night comedy show — that’s the context. Who it becomes is up to you.
          </p>
          <p>
            We’re starting in {site.launchRegion}, building a real local community one connection at a time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
