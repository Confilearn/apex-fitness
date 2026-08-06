/* Footer social button — square, brightens on hover. */
export const SBtn = ({ children }) => (
  <button
    className="flex h-9 w-9 items-center justify-center rounded-xs border border-[rgba(255,255,255,.08)]
      bg-[rgba(255,255,255,.04)] transition-colors duration-200 hover:bg-[rgba(255,255,255,.08)]"
  >
    {children}
  </button>
);
