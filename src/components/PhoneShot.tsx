import type { Screenshot } from '../config/screenshots';
import styles from './PhoneShot.module.css';

interface PhoneShotProps {
  shot: Screenshot;
  /** Hero-adjacent images should be eager; everything below the fold lazy. */
  priority?: boolean;
  /** `sizes` hint so the browser picks the 320w, 480w or 720w variant. */
  sizes?: string;
  className?: string;
}

const srcset = (s: { w320: string; w480: string; w720: string }) => `${s.w320} 320w, ${s.w480} 480w, ${s.w720} 720w`;

/**
 * A real app screenshot in a minimal device frame. The frame is deliberately
 * quiet (thin bezel, rounded corners) so the product, not the hardware, reads.
 */
export function PhoneShot({ shot, priority = false, sizes = '(min-width: 820px) 300px, 70vw', className }: PhoneShotProps) {
  return (
    <figure className={[styles.frame, className].filter(Boolean).join(' ')}>
      <picture>
        <source type="image/webp" srcSet={srcset(shot.webp)} sizes={sizes} />
        <img
          src={shot.jpg.w720}
          srcSet={srcset(shot.jpg)}
          sizes={sizes}
          width={shot.width}
          height={shot.height}
          alt={shot.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className={styles.img}
        />
      </picture>
    </figure>
  );
}
