/**
 * Real app screenshots used across the site.
 *
 * Adding a screenshot:
 *   1. Drop the raw device capture in  content/screenshots/<slug>.(png|jpg)
 *   2. Run `npm run images`  → writes src/assets/screenshots/<slug>-{320,480,720}.{webp,jpg}
 *   3. Add an entry below with `shot('<slug>', alt)` and reference it by key.
 *
 * Never fabricate UI — if a step has no real screenshot yet, leave its slot
 * `undefined` and the section renders its orbit glyph instead.
 */

const webp = import.meta.glob('../assets/screenshots/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const jpg = import.meta.glob('../assets/screenshots/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export interface Screenshot {
  /** Alt text describing what the screen shows (used verbatim by screen readers). */
  alt: string;
  /** srcset-ready sources at 320w, 480w and 720w. */
  webp: { w320: string; w480: string; w720: string };
  jpg: { w320: string; w480: string; w720: string };
  /** Native aspect ratio for layout reservation (prevents CLS). */
  width: number;
  height: number;
}

function shot(slug: string, alt: string): Screenshot {
  const pick = (map: Record<string, string>, ext: string, w: number) => {
    const key = `../assets/screenshots/${slug}-${w}.${ext}`;
    const url = map[key];
    if (!url) throw new Error(`Missing optimized screenshot: ${key}. Run \`npm run images\`.`);
    return url;
  };
  return {
    alt,
    webp: { w320: pick(webp, 'webp', 320), w480: pick(webp, 'webp', 480), w720: pick(webp, 'webp', 720) },
    jpg: { w320: pick(jpg, 'jpg', 320), w480: pick(jpg, 'jpg', 480), w720: pick(jpg, 'jpg', 720) },
    width: 945,
    height: 2048,
  };
}

export const screenshots = {
  discoverEvent: shot(
    '01-discover-event',
    'Pre:Fix For You feed showing a comedy tour event card with a 98% match, and Join Group and Pair Up buttons.',
  ),
  interests: shot(
    '02-interests',
    'Pre:Fix event preferences screen asking “What are you into?” with interest tiles like Food & Drink, Arts & Culture, and Concerts.',
  ),
  profile: shot(
    '03-profile',
    'A verified Pre:Fix profile with a photo, short bio, and details like occupation and education.',
  ),
  values: shot(
    '04-values',
    'A Pre:Fix profile showing a values chart across dimensions like Self-Direction, Benevolence and Achievement.',
  ),
} as const satisfies Record<string, Screenshot>;

export type ScreenshotKey = keyof typeof screenshots;
