# Apex Performance

Single-page marketing site for a personal training business. Dark, cinematic, results-forward — near-black base, one deep red accent, Bebas Neue display type over DM Sans body.

Built with React 18 + Vite 8 + Tailwind CSS 4.

---

## Quick start

```bash
npm install
npm run dev            # dev server (http://localhost:5173)
npm run build          # production build -> dist/ (includes route shells)
npm run preview        # serve the built output on :4173

npm run lint           # ESLint, including jsx-a11y
npm run format         # Prettier
npm run smoke          # runtime checks in real Chrome (needs `preview` running)
npm run optimize:media # regenerate images/video from media-src/
```

---

## Routes

| Path           | Page                   | Composition                                                                                  |
| -------------- | ---------------------- | -------------------------------------------------------------------------------------------- |
| `/`            | `pages/Home.jsx`       | Intro → Hero → About → Services → Process → ClientResults → Reviews → Pricing → FAQ → Footer |
| `/get-started` | `pages/GetStarted.jsx` | BookingHero (form) → Location → FAQ → Footer                                                 |
| `*`            | `pages/NotFound.jsx`   | 404 — mirrors the Hero composition, hands back a jump list into every real section           |

`Nav`, `ScrollToHash` and the error boundary sit above the router in [App.jsx](src/App.jsx). `/get-started` and the 404 are `React.lazy` chunks; Home stays eager because it is the landing route.

Each route also gets a static HTML shell at build time ([scripts/route-shells.mjs](scripts/route-shells.mjs)) carrying its own title, description, canonical and Open Graph tags — social scrapers do not run JavaScript, so client-set meta reaches them as nothing.

---

## Structure

```
src/
  main.jsx            BrowserRouter + StrictMode entry, analytics
  App.jsx             routes, shared Nav, error boundary, skip link
  index.css           @font-face, design tokens (@theme), base layer, focus, reduced motion
  pages/              route-level compositions
  sections/           full-width page sections, one file each
  components/         shared UI — Nav, FAQ, Footer, Img, Seo, ErrorBoundary, FormField, icons
  hooks/              useInView, useCounter, useScrollRadius, useMediaQuery, useMobile,
                      useReducedMotion, useDocumentTitle
  lib/                media.js (srcset resolution), motion.js (reveal/lift),
                      scroll.js (shared listener), introGate.js
  data/content.js     all copy — business, socials, services, steps, clients, reviews, plans, FAQs, gyms
  assets/media/       generated derivatives (committed, ~3.7 MB)
api/lead.js           booking form endpoint (Vercel serverless)
media-src/            untouched masters (gitignored, ~175 MB)
public/               icon.svg, og-image.jpg, robots.txt, sitemap.xml, fonts/
```

**All copy lives in [src/data/content.js](src/data/content.js).** Rewriting the site for another client is a content edit plus a token swap — not a component rewrite.

---

## Media pipeline

Originals live in `media-src/` and are **never** modified or committed. `npm run optimize:media` reads them and writes web-ready derivatives into `src/assets/media/`, where Vite content-hashes them so they can be served `immutable` for a year.

| | Before | After |
| --- | --- | --- |
| Unique source images | 53.4 MB | **1.9 MB** (WebP, 3 widths each) |
| Hero video | 68 MB @ 27.7 Mbps | **1.0 MB** MP4 + 0.64 MB WebM + poster |
| Build output | 222 MB | **4.3 MB** |
| Homepage payload | ~133 MB | **0.87 MB** (measured in Chrome) |

The originals also shipped seven byte-identical duplicate pairs across `assets/` and `assets/images/`, two of which were both live on the homepage — 12.4 MB of the same pixels fetched twice per visit. Each photo now exists once.

Every photo renders through [`<Img>`](src/components/Img.jsx), which cannot forget `srcset`, `sizes`, intrinsic dimensions, lazy loading or async decoding.

> Masters are gitignored. Keep them in shared storage — a clone builds fine without them because the derivatives are committed.

---

## Design system

Tokens are declared once in [index.css](src/index.css) under Tailwind 4's `@theme`, so utilities generate straight from them (`bg-bg`, `text-accent`, `font-display`, `rounded-card`).

| Token                            | Value                 | Contrast on base | Role                              |
| -------------------------------- | --------------------- | ---------------- | --------------------------------- |
| `--color-bg`                     | `#0d0d0b`             | —                | Page base                         |
| `--color-surface` / `-2`         | `#111110` / `#161614` | —                | Card and section contrast         |
| `--color-cream` / `--color-ink`  | `#f2f1eb` / `#1c1b18` | 15.2:1           | Light-section inversion           |
| `--color-text`                   | `#e8e0d0`             | 14.8:1           | Body                              |
| `--color-muted`                  | `#888880`             | 5.5:1            | Secondary                         |
| `--color-faint`                  | `#7c7c74`             | 4.6:1            | Tertiary — footer nav, counters   |
| `--color-disabled`               | `#3e3e3a`             | 1.8:1            | Disabled controls only (AA exempt) |
| `--color-accent`                 | `#d62828`             | 3.9:1            | Fills, large display type         |
| `--color-accent-hi`              | `#ff4b4b`             | 5.9:1            | Accent as small text on dark      |
| `--color-on-accent`              | `#fff5f2`             | 4.7:1 on accent  | Text on an accent fill            |

The red is split into three tokens deliberately: `#d62828` fails AA for small text, so fine strokes and small labels use `accent-hi` and text on accent fills uses `on-accent`.

`--color-faint` was `#3e3e3a` (1.8:1) and carried real content. `--color-disabled` keeps that value for genuinely disabled controls, which WCAG exempts.

Accent discipline: primary CTA, one word in the hero headline, and the display stat counters.

A fixed SVG grain overlay runs at `body::after`, opacity `0.035`, `z-index: 9999`.

Fonts are self-hosted from `public/fonts/` (latin subset, woff2) and the two above-the-fold faces are preloaded — previously four DNS/TLS round trips to Google before any text could paint.

---

## Motion

Everything scroll-triggered goes through [`useInView`](src/hooks/useInView.js) — a one-shot IntersectionObserver that disconnects after firing — paired with [`reveal(vis, delay, axis)`](src/lib/motion.js).

All scroll work shares one listener via [`onScrollFrame`](src/lib/scroll.js), and subscribers write style directly rather than calling `setState`. There were previously five independent listeners, three of which re-rendered whole sections every frame to animate one `border-radius`.

**Every motion path respects `prefers-reduced-motion`**, via [`useReducedMotion`](src/hooks/useReducedMotion.js) in JS and a global damper in CSS.

Specialised pieces:

- **[Intro](src/sections/Intro.jsx)** — full-screen video overlay that locks `body` scroll and dissolves on wheel, touch, click, any key, or a 7s timeout. Shows once per session (`sessionStorage`), and not at all under reduced motion.
- **[introGate](src/lib/introGate.js)** — lets the hero defer its video while the overlay is up, so the file is requested once instead of by two elements simultaneously.
- **[useCounter](src/hooks/useCounter.js)** — `easeOutExpo` 0 → target on rAF, cancelled on unmount.
- **[useScrollRadius](src/hooks/useScrollRadius.js)** — light sections tuck corners from 28px to flat as they rise into view.
- **[ScrollToHash](src/components/ScrollToHash.jsx)** — restores fragment jumps under client-side routing, holding the scroll until the intro gate opens. Anchor offset comes from `scroll-margin-top` on `[id]`, so jumps use `scrollIntoView()` rather than measuring `offsetTop`.

`useMobile` is `matchMedia`-backed and reserved for structural branches only — the hamburger menu and font-size props. Pure styling branches use Tailwind `md:`.

---

## Booking form

[BookingHero](src/sections/BookingHero.jsx) POSTs to [`/api/lead`](api/lead.js). Configure **one** of these in the Vercel project:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` + `LEAD_TO_EMAIL` | Email the lead (optionally `LEAD_FROM_EMAIL`) |
| `LEAD_WEBHOOK_URL` | POST the JSON to Zapier / Make / Slack / a CRM |

With neither set the endpoint returns **503** and the form shows a mailto/tel fallback. It never reports success it did not achieve.

The endpoint validates and length-caps every field, strips control characters, rate-limits per IP, and drops honeypot submissions.

`vite dev` does not run `/api` — use `vercel dev` to exercise the endpoint locally.

---

## Deployment

Vercel, configured in [vercel.json](vercel.json):

- **No SPA catch-all.** `/` and `/get-started` are real files on disk, so unmatched paths fall through to `dist/404.html` with a genuine **HTTP 404** instead of a soft-404 served as 200. Adding a route means adding it to `scripts/route-shells.mjs`.
- `/assets/*` and `/fonts/*` are `immutable` for a year; the shell must revalidate.
- Security headers: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.

The CSP allows `frame-src` for `google.com`/`maps.google.com` — the map facade. If you remove the map, tighten it.

---

## Before launch

- [ ] **Replace the placeholders in [content.js](src/data/content.js)** — `business.phone`, `business.email`, `business.url` and all three `socials` URLs are fictional and are published as real links.
- [ ] Configure `RESEND_API_KEY` + `LEAD_TO_EMAIL` (or `LEAD_WEBHOOK_URL`), then submit the form once and confirm it arrives.
- [ ] Update the origin in `vercel.json` comments, `public/robots.txt`, `public/sitemap.xml`, `index.html` and `scripts/route-shells.mjs` if the domain is not `apex-performance.vercel.app`.
- [ ] Enable Analytics and Speed Insights in the Vercel dashboard (the components are already mounted).
- [ ] The client testimonials, before/after photos and stat counters are placeholder marketing claims. Confirm they are substantiated.

---

## Notes

- `content-visibility: auto` was assessed for below-fold sections and **not** applied: every major section is an anchor target, and a `contain-intrinsic-size` mismatch would land a `/#pricing` deep link in the wrong place. The rendering saving did not justify that on a page that is now under 1 MB.
- Full server-side prerendering of body content was also assessed and skipped in favour of the static route shells — see the rationale at the top of [scripts/route-shells.mjs](scripts/route-shells.mjs).
