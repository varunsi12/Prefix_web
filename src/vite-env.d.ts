/// <reference types="vite/client" />

/** Injected by vite.config.ts so server-rendered and client markup agree. */
declare const __BUILD_YEAR__: number;

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_APP_STORE_URL?: string;
  readonly VITE_APP_URL_SCHEME?: string;
  readonly VITE_INSTAGRAM_URL?: string;
  readonly VITE_TIKTOK_URL?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_INVITE_ENABLED?: string;
  readonly VITE_CF_BEACON_TOKEN?: string;
}
