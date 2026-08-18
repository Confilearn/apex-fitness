import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { reveal } from '../lib/motion';
import { reviewData } from '../data/content';
import { Label } from '../components/Label';
import { Img } from '../components/Img';

/* ════════════════════════════════════════════════════════════
   7. REVIEWS
   Job: stack social proof on top of the visual proof above.
   One large editorial quote per slide — not a Google review embed.
   ════════════════════════════════════════════════════════════ */
export const Reviews = () => {
  const [ref, vis] = useInView(0.1);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const review = reviewData[idx];
  const anim = `${dir === 1 ? 'slideFromRight' : 'slideFromLeft'} 0.42s cubic-bezier(0.25,0.46,0.45,0.94) both`;

  const goTo = (next) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  };

  return (
    <section id="reviews" ref={ref} className="relative bg-surface-2 py-20 md:py-40">
      {/* Giant decorative quote mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-10 z-0 hidden font-display text-[320px] leading-none text-[rgba(255,75,75,0.055)] select-none md:block"
      >
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
              [-1, '←', 'Previous review'],
              [1, '→', 'Next review'],
            ].map(([d, glyph, label]) => {
              const disabled = d === -1 ? idx === 0 : idx === reviewData.length - 1;
              return (
                <button
                  key={glyph}
                  type="button"
                  disabled={disabled}
                  aria-label={label}
                  onClick={() => goTo(idx + d)}
                  className={`flex h-[46px] w-[46px] items-center justify-center rounded-xs border bg-transparent text-base
                    transition-[border-color,color] duration-200
                    ${
                      disabled
                        ? 'cursor-not-allowed border-[rgba(255,255,255,.06)] text-disabled'
                        : 'cursor-pointer border-[rgba(255,255,255,.12)] text-muted hover:border-[rgba(255,255,255,.28)] hover:text-text'
                    }`}
                >
                  <span aria-hidden="true">{glyph}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Single editorial review */}
        <div
          className={`transition-opacity duration-500 ease-css delay-150 ${vis ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress ticks — double as direct navigation. Were click-handling
              <div>s, so keyboard users could not reach them at all. */}
          <div className="mb-10 flex gap-1.5" role="tablist" aria-label="Choose a review">
            {reviewData.map((r, i) => (
              <button
                key={r.name}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`Review ${i + 1} of ${reviewData.length}, ${r.name}`}
                onClick={() => goTo(i)}
                className="group cursor-pointer border-none bg-transparent p-0 py-2"
              >
                <span
                  className={`block h-0.5 rounded-[1px] transition-[width,background] duration-350 ease-css
                    ${i === idx ? 'w-8 bg-accent' : 'w-4 bg-[rgba(255,255,255,0.3)] group-hover:bg-[rgba(255,255,255,0.5)]'}`}
                />
              </button>
            ))}
          </div>

          {/* Quote — large, editorial. Keyed so it re-animates per slide. */}
          <div aria-live="polite" aria-atomic="true">
            <div key={idx} style={{ animation: anim }}>
              <blockquote className="mb-12 max-w-[900px] font-body text-[clamp(20px,5.5vw,28px)] leading-[1.45] font-light tracking-[-0.01em] text-pretty text-text italic md:text-[clamp(26px,3.6vw,46px)]">
                &quot;{review.quote}&quot;
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center gap-4">
                <Img
                  name={review.photo}
                  alt=""
                  sizes="52px"
                  className="h-13 w-13 shrink-0 rounded-full object-cover contrast-[1.05] saturate-[0.85]"
                />
                <div>
                  <div className="mb-[3px] text-sm font-semibold text-text">{review.name}</div>
                  <div className="text-xs font-normal text-muted">
                    {review.type} &middot; {review.dur}
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none ml-auto font-display text-[80px] leading-none tracking-[.03em] text-[rgba(255,75,75,0.09)] select-none"
                >
                  &quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
