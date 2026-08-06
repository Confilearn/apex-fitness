import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { reveal } from '../lib/motion';
import { clientData } from '../data/content';
import { Label } from '../components/Label';

/* Side-by-side before/after pair. */
const BAS = ({ bSrc, aSrc }) => (
  <div className="grid w-full grid-cols-2 gap-2">
    {/* Before */}
    <div className="relative h-[260px] overflow-hidden rounded-xl md:h-[600px]">
      <img
        src={bSrc}
        alt="Before"
        className="h-full w-full object-cover brightness-[.72] contrast-[1.12]"
      />
      <div className="absolute top-3.5 left-3.5 bg-[rgba(0,0,0,.5)] px-[9px] py-1 text-[10px] font-semibold tracking-[0.2em] text-[rgba(255,255,255,.5)] uppercase">
        Before
      </div>
    </div>
    {/* After */}
    <div className="relative h-[260px] overflow-hidden rounded-xl md:h-[600px]">
      <img src={aSrc} alt="After" className="h-full w-full object-cover brightness-[.72] contrast-[1.12]" />
      <div className="absolute top-3.5 right-3.5 bg-[rgba(0,0,0,.5)] px-[9px] py-1 text-[10px] font-semibold tracking-[0.2em] text-accent-hi uppercase">
        After
      </div>
    </div>
  </div>
);

/* Arrow nav — dims to faint when there is nowhere further to go. */
const Arr = ({ dir, idx, onNavigate }) => {
  const ok = dir === -1 ? idx > 0 : idx < clientData.length - 1;
  return (
    <button
      onClick={() => ok && onNavigate(dir)}
      onMouseEnter={(e) => {
        if (ok) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,.28)';
          e.currentTarget.style.color = '#E8E0D0';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)';
        e.currentTarget.style.color = ok ? '#888880' : '#3E3E3A';
      }}
      className={`flex h-[42px] w-[42px] items-center justify-center rounded-xs border border-[rgba(255,255,255,.1)] bg-transparent text-base transition-[border-color,color] duration-200
        ${ok ? 'text-muted' : 'text-faint'}`}
    >
      {dir === -1 ? '←' : '→'}
    </button>
  );
};

/* ════════════════════════════════════════════════════════════
   6. CLIENT RESULTS
   Job: proof. This section converts harder than any other.
   Before/after pairs, three clients, arrow nav — no dots.
   ════════════════════════════════════════════════════════════ */
export const ClientResults = () => {
  const [ref, vis] = useInView(0.1);
  const [idx, setIdx] = useState(0);
  const c = clientData[idx];

  const onNavigate = (d) => setIdx((i) => i + d);

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
          <div key={idx} style={{ animation: 'photoReveal 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both' }}>
            <BAS bSrc={c.bSrc} aSrc={c.aSrc} />
            <div className="mt-4.5 flex items-center gap-3.5">
              <Arr dir={-1} idx={idx} onNavigate={onNavigate} />
              <span className="text-xs font-medium tracking-[.1em] text-faint">
                {String(idx + 1).padStart(2, '0')} / {String(clientData.length).padStart(2, '0')}
              </span>
              <Arr dir={1} idx={idx} onNavigate={onNavigate} />
            </div>
          </div>

          {/* Info */}
          <div
            key={`info-${idx}`}
            style={{ animation: 'infoSlideUp 0.45s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
          >
            <div className="mb-1 font-display text-[clamp(56px,12vw,80px)] leading-none tracking-[.03em] text-text md:text-[clamp(80px,8vw,120px)]">
              {c.result}
            </div>
            <div className="mb-6 h-0.5 w-8 bg-accent" />
            <p className="mb-7 text-base leading-[1.75] font-light text-muted italic">&quot;{c.quote}&quot;</p>
            <div className="border-t border-[rgba(255,255,255,0.08)] pt-5.5">
              <div className="mb-[3px] text-sm font-semibold text-text">{c.name}</div>
              <div className="text-xs font-normal text-muted">
                {c.type} &middot; {c.dur}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
