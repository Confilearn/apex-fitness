/*
  Scroll-reveal transform + per-element stagger delay. Delay is
  computed per call site, so this stays an inline style object.
*/
export const reveal = (vis, delay = 0, axis = 'y') => ({
  opacity: vis ? 1 : 0,
  transform: vis
    ? 'none'
    : axis === 'x'
      ? 'translateX(-48px)'
      : axis === 'right'
        ? 'translateX(48px)'
        : 'translateY(40px)',
  transition: `opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
  willChange: 'opacity, transform',
});

/* Accent button: lift + glow. Imperative so it survives re-render churn. */
export const accentHover = {
  onMouseEnter: (e) => {
    e.currentTarget.style.transform = 'scale(1.03)';
    e.currentTarget.style.boxShadow = '0 0 36px rgba(200,255,0,0.28)';
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  },
};
