import { useEffect, useState } from 'react';
import { FormField, FormSelect, Honeypot } from '../components/FormField';
import { Img } from '../components/Img';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { lift } from '../lib/motion';
import { business } from '../data/content';

const goalOptions = [
  { value: '', label: 'Select a goal...' },
  { value: 'strength', label: 'Build Real Strength' },
  { value: 'conditioning', label: 'Improve Conditioning' },
  { value: 'weight', label: 'Lose Weight / Cut' },
  { value: 'injury', label: 'Injury Recovery' },
  { value: 'performance', label: 'Athletic Performance' },
  { value: 'general', label: 'General Fitness' },
];

const EMPTY = { name: '', email: '', phone: '', goal: '', message: '', company: '' };

/* ════════════════════════════════════════════════════════════
   BOOKING HERO
   Job: convert the click into a booked call.
   Left: cinematic photo panel. Right: the form.

   Submits to /api/lead. It previously ran a 1.4s timeout and showed the
   success screen without sending anything, so every enquiry was lost.
   A failed send now says so and offers a mailto fallback rather than
   claiming success.
   ════════════════════════════════════════════════════════════ */
export const BookingHero = () => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [vis, setVis] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 180);
    return () => clearTimeout(t);
  }, []);

  const update = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrors({});

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('sent');
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data.errors) setErrors(data.errors);
      setStatus('error');
    } catch {
      // Offline, DNS failure, request blocked — all land here.
      setStatus('error');
    }
  };

  // Two-element entrance stagger — per-element delay, so inline.
  const fd = (d) =>
    reduced
      ? { opacity: vis ? 1 : 0, transition: `opacity .5s ease ${d}ms` }
      : {
          opacity: vis ? 1 : 0,
          transform: vis ? 'none' : 'translateY(28px)',
          transition: `opacity .75s ease ${d}ms, transform .75s cubic-bezier(0.25,0.46,0.45,0.94) ${d}ms`,
        };

  const sending = status === 'sending';

  return (
    <section className="flex min-h-screen items-center bg-bg pt-20">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 md:px-14 md:py-10">
        <div className="grid grid-cols-1 items-stretch gap-5 md:min-h-[660px] md:grid-cols-[44%_56%]">
          {/* ── Left — photo panel ── */}
          <div style={fd(0)} className="relative min-h-[280px] overflow-hidden rounded-card md:min-h-auto">
            <Img
              name="trainer-session"
              alt=""
              sizes="(max-width: 767px) 100vw, 530px"
              priority
              className="absolute inset-0 block h-full w-full object-cover object-center brightness-[0.5] contrast-[1.12]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,13,11,0.97)_0%,rgba(13,13,11,0.12)_55%,transparent_100%)]" />

            {/* Stat chips */}
            <div className="absolute top-6 left-6 flex gap-2.5">
              {[
                { n: '500+', l: 'Clients' },
                { n: '99%', l: 'Satisfaction' },
              ].map(({ n, l }) => (
                <div
                  key={l}
                  className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(13,13,11,0.65)] px-4.5 py-2.5 backdrop-blur-md"
                >
                  <div className="font-display text-[28px] leading-none tracking-[.04em] text-accent-hi">{n}</div>
                  <div className="mt-[3px] text-[9px] font-medium tracking-[0.14em] text-[rgba(232,224,208,0.7)] uppercase">
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom text */}
            <div className="absolute right-9 bottom-9 left-9">
              <p className="mb-3.5 font-display text-[clamp(34px,3.8vw,52px)] leading-[0.95] text-text">
                Your Transformation
                <br />
                Starts Here.
              </p>
              <p className="text-[13px] leading-[1.65] font-light text-[rgba(232,224,208,0.72)]">
                A free 20-minute call to map out your path forward. No pressure, no filler.
              </p>
            </div>
          </div>

          {/* ── Right — form card ── */}
          <div
            style={fd(140)}
            className="flex flex-col justify-center rounded-card border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-6 py-8 md:px-13 md:py-12"
          >
            <div className="mb-2.5 text-[11px] font-medium tracking-[0.2em] text-muted uppercase">
              Free Consultation
            </div>
            <h1 className="mb-2.5 font-body text-[clamp(30px,3vw,44px)] leading-none font-extrabold tracking-[-0.03em] text-text">
              Book Your
              <br />
              <span className="text-accent">Discovery Call</span>
            </h1>
            <p className="mb-8 text-[13px] leading-[1.72] font-light text-muted">
              20 minutes. Zero pressure. We&apos;ll figure out if we&apos;re the right fit.
            </p>

            {status === 'sent' ? (
              <div className="py-13 text-center" role="status">
                <div className="mb-3.5 font-display text-[60px] tracking-[.04em] text-accent-hi">
                  You&apos;re In.
                </div>
                <p className="text-sm leading-[1.72] font-light text-muted">
                  We&apos;ll be in touch within 24 hours to confirm your call time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative flex flex-col gap-3.5" noValidate>
                <Honeypot value={form.company} onChange={update('company')} />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <FormField
                    label="First Name"
                    placeholder="Alex"
                    value={form.name}
                    onChange={update('name')}
                    error={errors.name}
                    autoComplete="given-name"
                    required
                  />
                  <FormField
                    label="Email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={update('email')}
                    error={errors.email}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <FormField
                    label="Phone (optional)"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={update('phone')}
                    error={errors.phone}
                    autoComplete="tel"
                  />
                  <FormSelect
                    label="Training Goal"
                    value={form.goal}
                    onChange={update('goal')}
                    error={errors.goal}
                    options={goalOptions}
                    required
                  />
                </div>
                <FormField
                  label="Anything else we should know?"
                  placeholder="Current fitness level, injuries, schedule preferences..."
                  value={form.message}
                  onChange={update('message')}
                  error={errors.message}
                  textarea
                />

                <button
                  type="submit"
                  disabled={sending}
                  {...lift(1.02, '0 0 32px rgba(214,40,40,0.42)')}
                  className={`mt-1 w-full rounded-[10px] border-none p-4 text-[13px] font-bold tracking-[0.14em] text-on-accent uppercase transition-[transform,box-shadow,background] duration-200 ease-css
                    ${sending ? 'cursor-wait bg-[rgba(214,40,40,0.65)]' : 'cursor-pointer bg-accent'}`}
                >
                  {sending ? 'Sending...' : 'Book My Free Call →'}
                </button>

                {/* Never claim a lead landed when it did not. */}
                <div aria-live="polite">
                  {status === 'error' && (
                    <p className="rounded-[10px] border border-[rgba(255,75,75,0.3)] bg-[rgba(214,40,40,0.1)] p-3.5 text-center text-[12px] leading-[1.6] text-accent-hi">
                      That didn&apos;t go through. Email{' '}
                      <a href={`mailto:${business.email}`} className="underline underline-offset-2">
                        {business.email}
                      </a>{' '}
                      or call{' '}
                      <a href={`tel:${business.phone}`} className="underline underline-offset-2">
                        {business.phoneDisplay}
                      </a>
                      .
                    </p>
                  )}
                </div>

                <p className="text-center text-[11px] leading-[1.6] text-faint">
                  No spam. Your details are private and never shared.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
