import { useEffect, useState } from 'react';

/*
  Retained only for STRUCTURAL branches — cases where the mobile and
  desktop trees differ in what renders, not just how it looks:
  the hamburger/full-screen menu, and the font-size props fed into
  SvcCard. Pure styling branches use Tailwind `md:` utilities instead.
*/
export const useMobile = () => {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);

  return mobile;
};
