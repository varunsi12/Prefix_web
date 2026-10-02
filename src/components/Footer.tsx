import { Link } from 'react-router';
import { Logo } from './Logo';
import { site } from '../config/site';
import { track } from '../lib/analytics';
import styles from './Footer.module.css';

export function Footer() {
  const year = __BUILD_YEAR__;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tag}>Find something you want to do. Find people to do it with.</p>
        </div>

        <nav aria-label="Footer" className={styles.cols}>
          <ul className={styles.list}>
            <li>
              <a href="/#about">About</a>
            </li>
            {site.contactEmail && (
              <li>
                <a href={`mailto:${site.contactEmail}`}>Contact</a>
              </li>
            )}
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
          </ul>

          {(site.social.instagram || site.social.tiktok) && (
            <ul className={styles.list}>
              {site.social.instagram && (
                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener"
                    onClick={() => track({ name: 'outbound_social', props: { network: 'instagram' } })}
                  >
                    Instagram
                  </a>
                </li>
              )}
              {site.social.tiktok && (
                <li>
                  <a
                    href={site.social.tiktok}
                    target="_blank"
                    rel="noopener"
                    onClick={() => track({ name: 'outbound_social', props: { network: 'tiktok' } })}
                  >
                    TikTok
                  </a>
                </li>
              )}
            </ul>
          )}
        </nav>
      </div>

      <div className={`container ${styles.legal}`}>
        <p>© {year} Pre:Fix</p>
        <p className={styles.region}>Launching first in {site.launchRegion}.</p>
      </div>
    </footer>
  );
}
