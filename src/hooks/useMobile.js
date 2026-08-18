import { useMediaQuery } from './useMediaQuery';

/*
  Retained only for STRUCTURAL branches — cases where the mobile and desktop
  trees differ in what renders, not just how it looks: the hamburger menu and
  the font-size props fed into SvcCard. Pure styling branches use Tailwind
  `md:` utilities instead.

  Backed by matchMedia, so a window drag no longer re-renders Nav, About and
  Services on every resize event.
*/
export const useMobile = () => useMediaQuery('(max-width: 767px)');
