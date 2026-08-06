/*
  Small-caps section label. `light` switches it for the cream sections —
  a variant prop rather than an overriding class, so there is no
  same-specificity colour conflict to reason about.
*/
export const Label = ({ children, vis, light = false, className = '' }) => (
  <div
    className={`mb-4.5 font-body text-[11px] font-medium tracking-[0.2em] uppercase
      transition-opacity duration-400 ease-css
      ${light ? 'text-[rgba(0,0,0,0.4)]' : 'text-muted'}
      ${vis ? 'opacity-100' : 'opacity-0'} ${className}`}
  >
    {children}
  </div>
);
