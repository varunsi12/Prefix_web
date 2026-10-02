/**
 * Provider-independent analytics.
 *
 * `track()` is the only function components call. It fans out to whichever
 * providers are registered. Nothing is collected unless a provider is wired up.
 *
 * Cloudflare Web Analytics (free, cookie-less) is supported out of the box for
 * page views via `initCloudflareBeacon()`. It does not accept custom events, so
 * custom events are forwarded to any `window.__prefixAnalytics` handler that a
 * future provider can register, and logged to the console in development.
 */

export type AnalyticsEvent =
  | { name: 'cta_get_app'; props: { location: string; hasStoreUrl: boolean } }
  | { name: 'nav_click'; props: { label: string; href: string } }
  | { name: 'invite_code_focus'; props?: undefined }
  | { name: 'invite_code_submit'; props: { codeLength: number } }
  | { name: 'events_places_toggle'; props: { mode: 'event' | 'place' } }
  | { name: 'outbound_social'; props: { network: 'instagram' | 'tiktok' } };

type Provider = (event: AnalyticsEvent) => void;

declare global {
  interface Window {
    /** Optional hook a future analytics provider can set to receive events. */
    __prefixAnalytics?: Provider;
  }
}

const providers: Provider[] = [];

export function registerProvider(provider: Provider): void {
  providers.push(provider);
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  if (import.meta.env.DEV) {
    console.debug('[analytics]', event.name, event.props ?? {});
  }
  window.__prefixAnalytics?.(event);
  for (const p of providers) {
    try {
      p(event);
    } catch {
      // Analytics must never break the page.
    }
  }
}

/**
 * Injects the Cloudflare Web Analytics beacon when a token is configured.
 * Safe to call once from the client entry.
 */
export function initCloudflareBeacon(token: string | undefined): void {
  if (!token || typeof document === 'undefined') return;
  if (document.querySelector('script[data-cf-beacon]')) return;
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(s);
}
