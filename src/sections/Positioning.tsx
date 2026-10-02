import { Reveal } from '../components/Reveal';
import styles from './Positioning.module.css';

const INTENTS = ['Friendship', 'Dating', 'Networking', 'New experiences'] as const;

export function Positioning() {
  return (
    <section className={styles.section} aria-labelledby="pos-title">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className="eyebrow">Open to more than one thing</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="pos-title" className={styles.title}>
            Start with something you actually want to do.
          </h2>
        </Reveal>

        <Reveal as="ul" className={styles.intents} delay={120} aria-label="Kinds of connection people are open to">
          {INTENTS.map((intent) => (
            <li key={intent} className={styles.intent}>
              <span className={styles.dot} aria-hidden="true" />
              {intent}
            </li>
          ))}
        </Reveal>

        <Reveal delay={180}>
          <p className={`lede ${styles.body}`}>
            People don’t fit into one box. Pre:Fix starts with shared intent and gives the connection room to become
            whatever feels natural.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
