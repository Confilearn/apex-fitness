/**
 * Post-build step — emits a static HTML shell per route.
 *
 * Why this and not full prerendering:
 *
 * The gap worth closing is that social scrapers (Slack, WhatsApp, iMessage,
 * LinkedIn) do not execute JavaScript, so a client-set <meta> reaches them as
 * nothing. Every route previously served the identical index.html, meaning a
 * shared /get-started link previewed as the homepage.
 *
 * That is fixed by giving each route its own shell with its own baked meta —
 * no React, no hydration, no risk. Rendering the body server-side as well was
 * assessed and deliberately skipped: this app reads matchMedia, sessionStorage
 * and an intro-overlay gate during render, so the hydration surface across
 * three routes and two media-query states costs more to verify than the
 * remaining benefit (Google already executes JS, and FCP is now ~0.9 MB away).
 *
 * Vercel checks the filesystem before applying rewrites, so these shells win
 * over the SPA fallback for their exact paths.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const ORIGIN = 'https://apex-performance.vercel.app';

const routes = [
  {
    out: 'get-started/index.html',
    path: '/get-started',
    title: 'Book a Free Discovery Call — Apex Performance',
    description:
      'Book a free 20-minute discovery call with Marcus Kane. We cover your goals, current fitness level and schedule, then build your plan within 48 hours.',
  },
  {
    out: '404.html',
    path: '/404',
    title: '404 — Page Not Found | Apex Performance',
    description: 'That page does not exist. Head back to Apex Performance.',
    noindex: true,
  },
];

const shell = readFileSync(join(DIST, 'index.html'), 'utf8');

const swapTag = (html, pattern, replacement) =>
  pattern.test(html) ? html.replace(pattern, replacement) : html;

let written = 0;
for (const route of routes) {
  let html = shell;

  html = swapTag(html, /<title>[^<]*<\/title>/, `<title>${route.title}</title>`);
  html = swapTag(
    html,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${route.description}" />`
  );
  html = swapTag(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${ORIGIN}${route.path}" />`
  );

  for (const [attr, key] of [
    ['property', 'og:title'],
    ['name', 'twitter:title'],
  ]) {
    html = swapTag(
      html,
      new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`),
      `<meta ${attr}="${key}" content="${route.title}" />`
    );
  }
  for (const [attr, key] of [
    ['property', 'og:description'],
    ['name', 'twitter:description'],
  ]) {
    html = swapTag(
      html,
      new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`),
      `<meta ${attr}="${key}" content="${route.description}" />`
    );
  }
  html = swapTag(
    html,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${ORIGIN}${route.path}" />`
  );

  if (route.noindex) {
    html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
  }

  const target = join(DIST, route.out);
  mkdirSync(join(target, '..'), { recursive: true });
  writeFileSync(target, html);
  console.log(`  ${route.out.padEnd(24)} ${route.title}`);
  written += 1;
}

console.log(`\nWrote ${written} route shells.\n`);
