import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { reveal } from '../lib/motion';
import { reviewData } from '../data/content';
import { Label } from '../components/Label';

/* ════════════════════════════════════════════════════════════
   7. REVIEWS
   Job: stack social proof on top of the visual proof above.
   One large editorial quote per slide — not a Google review embed.
   ════════════════════════════════════════════════════════════ */
export const Reviews = () => {
  const [ref, vis] = useInView(0.1);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const r = reviewData[idx];
  const anim = `${dir === 1 ? 'slideFromRight' : 'slideFromLeft'} 0.42s cubic-bezier(0.25,0.46,0.45,0.94) both`;

  return (
    <section id="reviews" ref={ref} className="relative bg-surface-2 py-20 md:py-40">
      {/* Giant decorative quote mark */}
      <div className="pointer-events-none absolute top-20 left-10 z-0 hidden font-display text-[320px] leading-none text-[rgba(255,75,75,0.055)] select-none md:block">
        &quot;
      </div>
      <div className="relative z-1 mx-auto max-w-[1200px] px-6 md:px-14">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 md:mb-18 md:flex-row md:items-end md:gap-0">
          <div>
            <Label vis={vis}>Client Stories</Label>
            <h2
              style={reveal(vis, 80)}
              className="font-body text-[clamp(36px,5vw,64px)] leading-[0.98] font-extrabold tracking-[-0.035em] text-text"
            >
              Hear From Clients
              <br />
              Who Took the Step
            </h2>
          </div>
          <div style={reveal(vis, 160)} className="flex gap-2">
            {[
              [-1, '←'],
              [1, '→'],
            ].map(([d, icon]) => {
              const ok = d === -1 ? idx > 0 : idx < reviewData.length - 1;
              return (
                <button
                  key={icon}
                  onClick={() => {
                    if (ok) {
                      setDir(d);
                      setIdx((i) => i + d);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (ok) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,.28)';
                      e.currentTarget.style.color = '#E8E0D0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)';
                    e.currentTarget.style.color = ok ? '#888880' : '#3E3E3A';
                  }}
                  className={`flex h-[46px] w-[46px] items-center justify-center rounded-xs border border-[rgba(255,255,255,.12)] bg-transparent text-base transition-[border-color,color] duration-200
                    ${ok ? 'text-muted' : 'text-faint'}`}
                >
                  {icon}
                </button>
              );
            })}
          </div>
        </div>

        {/* Single editorial review */}
        <div
          className={`transition-opacity duration-500 ease-css delay-150 ${vis ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress ticks — double as direct navigation */}
          <div className="mb-10 flex gap-1.5">
            {reviewData.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  setDir(i > idx ? 1 : -1);
                  setIdx(i);
                }}
                className={`h-0.5 cursor-pointer rounded-[1px] transition-[width,background] duration-350 ease-css
                  ${i === idx ? 'w-8 bg-accent' : 'w-4 bg-[rgba(255,255,255,0.2)]'}`}
              />
            ))}
          </div>

          {/* Quote — large, editorial. Keyed so it re-animates per slide. */}
          <div key={idx} style={{ animation: anim }}>
            <blockquote className="mb-12 max-w-[900px] font-body text-[clamp(20px,5.5vw,28px)] leading-[1.45] font-light tracking-[-0.01em] text-pretty text-text italic md:text-[clamp(26px,3.6vw,46px)]">
              &quot;{r.quote}&quot;
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center gap-4">
              <img
                src={r.photo}
                alt={r.name}
                className="h-13 w-13 shrink-0 rounded-full object-cover contrast-[1.05] saturate-[0.85]"
              />
              <div>
                <div className="mb-[3px] text-sm font-semibold text-text">{r.name}</div>
                <div className="text-xs font-normal text-muted">
                  {r.type} &middot; {r.dur}
                </div>
              </div>
              <div className="pointer-events-none ml-auto font-display text-[80px] leading-none tracking-[.03em] text-[rgba(255,75,75,0.09)] select-none">
                &quot;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
