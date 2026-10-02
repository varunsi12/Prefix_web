import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Logo } from './Logo';
import { GetAppButton } from './GetAppButton';
import { track } from '../lib/analytics';
import styles from './Nav.module.css';

const LINKS = [
  { label: 'How It Works', hash: 'how-it-works' },
  { label: 'Events & Places', hash: 'events-and-places' },
  { label: 'About', hash: 'about' },
] as const;

export function Nav() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Solid background once the hero starts scrolling away.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock scroll, close on Escape / resize, manage focus.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const mq = window.matchMedia('(min-width: 820px)');
    const onResize = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onResize);
      toggleRef.current?.focus();
    };
  }, [open]);

  const hrefFor = (hash: string) => (isHome ? `#${hash}` : `/#${hash}`);
  const onNavClick = (label: string, href: string) => {
    track({ name: 'nav_click', props: { label, href } });
    setOpen(false);
  };

  return (
    <header className={[styles.header, scrolled && styles.scrolled, open && styles.open].filter(Boolean).join(' ')}>
      <nav className={`container ${styles.nav}`} aria-label="Primary">
        <Logo />

        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.hash}>
              <a href={hrefFor(l.hash)} onClick={() => onNavClick(l.label, hrefFor(l.hash))}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <GetAppButton location="nav" size="md" className={styles.cta} />
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={styles.panel}
        hidden={!open}
        // inert keeps hidden links out of the tab order on browsers that ignore `hidden` during transitions
        inert={!open}
      >
        <ul className={styles.panelLinks}>
          {LINKS.map((l) => (
            <li key={l.hash}>
              <a href={hrefFor(l.hash)} onClick={() => onNavClick(l.label, hrefFor(l.hash))}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.panelCta} onClick={() => setOpen(false)}>
          <GetAppButton location="nav-mobile" size="lg" />
        </div>
      </div>
    </header>
  );
}
