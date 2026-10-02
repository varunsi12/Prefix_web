import { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { track } from '../lib/analytics';
import styles from './EventsPlaces.module.css';

type Mode = 'event' | 'place';

const COPY: Record<Mode, { label: string; explain: string }> = {
  event: {
    label: 'Event',
    explain: 'The date is already set. Signal you want to go, then pair up or join a group heading there.',
  },
  place: {
    label: 'Place',
    explain: 'No date yet — just somewhere you’ve been meaning to try. Find someone who wants to go, then pick a time together.',
  },
};

export function EventsPlaces() {
  const [mode, setMode] = useState<Mode>('event');
  const select = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    track({ name: 'events_places_toggle', props: { mode: m } });
  };

  return (
    <section id="events-and-places" className={styles.section} aria-labelledby="ep-title">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="ep-title"
            eyebrow="Events & places"
            title="Plans can start with an event — or just a place."
            lede="Some experiences already have a date. Others start with a place you’ve been wanting to try. Pre:Fix helps you find people for both."
          />
        </Reveal>

        <Reveal className={styles.controls} delay={80}>
          <div className={styles.segmented} role="group" aria-label="Choose an example">
            {(Object.keys(COPY) as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                className={styles.segment}
                aria-pressed={mode === m}
                onClick={() => select(m)}
              >
                {COPY[m].label}
              </button>
            ))}
          </div>
          <p className={styles.explain} aria-live="polite">
            {COPY[mode].explain}
          </p>
        </Reveal>

        <div className={styles.cards}>
          {/* EVENT */}
          <Reveal delay={120}>
            <article
              className={`${styles.card} ${mode === 'event' ? styles.active : ''}`}
              onClick={() => select('event')}
              aria-label="Example event: Comedy Night, Saturday at 8 PM"
            >
              <header className={styles.cardHead}>
                <span className={styles.kind}>
                  <CalendarGlyph /> Event
                </span>
                <span className={styles.tag}>Date is set</span>
              </header>
              <h3 className={styles.cardTitle}>Comedy Night</h3>
              <p className={styles.meta}>Saturday · 8 PM</p>
              <div className={styles.pills} aria-hidden="true">
                <span className={`${styles.pill} ${styles.pillPrimary}`}>Pair Up</span>
                <span className={styles.pill}>Join Group</span>
              </div>
            </article>
          </Reveal>

          {/* PLACE */}
          <Reveal delay={200}>
            <article
              className={`${styles.card} ${mode === 'place' ? styles.active : ''}`}
              onClick={() => select('place')}
              aria-label="Example place: Local Museum, 18 people want to go"
            >
              <header className={styles.cardHead}>
                <span className={styles.kind}>
                  <PinGlyph /> Place
                </span>
                <span className={styles.tag}>You pick the time</span>
              </header>
              <h3 className={styles.cardTitle}>Local Museum</h3>
              <p className={styles.meta}>
                <span className={styles.dots} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                18 people want to go
              </p>
              <div className={styles.pills} aria-hidden="true">
                <span className={`${styles.pill} ${styles.pillPrimary}`}>Find Someone</span>
                <span className={styles.pill}>Join Group</span>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CalendarGlyph() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function PinGlyph() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
