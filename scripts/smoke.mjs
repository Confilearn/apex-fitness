/**
 * Runtime smoke test — `npm run smoke` (expects `npm run preview` on :4173).
 *
 * Drives the built site in real Chrome and asserts the things that static
 * checks cannot: that React mounts, that no console errors or failed
 * requests appear, that every route renders its landmarks, and that the
 * total transferred weight stays in budget.
 */
import puppeteer from 'puppeteer-core';

const BASE = process.env.SMOKE_BASE || 'http://localhost:4173';
const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const results = [];
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

async function visit(path, { reducedMotion = false, mobile = false } = {}) {
  const page = await browser.newPage();
  const errors = [];
  const failed = [];
  let transferred = 0;

  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  if (mobile) await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  else await page.setViewport({ width: 1440, height: 900 });

  const isVercelRuntime = (t) => t.includes('/_vercel/');

  page.on('console', (m) => {
    if (m.type() === 'error' && !isVercelRuntime(m.location()?.url || '')) errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    if (!isVercelRuntime(r.url())) failed.push(`${r.url()} ${r.failure()?.errorText}`);
  });
  page.on('response', async (r) => {
    if (r.status() >= 400 && !isVercelRuntime(r.url())) failed.push(`${r.status()} ${r.url()}`);
    try {
      const len = Number(r.headers()['content-length'] || 0);
      transferred += len;
    } catch {
      /* headers unavailable on some redirects */
    }
  });

  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle2', timeout: 45000 });
  return { page, errors, failed, transferred };
}

/* The homepage intro overlay covers the viewport until dismissed. */
async function dismissIntro(page) {
  await page.evaluate(() => window.dispatchEvent(new WheelEvent('wheel', { deltaY: 400 })));
  await new Promise((r) => setTimeout(r, 1600));
}

/* ── / ── */
{
  const { page, errors, failed, transferred } = await visit('/');

  // The intro overlay gates the homepage; dismiss it the way a visitor would.
  await dismissIntro(page);

  const mounted = await page.$eval('#root', (el) => el.children.length > 0);
  record('/ mounts React', mounted);

  const h1 = await page.$$eval('h1', (n) => n.map((e) => e.textContent.trim()));
  record('/ has exactly one h1', h1.length === 1, h1.join(' | ').slice(0, 60));

  const main = await page.$('main#main');
  record('/ has main landmark', !!main);

  const sections = await page.evaluate(() =>
    ['about', 'services', 'process', 'results', 'reviews', 'pricing', 'faq'].filter(
      (id) => !document.getElementById(id)
    )
  );
  record('/ all nav targets exist', sections.length === 0, sections.join(', '));

  const lazy = await page.$$eval('img', (imgs) => ({
    total: imgs.length,
    lazy: imgs.filter((i) => i.loading === 'lazy').length,
    noSrcset: imgs.filter((i) => !i.srcset && !i.src.endsWith('.svg')).length,
    noDims: imgs.filter((i) => !i.getAttribute('width')).length,
  }));
  record('/ images carry srcset', lazy.noSrcset === 0, `${lazy.total} imgs, ${lazy.noSrcset} without`);
  record('/ images carry dimensions', lazy.noDims === 0, `${lazy.noDims} without`);

  const noAria = await page.$$eval('button', (btns) =>
    btns.filter((b) => !b.textContent.trim() && !b.getAttribute('aria-label')).length
  );
  record('/ no unlabelled buttons', noAria === 0, `${noAria} unlabelled`);

  const deadControls = await page.$$eval('a[href="#"], a:not([href])', (els) => els.length);
  record('/ no dead links', deadControls === 0, `${deadControls} found`);

  record('/ no console errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  record('/ no failed requests', failed.length === 0, failed.slice(0, 2).join(' | '));

  const mb = transferred / 1048576;
  record('/ payload under 5 MB', mb < 5, `${mb.toFixed(2)} MB`);

  await page.close();
}

/* ── /get-started ── */
{
  const { page, errors, failed } = await visit('/get-started');
  const heading = await page.$eval('h1', (el) => el.textContent.trim()).catch(() => '');
  record('/get-started renders', heading.includes('Discovery'), heading.slice(0, 40));

  const labelled = await page.$$eval('input:not([type=hidden]), select, textarea', (fields) =>
    fields.filter((f) => {
      if (f.closest('[aria-hidden="true"]')) return false; // honeypot
      return !f.labels?.length && !f.getAttribute('aria-label');
    }).length
  );
  record('/get-started all fields labelled', labelled === 0, `${labelled} unlabelled`);

  const mapIframes = await page.$$eval('iframe', (f) => f.length);
  record('/get-started map is deferred', mapIframes === 0, `${mapIframes} iframes on load`);

  record('/get-started no console errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  record('/get-started no failed requests', failed.length === 0, failed.slice(0, 2).join(' | '));
  await page.close();
}

/* ── 404 ── */
{
  const { page, errors } = await visit('/definitely-not-a-page');
  const body = await page.$eval('body', (el) => el.innerText);
  record('404 renders', body.includes('Went Off'), '');
  const robots = await page.$eval('meta[name="robots"]', (el) => el.content).catch(() => '');
  record('404 is noindex', robots.includes('noindex'), robots);
  record('404 no console errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  await page.close();
}

/* ── reduced motion ── */
{
  const { page, errors } = await visit('/', { reducedMotion: true });
  const introGone = await page.evaluate(() => !document.querySelector('[aria-label="Skip intro"]'));
  record('reduced motion skips intro overlay', introGone);
  const video = await page.$$eval('video', (v) => v.length);
  record('reduced motion serves poster not video', video === 0, `${video} video elements`);
  record('reduced motion no console errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  await page.close();
}

/* ── mobile ── */
{
  const { page, errors } = await visit('/', { mobile: true });
  await dismissIntro(page); // otherwise the overlay swallows the click
  const burger = await page.$('button[aria-controls="mobile-menu"]');
  record('mobile shows hamburger', !!burger);
  if (burger) {
    await burger.click();
    await new Promise((r) => setTimeout(r, 400));
    const expanded = await page.$eval('button[aria-controls="mobile-menu"]', (b) => b.getAttribute('aria-expanded'));
    record('mobile menu reports expanded', expanded === 'true', String(expanded));
  }
  /*
    Horizontal overflow guard. body{overflow-x:hidden} hides the scrollbar but
    not the consequences: the document box still widens, and a fixed element's
    left:50% then resolves against the overflow area instead of the viewport,
    which silently drags the nav pill off-centre on every page.
  */
  const box = await page.evaluate(() => {
    const de = document.documentElement;
    const nav = document.querySelector('nav[aria-label="Main"]').getBoundingClientRect();
    return {
      viewport: de.clientWidth,
      scrollWidth: de.scrollWidth,
      leftGap: Math.round(nav.left),
      rightGap: Math.round(de.clientWidth - nav.right),
    };
  });
  record(
    'mobile has no horizontal overflow',
    box.scrollWidth <= box.viewport,
    `viewport ${box.viewport}, scrollWidth ${box.scrollWidth}`
  );
  record(
    'mobile nav pill is centred',
    Math.abs(box.leftGap - box.rightGap) <= 1,
    `left ${box.leftGap}px vs right ${box.rightGap}px`
  );

  record('mobile no console errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  await page.close();
}

await browser.close();

const failedCount = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failedCount}/${results.length} passed`);
process.exit(failedCount ? 1 : 0);

