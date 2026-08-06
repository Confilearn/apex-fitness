import { useEffect, useState } from 'react';
import { FormField, FormSelect } from '../components/FormField';

const goalOptions = [
  { value: '', label: 'Select a goal...' },
  { value: 'strength', label: 'Build Real Strength' },
  { value: 'conditioning', label: 'Improve Conditioning' },
  { value: 'weight', label: 'Lose Weight / Cut' },
  { value: 'injury', label: 'Injury Recovery' },
  { value: 'performance', label: 'Athletic Performance' },
  { value: 'general', label: 'General Fitness' },
];

/* ════════════════════════════════════════════════════════════
   BOOKING HERO
   Job: convert the click into a booked call.
   Left: cinematic photo panel. Right: the form.

   NOTE: submission is still simulated — a 1.4s timeout, then the
   confirmation state. There is no backend wired up.
   ════════════════════════════════════════════════════════════ */
export const BookingHero = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', goal: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 180);
    return () => clearTimeout(t);
  }, []);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  // Two-element entrance stagger — per-element delay, so inline.
  const fd = (d) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'none' : 'translateY(28px)',
    transition: `opacity .75s ease ${d}ms, transform .75s cubic-bezier(0.25,0.46,0.45,0.94) ${d}ms`,
  });

  return (
    <section className="flex min-h-screen items-center bg-bg pt-20">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 md:px-14 md:py-10">
        <div className="grid grid-cols-1 items-stretch gap-5 md:min-h-[660px] md:grid-cols-[44%_56%]">
          {/* ── Left — photo panel ── */}
          <div style={fd(0)} className="relative min-h-[280px] overflow-hidden rounded-card md:min-h-auto">
            <img
              src="/assets/woman-doing-workout-gym-with-trainer.jpg"
              alt="Training session"
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
                  <div className="font-display text-[28px] leading-none tracking-[.04em] text-accent">{n}</div>
                  <div className="mt-[3px] text-[9px] font-medium tracking-[0.14em] text-[rgba(232,224,208,0.45)] uppercase">
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom text */}
            <div className="absolute right-9 bottom-9 left-9">
              <div className="mb-3.5 font-display text-[clamp(34px,3.8vw,52px)] leading-[0.95] text-text">
                Your Transformation
                <br />
                Starts Here.
              </div>
              <p className="text-[13px] leading-[1.65] font-light text-[rgba(232,224,208,0.5)]">
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

            {sent ? (
              <div className="py-13 text-center">
                <div className="mb-3.5 font-display text-[60px] tracking-[.04em] text-accent">
                  You&apos;re In.
                </div>
                <p className="text-sm leading-[1.72] font-light text-muted">
                  We&apos;ll be in touch within 24 hours to confirm your call time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <FormField
                    label="First Name"
                    placeholder="Jordan"
                    value={form.name}
                    onChange={update('name')}
                    required
                  />
                  <FormField
                    label="Email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={update('email')}
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
                  />
                  <FormSelect
                    label="Training Goal"
                    value={form.goal}
                    onChange={update('goal')}
                    required
                    options={goalOptions}
                  />
                </div>
                <FormField
                  label="Anything else we should know?"
                  placeholder="Current fitness level, injuries, schedule preferences..."
                  value={form.message}
                  onChange={update('message')}
                  textarea
                />
                <button
                  type="submit"
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 0 32px rgba(200,255,0,0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  className={`mt-1 w-full rounded-[10px] border-none p-4 text-[13px] font-bold tracking-[0.14em] text-bg uppercase transition-[transform,box-shadow,background] duration-200 ease-css
                    ${loading ? 'cursor-wait bg-[rgba(200,255,0,0.65)]' : 'cursor-pointer bg-accent'}`}
                >
                  {loading ? 'Sending...' : 'Book My Free Call →'}
                </button>
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
