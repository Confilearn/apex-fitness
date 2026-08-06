import { useEffect, useState } from 'react';

/*
  Light sections tuck their corners in as they rise into view:
  28px radius at the bottom of the viewport, flat by the time they
  reach ~35% up. Genuinely computed per scroll frame, so it stays an
  inline style — Tailwind has no static class for this.
*/
export const useScrollRadius = (ref, max = 28, enabled = true) => {
  const [br, setBr] = useState(max);

  useEffect(() => {
    if (!enabled) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = ref.current;
        if (el) {
          const top = el.getBoundingClientRect().top;
          const start = window.innerHeight * 0.65;
          const t = 1 - Math.max(0, Math.min(1, top / start));
          setBr(Math.round(max * (1 - t)));
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref, max, enabled]);

  return br;
};
