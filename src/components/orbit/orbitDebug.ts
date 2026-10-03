/**
 * TEMPORARY diagnostics for the hero orbit animation on devices where the
 * console is hard to reach (iOS Safari). Enabled only when the URL contains
 * `?debug=orbit` (or `#debug-orbit`); otherwise every call is a no-op.
 *
 * Shows a small fixed overlay with the event log and live frame stats, and
 * mirrors everything to console.log as `[OrbitField] …`.
 *
 * Remove this file and its two call sites in OrbitField.tsx once resolved.
 */
export interface OrbitDebug {
  enabled: boolean;
  log: (msg: string, data?: unknown) => void;
  stats: (text: string) => void;
}

const NOOP: OrbitDebug = { enabled: false, log: () => {}, stats: () => {} };

export function createOrbitDebug(): OrbitDebug {
  if (typeof window === 'undefined') return NOOP;
  const enabled = /[?&]debug=orbit\b/.test(location.search) || location.hash === '#debug-orbit';
  if (!enabled) return NOOP;

  const box = document.createElement('div');
  box.setAttribute('aria-hidden', 'true');
  Object.assign(box.style, {
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '99999',
    maxHeight: '45vh',
    overflow: 'auto',
    padding: '8px 10px 14px',
    background: 'rgba(0,0,0,0.85)',
    color: '#9f9',
    font: '11px/1.35 ui-monospace, Menlo, monospace',
    whiteSpace: 'pre-wrap',
    pointerEvents: 'none',
  } as Partial<CSSStyleDeclaration>);
  const statsEl = document.createElement('div');
  statsEl.style.color = '#ff9';
  const logEl = document.createElement('div');
  box.append(statsEl, logEl);
  document.body.appendChild(box);

  const lines: string[] = [];
  const t0 = performance.now();
  const stamp = () => `${((performance.now() - t0) / 1000).toFixed(2)}s`;

  const log = (msg: string, data?: unknown) => {
    const extra = data === undefined ? '' : ' ' + safe(data);
    console.log(`[OrbitField] ${msg}`, data ?? '');
    lines.push(`${stamp()} ${msg}${extra}`);
    if (lines.length > 40) lines.shift();
    logEl.textContent = lines.join('\n');
  };

  window.addEventListener('error', (e) => log('window.error', e.message));
  window.addEventListener('unhandledrejection', (e) => log('unhandledrejection', String(e.reason)));

  log('debug overlay on', {
    ua: navigator.userAgent,
    inner: `${innerWidth}x${innerHeight}`,
    dpr: devicePixelRatio,
    visibility: document.visibilityState,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    IO: 'IntersectionObserver' in window,
    rAF: typeof requestAnimationFrame,
    mqlAddEventListener: typeof matchMedia('(x)').addEventListener,
  });

  return { enabled: true, log, stats: (text) => (statsEl.textContent = text) };
}

function safe(v: unknown): string {
  try {
    return typeof v === 'string' ? v : JSON.stringify(v);
  } catch {
    return String(v);
  }
}
