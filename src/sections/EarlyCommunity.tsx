import { Reveal } from '../components/Reveal';
import { GetAppButton } from '../components/GetAppButton';
import { InviteCode } from '../components/InviteCode';
import { GET_APP_ANCHOR, site } from '../config/site';
import styles from './EarlyCommunity.module.css';

export function EarlyCommunity() {
  const invite = site.features.inviteCodes;

  return (
    <section id={GET_APP_ANCHOR} className={styles.section} aria-labelledby="community-title">
      <div className="container">
        <Reveal className={styles.panel}>
          <div className={styles.copy}>
            <p className="eyebrow">Early community</p>
            <h2 id="community-title">We’re starting local.</h2>
            <p className="lede">
              Pre:Fix is building its founding {site.launchRegionShort} community one real connection at a time.
            </p>
            <div className={styles.cta}>
              <GetAppButton location="community" fallback="disabled" />
              {!site.appStoreUrl && (
                <p className={styles.ctaNote}>iOS first. {invite ? 'Early access is by invite while we grow locally.' : ''}</p>
              )}
            </div>
          </div>

          {invite && (
            <div className={styles.invite}>
              <InviteCode location="community" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
