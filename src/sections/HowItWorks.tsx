import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { PhoneShot } from '../components/PhoneShot';
import { OrbitMark } from '../components/orbit/OrbitMark';
import { screenshots, type Screenshot } from '../config/screenshots';
import styles from './HowItWorks.module.css';

interface Step {
  n: string;
  title: string;
  body: string;
  /** Real screenshot for this step. Leave undefined until one exists — never mock UI. */
  shot?: Screenshot;
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Discover',
    body: 'Find events and local places that fit your interests.',
    shot: screenshots.interests,
  },
  {
    n: '02',
    title: 'Signal',
    body: 'Let people know you’d like to go.',
    shot: screenshots.discoverEvent,
  },
  {
    n: '03',
    title: 'Connect',
    body: 'Pair up with someone or join a group.',
    shot: screenshots.profile,
  },
  {
    n: '04',
    title: 'Go',
    body: 'Chat, make plans, and turn the connection into real life.',
    // TODO(screenshots): add a chat / plans screenshot here when available.
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section} aria-labelledby="how-title">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="how-title"
            eyebrow="How it works"
            title="Discover. Connect. Go together."
            lede="Pre:Fix starts with the thing you want to do, then helps you find the people to do it with."
          />
        </Reveal>

        <ol className={styles.steps}>
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.n} className={styles.step} delay={i * 90}>
              <div className={styles.window}>
                {step.shot ? (
                  <PhoneShot shot={step.shot} className={styles.shot} sizes="(min-width: 1024px) 230px, (min-width: 640px) 38vw, 125px" />
                ) : (
                  <div className={styles.glyph}>
                    <OrbitMark orientation="horizontal" size="clamp(90px, 10vw, 120px)" />
                    <p className={styles.glyphCaption}>
                      Chat <span aria-hidden="true">·</span> Make plans <span aria-hidden="true">·</span> Meet up
                    </p>
                  </div>
                )}
              </div>
              <div className={styles.text}>
                <span className={styles.num} aria-hidden="true">
                  {step.n}
                </span>
                <h3 className={styles.stepTitle}>
                  <span className="visually-hidden">Step {Number(step.n)}: </span>
                  {step.title}
                </h3>
                <p className={styles.body}>{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
