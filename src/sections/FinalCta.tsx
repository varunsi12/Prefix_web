import { Reveal } from '../components/Reveal';
import { GetAppButton } from '../components/GetAppButton';
import { OrbitMark } from '../components/orbit/OrbitMark';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className={styles.section} aria-labelledby="final-title">
      <div className={`container ${styles.inner}`}>
        <OrbitMark orientation="vertical" className={styles.mark} />

        <Reveal className={styles.copy}>
          <p className={styles.kicker}>
            Something you’d love to do?
            <br />
            Don’t wait for someone to suggest it.
          </p>
          <h2 id="final-title" className={styles.title}>
            Find your people.
            <br />
            <em className="accent">Go together.</em>
          </h2>
          <div className={styles.cta}>
            <GetAppButton location="final" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
