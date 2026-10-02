import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { HeadContext, renderHeadTags, type HeadCollector } from './lib/seo';

// Re-exported so the prerender script can read the canonical URL for sitemap/robots.
export { site } from './config/site';

/**
 * Used only by scripts/prerender.mjs at build time to emit static HTML for
 * each route. Not shipped to the browser.
 */
export function render(url: string): { html: string; head: string } {
  const collector: HeadCollector = {};
  const html = renderToString(
    <StrictMode>
      <HeadContext.Provider value={collector}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>
    </StrictMode>,
  );
  const head = collector.current ? renderHeadTags(collector.current) : '';
  return { html, head };
}
