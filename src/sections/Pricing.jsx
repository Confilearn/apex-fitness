import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { reveal } from '../lib/motion';
import { plans } from '../data/content';
import { Label } from '../components/Label';
import { CheckIcon, TrophyIcon } from '../components/icons';

const PCard = ({ p, delay, vis }) => {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`relative rounded-card border backdrop-blur-md px-6 py-7 md:p-11
        ${p.badge ? 'bg-[rgba(255,255,255,0.05)]' : 'bg-[rgba(255,255,255,0.02)]'}
        ${hov || p.badge ? 'border-[rgba(255,255,255,.16)]' : 'border-[rgba(255,255,255,.07)]'}
        ${hov ? '-translate-y-1.5 shadow-[0_24px_64px_rgba(0,0,0,.6)]' : 'translate-y-0 shadow-none'}`}
      style={{
        opacity: vis ? 1 : 0,
        transition: `opacity .55s ease ${delay}ms, border-color .25s, transform .28s ease, box-shadow .28s ease`,
      }}
    >
      {p.badge && (
        <div className="absolute top-5 right-5 flex items-center gap-[5px] rounded-full border border-[rgba(255,75,75,.35)] bg-[rgba(214,40,40,.12)] px-3 py-[5px] text-[9px] font-semibold tracking-[.2em] text-accent-hi uppercase">
          <TrophyIcon />
          Most Effective
        </div>
      )}
      <div className="mb-2 font-body text-[22px] font-bold tracking-[-0.01em] text-text">
        {p.name} Training
      </div>
      <div className="mb-5 flex items-baseline gap-1">
        <span className="font-display text-[72px] leading-none tracking-[.02em] text-text">{p.price}</span>
        <span className="text-sm font-light text-muted">{p.mo}</span>
      </div>
      <p className="mb-7 text-sm leading-[1.65] font-light text-muted">{p.desc}</p>
      <div className="mb-9 flex flex-col gap-3">
        {p.features.map((f) => (
          <div key={f} className="flex items-center gap-2.5">
            <CheckIcon />
            <span className="text-[13px] font-normal text-text">{f}</span>
          </div>
        ))}
      </div>
      <button
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          if (p.badge) e.currentTarget.style.boxShadow = '0 0 28px rgba(214,40,40,.38)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onClick={() => navigate('/get-started')}
        className={`w-full rounded-[10px] p-[15px] text-xs font-bold tracking-[.16em] uppercase transition-[transform,box-shadow] duration-200 ease-css
          ${p.badge ? 'border-none bg-accent text-on-accent' : 'border border-[rgba(255,255,255,.12)] bg-transparent text-text'}`}
      >
        Get Started
      </button>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   8. PRICING
   Job: make the decision easy. Two options, no confusion.
   The recommended card sits in a soft accent bloom.
   ════════════════════════════════════════════════════════════ */
export const Pricing = () => {
  const [ref, vis] = useInView(0.1);

  return (
    <section id="pricing" ref={ref} className="bg-bg py-20 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-14">
        <Label vis={vis}>Investment</Label>
        <h2
          style={reveal(vis, 80)}
          className="mb-10 font-body text-[clamp(36px,5vw,64px)] leading-[0.98] font-extrabold tracking-[-0.035em] text-text"
        >
          Choose Your Path
        </h2>
        <div className="grid max-w-full grid-cols-1 items-start gap-3.5 md:max-w-[880px] md:grid-cols-2">
          {plans.map((p, i) =>
            p.badge ? (
              <div key={p.name} className="relative">
                <div className="pointer-events-none absolute -inset-10 z-0 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(214,40,40,0.13)_0%,transparent_70%)]" />
                <div className="relative z-1">
                  <PCard p={p} delay={i * 100} vis={vis} />
                </div>
              </div>
            ) : (
              <PCard key={p.name} p={p} delay={i * 100} vis={vis} />
            )
          )}
        </div>
      </div>
    </section>
  );
};
