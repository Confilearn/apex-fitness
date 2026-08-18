/*
  Reveal transforms are plain style objects rather than hooks, so the
  reduced-motion check reads the MediaQueryList directly. The list is created
  once and cached — `matches` is live, so it stays correct if the OS setting
  changes mid-session.
*/
let mql = null;
const prefersReduced = () => {
  if (typeof window === 'undefined') return false;
  mql ??= window.matchMedia('(prefers-reduced-motion: reduce)');
  return mql.matches;
};

const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

const offset = (axis) =>
  axis === 'x' ? 'translateX(-48px)' : axis === 'right' ? 'translateX(48px)' : 'translateY(40px)';

/*
  Scroll-reveal transform + per-element stagger delay. Delay is computed per
  call site, so this stays an inline style object.

  Under reduced motion the element still fades in — opacity is not what
  triggers vestibular symptoms — but it does not travel.
*/
export const reveal = (vis, delay = 0, axis = 'y') => {
  if (prefersReduced()) {
    return {
      opacity: vis ? 1 : 0,
      transition: `opacity 0.4s ease ${delay}ms`,
    };
  }

  return {
    opacity: vis ? 1 : 0,
    transform: vis ? 'none' : offset(axis),
    transition: `opacity 0.7s ${EASE} ${delay}ms, transform 0.7s ${EASE} ${delay}ms`,
    willChange: 'opacity, transform',
  };
};

/* Accent button: lift + glow. Imperative so it survives re-render churn. */
export const accentHover = {
  onMouseEnter: (e) => {
    if (!prefersReduced()) e.currentTarget.style.transform = 'scale(1.03)';
    e.currentTarget.style.boxShadow = '0 0 36px rgba(214,40,40,0.4)';
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  },
};

/* Same lift, parameterised — several call sites use their own glow radius. */
export const lift = (scale = 1.03, glow = '0 0 36px rgba(214,40,40,0.45)') => ({
  onMouseEnter: (e) => {
    if (!prefersReduced()) e.currentTarget.style.transform = `scale(${scale})`;
    e.currentTarget.style.boxShadow = glow;
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  },
});
