/**
 * Central site configuration.
 *
 * Every URL / contact value that may change lives here (and only here).
 * Components must import from this file rather than hard-coding values.
 *
 * Values can be overridden per-environment with Vite env vars (see .env.example).
 * Only `VITE_*` variables are exposed to the browser — never put secrets here.
 */

const env = import.meta.env;

/** Returns `undefined` for empty/unset env values so fallbacks apply cleanly. */
function optional(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export const site = {
  name: 'Pre:Fix',
  tagline: 'Find something you want to do. Find people to do it with.',
  description:
    'Pre:Fix helps you discover events and places around you, connect with people who want to go, and make plans in real life. Launching first in the Bay Area.',

  /**
   * Canonical origin, no trailing slash. Used for <link rel="canonical">,
   * Open Graph URLs, sitemap.xml and robots.txt.
   */
  url: (optional(env.VITE_SITE_URL) ?? 'https://joinprefix.com').replace(/\/$/, ''),

  /**
   * App Store URL. Leave unset until the app is live; while unset, every
   * "Get Pre:Fix" button falls back to the #get-prefix section instead of a
   * dead link.
   */
  appStoreUrl: optional(env.VITE_APP_STORE_URL),

  /**
   * Custom URL scheme or Universal Link base for deep links
   * (e.g. "prefix://"). Unset until the iOS app registers one.
   */
  appUrlScheme: optional(env.VITE_APP_URL_SCHEME),

  /** Used in sentences: "Launching first in {launchRegion}". */
  launchRegion: 'the Bay Area',
  /** Used as an adjective: "founding {launchRegionShort} community". */
  launchRegionShort: 'Bay Area',

  social: {
    // TODO(config): set VITE_INSTAGRAM_URL / VITE_TIKTOK_URL. Links are hidden while unset.
    instagram: optional(env.VITE_INSTAGRAM_URL),
    tiktok: optional(env.VITE_TIKTOK_URL),
  },

  // TODO(config): set VITE_CONTACT_EMAIL. The Contact link is hidden while unset.
  contactEmail: optional(env.VITE_CONTACT_EMAIL),

  features: {
    /**
     * Invite-code UI. Flip VITE_INVITE_ENABLED to "false" (or remove it) when
     * the app opens up; all invite UI disappears with no other code changes.
     */
    inviteCodes: (optional(env.VITE_INVITE_ENABLED) ?? 'true') !== 'false',
  },

  analytics: {
    /** Cloudflare Web Analytics beacon token (optional, free tier). */
    cloudflareBeaconToken: optional(env.VITE_CF_BEACON_TOKEN),
  },
} as const;

/** Anchor id of the on-page "Get Pre:Fix" section used as the CTA fallback. */
export const GET_APP_ANCHOR = 'get-prefix';

export type Site = typeof site;
