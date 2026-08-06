import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { useMobile } from '../hooks/useMobile';
import { useScrollRadius } from '../hooks/useScrollRadius';
import { reveal } from '../lib/motion';
import { TrophyIcon, MedalIcon, XIcon, InstagramIcon, LinkedInIcon } from '../components/icons';

const socials = [
  <XIcon key="x" size={13} fill="rgba(0,0,0,0.4)" />,
  <InstagramIcon key="ig" size={13} fill="rgba(0,0,0,0.4)" />,
  <LinkedInIcon key="li" size={13} fill="rgba(0,0,0,0.4)" />,
];

/* ════════════════════════════════════════════════════════════
   3. ABOUT
   Job: build trust — make the coach read as a real expert.
   Asymmetric 3-column: credential cards / tall portrait / bio.
   ════════════════════════════════════════════════════════════ */
export const About = () => {
  const sectionRef = useRef(null);
  const [gridRef, vis] = useInView(0.2, '0px 0px -5% 0px');
  const [gridVis, setGridVis] = useState(false);
  const isMobile = useMobile();
  const navigate = useNavigate();
  const br = useScrollRadius(sectionRef);

  useEffect(() => {
    if (!vis) return;
    setGridVis(true);
  }, [vis]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="overflow-hidden bg-cream py-20 md:py-30"
      style={{ borderRadius: `${br}px`, transition: 'border-radius 0.05s linear', willChange: 'border-radius' }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-14">
        {/* ── Centered heading block ── */}
        <div className="mb-16 text-center">
          <div className="mb-[22px] inline-flex items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.06)] px-4.5 py-1.5">
            <span className="text-[11px] font-medium tracking-[0.14em] text-[rgba(0,0,0,0.4)] uppercase">
              About Me
            </span>
          </div>
          <h2 className="mb-4.5 font-body text-[clamp(40px,5vw,64px)] leading-none font-extrabold tracking-[-0.035em] text-ink">
            Meet Your Coach
          </h2>
          <p className="mx-auto max-w-[440px] text-[15px] leading-[1.72] font-light text-ink-muted">
            This level of progress is driven by custom training, strategic nutrition, and accountability every
            step of the way.
          </p>
        </div>

        {/* ── 3-column content grid — observer sits here ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 items-stretch gap-3.5 md:min-h-[580px] md:grid-cols-[1fr_1.15fr_2fr]"
        >
          {/* LEFT — stacked credential + gym location cards (desktop only) */}
          {!isMobile && (
            <div className="flex flex-col gap-3">
              {/* Card 1 — Pro Athlete */}
              <div
                style={reveal(gridVis, 0, 'x')}
                className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-6"
              >
                <div className="mb-4.5 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[rgba(0,0,0,0.07)] bg-[rgba(0,0,0,0.05)]">
                  <TrophyIcon size={18} fill="rgba(0,0,0,0.4)" className="block" />
                </div>
                <div className="mb-[5px] font-body text-[15px] font-bold text-ink">Pro Athlete</div>
                <div className="text-[13px] leading-[1.55] font-light text-ink-muted">
                  Former Competitive
                  <br />
                  Athlete
                </div>
              </div>

              {/* Card 2 — Certified Coach */}
              <div
                style={reveal(gridVis, 0, 'x')}
                className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-6"
              >
                <div className="mb-4.5 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[rgba(0,0,0,0.07)] bg-[rgba(0,0,0,0.05)]">
                  <MedalIcon />
                </div>
                <div className="mb-[5px] font-body text-[15px] font-bold text-ink">Certified Coach</div>
                <div className="text-[13px] leading-[1.55] font-light text-ink-muted">
                  NASM &amp; ACE
                  <br />
                  Certified
                </div>
              </div>

              {/* Card 3 — gym location, fills the remaining height */}
              <div
                style={reveal(gridVis, 0, 'x')}
                className="relative min-h-[160px] flex-1 overflow-hidden rounded-2xl"
              >
                <img
                  src="/assets/images/dumbbell-rack.jpg"
                  alt="Gym"
                  className="absolute inset-0 block h-full w-full object-cover brightness-[0.32] contrast-[1.1]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,13,11,0.92)_0%,transparent_60%)]" />
                {/* Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.1)] px-[11px] py-[5px] backdrop-blur-sm">
                  <svg width="8" height="8" viewBox="0 0 256 256" fill="#E8E0D0">
                    <circle cx="128" cy="128" r="96" fill="none" stroke="#E8E0D0" strokeWidth="20" />
                  </svg>
                  <span className="text-[10px] font-medium tracking-[0.04em] whitespace-nowrap text-text">
                    Train in-person
                  </span>
                </div>
                {/* Location label */}
                <div className="absolute bottom-4 left-3.5">
                  <div className="mb-0.5 font-body text-[15px] font-bold text-text">Apex Performance</div>
                  <div className="text-[11px] font-normal tracking-[0.04em] text-[rgba(232,224,208,0.5)]">
                    San Francisco, CA
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CENTER — tall portrait, no wrapper card */}
          <div
            className="h-[420px] overflow-hidden rounded-2xl will-change-[opacity,transform] md:h-full"
            style={{
              opacity: gridVis ? 1 : 0,
              transform: gridVis ? 'none' : 'translateY(60px) scale(0.96)',
              transition:
                'opacity 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <img
              src="/assets/handsome-man-exercising-gym.jpg"
              alt="Marcus Kane"
              className="block h-full w-full object-cover object-[30%_50%] contrast-[1.05] saturate-[0.88]"
            />
          </div>

          {/* RIGHT — name, bio, CTA, socials */}
          <div className="flex flex-col pl-0 md:pl-4">
            <div className="flex-1">
              <h3
                style={reveal(gridVis, 0, 'right')}
                className="mb-7 font-body text-[clamp(34px,3.8vw,52px)] leading-none font-extrabold tracking-[-0.03em] text-ink"
              >
                Marcus Kane
              </h3>
              <div style={reveal(gridVis, 0, 'right')}>
                <p className="mb-4 text-[15px] leading-[1.82] font-light text-ink-muted">
                  With over eight years in the fitness industry, I specialise in building real strength,
                  improving conditioning, and developing long-term physical capacity. My coaching is rooted in
                  structured programming, technical precision, and measurable progression.
                </p>
                <p className="text-[15px] leading-[1.82] font-light text-ink-muted">
                  I prioritise strong fundamentals, progressive overload, and purposeful conditioning to build
                  resilient, capable bodies. Every programme is intentional, progressive, and built around
                  continuous improvement.
                </p>
              </div>
            </div>

            {/* CTA + socials — pinned to the bottom of the column */}
            <div style={reveal(gridVis, 340, 'right')} className="mt-11 flex items-center gap-6">
              <button
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 0 28px rgba(214,40,40,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => navigate('/get-started')}
                className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full border-none bg-accent py-[13px] pr-3.5 pl-6 text-[13px] font-bold whitespace-nowrap text-on-accent transition-[transform,box-shadow] duration-200 ease-css"
              >
                Get in Touch
                <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-bg text-sm text-accent-hi">
                  ↗
                </span>
              </button>
              <div>
                <div className="mb-2 text-[10px] font-medium tracking-[0.12em] text-[rgba(0,0,0,0.3)] uppercase">
                  Follow me:
                </div>
                <div className="flex gap-[7px]">
                  {socials.map((icon, i) => (
                    <button
                      key={i}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                      className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.05)] transition-[background] duration-200"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
