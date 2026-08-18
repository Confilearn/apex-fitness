import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { reveal } from '../lib/motion';
import { img } from '../lib/media';
import { clientData } from '../data/content';
import { Label } from '../components/Label';
import { Img } from '../components/Img';

const SIZES = '(max-width: 767px) 50vw, 350px';

/* Side-by-side before/after pair. */
const BeforeAfter = ({ before, after, name }) => (
  <div className="grid w-full grid-cols-2 gap-2">
    <div className="relative h-[260px] overflow-hidden rounded-xl md:h-[600px]">
      <Img
        name={before}
        alt={`${name} before training`}
        sizes={SIZES}
        className="h-full w-full object-cover brightness-[.72] contrast-[1.12]"
      />
      <div className="absolute top-3.5 left-3.5 bg-[rgba(0,0,0,.6)] px-[9px] py-1 text-[10px] font-semibold tracking-[0.2em] text-[rgba(255,255,255,.8)] uppercase">
        Before
      </div>
    </div>
    <div className="relative h-[260px] overflow-hidden rounded-xl md:h-[600px]">
      <Img
        name={after}
        alt={`${name} after training`}
        sizes={SIZES}
        className="h-full w-full object-cover brightness-[.72] contrast-[1.12]"
      />
      <div className="absolute top-3.5 right-3.5 bg-[rgba(0,0,0,.6)] px-[9px] py-1 text-[10px] font-semibold tracking-[0.2em] text-accent-hi uppercase">
        After
      </div>
    </div>
  </div>
);

/*
  Arrow nav. Now a real `disabled` button rather than a live control that
  silently does nothing at the ends — keyboard users skip it and screen
  readers announce the state.
*/
const Arrow = ({ dir, disabled, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    aria-label={dir === -1 ? 'Previous client result' : 'Next client result'}
    className={`flex h-[42px] w-[42px] items-center justify-center rounded-xs border bg-transparent text-base
      transition-[border-color,color] duration-200
      ${
        disabled
          ? 'cursor-not-allowed border-[rgba(255,255,255,.06)] text-disabled'
          : 'cursor-pointer border-[rgba(255,255,255,.1)] text-muted hover:border-[rgba(255,255,255,.28)] hover:text-text'
      }`}
  >
    <span aria-hidden="true">{dir === -1 ? '←' : '→'}</span>
  </button>
);

/* ════════════════════════════════════════════════════════════
   6. CLIENT RESULTS
   Job: proof. This section converts harder than any other.
   Before/after pairs, three clients, arrow nav — no dots.
   ════════════════════════════════════════════════════════════ */
export const ClientResults = () => {
  const [ref, vis] = useInView(0.1);
  const [idx, setIdx] = useState(0);
  const client = clientData[idx];

  const go = (d) => setIdx((i) => Math.min(Math.max(i + d, 0), clientData.length - 1));

  /*
    Warm the neighbouring pair while the browser is idle, so an arrow click
    swaps instantly instead of stalling on a fresh request.
  */
  useEffect(() => {
    if (!vis) return;
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 300));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const handle = idle(() => {
      [idx - 1, idx + 1]
        .filter((i) => i >= 0 && i < clientData.length)
        .forEach((i) => {
          for (const key of [clientData[i].before, clientData[i].after]) {
            const preload = new Image();
            preload.sizes = SIZES;
            preload.srcset = img(key).srcSet;
            preload.src = img(key).src;
          }
        });
    });
    return () => cancel(handle);
  }, [idx, vis]);

  return (
    <section id="results" ref={ref} className="bg-bg py-20 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-14">
        <Label vis={vis}>Client Results</Label>
        <h2
          style={reveal(vis, 80)}
          className="mb-10 font-body text-[clamp(36px,5vw,64px)] leading-[0.98] font-extrabold tracking-[-0.035em] text-text"
        >
          Results Speak
          <br />
          For Themselves
        </h2>

        <div
          className={`grid grid-cols-1 items-center gap-7 transition-opacity duration-600 ease-css delay-200 md:grid-cols-[58%_1fr] md:gap-14
            ${vis ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Slider — keyed so the photo re-reveals on every change */}
          <div>
            <div key={idx} style={{ animation: 'photoReveal 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both' }}>
              <BeforeAfter before={client.before} after={client.after} name={client.name} />
            </div>
            <div className="mt-4.5 flex items-center gap-3.5">
              <Arrow dir={-1} disabled={idx === 0} onClick={() => go(-1)} />
              <span className="text-xs font-medium tracking-[.1em] text-faint">
                {String(idx + 1).padStart(2, '0')} / {String(clientData.length).padStart(2, '0')}
              </span>
              <Arrow dir={1} disabled={idx === clientData.length - 1} onClick={() => go(1)} />
            </div>
          </div>

          {/* Info — announced as a unit when the slide changes */}
          <div aria-live="polite" aria-atomic="true">
            <div key={`info-${idx}`} style={{ animation: 'infoSlideUp 0.45s cubic-bezier(0.25,0.46,0.45,0.94) both' }}>
              <div className="mb-1 font-display text-[clamp(56px,12vw,80px)] leading-none tracking-[.03em] text-text md:text-[clamp(80px,8vw,120px)]">
                {client.result}
              </div>
              <div className="mb-6 h-0.5 w-8 bg-accent" />
              <blockquote className="mb-7 text-base leading-[1.75] font-light text-muted italic">
                &quot;{client.quote}&quot;
              </blockquote>
              <div className="border-t border-[rgba(255,255,255,0.08)] pt-5.5">
                <div className="mb-[3px] text-sm font-semibold text-text">{client.name}</div>
                <div className="text-xs font-normal text-muted">
                  {client.type} &middot; {client.dur}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
