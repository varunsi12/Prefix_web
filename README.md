# Pre:Fix — marketing website

The public landing page for **Pre:Fix**, the iOS app for finding something you want to do and people to do it with.

Static site: **React 19 + Vite 7 + TypeScript**, prerendered to HTML at build time, deployed on **Cloudflare Pages** (free tier). No backend.

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

Every URL or contact value that can change lives in **one place**: [`src/config/site.ts`](src/config/site.ts), fed by `VITE_*` environment variables. Copy [`.env.example`](.env.example) to `.env.local` for local work; in production set them under **Cloudflare Pages → Settings → Environment variables**.

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

## Deploying to Cloudflare Pages

**Build settings (copy these exactly):**

| Setting                | Value           |
| ---------------------- | --------------- |
| Framework preset       | `None` (or `Vite`) |
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Root directory         | `/`             |
| Node version           | `22` (set env var `NODE_VERSION=22`) |

Step by step:

1. **Push to GitHub.** Create a repository and push this project (`main` branch).
2. **Create the Pages project.** Cloudflare dashboard → *Workers & Pages* → *Create* → *Pages* → *Connect to Git*.
3. **Connect the repository.** Authorize GitHub and select the repo. Production branch: `main`.
4. **Framework / build settings.** Framework preset `None`; build command `npm run build`; output directory `dist`.
5. **Build command** is `npm run build` — it type-checks, builds, prerenders every static route and writes `sitemap.xml` / `robots.txt`.
6. **Output directory** is `dist`.
7. **Environment variables.** Add `NODE_VERSION=22` plus the `VITE_*` values from the table above (at minimum `VITE_SITE_URL`). Set them for both *Production* and *Preview*. Click *Save and Deploy*.
8. **Custom domain.** Pages project → *Custom domains* → *Set up a custom domain* → enter `joinprefix.com`, then repeat for `www.joinprefix.com`. The domain is registered with Cloudflare, so the DNS records are created automatically — just confirm the prompt.
9. **www → apex redirect.** Both hostnames serve the site; to keep one canonical origin, add a redirect: zone `joinprefix.com` → *Rules* → *Redirect Rules* → *Create rule* → "Redirect from WWW to Root" template (free). `VITE_SITE_URL` must match the apex (`https://joinprefix.com`).
10. **Verify HTTPS.** Cloudflare issues a certificate automatically; the domain shows *Active* once DNS propagates (usually minutes). Load `https://joinprefix.com` and confirm the lock icon, then check `/sitemap.xml` and `/robots.txt` show `https://joinprefix.com`.
11. **Future updates.** Every push to `main` triggers a production deploy; every pull request gets a preview URL. No manual steps.

Nothing here requires a paid Cloudflare feature.

### Routing on Cloudflare

- `/`, `/privacy`, `/terms`, `/invite` are real HTML files (prerendered). Cloudflare serves `privacy/index.html` at `/privacy` automatically.
- `404.html` is served with a **real 404 status** for unknown URLs.
- `/invite/:code`, `/event/:id`, `/venue/:id` are rewritten to an empty app shell by [`public/_redirects`](public/_redirects) and rendered client-side.
- Security and caching headers live in [`public/_headers`](public/_headers).

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

`/privacy` and `/terms` are **structural placeholders** marked "Draft — pending legal review". Replace each `[TODO]` in `src/pages/Privacy.tsx` and `src/pages/Terms.tsx` with reviewed text before launch.

---

## Accessibility & performance notes

- Semantic landmarks, skip link, visible focus rings, keyboard-operable mobile menu (Escape closes, focus returns).
- `prefers-reduced-motion`: the hero renders its connected end-state with no motion; reveals and transitions are disabled.
- Hero animation uses only `transform`/`opacity` and a single `requestAnimationFrame` loop that pauses off-screen.
- Images are responsive WebP with JPEG fallback, lazy-loaded below the fold, with intrinsic sizes to prevent layout shift.
- Fonts: Lora (variable, self-hosted via `@fontsource-variable/lora`) for headlines; system UI stack for body.
