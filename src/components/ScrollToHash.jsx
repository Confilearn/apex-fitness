import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/*
  The two pages used to be separate documents, so every navigation
  started at scroll 0 and `?page#section` links were resolved by the
  browser's own fragment jump. Client-side routing does neither, so
  this restores both.

  The wait loop matters: the homepage intro overlay pins
  `body { overflow: hidden }` while it is up, which clamps
  window.scrollTo. We hold the scroll until the intro releases, so a
  `/#services` link from the booking page still lands on Services once
  the overlay dissolves — same end state the full page load produced.
*/
export const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = hash ? decodeURIComponent(hash.slice(1)) : null;
    let raf = 0;
    let cancelled = false;
    let lookups = 0;

    const scrollLocked = () => document.body.style.overflow === 'hidden';

    const settle = () => {
      if (cancelled) return;

      if (scrollLocked()) {
        raf = requestAnimationFrame(settle);
        return;
      }

      if (!id) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      const el = document.getElementById(id);
      if (!el) {
        // Section may not be mounted yet on the first frame after a route change.
        if (lookups++ < 60) raf = requestAnimationFrame(settle);
        return;
      }
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'auto' });
    };

    // Land at the top straight away; `settle` corrects once anything unlocks.
    if (!id) window.scrollTo({ top: 0, behavior: 'auto' });
    raf = requestAnimationFrame(settle);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [pathname, hash]);

  return null;
};
