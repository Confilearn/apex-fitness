import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { accentHover } from '../lib/motion';
import { onScrollFrame } from '../lib/scroll';
import { business, footerSections, socials } from '../data/content';
import { Img } from './Img';
import { SOCIAL_ICONS } from './icons';

/* ════════════════════════════════════════════════════════════
   10 + 11. FINAL CTA + FOOTER
   Job: last chance. Make it feel like a decision, then get out.
   ════════════════════════════════════════════════════════════ */
export const Footer = () => {
  const [ref, vis] = useInView(0.1);
  const ctaBgRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const onHome = pathname === '/';

  const go = (id) => {
    if (!onHome) {
      navigate(`/#${id}`);
      return;
    }
    // scroll-margin-top on [id] handles the fixed-nav offset in CSS.
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onCta = () => {
    // On the booking page the CTA returns to the form; everywhere
    // else — homepage, 404 — it routes there.
    if (pathname === '/get-started') window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate('/get-started');
  };

  // Slow counter-drift on the CTA photo.
  useEffect(() => {
    if (reduced) return;
    return onScrollFrame(() => {
      if (!ctaBgRef.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
      ctaBgRef.current.style.transform = `translateY(${center * rect.height * 0.12}px)`;
    });
  }, [ref, reduced]);

  return (
    <>
      {/* ─── Final CTA ─── */}
      <section ref={ref} className="relative overflow-hidden py-25 md:py-40">
        <div className="absolute inset-0">
          <Img
            ref={ctaBgRef}
            name="dumbbells-mat"
            alt=""
            sizes="100vw"
            className="absolute top-[-12%] left-0 block h-[124%] w-full object-cover brightness-[.28] contrast-[1.15] will-change-transform"
          />
          <div className="absolute inset-0 bg-[rgba(13,13,11,.7)]" />
        </div>
        <div className="relative z-2 mx-auto max-w-[960px] px-6 text-center md:px-14">
          <div
            className="transition-[opacity,transform] duration-650 ease-css"
            style={{ opacity: vis ? 1 : 0, transform: vis || reduced ? 'none' : 'translateY(28px)' }}
          >
            <div className="mb-7 text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
              The First Step Is The Hardest
            </div>
            <h2 className="mb-10 font-display text-[clamp(52px,13vw,80px)] leading-[0.88] tracking-[.025em] text-text md:text-[clamp(64px,9.5vw,128px)]">
              Ready To Achieve
              <br />
              <span className="text-accent">Your Goals?</span>
            </h2>
            <button
              type="button"
              {...accentHover}
              onClick={onCta}
              className="cursor-pointer rounded-btn border-none bg-accent px-10 py-4 text-[13px] font-bold tracking-[.18em] text-on-accent uppercase transition-[transform,box-shadow] duration-200 ease-css md:px-15 md:py-5"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[rgba(255,255,255,.06)] bg-bg">
        <div className="flex flex-col items-start justify-between gap-5 px-6 py-7 md:flex-row md:items-center md:px-14 md:py-9">
          <div className="font-display text-2xl tracking-[.18em] text-text">
            APEX<span className="text-accent-hi">.</span>PERFORMANCE
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-4 md:gap-7">
            {footerSections.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                className="cursor-pointer border-none bg-transparent text-[11px] font-medium tracking-[.1em] text-faint uppercase transition-colors duration-200 hover:text-text"
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </nav>

          {/* Were <button>s with no handler. Now real links. */}
          <div className="flex gap-2">
            {socials.map(({ name, href }) => {
              const Icon = SOCIAL_ICONS[name];
              return (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} (opens in a new tab)`}
                  className="flex h-9 w-9 items-center justify-center rounded-xs border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.04)] transition-colors duration-200 hover:bg-[rgba(255,255,255,.08)]"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        {/* Contact strip — the site previously had no clickable phone or email */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[rgba(255,255,255,.04)] px-6 py-4 text-[12px] text-muted">
          <a href={`tel:${business.phone}`} className="transition-colors hover:text-text">
            {business.phoneDisplay}
          </a>
          <a href={`mailto:${business.email}`} className="transition-colors hover:text-text">
            {business.email}
          </a>
          <span className="text-faint">
            {business.city}, {business.region}
          </span>
        </div>

        <div className="border-t border-[rgba(255,255,255,.04)] px-6 py-3.5 text-center text-[11px] tracking-[.06em] text-faint md:px-14">
          Built by{' '}
          <a
            href="https://confibiz.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-hi no-underline transition-opacity duration-200 hover:underline hover:decoration-[rgba(255,75,75,.5)] hover:underline-offset-[3px] hover:opacity-85"
          >
            Confibiz
          </a>
        </div>
      </footer>
    </>
  );
};
