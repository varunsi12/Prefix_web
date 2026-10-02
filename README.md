# Pre:Fix — marketing website

The public landing page for **Pre:Fix**, the iOS app for finding something you want to do and people to do it with.

Static site: **React 19 + Vite 7 + TypeScript**, prerendered to HTML at build time, deployed on **Cloudflare** (Workers static assets or Pages, free tier). No backend.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command            | What it does                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `npm run dev`      | Local dev server with HMR                                                                        |
| `npm run build`    | Production build → `dist/` (typecheck → client build → SSR build → prerender + sitemap/robots)   |
| `npm run preview`  | Serve `dist/` locally                                                                            |
| `npm run typecheck`| TypeScript only                                                                                  |
| `npm run images`   | Regenerate optimized screenshots + favicons (see [Images](#images))                              |

---

## Configuration

Every URL or contact value that can change lives in **one place**: [`src/config/site.ts`](src/config/site.ts), fed by `VITE_*` environment variables. Copy [`.env.example`](.env.example) to `.env.local` for local work; in production set them in the Cloudflare project’s **Build variables** (Workers) or **Environment variables** (Pages).

| Variable               | Purpose                                                                                           | Default                  |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------------------------ |
| `VITE_SITE_URL`        | Canonical origin (no trailing slash). Used for `<link rel=canonical>`, OG URLs, sitemap, robots.  | `https://joinprefix.com` |
| `VITE_APP_STORE_URL`   | App Store listing. **Every "Get Pre:Fix" button uses this.** While empty, CTAs link to `#get-prefix` and the on-page button shows "Coming soon to the App Store". | _(empty)_ |
| `VITE_APP_URL_SCHEME`  | Deep-link scheme / Universal Link base for `/event/:id`, `/venue/:id`, `/invite/:code` (e.g. `prefix://`). | _(empty)_ |
| `VITE_INSTAGRAM_URL`   | Footer link. Hidden while empty.                                                                  | _(empty)_                |
| `VITE_TIKTOK_URL`      | Footer link. Hidden while empty.                                                                  | _(empty)_                |
| `VITE_CONTACT_EMAIL`   | Footer "Contact" + legal pages. Hidden while empty.                                               | _(empty)_                |
| `VITE_INVITE_ENABLED`  | `"true"` shows the invite-code UI (landing section + `/invite/:code`). Set `"false"` to remove it everywhere. | `true` |
| `VITE_CF_BEACON_TOKEN` | Cloudflare Web Analytics token (optional).                                                        | _(empty)_                |

All values are public (they ship to the browser). **Never put secrets in `VITE_*` variables.**

---

## Deploying to Cloudflare

The site is fully static (`dist/`), so it runs on either Cloudflare product. Both are free; pick one.

| | **Workers** (what the dashboard offers by default) | **Pages** |
| --- | --- | --- |
| Where | *Workers & Pages → Create → Workers → Import a repository* | *Workers & Pages → Create → Pages → Connect to Git* |
| Build command | `npm run build` | `npm run build` |
| Deploy command | `npx wrangler deploy` (default) | — |
| Output directory | read from [`wrangler.jsonc`](wrangler.jsonc) (`./dist`) | `dist` |
| Node version | `22` via [`.nvmrc`](.nvmrc) | `22` via `.nvmrc` or env `NODE_VERSION=22` |

### Option A — Workers (recommended, matches the default "Set up your application" form)

1. **Push to GitHub** (`main` branch).
2. Cloudflare dashboard → **Workers & Pages → Create → Workers → Import a repository** → pick `Prefix_web`.
3. On *Set up your application* leave the defaults: project name `prefix-web`, build command `npm run build`, deploy command `npx wrangler deploy`. **Enable Preview builds** can stay on (every PR gets a preview URL).
4. Open **Advanced settings → Build variables** and add any `VITE_*` values from the table above (none are required; `VITE_SITE_URL` already defaults to `https://joinprefix.com`).
5. Click **Deploy**. The first build takes ~1–2 minutes and the site is live at `prefix-web.<account>.workers.dev`.
6. **Custom domain.** Worker → **Settings → Domains & Routes → + Add → Custom domain** → `joinprefix.com`. Repeat for `www.joinprefix.com`. The domain is registered with Cloudflare, so DNS and the certificate are set up automatically.
7. **www → apex redirect.** Zone `joinprefix.com` → **Rules → Redirect Rules → Create rule** → template *"Redirect from WWW to Root"* (free). `VITE_SITE_URL` must match the apex (`https://joinprefix.com`).
8. **Verify.** Load `https://joinprefix.com`, then check `/privacy`, `/terms`, `/sitemap.xml`, `/robots.txt`, and that a bogus URL returns a styled 404.
9. **Future updates.** Every push to `main` deploys to production; every pull request gets a preview URL.

### Option B — Pages

1. **Push to GitHub** (`main` branch).
2. **Workers & Pages → Create → Pages → Connect to Git** → select the repo. Production branch `main`.
3. Framework preset `None`; **build command `npm run build`**; **build output directory `dist`**; root directory `/`.
4. **Environment variables.** Add `NODE_VERSION=22` plus any `VITE_*` values, for both *Production* and *Preview*. **Save and Deploy**.
5. **Custom domain.** Pages project → **Custom domains → Set up a custom domain** → `joinprefix.com`, then `www.joinprefix.com`.
6. Steps 7–9 from Option A apply unchanged.

Nothing here requires a paid Cloudflare feature.

### Routing on Cloudflare

Behaviour is identical on Workers and Pages:

- `/`, `/privacy`, `/terms`, `/invite` are real HTML files (prerendered). `privacy/index.html` is served at `/privacy`; `/privacy/` redirects to `/privacy`.
- `404.html` is served with a **real 404 status** for unknown URLs (`not_found_handling: "404-page"` in `wrangler.jsonc`; automatic on Pages).
- `/invite/:code`, `/event/:id`, `/venue/:id` are rewritten (200) to the empty app shell by [`public/_redirects`](public/_redirects) and rendered client-side.
- Security and caching headers live in [`public/_headers`](public/_headers).
- `npm run preview` reproduces this routing locally; `npx wrangler dev` runs the real Workers runtime against `dist/`.

---

## Project structure

```
.
├── index.html                  HTML template (head placeholders filled at prerender)
├── public/                     Copied verbatim to dist/
│   ├── _headers                Cloudflare response headers
│   ├── _redirects              Cloudflare rewrites for dynamic deep-link routes
│   ├── og.jpg                  Open Graph / Twitter card image (1200×630)
│   ├── favicon-*.png, apple-touch-icon.png, icon-*.png, site.webmanifest
├── content/
│   └── screenshots/            RAW app screenshots (drop new ones here)
├── scripts/
│   ├── optimize-images.mjs     content/screenshots → src/assets/screenshots (webp/jpg) + favicons
│   └── prerender.mjs           Emits static HTML per route, 404.html, shell.html, sitemap, robots
└── src/
    ├── main.tsx                Client entry (hydrates prerendered HTML)
    ├── entry-server.tsx        Used only by the prerender step
    ├── App.tsx                 Route table
    ├── config/
    │   ├── site.ts             ★ All URLs / contact / feature flags (env-driven)
    │   └── screenshots.ts      ★ Registry of real app screenshots + alt text
    ├── lib/
    │   ├── analytics.ts        Provider-independent track() + Cloudflare beacon
    │   ├── seo.tsx             <Seo> per-route metadata (prerender + client)
    │   ├── motion.ts           reduced-motion, in-view, easing helpers
    │   └── deeplink.ts         App link builder for /event, /venue, /invite
    ├── components/
    │   ├── orbit/              OrbitSystem (one orbit), OrbitField (hero), OrbitMark (reusable)
    │   ├── Nav, Footer, Layout, Logo, Button, GetAppButton, PhoneShot, Reveal,
    │   │   SectionHeading, InviteCode
    ├── sections/               Hero, HowItWorks, EventsPlaces, Positioning, Screenshots,
    │                           About, EarlyCommunity, FinalCta
    ├── pages/                  Home, Privacy, Terms, NotFound, DeepLink (invite/event/venue)
    ├── styles/                 tokens.css (design tokens), global.css
    └── assets/
        ├── brand/prefix-icon.png   The app icon, used as supplied
        └── screenshots/            Generated — do not edit by hand
```

---

## Images

**Adding app screenshots**

1. Drop the raw capture in `content/screenshots/<slug>.png` (or `.jpg`).
2. `npm run images` → writes `src/assets/screenshots/<slug>-{320,480,720}.{webp,jpg}`.
3. Register it in [`src/config/screenshots.ts`](src/config/screenshots.ts) with alt text, then reference it from a section (`HowItWorks.tsx` step list or `Screenshots.tsx` frames).

Steps without a real screenshot (currently step 4 "Go" — chat/plans) render an orbit glyph instead. Never mock UI.

**App icon / favicons**

`src/assets/brand/prefix-icon.png` is used unmodified for the logo and as the source for favicons. The current file is only 79×82 px, so `apple-touch-icon.png` (180) and `icon-512.png` are upscaled and soft. Replace it with a 1024×1024 export and run `npm run images`.

**Open Graph image**

`public/og.jpg` (1200×630) is a render of the hero. Regenerate after major hero changes.

---

## Analytics

[`src/lib/analytics.ts`](src/lib/analytics.ts) exposes `track(event)` — provider-independent and typed. Events emitted:

| Event                   | Where                                   |
| ----------------------- | --------------------------------------- |
| `cta_get_app`           | Every "Get Pre:Fix" button (`location`) |
| `nav_click`             | Header / mobile menu links              |
| `invite_code_focus`, `invite_code_submit` | Invite code field       |
| `events_places_toggle`  | Event / Place segmented control         |
| `outbound_social`       | Instagram / TikTok footer links         |

Page views: set `VITE_CF_BEACON_TOKEN` to enable Cloudflare Web Analytics (cookie-less). Custom events are forwarded to `window.__prefixAnalytics` if a provider registers one, and logged to the console in dev. No cookies, no fingerprinting.

---

## Invite-only mode

The invite UI is controlled entirely by `VITE_INVITE_ENABLED`. Setting it to `false` removes the code field from the landing page and `/invite/:code`; nothing else in the copy assumes invite-only. Codes are **not validated** on the web (no backend) — they are remembered in `localStorage` and the user is told to enter the code in the app.

---

## Legal pages

`/privacy` and `/terms` contain the Prefix Privacy Policy and Terms of Service (effective October 2, 2026). The text lives as plain JSX in `src/pages/Privacy.tsx` and `src/pages/Terms.tsx`; edit there and update the `effective` date prop when the documents change. The closing "Contact" section automatically appends `VITE_CONTACT_EMAIL` when it is set.

---

## Accessibility & performance notes

- Semantic landmarks, skip link, visible focus rings, keyboard-operable mobile menu (Escape closes, focus returns).
- `prefers-reduced-motion`: the hero renders its connected end-state with no motion; reveals and transitions are disabled.
- Hero animation uses only `transform`/`opacity` and a single `requestAnimationFrame` loop that pauses off-screen.
- Images are responsive WebP with JPEG fallback, lazy-loaded below the fold, with intrinsic sizes to prevent layout shift.
- Fonts: Lora (variable, self-hosted via `@fontsource-variable/lora`) for headlines; system UI stack for body.
