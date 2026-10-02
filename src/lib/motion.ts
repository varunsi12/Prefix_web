import { useEffect, useRef, useState, type RefObject } from 'react';

const REDUCED = '(prefers-reduced-motion: reduce)';

/**
 * Reactive prefers-reduced-motion flag.
 * Returns `true` during SSR / first paint so no motion runs before we know.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** Non-reactive check for use inside animation loops. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED).matches;
}

/**
 * Observes an element and flips to `true` once it enters the viewport.
 * Used by <Reveal> for one-shot, scroll-triggered entrances.
 */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setInView(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return [ref, inView];
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
/** Ease-out cubic — used for the hero entrance so motion settles gently. */
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
