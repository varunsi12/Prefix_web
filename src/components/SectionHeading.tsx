import type { ReactNode } from 'react';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  /** Heading id for aria-labelledby on the parent <section>. */
  id?: string;
}

export function SectionHeading({ eyebrow, title, lede, align = 'left', id }: SectionHeadingProps) {
  return (
    <div className={`${styles.heading} ${align === 'center' ? styles.center : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}
