import { useMediaQuery } from './useMediaQuery';

/*
  The site ships parallax, a scaling full-screen video, count-up stats and
  nine staggered reveal sequences. All of it is suppressed when the visitor
  has asked their OS for reduced motion.
*/
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
