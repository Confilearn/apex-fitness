import { useId, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useScrollRadius } from '../hooks/useScrollRadius';
import { reveal } from '../lib/motion';
import { faqs } from '../data/content';
import { Label } from './Label';

const FaqItem = ({ q, a, i, vis }) => {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div
      className="border-t border-[rgba(0,0,0,0.1)]"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : 'translateY(16px)',
        transition: `opacity .45s ease ${i * 65}ms, transform .45s ease ${i * 65}ms`,
      }}
    >
      <h3 className="m-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          className="flex w-full cursor-pointer items-center justify-between gap-6 border-none bg-transparent py-[22px] text-left"
        >
          <span className="text-base leading-[1.4] font-medium text-ink">{q}</span>
          <span
            aria-hidden="true"
            className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-xs border text-lg font-extralight
              transition-[transform,background,border-color,color] duration-320 ease-css
              ${
                open
                  ? /* Deep red on the light accent tint — the accent itself is
                       too close in value to read against a cream surface. */
                    'rotate-45 border-[rgba(214,40,40,.35)] bg-[rgba(214,40,40,.12)] text-[#A31212]'
                  : 'rotate-0 border-[rgba(0,0,0,.1)] bg-[rgba(0,0,0,.05)] text-[rgba(0,0,0,0.55)]'
              }`}
          >
            +
          </span>
        </button>
      </h3>
      {/*
        grid-template-rows 0fr -> 1fr animates to the content's natural height
        with no measurement. The previous version cached scrollHeight once on
        mount, so an answer that reflowed at another width animated to a stale
        height and clipped.
      */}
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        // `hidden` would be display:none and kill the transition; `inert`
        // takes the collapsed copy out of the a11y tree and tab order without
        // touching layout.
        inert={open ? undefined : ''}
        className="grid transition-[grid-template-rows] duration-360 ease-css"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="max-w-[640px] pb-[22px] text-[15px] leading-[1.78] font-light text-ink-muted">{a}</p>
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
  useScrollRadius(ref, 28, animateRadius);

  return (
    <section id={id} ref={ref} className="bg-cream py-20 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-14">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[38%_1fr] md:gap-[100px]">
          <div className="relative overflow-hidden">
            {/* Ghost question mark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-40px] left-[-20px] z-0 font-display text-[220px] leading-none text-[rgba(0,0,0,0.06)] select-none"
            >
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
              <FaqItem key={f.q} q={f.q} a={f.a} i={i} vis={vis} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
