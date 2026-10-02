import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { useInView } from '../lib/motion';
import styles from './Reveal.module.css';

interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'> {
  children: ReactNode;
  as?: ElementType;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
}

/**
 * One-shot fade/rise on scroll. Content is fully visible with no JS and under
 * prefers-reduced-motion (handled in CSS), so nothing is ever hidden.
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, className, ...rest }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>();
  const cls = [styles.reveal, inView && styles.in, className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={cls} style={delay ? ({ '--delay': `${delay}ms` } as CSSProperties) : undefined} {...rest}>
      {children}
    </Tag>
  );
}
