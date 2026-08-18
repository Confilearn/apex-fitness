import { useCallback, useEffect, useRef, useState } from 'react';
import { BackdropVideo } from '../components/BackdropVideo';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { closeIntroGate, openIntroGate } from '../lib/introGate';

/* ════════════════════════════════════════════════════════════
   INTRO OVERLAY
   Job: hold the brand for one beat before the site starts.

   It used to listen for `wheel` and `touchmove` only, with no timeout — a
   keyboard user, or anyone whose first input was a click, had no way past it.
   It now also takes a click, any key, and gives up on its own after 7s. It
   shows once per session, and not at all under reduced motion.
   ════════════════════════════════════════════════════════════ */
const THRESHOLD = 280;
const SEEN_KEY = 'apex:intro-seen';

const alreadySeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false; // private mode / storage disabled
  }
};

export const Intro = () => {
  const reduced = useReducedMotion();
  // Decided before first paint so the overlay never flashes for a repeat visit.
  const [skipped] = useState(() => alreadySeen());
  const [phase, setPhase] = useState('show');
  const [delta, setDelta] = useState(0);
  const active = !skipped && !reduced;
  const timers = useRef([]);

  const dissolve = useCallback(() => {
    setPhase((p) => {
      if (p !== 'show') return p;
      timers.current.push(
        setTimeout(() => {
          document.body.style.overflow = '';
          openIntroGate();
          setPhase('done');
        }, 1200)
      );
      return 'dissolve';
    });
  }, []);

  useEffect(() => {
    if (!active) {
      openIntroGate();
      return;
    }

    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage disabled — the overlay simply shows again next time */
    }

    closeIntroGate();
    document.body.style.overflow = 'hidden';

    const onWheel = (e) => {
      setDelta((d) => {
        const next = d + Math.abs(e.deltaY);
        if (next >= THRESHOLD) dissolve();
        return next;
      });
    };
    const onKey = (e) => {
      // Let the browser's own focus cycling still work.
      if (e.key !== 'Tab') dissolve();
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', dissolve, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', dissolve);
    // Nobody should be held here indefinitely.
    timers.current.push(setTimeout(dissolve, 7000));

    const pending = timers.current;
    return () => {
      document.body.style.overflow = '';
      openIntroGate();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', dissolve);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', dissolve);
      pending.forEach(clearTimeout);
    };
  }, [active, dissolve]);

  if (!active || phase === 'done') return null;

  // Scroll pressure drives scale and brightness frame by frame — inline.
  const push = Math.min(delta / THRESHOLD, 1);
  const pushScale = phase === 'dissolve' ? 0.78 : 1 - push * 0.13;
  const pushBright = phase === 'dissolve' ? 0.5 : 1 - push * 0.35;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onClick={dissolve}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') dissolve();
      }}
      className="fixed inset-0 z-9998 cursor-pointer bg-bg"
      style={{
        opacity: phase === 'dissolve' ? 0 : 1,
        transform: `scale(${pushScale})`,
        filter: `brightness(${pushBright})`,
        transition:
          phase === 'dissolve'
            ? 'opacity 1.0s ease, transform 1.0s ease, filter 1.0s ease'
            : 'transform 0.12s ease-out, filter 0.12s ease-out',
      }}
    >
      <BackdropVideo className="absolute inset-0 block h-full w-full object-cover" />

      {/* Dark veil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.65)_100%)]" />

      {/* Brand content */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0"
        style={{
          opacity: delta > 0 ? 0 : 1,
          transition: delta > 0 ? 'opacity 0.3s ease' : 'none',
        }}
      >
        <div
          className="mb-5 text-[11px] font-medium tracking-[0.3em] text-[rgba(232,224,208,0.72)] uppercase"
          style={{ animation: 'introFadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s both' }}
        >
          Marcus Kane &nbsp;·&nbsp; San Francisco
        </div>
        {/*
          Two-line lockup: "PERFORMANCE" is 11 characters, so the old
          single-line clamp floor would run past a 375px viewport.
        */}
        <p
          className="m-0 text-center font-display text-[clamp(54px,11vw,152px)] leading-[0.88] tracking-[0.04em] text-text"
          style={{ animation: 'introFadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s both' }}
        >
          Apex
          <br />
          Performance
        </p>
        <div
          className="mt-7 h-0.5 w-12 bg-accent"
          style={{ animation: 'introFadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.75s both' }}
        />
      </div>

      {/* Scroll indicator */}
      <div
        className="pointer-events-none absolute right-0 bottom-11 left-0 flex flex-col items-center gap-2.5"
        style={{
          animation: 'introFadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 1.4s both',
          opacity: delta > 0 ? 0 : 1,
          transition: delta > 0 ? 'opacity 0.3s ease' : 'none',
        }}
      >
        <div className="text-[9px] font-semibold tracking-[0.28em] text-[rgba(232,224,208,0.62)] uppercase">
          Scroll, tap or press any key
        </div>
        <div
          className="flex flex-col items-center gap-[3px]"
          style={{ animation: 'scrollPulse 1.8s ease-in-out infinite' }}
        >
          <div className="h-7 w-px bg-[linear-gradient(to_bottom,rgba(255,75,75,0.7),rgba(255,75,75,0.1))]" />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path
              d="M1 1l4 4 4-4"
              stroke="#FF4B4B"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
