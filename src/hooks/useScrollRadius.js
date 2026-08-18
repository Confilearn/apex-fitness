import { useEffect } from 'react';
import { onScrollFrame } from '../lib/scroll';

/*
  Light sections tuck their corners in as they rise into view: 28px radius at
  the bottom of the viewport, flat by the time they reach ~35% up.

  This writes borderRadius straight to the node. It used to hold the value in
  state, which re-rendered the whole section on every scroll frame — three
  sections use this hook, so scrolling cost three full subtree renders per
  frame to animate one CSS property.
*/
export const useScrollRadius = (ref, max = 28, enabled = true) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!enabled) {
      el.style.borderRadius = '';
      return;
    }

    el.style.willChange = 'border-radius';

    const unsubscribe = onScrollFrame(() => {
      const { top } = el.getBoundingClientRect();
      const start = window.innerHeight * 0.65;
      const t = 1 - Math.max(0, Math.min(1, top / start));
      el.style.borderRadius = `${Math.round(max * (1 - t))}px`;
    });

    return () => {
      unsubscribe();
      el.style.willChange = '';
    };
  }, [ref, max, enabled]);
};
