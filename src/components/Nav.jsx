import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMobile } from '../hooks/useMobile';
import { navSections } from '../data/content';
import { LogoMark, CloseIcon } from './icons';

/* ════════════════════════════════════════════════════════════
   1. NAV
   Job: stay out of the way, then harden into a pill on scroll.
   Section links scroll in place on the homepage and route back to
   it with a hash from anywhere else.
   ════════════════════════════════════════════════════════════ */
export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const go = (id) => {
    setMenuOpen(false);
    if (!onHome) {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const onLogo = () => {
    if (onHome) window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate('/');
  };

  const onCta = () => {
    setMenuOpen(false);
    if (onHome) navigate('/get-started');
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`nav-shell fixed top-4 left-1/2 z-1000 flex -translate-x-1/2 items-center
          w-[calc(100vw-40px)] md:w-[calc(100vw-80px)] whitespace-nowrap
          backdrop-blur-xl backdrop-saturate-180 border
          ${
            scrolled
              // 999px, not rounded-full: the shell transitions border-radius, and
              // Tailwind's infinity value would make that morph snap instead of ease.
              ? 'max-w-[1000px] rounded-[999px] px-5 py-[9px] bg-[rgba(13,13,11,0.88)] border-[rgba(255,255,255,0.15)] shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
              : 'max-w-[1200px] rounded-[20px] px-5 py-[11px] md:px-9 md:py-[13px] bg-[rgba(13,13,11,0.52)] border-[rgba(255,255,255,0.08)] shadow-[0_2px_24px_rgba(0,0,0,0.15)]'
          }`}
      >
        {/* Logo — pinned left */}
        <div className="flex shrink-0 cursor-pointer items-center gap-2" onClick={onLogo}>
          <LogoMark />
          <span className="font-body text-[15px] font-semibold text-text">Apex Performance</span>
        </div>

        {/* Desktop: links + CTA */}
        {!isMobile && (
          <>
            <div className="flex flex-1 items-center justify-center gap-8">
              {navSections.map((l) => (
                <button key={l} className="nav-link" onClick={() => go(l.toLowerCase())}>
                  {l}
                </button>
              ))}
            </div>
            <button
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D62828';
                e.currentTarget.style.color = '#FFF5F2';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(214,40,40,0.38)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#FF4B4B';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={onCta}
              className="shrink-0 rounded-full border-[1.5px] border-accent-hi bg-transparent px-5 py-2 text-sm font-semibold text-accent-hi transition-all duration-200 ease-css"
            >
              Get Started
            </button>
          </>
        )}

        {/* Mobile: hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="ml-auto flex cursor-pointer flex-col gap-[5px] border-none bg-transparent p-1"
          >
            {menuOpen ? (
              <CloseIcon />
            ) : (
              <>
                <span className="block h-[1.5px] w-[22px] rounded-xs bg-text" />
                <span className="block h-[1.5px] w-[22px] rounded-xs bg-text" />
                <span className="block h-[1.5px] w-[14px] rounded-xs bg-text" />
              </>
            )}
          </button>
        )}
      </nav>

      {/* Mobile full-screen menu */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-999 flex flex-col items-center justify-center gap-2
            bg-[rgba(13,13,11,0.97)] backdrop-blur-lg transition-opacity duration-250 ease-css
            ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          {navSections.map((l) => (
            <button
              key={l}
              onClick={() => go(l.toLowerCase())}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FF4B4B')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#E8E0D0')}
              className="cursor-pointer border-none bg-transparent py-3 font-body text-[32px] font-semibold tracking-[-0.02em] text-text transition-colors duration-200"
            >
              {l}
            </button>
          ))}
          <button
            onClick={onCta}
            className="mt-6 cursor-pointer rounded-full border-none bg-accent px-10 py-3.5 text-[15px] font-bold text-on-accent"
          >
            Get Started
          </button>
        </div>
      )}
    </>
  );
};
