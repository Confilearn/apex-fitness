import { useEffect, useRef, useState } from 'react';

/* Scroll-triggered visibility. Fires once, then disconnects. */
export const useInView = (threshold = 0.12, rootMargin = '0px 0px -12% 0px') => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  return [ref, vis];
};
