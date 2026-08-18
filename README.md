# Apex Performance

Marketing site for a personal training business. Dark, cinematic, results-forward — near-black base, one deep red accent, Bebas Neue over DM Sans.

React 18 + Vite 8 + Tailwind 4. No backend beyond one serverless function.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the build on :4173

npm run lint
npm run smoke    # browser checks (needs `preview` running)
npm run optimize:media   # regenerate images/video from media-src/
```

---

## Routes

| Path | Page |
| --- | --- |
| `/` | Intro → Hero → About → Services → Process → ClientResults → Reviews → Pricing → FAQ → Footer |
| `/get-started` | BookingHero (form) → Location → FAQ → Footer |
| `*` | 404 — mirrors the Hero, with a jump list into every section |

`/get-started` and the 404 are lazy chunks; Home stays eager. Each route gets a static HTML shell at build time with its own meta tags, because social scrapers don't run JavaScript.

---

## Structure

```
src/
  App.jsx           routes, shared Nav, error boundary, skip link
  index.css         @font-face, design tokens (@theme), focus, reduced motion
  pages/            route compositions
  sections/         one file per full-width section
  components/       Nav, FAQ, Footer, Img, Seo, ErrorBoundary, FormField, icons
  hooks/            useInView, useCounter, useScrollRadius, useMediaQuery,
                    useMobile, useReducedMotion
  lib/              media.js, motion.js, scroll.js, introGate.js
  data/content.js   ALL copy and business details
  assets/media/     generated derivatives (committed, 3.7 MB)
api/lead.js         booking form endpoint
media-src/          masters (gitignored, 175 MB)
```

**All copy lives in [content.js](src/data/content.js).** Reskinning for another client is a content edit plus a token swap.

---

## Media

Masters go in `media-src/` and are never modified. `npm run optimize:media` writes WebP at three widths plus the video into `src/assets/media/`, where Vite content-hashes them so they can be cached for a year.

| | Before | After |
| --- | --- | --- |
| Homepage payload | ~133 MB | **0.87 MB** |
| Build output | 222 MB | **4.3 MB** |
| Hero video | 68 MB | 1.0 MB MP4 + 0.64 MB WebM |

Every photo renders through [`<Img>`](src/components/Img.jsx), which always emits `srcset`, `sizes`, intrinsic dimensions, lazy loading and async decoding.

> Masters are gitignored; derivatives are committed, so a fresh clone builds.

---

## Design tokens

Declared once in [index.css](src/index.css) under Tailwind's `@theme`, so utilities generate from them (`bg-bg`, `text-accent`, `font-display`).

| Token | Value | Contrast | Role |
| --- | --- | --- | --- |
| `bg` / `surface` / `surface-2` | `#0d0d0b` / `#111110` / `#161614` | — | Dark base and cards |
| `cream` / `ink` | `#f2f1eb` / `#1c1b18` | 15.2:1 | Light-section inversion |
| `text` | `#e8e0d0` | 14.8:1 | Body |
| `muted` | `#888880` | 5.5:1 | Secondary |
| `faint` | `#7c7c74` | 4.6:1 | Tertiary |
| `disabled` | `#3e3e3a` | 1.8:1 | Disabled controls only |
| `accent` | `#d62828` | 3.9:1 | Fills, large display type |
| `accent-hi` | `#ff4b4b` | 5.9:1 | Accent as small text |
| `on-accent` | `#fff5f2` | 4.7:1 | Text on an accent fill |

The red is three tokens on purpose: `#d62828` fails AA for small text, so small labels use `accent-hi` and text on fills uses `on-accent`. `disabled` is the only sub-AA value and WCAG exempts it.

Fonts are self-hosted from `public/fonts/` and the two above-the-fold faces are preloaded.

---

## Motion

Scroll reveals use [`useInView`](src/hooks/useInView.js) (one-shot IntersectionObserver) with [`reveal()`](src/lib/motion.js). All scroll work shares one listener via [`onScrollFrame`](src/lib/scroll.js) and writes style directly rather than calling `setState`.

**Every motion path respects `prefers-reduced-motion`.**

- **[Intro](src/sections/Intro.jsx)** — video overlay, dismissed by wheel, touch, click, any key, or a 7s timeout. Once per session; skipped entirely under reduced motion.
- **[introGate](src/lib/introGate.js)** — lets the hero defer its video while the overlay is up, so the file is requested once.
- **[ScrollToHash](src/components/ScrollToHash.jsx)** — restores fragment jumps under client routing. Nav offset comes from `scroll-margin-top` on `[id]`.

---

## Booking form

[BookingHero](src/sections/BookingHero.jsx) POSTs to [`/api/lead`](api/lead.js). Set **one** of these in Vercel:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` + `LEAD_TO_EMAIL` | Email the lead |
| `LEAD_WEBHOOK_URL` | POST JSON to Zapier / Slack / a CRM |

With neither set the endpoint returns 503 and the form shows a mailto/tel fallback — it never reports a success it didn't achieve.

`vite dev` doesn't run `/api`; use `vercel dev`.

---

## Deployment

Vercel, configured in [vercel.json](vercel.json).

There is **no SPA catch-all**: `/` and `/get-started` are real files, so unmatched paths fall through to `404.html` with a genuine HTTP 404. Adding a route means adding it to [scripts/route-shells.mjs](scripts/route-shells.mjs).

`/assets/*` and `/fonts/*` are immutable for a year; the shell revalidates. CSP, HSTS and the usual security headers are set.

---

## Before launch

- [ ] **Replace the placeholders in [content.js](src/data/content.js)** — `phone`, `email`, `url` and all three social URLs are fictional and publish as real links.
- [ ] Configure the form delivery variables, then submit once and confirm it arrives.
- [ ] Update the origin in `index.html`, `vercel.json`, `robots.txt`, `sitemap.xml` and `route-shells.mjs` if the domain changes.
- [ ] Enable Analytics and Speed Insights in the Vercel dashboard.
- [ ] Testimonials, before/after photos and stat counters are placeholder claims — confirm they're substantiated.

---

## Known gaps

- **Process on mobile** puts 5 steps in a 2-column grid, so step 05 sits alone with an empty cell. Design call, not yet made.
- **`content-visibility`** was skipped: every section is an anchor target, and an intrinsic-size mismatch would land deep links in the wrong place.
- **Full SSR** was skipped in favour of the static route shells — rationale at the top of [route-shells.mjs](scripts/route-shells.mjs).
