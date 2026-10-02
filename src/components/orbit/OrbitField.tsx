import { useEffect, useRef } from 'react';
import { OrbitSystem, ORBIT_OUTER_RATIO } from './OrbitSystem';
import { clamp, easeOutCubic, lerp, prefersReducedMotion, smoothstep } from '../../lib/motion';
import styles from './OrbitField.module.css';

/**
 * Hero artwork: two orbit systems — "you" and "someone else" — that drift
 * toward each other on load, intersect further as you scroll, and glow where
 * they overlap. Communicates: individual → shared experience → connection.
 *
 * Performance notes
 * - Only `transform` and `opacity` are animated (compositor-only).
 * - A single rAF loop runs only while the artwork is on screen.
 * - prefers-reduced-motion renders the final, connected state with no motion.
 */
export function OrbitField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const glow = glowRef.current;
    if (!field || !left || !right || !glow) return;

    let raf = 0;
    let visible = true;
    let start = 0;
    const ENTRY_DELAY = 350;
    const ENTRY_MS = 2600;

    // pointer (normalised -1..1 relative to field centre), smoothed
    const target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    let pointerActive = false;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = field.getBoundingClientRect();
      target.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1.5, 1.5);
      target.y = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1.5, 1.5);
      pointerActive = true;
    };
    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const apply = (d: number, o: number, e: number, px: number, py: number) => {
      const half = d / 2;
      left.style.transform = `translate3d(${(-half + px * 10).toFixed(2)}px, ${(py * 6).toFixed(2)}px, 0)`;
      right.style.transform = `translate3d(${(half + px * 16).toFixed(2)}px, ${(py * 9).toFixed(2)}px, 0)`;
      left.style.opacity = String(0.82 + 0.18 * o);
      right.style.opacity = String(0.82 + 0.18 * o);
      glow.style.opacity = o.toFixed(3);
      glow.style.transform = `translate3d(${(px * 13).toFixed(2)}px, ${(py * 7.5).toFixed(2)}px, 0) scale(${(0.55 + 0.45 * o).toFixed(3)})`;
      field.style.setProperty('--label-o', ((1 - o) * e).toFixed(3));
    };

    const geometry = () => {
      const S = left.offsetWidth;
      const R = S * ORBIT_OUTER_RATIO;
      const W = field.clientWidth;
      // The entrance brings the orbits to the point of touching/overlapping; the
      // first stretch of scroll completes the connection. Phones have less
      // scroll room before the artwork leaves the viewport, so the entrance
      // goes a little further and the scroll span is shorter.
      const narrow = window.innerWidth < 820;
      return {
        R,
        dFar: Math.max(Math.min(3.4 * R, W - 2.3 * R), 2.0 * R),
        dTouch: 1.96 * R,
        dEntryEnd: narrow ? 1.62 * R : 1.74 * R,
        dClose: 1.3 * R,
        scrollSpan: window.innerHeight * (narrow ? 0.22 : 0.3),
      };
    };

    // Reduced motion: a single still composition that tells the whole story —
    // two clearly overlapping worlds, glowing where they meet, both labelled.
    const renderStatic = () => {
      const g = geometry();
      const d = 1.5 * g.R;
      apply(d, smoothstep(g.dTouch, g.dClose, d), 1, 0, 0);
      field.style.setProperty('--label-o', '1');
      field.style.opacity = '1';
      field.classList.remove(styles.pre);
    };

    const frame = (now: number) => {
      if (!visible) return;
      if (!start) start = now;
      const g = geometry();

      const e = easeOutCubic(clamp((now - start - ENTRY_DELAY) / ENTRY_MS, 0, 1));
      const d1 = lerp(g.dFar, g.dEntryEnd, e);

      // Connection completes within the first fraction of a viewport of
      // scrolling, while the rings are still comfortably on screen.
      const s = smoothstep(0, 1, clamp(window.scrollY / g.scrollSpan, 0, 1));

      // Once settled, a slow breath (±3.5% of a radius, ~12 s period) keeps the
      // artwork alive on touch devices, where there is no pointer parallax.
      // It also modulates the overlap glow via `o` below.
      const breath = Math.sin((now - start) / 1900) * 0.035 * g.R * e;
      const d = lerp(d1, g.dClose, s) + breath;

      const o = smoothstep(g.dTouch, g.dClose, d);

      if (pointerActive) {
        pointer.x = lerp(pointer.x, target.x, 0.06);
        pointer.y = lerp(pointer.y, target.y, 0.06);
      }

      apply(d, o, e, pointer.x, pointer.y);
      // Fade the whole artwork as the hero leaves the viewport.
      field.style.opacity = String(1 - clamp(window.scrollY / (window.innerHeight * 1.1), 0, 1) * 0.75);
      if (field.classList.contains(styles.pre)) field.classList.remove(styles.pre);

      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const run = () => {
      stop();
      if (prefersReducedMotion()) {
        renderStatic();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    // Pause the loop when off screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) run();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(field);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => run();
    mq.addEventListener('change', onMotionChange);

    const onVisibility = () => (document.hidden ? stop() : visible && run());
    document.addEventListener('visibilitychange', onVisibility);

    field.addEventListener('pointermove', onPointerMove, { passive: true });
    field.addEventListener('pointerleave', onPointerLeave);

    return () => {
      stop();
      io.disconnect();
      mq.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibility);
      field.removeEventListener('pointermove', onPointerMove);
      field.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pre}`} aria-hidden="true">
      <div className={styles.bgRing} />
      <div className={`${styles.bgRing} ${styles.bgRing2}`} />

      <div ref={glowRef} className={styles.glow} />

      <div ref={leftRef} className={`${styles.system} ${styles.left}`}>
        <OrbitSystem tone="warm" size="100%" />
        <span className={styles.label}>Your World</span>
      </div>
      <div ref={rightRef} className={`${styles.system} ${styles.right}`}>
        <OrbitSystem tone="cool" size="100%" />
        <span className={styles.label}>Their World</span>
      </div>
    </div>
  );
}
