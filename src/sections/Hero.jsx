import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCounter } from '../hooks/useCounter';

/* ════════════════════════════════════════════════════════════
   2. HERO
   Job: stop the scroll and say who this is for in three seconds.
   Left-aligned content over a parallaxed video. Mixed-weight
   headline, one accent word, glass stat cards.
   ════════════════════════════════════════════════════════════ */
export const Hero = () => {
  const [vis, setVis] = useState(false);
  const bgRef = useRef(null);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const clients = useCounter(500, 1600, vis);
  const sat = useCounter(99, 1400, vis);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (bgRef.current && heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            // Section moves up at 100% speed, image at ~85% — the lag reads as depth.
            const progress = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
            const offset = progress * window.innerHeight * 0.15;
            bgRef.current.style.transform = `translateY(${offset}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    fn(); // set initial position
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Staggered entrance — per-element delay, so it stays inline.
  const fd = (d) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'none' : 'translateY(35px)',
    transition: `opacity .8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${d}ms, transform .8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${d}ms`,
  });

  return (
    <section ref={heroRef} id="hero" className="relative h-screen min-h-[640px] overflow-hidden">
      {/* Background — wrapper takes the filter and the parallax transform */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={bgRef}
          className="absolute top-[-15%] left-0 h-[130%] w-full brightness-[0.58] contrast-[1.08] will-change-transform"
        >
          <video autoPlay muted loop playsInline className="block h-full w-full object-cover object-[65%_30%]">
            <source src="/assets/mixkit-52099-video-52099-full-hd.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Directional gradient: dark left → clear right */}
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(13,13,11,0.97)_0%,rgba(13,13,11,0.9)_28%,rgba(13,13,11,0.55)_55%,rgba(13,13,11,0.12)_80%,transparent_100%)]" />
        {/* Bottom wash so the stat cards read */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,13,11,0.82)_0%,transparent_38%)]" />
      </div>

      {/* Left column — full height, three-way split */}
      <div className="relative z-2 flex h-full max-w-full flex-col justify-between px-6 pt-22 pb-12 md:max-w-[700px] md:px-14 md:pt-24 md:pb-14">
        {/* Label */}
        <div style={fd(0)}>
          <span className="text-[13px] font-normal tracking-[0.01em] text-muted">Personal Coach</span>
        </div>

        {/* Headline + sub + CTA */}
        <div>
          {/* Mixed weight: light intro / bold accent / light outro */}
          <h1 className="mb-[22px] font-body leading-none tracking-[-0.03em]">
            <div style={fd(60)} className="text-[clamp(36px,5vw,72px)] leading-none whitespace-nowrap">
              <span className="font-normal whitespace-nowrap text-[rgba(232,224,208,0.82)]">Meet the </span>
              <span className="font-extrabold whitespace-nowrap text-accent">Stronger</span>
            </div>
            <div
              style={fd(160)}
              className="text-[clamp(36px,5vw,72px)] leading-none font-normal whitespace-nowrap text-[rgba(232,224,208,0.82)]"
            >
              version of you.
            </div>
          </h1>

          <div style={fd(310)} className="mb-9 max-w-[440px]">
            <p className="text-base leading-[1.7] font-light text-muted">
              Expert coaching built on proven methods — real strength, lasting progress, no filler.
            </p>
          </div>

          {/* Pill CTA with arrow circle */}
          <div style={fd(420)}>
            <button
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 0 36px rgba(200,255,0,0.32)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => navigate('/get-started')}
              className="inline-flex cursor-pointer items-center gap-3.5 rounded-full border-none bg-accent py-3 pr-3.5 pl-7 text-sm font-semibold text-bg transition-[transform,box-shadow] duration-220 ease-css"
            >
              Get Started
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-bg text-[15px] text-accent">
                ↗
              </span>
            </button>
          </div>
        </div>

        {/* Glass stat cards */}
        <div style={fd(540)} className="flex gap-3">
          {[
            { val: `${clients}+`, label: 'Clients Transformed' },
            { val: `${sat}%`, label: 'Satisfaction Rate' },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="min-w-0 flex-1 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.07)] px-5 py-4 backdrop-blur-lg md:min-w-[150px] md:flex-none md:px-7 md:py-5"
            >
              <div className="font-body text-[28px] leading-none font-bold tracking-[-0.02em] text-text md:text-[38px]">
                {val}
              </div>
              <div className="mt-[5px] text-xs font-normal text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
