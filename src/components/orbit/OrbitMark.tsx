import { OrbitSystem } from './OrbitSystem';
import { useInView } from '../../lib/motion';
import styles from './OrbitMark.module.css';

interface OrbitMarkProps {
  /** 'vertical' echoes the app icon's stacked arrangement; 'horizontal' echoes the hero. */
  orientation?: 'vertical' | 'horizontal';
  /** CSS size of one orbit system. */
  size?: string;
  className?: string;
}

/**
 * Two orbit systems that slide together and glow once scrolled into view.
 * Pure CSS transitions — the only JS is a one-shot IntersectionObserver.
 */
export function OrbitMark({ orientation = 'vertical', size = 'clamp(150px, 24vw, 230px)', className }: OrbitMarkProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const cls = [styles.mark, styles[orientation], inView && styles.joined, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={cls} style={{ '--size': size } as React.CSSProperties} aria-hidden="true">
      <div className={styles.glow} />
      <div className={`${styles.system} ${styles.a}`}>
        <OrbitSystem tone="warm" size="100%" />
      </div>
      <div className={`${styles.system} ${styles.b}`}>
        <OrbitSystem tone="cool" size="100%" />
      </div>
    </div>
  );
}
