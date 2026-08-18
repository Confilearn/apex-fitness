/*
  POST /api/lead — booking form endpoint.

  The form used to fake a 1.4s submit and show a success screen without
  sending anything, so every enquiry was silently discarded.

  Delivery is whichever of these is configured, in order:
    RESEND_API_KEY + LEAD_TO_EMAIL   email the lead
    LEAD_WEBHOOK_URL                 POST the JSON (Zapier, Make, Slack, CRM)

  If neither is set the endpoint returns 503 rather than a false success —
  the UI then shows the mailto fallback. Never pretend a lead landed.
*/

const MAX = { name: 100, email: 200, phone: 40, goal: 40, message: 2000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Small in-memory throttle. Serverless instances are short-lived and not
   shared, so this only blunts naive floods — put a WAF in front for real
   protection. */
const hits = new Map();
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // bound memory
  return recent.length > RATE_LIMIT;
}

/* Strip control characters (a header-injection vector), trim, cap length. */
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f]/g;
const clean = (v, max) => (typeof v === 'string' ? v.replace(CONTROL, '').trim().slice(0, max) : '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  // Honeypot: a real person never fills a field they cannot see. Accept the
  // request so the bot does not learn anything, but drop it.
  if (clean(body.company, 100)) return res.status(200).json({ ok: true });

  const lead = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    phone: clean(body.phone, MAX.phone),
    goal: clean(body.goal, MAX.goal),
    message: clean(body.message, MAX.message),
  };

  const errors = {};
  if (!lead.name) errors.name = 'Required';
  if (!lead.email) errors.email = 'Required';
  else if (!EMAIL.test(lead.email)) errors.email = 'Enter a valid email address';
  if (!lead.goal) errors.goal = 'Required';
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Invalid submission', errors });

  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL, LEAD_WEBHOOK_URL } = process.env;
  const received = new Date().toISOString();

  try {
    if (RESEND_API_KEY && LEAD_TO_EMAIL) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: LEAD_FROM_EMAIL || 'Apex Performance <onboarding@resend.dev>',
          to: [LEAD_TO_EMAIL],
          reply_to: lead.email,
          subject: `New discovery call request — ${lead.name}`,
          text: [
            `Name:    ${lead.name}`,
            `Email:   ${lead.email}`,
            `Phone:   ${lead.phone || '—'}`,
            `Goal:    ${lead.goal}`,
            '',
            lead.message || '(no message)',
            '',
            `Received: ${received}`,
          ].join('\n'),
        }),
      });
      if (!r.ok) throw new Error(`Resend responded ${r.status}: ${await r.text()}`);
      return res.status(200).json({ ok: true });
    }

    if (LEAD_WEBHOOK_URL) {
      const r = await fetch(LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, received, source: 'apex-performance/get-started' }),
      });
      if (!r.ok) throw new Error(`Webhook responded ${r.status}`);
      return res.status(200).json({ ok: true });
    }
  } catch (err) {
    console.error('[lead] delivery failed:', err);
    return res.status(502).json({ error: 'We could not send that just now.' });
  }

  console.error('[lead] no delivery configured — set RESEND_API_KEY + LEAD_TO_EMAIL or LEAD_WEBHOOK_URL');
  return res.status(503).json({ error: 'Booking is not configured yet.' });
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
