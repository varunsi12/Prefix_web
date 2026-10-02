import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

/**
 * Client-side navigations keep the previous scroll position by default, so
 * clicking "Terms" from the footer would open the page already scrolled to the
 * bottom. On every new route (PUSH/REPLACE) this jumps to the top — or to the
 * `#hash` target when there is one. Back/forward (POP) is left to the browser
 * so it can restore where the user was.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === 'POP') return;
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash, navigationType]);

  return null;
}
