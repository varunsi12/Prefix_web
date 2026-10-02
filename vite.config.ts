import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflarePagesPreview()],
  define: {
    // Fixed at build time so prerendered HTML and the client agree (no hydration mismatch).
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    // Inline nothing large; keep screenshots as separate cacheable files.
    assetsInlineLimit: 2048,
    target: 'es2020',
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});

/**
 * Makes `vite preview` behave like Cloudflare Pages so the production build can
 * be checked locally: clean URLs (/privacy → privacy/index.html), `_redirects`
 * rewrites, and `404.html` with a real 404 status. Dev server is unaffected.
 */
function cloudflarePagesPreview(): Plugin {
  return {
    name: 'cloudflare-pages-preview',
    configurePreviewServer(server) {
      const dist = path.resolve(server.config.root, server.config.build.outDir);
      const rulesFile = path.join(dist, '_redirects');
      const rules = existsSync(rulesFile)
        ? readFileSync(rulesFile, 'utf8')
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => l && !l.startsWith('#'))
            .map((l) => {
              const [from, to, status = '301'] = l.split(/\s+/);
              return { from, to, status: Number(status) };
            })
        : [];
      const matches = (pattern: string, p: string) =>
        pattern.endsWith('/*') ? p.startsWith(pattern.slice(0, -1)) : pattern === p;
      const isFile = (p: string) => existsSync(p) && statSync(p).isFile();

      server.middlewares.use((req, res, next) => {
        const p = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
        if (p.includes('..') || isFile(path.join(dist, p))) return next();
        if (isFile(path.join(dist, `${p}.html`))) {
          req.url = `${p}.html`;
          return next();
        }
        if (isFile(path.join(dist, p, 'index.html'))) {
          req.url = path.posix.join(p, 'index.html');
          return next();
        }
        for (const r of rules) {
          if (!matches(r.from, p)) continue;
          if (r.status === 200) {
            req.url = r.to;
            return next();
          }
          res.statusCode = r.status;
          res.setHeader('Location', r.to);
          return res.end();
        }
        const notFound = path.join(dist, '404.html');
        if (!isFile(notFound)) return next();
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(notFound));
      });
    },
  };
}
