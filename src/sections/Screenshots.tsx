import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { PhoneShot } from '../components/PhoneShot';
import { screenshots, type Screenshot } from '../config/screenshots';
import styles from './Screenshots.module.css';

interface Frame {
  shot: Screenshot;
  caption: string;
  detail: string;
}

/**
 * Real screens only. Order tells the story: set up → discover & signal → see
 * who's going → go deeper. Add chat / plans screens here as they become
 * available (see src/config/screenshots.ts).
 */
const FRAMES: Frame[] = [
  {
    shot: screenshots.interests,
    caption: 'Say what you’re into',
    detail: 'Interests and values shape what you see.',
  },
  {
    shot: screenshots.discoverEvent,
    caption: 'Find something worth going to',
    detail: 'Signal interest, then Pair Up or Join a Group.',
  },
  {
    shot: screenshots.profile,
    caption: 'See who else wants to go',
    detail: 'Real people, verified profiles.',
  },
  {
    shot: screenshots.values,
    caption: 'Go deeper than a bio',
    detail: 'Values help the right people find each other.',
  },
];

export function Screenshots() {
  return (
    <section className={styles.section} aria-labelledby="shots-title">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="shots-title"
            eyebrow="Inside the app"
            title="From “I want to go” to “see you there.”"
            lede="A look at how plans come together in Pre:Fix — from what you’re into, to who you’re going with."
          />
        </Reveal>
      </div>

      <div className={styles.rail} tabIndex={0} aria-label="App screenshots, scroll horizontally">
        <ol className={`container ${styles.track}`}>
          {FRAMES.map((f, i) => (
            <Reveal as="li" key={f.caption} className={styles.frame} delay={i * 80}>
              <PhoneShot shot={f.shot} sizes="(min-width: 1024px) 260px, (min-width: 640px) 40vw, 68vw" />
              <div className={styles.caption}>
                <strong>{f.caption}</strong>
                <span>{f.detail}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
