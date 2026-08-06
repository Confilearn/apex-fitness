import { useLayoutEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useScrollRadius } from '../hooks/useScrollRadius';
import { reveal } from '../lib/motion';
import { faqs } from '../data/content';
import { Label } from './Label';

const FItem = ({ q, a, i, vis }) => {
  const [open, setOpen] = useState(false);
  const bRef = useRef(null);
  const [h, setH] = useState(0);

  // Measure once so max-height can animate to a real value.
  useLayoutEffect(() => {
    if (bRef.current) setH(bRef.current.scrollHeight);
  }, []);

  return (
    <div
      className="border-t border-[rgba(0,0,0,0.1)]"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : 'translateY(16px)',
        transition: `opacity .45s ease ${i * 65}ms, transform .45s ease ${i * 65}ms`,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-6 border-none bg-transparent py-[22px] text-left"
      >
        <span className="text-base leading-[1.4] font-medium text-ink">{q}</span>
        <span
          className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-xs border text-lg font-extralight
            transition-[transform,background,border-color,color] duration-320 ease-css
            ${
              open
                /* Deep red on the light accent tint — the accent itself is
                   too close in value to read against a cream surface. */
                ? 'rotate-45 border-[rgba(214,40,40,.35)] bg-[rgba(214,40,40,.12)] text-[#A31212]'
                : 'rotate-0 border-[rgba(0,0,0,.1)] bg-[rgba(0,0,0,.05)] text-[rgba(0,0,0,0.4)]'
            }`}
        >
          +
        </span>
      </button>
      {/* max-height animates to the measured content height */}
      <div
        className="overflow-hidden transition-[max-height] duration-360 ease-css"
        style={{ maxHeight: open ? `${h}px` : '0' }}
      >
        <div ref={bRef} className="pb-[22px]">
          <p className="max-w-[640px] text-[15px] leading-[1.78] font-light text-ink-muted">{a}</p>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   9. FAQ
   Job: kill objections before they kill the conversion.
   38/62 split. Homepage passes an id + the scroll-radius treatment;
   the booking page renders the plain variant.
   ════════════════════════════════════════════════════════════ */
export const FAQ = ({ id, animateRadius = false }) => {
  const [ref, vis] = useInView(0.1);
  const br = useScrollRadius(ref, 28, animateRadius);

  return (
    <section
      id={id}
      ref={ref}
      className="bg-cream py-20 md:py-40"
      style={animateRadius ? { borderRadius: `${br}px`, transition: 'border-radius 0.05s linear', willChange: 'border-radius' } : undefined}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-14">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[38%_1fr] md:gap-[100px]">
          <div className="relative overflow-hidden">
            {/* Ghost question mark */}
            <div className="pointer-events-none absolute bottom-[-40px] left-[-20px] z-0 font-display text-[220px] leading-none text-[rgba(0,0,0,0.06)] select-none">
              ?
            </div>
            <div className="relative z-1">
              <Label vis={vis} light>
                Common Questions
              </Label>
              <h2
                style={reveal(vis, 80)}
                className="mb-5 font-body text-[clamp(40px,4.5vw,60px)] leading-[0.98] font-extrabold tracking-[-0.035em] text-ink"
              >
                Everything
                <br />
                You Need
                <br />
                To Know
              </h2>
              <p style={reveal(vis, 160)} className="text-sm leading-[1.7] font-light text-ink-muted">
                Still have questions? Book a free call and ask directly.
              </p>
            </div>
          </div>
          <div className="border-b border-[rgba(0,0,0,0.1)]">
            {faqs.map((f, i) => (
              <FItem key={i} q={f.q} a={f.a} i={i} vis={vis} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
