import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/* Counts 0 to target over `ms` once `active` flips true. */
export const useCounter = (target, ms, active) => {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) return;

    let frame = 0;
    let start = null;

    const tick = (ts) => {
      start ??= ts;
      const p = Math.min((ts - start) / ms, 1);
      setValue(Math.round(easeOutExpo(p) * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    // Without this the loop kept calling setValue after unmount, and a change
    // to `target` mid-flight left two loops racing each other.
    return () => cancelAnimationFrame(frame);
  }, [active, target, ms, reduced]);

  // Reduced motion still needs the number, just not the animation. Derived
  // rather than pushed through setState, which would be a cascading render.
  if (reduced) return active ? target : 0;

  return value;
};
