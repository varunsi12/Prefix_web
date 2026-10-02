import { createContext, useContext, useEffect } from 'react';
import { site } from '../config/site';

/**
 * Per-route document metadata.
 *
 * - During prerendering (see src/entry-server.tsx) the <Seo> component writes
 *   into a HeadCollector so the static HTML ships with the correct tags.
 * - In the browser it keeps document.title / meta / canonical in sync when
 *   the route changes client-side.
 */
export interface SeoProps {
  title: string;
  description?: string;
  /** Path beginning with "/" — combined with site.url for canonical + og:url. */
  path: string;
  /** Prevent indexing (used by the 404 page and deep-link stubs). */
  noindex?: boolean;
  /** Absolute or root-relative image path. Defaults to /og.jpg */
  image?: string;
}

export interface HeadCollector {
  current?: SeoProps;
}

export const HeadContext = createContext<HeadCollector | null>(null);

function resolve(props: SeoProps) {
  const url = `${site.url}${props.path === '/' ? '/' : props.path}`;
  const img = props.image ?? '/og.jpg';
  const image = img.startsWith('http') ? img : `${site.url}${img}`;
  return {
    title: props.title,
    description: props.description ?? site.description,
    url,
    image,
    robots: props.noindex ? 'noindex, nofollow' : 'index, follow',
  };
}

/** Builds the <head> tag string used by the prerender step. */
export function renderHeadTags(props: SeoProps): string {
  const m = resolve(props);
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    `<meta name="robots" content="${m.robots}">`,
    `<link rel="canonical" href="${esc(m.url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(site.name)}">`,
    `<meta property="og:title" content="${esc(m.title)}">`,
    `<meta property="og:description" content="${esc(m.description)}">`,
    `<meta property="og:url" content="${esc(m.url)}">`,
    `<meta property="og:image" content="${esc(m.image)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(m.title)}">`,
    `<meta name="twitter:description" content="${esc(m.description)}">`,
    `<meta name="twitter:image" content="${esc(m.image)}">`,
  ].join('\n    ');
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    const [, key, name] = selector.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/) ?? [];
    if (key && name) el.setAttribute(key, name);
    if (selector.startsWith('link')) el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function Seo(props: SeoProps) {
  const collector = useContext(HeadContext);
  // Server/prerender path: record synchronously during render.
  if (collector) collector.current = props;

  useEffect(() => {
    const m = resolve(props);
    document.title = m.title;
    setMeta('meta[name="description"]', 'content', m.description);
    setMeta('meta[name="robots"]', 'content', m.robots);
    setMeta('link[rel="canonical"]', 'href', m.url);
    setMeta('meta[property="og:title"]', 'content', m.title);
    setMeta('meta[property="og:description"]', 'content', m.description);
    setMeta('meta[property="og:url"]', 'content', m.url);
    setMeta('meta[property="og:image"]', 'content', m.image);
    setMeta('meta[name="twitter:title"]', 'content', m.title);
    setMeta('meta[name="twitter:description"]', 'content', m.description);
    setMeta('meta[name="twitter:image"]', 'content', m.image);
  }, [props.title, props.description, props.path, props.noindex, props.image]);

  return null;
}
