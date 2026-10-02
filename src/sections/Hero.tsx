import { GetAppButton } from '../components/GetAppButton';
import { Button } from '../components/Button';
import { OrbitField } from '../components/orbit/OrbitField';
import { site } from '../config/site';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line}>Find something you want to do.</span>
            <span className={styles.line}>
              Find <em className="accent">people</em> to do it with.
            </span>
          </h1>
          <p className={`lede ${styles.lede}`}>
            Discover events and places around you, connect with people who want to go, and make plans in real life.
          </p>
          <div className={styles.actions}>
            <GetAppButton location="hero" />
            <Button href="#how-it-works" variant="ghost" size="lg">
              See how it works
              <span aria-hidden="true" className={styles.arrow}>
                ↓
              </span>
            </Button>
          </div>
          <p className={styles.note}>Launching first in {site.launchRegion}.</p>
        </div>

        <div className={styles.visual}>
          <OrbitField />
        </div>
      </div>
    </section>
  );
}
