import icon from '../assets/brand/prefix-icon.png';
import styles from './Logo.module.css';

interface LogoProps {
  /** Link target. Defaults to the home page. */
  href?: string;
  /** Hide the wordmark and show only the icon. */
  iconOnly?: boolean;
  className?: string;
}

/**
 * Brand lockup: the supplied app icon (unmodified) + "Pre:Fix" wordmark.
 * Replace src/assets/brand/prefix-icon.png with a higher-resolution export when
 * available — nothing else needs to change.
 */
export function Logo({ href = '/', iconOnly = false, className }: LogoProps) {
  return (
    <a href={href} className={[styles.logo, className].filter(Boolean).join(' ')} aria-label="Pre:Fix home">
      <img src={icon} alt="" width={32} height={32} className={styles.icon} decoding="async" />
      {!iconOnly && (
        <span className={styles.wordmark} aria-hidden="true">
          Pre<span className={styles.colon}>:</span>Fix
        </span>
      )}
    </a>
  );
}
