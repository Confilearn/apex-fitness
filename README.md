# Apex Performance

Single-page marketing site for a personal training business. Dark, cinematic, results-forward — near-black base, one deep red accent, Bebas Neue display type over DM Sans body.

Built with React 18 + Vite 8 + Tailwind CSS 4.

---

## Quick start

```bash
npm install
npm run dev      # dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # serve the built output
```

No environment variables, no backend. Everything runs client-side.

---

## Routes

| Path           | Page                   | Composition                                                                                  |
| -------------- | ---------------------- | -------------------------------------------------------------------------------------------- |
| `/`            | `pages/Home.jsx`       | Intro → Hero → About → Services → Process → ClientResults → Reviews → Pricing → FAQ → Footer |
| `/get-started` | `pages/GetStarted.jsx` | BookingHero (form) → Location → FAQ → Footer                                                 |
| `*`            | `pages/NotFound.jsx`   | 404 — mirrors the Hero composition, hands back a jump list into every real section           |

`Nav` and `ScrollToHash` sit above the router in [App.jsx](src/App.jsx), so both are shared across every route.

---

## Structure

```
src/
  main.jsx            BrowserRouter + StrictMode entry
  App.jsx             routes, shared Nav
  index.css           design tokens (@theme), base layer, .nav-* and .gs-* components
  pages/              route-level compositions
  sections/           full-width page sections, one file each
  components/         shared UI — Nav, FAQ, Footer, Label, SBtn, FormField, icons
  hooks/              useInView, useCounter, useScrollRadius, useMobile, useDocumentTitle
  lib/motion.js       reveal() transform + stagger, accentHover
  data/content.js     all copy — services, steps, clients, reviews, plans, FAQs, gyms, nav labels
public/assets/        photos, before/after pairs, hero + intro video, SVG icons
```

**All copy lives in [src/data/content.js](src/data/content.js).** Rewriting the site for another client is a content edit plus a token swap — not a component rewrite.

---

## Design system

Tokens are declared once in [index.css](src/index.css#L8) under Tailwind 4's `@theme`, so utilities generate straight from them (`bg-bg`, `text-accent`, `font-display`, `rounded-card`).

| Token                            | Value                 | Role                              |
| -------------------------------- | --------------------- | --------------------------------- |
| `--color-bg`                     | `#0d0d0b`             | Page base                         |
| `--color-surface` / `-2`         | `#111110` / `#161614` | Card and section contrast         |
| `--color-cream` / `--color-ink`  | `#f2f1eb` / `#1c1b18` | Light-section inversion           |
| `--color-text` / `--color-muted` | `#e8e0d0` / `#888880` | Body / secondary                  |
| `--color-accent`                 | `#d62828`             | Fills, large display type         |
| `--color-accent-hi`              | `#ff4b4b`             | Accent as small text on dark (AA) |
| `--color-on-accent`              | `#fff5f2`             | Text on an accent fill            |

The red is split into three tokens deliberately: `#d62828` sits at 3.85:1 on the base and fails AA for small text, so fine strokes and small labels use `accent-hi` and text on accent fills uses `on-accent`.

Accent discipline: primary CTA, one word in the hero headline, nowhere else.

A fixed SVG grain overlay runs at `body::after`, opacity `0.035`, `z-index: 9999`.

---

## Motion

Everything scroll-triggered goes through [`useInView`](src/hooks/useInView.js) — a one-shot IntersectionObserver that disconnects after firing — paired with [`reveal(vis, delay, axis)`](src/lib/motion.js) for the transform and per-element stagger.

Specialised pieces:

- **[Intro](src/sections/Intro.jsx)** — full-screen video overlay that locks `body` scroll, accumulates wheel delta to a 280px threshold, then dissolves over 1.2s. Replays on every arrival at `/`.
- **[useCounter](src/hooks/useCounter.js)** — `easeOutExpo` 0 → target on rAF, for the hero and process stat counters.
- **[useScrollRadius](src/hooks/useScrollRadius.js)** — light sections tuck corners from 28px to flat as they rise into view. Computed per scroll frame, so it stays an inline style.
- **[ScrollToHash](src/components/ScrollToHash.jsx)** — restores fragment jumps under client-side routing, and holds the scroll until the Intro overlay releases `overflow: hidden` (which would otherwise clamp `scrollTo`).

`useMobile` is reserved for structural branches only — the hamburger menu and font-size props. Pure styling branches use Tailwind `md:`.

---

## Notes

- The booking form in [BookingHero.jsx](src/sections/BookingHero.jsx#L34) is **UI-only** — it simulates a 1.4s submit then shows a success state. Wire `handleSubmit` to a real endpoint before launch.
- Fonts load from Google Fonts via `<link>` in [index.html](index.html) — Bebas Neue and DM Sans variable.
- `creds` in `content.js` is declared but unrendered; no credential marquee exists yet.
- Deploy target is any static host. Build output is `dist/`; SPA routing needs a rewrite rule sending unmatched paths to `index.html`.

---
