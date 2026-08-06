import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { useCounter } from '../hooks/useCounter';
import { reveal } from '../lib/motion';
import { steps } from '../data/content';

/* ════════════════════════════════════════════════════════════
   5. PROCESS
   Job: remove friction — show the path to results is short and clear.
   Stat card spans both rows on desktop; steps auto-place around it.
   ════════════════════════════════════════════════════════════ */
export const Process = () => {
  const [ref, vis] = useInView(0.08);
  const tfm = useCounter(450, 1500, vis);
  const sat = useCounter(95, 1200, vis);
  const navigate = useNavigate();

  return (
    <section id="process" ref={ref} className="bg-bg py-20 md:py-30">
      <div className="mx-auto max-w-[1200px] px-6 md:px-14">
        {/* ── Centered heading ── */}
        <div className="mb-13 text-center">
          <div
            style={reveal(vis, 0)}
            className="mb-[22px] inline-flex items-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-4.5 py-1.5"
          >
            <span className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Process</span>
          </div>
          <h2
            style={reveal(vis, 80)}
            className="mb-4 font-body text-[clamp(36px,4.5vw,60px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-text"
          >
            How It Works <span className="text-accent">Step by Step</span>
          </h2>
          <p
            style={reveal(vis, 160)}
            className="mx-auto max-w-[460px] text-[15px] leading-[1.7] font-light text-muted"
          >
            A step-by-step process designed to get you real, measurable results. From your first consultation
            to your transformation.
          </p>
        </div>

        {/* ── 4 cols × 2 rows on desktop, 2 cols on mobile ── */}
        <div className="grid grid-cols-2 grid-rows-[auto] gap-2.5 md:grid-cols-[1.1fr_1fr_1fr_1fr]">
          {/* Stat card — full width on mobile, spans both rows in col 1 on desktop */}
          <div
            style={reveal(vis, 60)}
            className="relative min-h-[200px] overflow-hidden rounded-card col-[1/3] md:min-h-[440px] md:col-1 md:row-[1/3]"
          >
            <img
              src="/assets/exercise-weights-iron-dumbbell-with-extra-plates.jpg"
              alt=""
              className="absolute inset-0 block h-full w-full object-contain brightness-[0.45] contrast-[1.15]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,13,11,0.97)_40%,rgba(13,13,11,0.25)_100%)]" />
            <div className="absolute inset-0 flex flex-row items-center justify-around gap-7 p-7 md:flex-col md:items-stretch md:justify-end">
              <div className="text-center md:text-left">
                <div className="font-display text-[48px] leading-none tracking-[.03em] text-accent md:text-[72px]">
                  {tfm}+
                </div>
                <div className="mt-1.5 text-[11px] font-medium tracking-[0.14em] text-[rgba(232,224,208,0.45)] uppercase">
                  Custom Plans Built
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="font-display text-[48px] leading-none tracking-[.03em] text-accent md:text-[72px]">
                  {sat}%
                </div>
                <div className="mt-1.5 text-[11px] font-medium tracking-[0.14em] text-[rgba(232,224,208,0.45)] uppercase">
                  Consistency Rate
                </div>
              </div>
            </div>
          </div>

          {/* Steps 01–05 — auto-placed, 60ms stagger */}
          {steps.map((s, i) => (
            <div
              key={s.n}
              style={reveal(vis, 100 + i * 60)}
              className="flex flex-col rounded-card border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.055)] p-5.5"
            >
              <div className="mb-6 font-display text-[34px] tracking-[.06em] text-[rgba(255,255,255,0.14)]">
                {s.n}
              </div>
              <div className="mb-2 font-body text-[15px] font-bold tracking-[-0.01em] text-text">{s.title}</div>
              <div className="text-[13px] leading-[1.65] font-light text-muted">{s.desc}</div>
            </div>
          ))}

          {/* CTA card — full width on mobile */}
          <div
            style={reveal(vis, 400)}
            className="relative min-h-[200px] overflow-hidden rounded-card col-[1/3] md:col-auto md:min-h-auto"
          >
            <img
              src="/assets/strong-man-training-gym (1).jpg"
              alt=""
              className="absolute inset-0 block h-full w-full object-cover object-top brightness-[0.5] contrast-[1.1]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,13,11,0.97)_30%,rgba(13,13,11,0.4)_100%)]" />
            <div className="absolute inset-0 flex flex-col justify-end p-7">
              <div className="mb-0.5 font-body text-[clamp(18px,1.9vw,26px)] leading-[1.15] font-extrabold tracking-[-0.02em] text-text">
                This Isn&apos;t Motivation.
              </div>
              <div className="mb-2 font-body text-[clamp(18px,1.9vw,26px)] leading-[1.15] font-extrabold tracking-[-0.02em] text-accent-hi">
                It&apos;s Method.
              </div>
              <div className="mb-5 text-[11px] font-normal tracking-[0.04em] text-[rgba(232,224,208,0.4)]">
                Start Your Journey!
              </div>
              <button
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(214,40,40,0.42)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => navigate('/get-started')}
                className="inline-flex cursor-pointer items-center gap-2 self-start rounded-full border-none bg-accent py-2.5 pr-3 pl-5 text-xs font-bold text-on-accent transition-[transform,box-shadow] duration-200 ease-css"
              >
                Let&apos;s do it!
                <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-bg text-xs text-accent-hi">
                  ↗
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
