import { useEffect, useState } from 'react';

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/* Counts 0 → target over `ms` once `active` flips true. */
export const useCounter = (target, ms, active) => {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!active) return;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / ms, 1);
      setV(Math.floor(easeOutExpo(p) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, ms]);

  return v;
};
