import { useId } from 'react';
import styles from './OrbitSystem.module.css';

interface OrbitSystemProps {
  /** Rendered size in CSS px (the SVG is square). */
  size?: number | string;
  /** 'warm' leads with gold at the top-left, 'cool' leads with blue — so two systems read as two different people. */
  tone?: 'warm' | 'cool';
  className?: string;
  /** Pauses the slow gradient drift (also disabled automatically by prefers-reduced-motion). */
  still?: boolean;
}

/**
 * One person's "orbit": a centre point and three concentric rings whose stroke
 * gradients drift slowly. This is our interpretation of the icon's motif, not a
 * copy of the icon — the icon itself is only used as the logo.
 *
 * Geometry lives in a 200x200 viewBox; outer ring radius is 92.
 */
export const ORBIT_OUTER_RATIO = 92 / 200;

export function OrbitSystem({ size = 320, tone = 'warm', className, still = false }: OrbitSystemProps) {
  const uid = useId().replace(/:/g, '');
  const gradA = `og-${uid}-a`;
  const gradB = `og-${uid}-b`;
  const glow = `og-${uid}-glow`;

  const warm = ['var(--orbit-gold)', 'var(--orbit-amber)', 'var(--orbit-violet)', 'var(--orbit-blue)'];
  const cool = ['var(--orbit-blue)', 'var(--orbit-ice)', 'var(--orbit-gold)', 'var(--orbit-violet)'];
  const stops = tone === 'warm' ? warm : cool;

  const cls = [styles.system, still && styles.still, className].filter(Boolean).join(' ');

  return (
    <svg
      className={cls}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      style={typeof size === 'string' ? { width: size, height: size } : undefined}
    >
      <defs>
        <linearGradient id={gradA} gradientUnits="userSpaceOnUse" x1="8" y1="8" x2="192" y2="192">
          <stop offset="0" stopColor={stops[0]} />
          <stop offset="0.45" stopColor={stops[1]} />
          <stop offset="1" stopColor={stops[2]} />
        </linearGradient>
        <linearGradient id={gradB} gradientUnits="userSpaceOnUse" x1="192" y1="8" x2="8" y2="192">
          <stop offset="0" stopColor={stops[3]} />
          <stop offset="0.55" stopColor={stops[0]} />
          <stop offset="1" stopColor={stops[2]} />
        </linearGradient>
        <radialGradient id={glow}>
          <stop offset="0" stopColor={stops[0]} stopOpacity="0.55" />
          <stop offset="1" stopColor={stops[0]} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* centre: soft halo + solid point */}
      <circle cx="100" cy="100" r="18" fill={`url(#${glow})`} />
      <circle cx="100" cy="100" r="4.2" fill={stops[0]} />

      {/* rings — each in its own group so they drift at different rates */}
      <g className={styles.ringSlow}>
        <circle cx="100" cy="100" r="28" fill="none" stroke={`url(#${gradA})`} strokeWidth="1.6" />
      </g>
      <g className={styles.ringMid}>
        <circle cx="100" cy="100" r="58" fill="none" stroke={`url(#${gradB})`} strokeWidth="1.3" opacity="0.9" />
      </g>
      <g className={styles.ringFast}>
        <circle cx="100" cy="100" r="92" fill="none" stroke={`url(#${gradA})`} strokeWidth="1.1" opacity="0.75" />
      </g>
    </svg>
  );
}
