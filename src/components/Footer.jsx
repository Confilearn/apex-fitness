import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { accentHover } from '../lib/motion';
import { footerSections } from '../data/content';
import { SBtn } from './SBtn';
import { InstagramIcon, XIcon, LinkedInIcon } from './icons';

/* ════════════════════════════════════════════════════════════
   10 + 11. FINAL CTA + FOOTER
   Job: last chance. Make it feel like a decision, then get out.
   ════════════════════════════════════════════════════════════ */
export const Footer = () => {
  const [ref, vis] = useInView(0.1);
  const ctaBgRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  const go = (id) => {
    if (!onHome) {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  const onCta = () => {
    if (onHome) navigate('/get-started');
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Slow counter-drift on the CTA photo — rAF-throttled scroll parallax.
  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ctaBgRef.current && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const viewH = window.innerHeight;
            const center = (rect.top + rect.height / 2) / viewH - 0.5;
            const offset = center * rect.height * 0.12;
            ctaBgRef.current.style.transform = `translateY(${offset}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [ref]);

  return (
    <>
      {/* ─── Final CTA ─── */}
      <section ref={ref} className="relative overflow-hidden py-25 md:py-40">
        <div className="absolute inset-0">
          <img
            ref={ctaBgRef}
            src="/assets/images/dumbbells-mat.jpg"
            alt=""
            className="absolute top-[-12%] left-0 block h-[124%] w-full object-cover brightness-[.28] contrast-[1.15] will-change-transform"
          />
          <div className="absolute inset-0 bg-[rgba(13,13,11,.7)]" />
        </div>
        <div className="relative z-2 mx-auto max-w-[960px] px-6 text-center md:px-14">
          <div
            className="transition-[opacity,transform] duration-650 ease-css"
            style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(28px)' }}
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
              {...accentHover}
              onClick={onCta}
              className="rounded-btn border-none bg-accent px-10 py-4 text-[13px] font-bold tracking-[.18em] text-bg uppercase transition-[transform,box-shadow] duration-200 ease-css md:px-15 md:py-5"
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
            JL<span className="text-accent">.</span>FITNESS
          </div>
          <div className="flex flex-wrap gap-4 md:gap-7">
            {footerSections.map((id) => (
              <button
                key={id}
                onClick={() => go(id)}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#888880')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#3E3E3A')}
                className="border-none bg-transparent text-[11px] font-medium tracking-[.1em] text-faint uppercase transition-colors duration-200"
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <SBtn>
              <InstagramIcon />
            </SBtn>
            <SBtn>
              <XIcon />
            </SBtn>
            <SBtn>
              <LinkedInIcon />
            </SBtn>
          </div>
        </div>
        <div className="border-t border-[rgba(255,255,255,.04)] px-14 py-3.5 text-center text-[11px] tracking-[.06em] text-faint">
          Built by <span className="text-accent">OSE.builds</span>
        </div>
      </footer>
    </>
  );
};
