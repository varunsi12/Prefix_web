import { site } from '../config/site';

export type DeepLinkKind = 'event' | 'venue' | 'invite';

/**
 * Builds the in-app URL for a resource, or `undefined` until an app URL scheme
 * (or Universal Link base) is configured via VITE_APP_URL_SCHEME.
 *
 * When iOS Universal Links are ready, host the AASA file at
 * /.well-known/apple-app-site-association (static, in /public) so these web
 * routes open directly in the app when installed.
 */
export function buildAppLink(kind: DeepLinkKind, id: string): string | undefined {
  if (!site.appUrlScheme) return undefined;
  const base = site.appUrlScheme.endsWith('/') || site.appUrlScheme.endsWith(':') ? site.appUrlScheme : `${site.appUrlScheme}/`;
  return `${base}${kind}/${encodeURIComponent(id)}`;
}

/** Minimal sanitising so ids/codes from the URL render safely and predictably. */
export function cleanParam(value: string | undefined, max = 64): string {
  return (value ?? '').replace(/[^\w-]/g, '').slice(0, max);
}
