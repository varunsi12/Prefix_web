/**
 * Build-time prerender (runs as the last step of `npm run build`).
 *
 * Why: the site is a static marketing page, so every known route is emitted as
 * real HTML. Visitors and crawlers get content without waiting for JS; React
 * then hydrates on top. Cloudflare Pages serves `/privacy/index.html` at
 * `/privacy` and `404.html` with a real 404 status automatically.
 *
 * Output (in dist/):
 *   index.html, privacy/index.html, terms/index.html, invite/index.html
 *   404.html            → Cloudflare custom 404 (real 404 status)
 *   shell.html          → empty app shell for dynamic routes (see public/_redirects)
 *   sitemap.xml, robots.txt
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const SSR = path.join(ROOT, 'dist-ssr');

// route → output file (relative to dist). Add new static routes here.
const ROUTES = {
  '/': 'index.html',
  '/privacy': 'privacy/index.html',
  '/terms': 'terms/index.html',
  '/invite': 'invite/index.html',
  '/404': '404.html',
};
const INDEXABLE = ['/', '/privacy', '/terms'];

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
const { render, site } = await import(pathToFileURL(path.join(SSR, 'entry-server.js')).href);

// Preload the one font file the headline needs (latin, upright). Hashed name is
// only known after the client build, so it's injected here.
const assets = await readdir(path.join(DIST, 'assets'));
const headlineFont = assets.find((f) => /^lora-latin-wght-normal-.*\.woff2$/.test(f));
const preload = headlineFont
  ? `<link rel="preload" as="font" type="font/woff2" href="/assets/${headlineFont}" crossorigin>\n    `
  : '';

const HEAD_RE = /<!--app-head-->[\s\S]*?<!--\/app-head-->/;

function fill(html, head) {
  return template
    .replace(HEAD_RE, preload + (head || template.match(HEAD_RE)[0]))
    .replace('<!--app-html-->', html);
}

for (const [route, file] of Object.entries(ROUTES)) {
  const { html, head } = render(route);
  const out = path.join(DIST, file);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, fill(html, head));
  console.log(`prerendered  ${route.padEnd(10)} → dist/${file}`);
}

// Empty shell for client-rendered dynamic routes (/invite/:code, /event/:id, /venue/:id).
await writeFile(path.join(DIST, 'shell.html'), fill('', ''));
console.log('shell        dist/shell.html');

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = INDEXABLE.map(
  (r) => `  <url>\n    <loc>${site.url}${r === '/' ? '/' : r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
).join('\n');
await writeFile(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

// robots.txt
await writeFile(
  path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /invite/\nDisallow: /event/\nDisallow: /venue/\n\nSitemap: ${site.url}/sitemap.xml\n`,
);
console.log(`seo          sitemap.xml + robots.txt (${site.url})`);

await rm(SSR, { recursive: true, force: true });
