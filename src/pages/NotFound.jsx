import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { lift } from '../lib/motion';
import { navSections } from '../data/content';
import { Img } from '../components/Img';
import { Footer } from '../components/Footer';
import { Seo } from '../components/Seo';

/* ════════════════════════════════════════════════════════════
   404
   Job: absorb a dead end without losing the visitor. State the
   mistake plainly, then hand back one obvious route into the
   funnel plus a short jump list to every real section.

   Composition mirrors the Hero — left column over a near-silhouette
   frame, mixed-weight headline, one accent word — so a wrong URL
   still lands inside the brand rather than outside it.
   ════════════════════════════════════════════════════════════ */
export default function NotFound() {
  useDocumentTitle('404 — Page Not Found | Apex Performance');

  const [vis, setVis] = useState(false);
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 180);
    return () => clearTimeout(t);
  }, []);

  // Staggered entrance — per-element delay, so it stays inline.
  const fd = (d) =>
    reduced
      ? { opacity: vis ? 1 : 0, transition: `opacity .4s ease ${d}ms` }
      : {
          opacity: vis ? 1 : 0,
          transform: vis ? 'none' : 'translateY(35px)',
          transition: `opacity .8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${d}ms, transform .8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${d}ms`,
        };

  // Jump list — nav sections plus FAQ, resolved on the homepage by ScrollToHash.
  const jumps = [...navSections, 'FAQ'];

  return (
    <div className="bg-bg">
      {/* noindex: the SPA rewrite serves this with a 200, so without it a
          soft-404 would be indexable. */}
      <Seo
        title="404 — Page Not Found | Apex Performance"
        description="That page does not exist. Head back to Apex Performance."
        noindex
      />
      <main id="main">
        <section className="relative flex min-h-screen items-center overflow-hidden">
          {/* ── Background — near silhouette, Process-grade treatment ── */}
          <div className="absolute inset-0">
            <Img
              name="trainer-pullup"
              alt=""
              sizes="100vw"
              priority
              className="absolute inset-0 block h-full w-full object-cover object-[70%_28%] brightness-[0.25] contrast-[1.2]"
            />
            {/* Directional gradient: dark left → clear right */}
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(13,13,11,0.97)_0%,rgba(13,13,11,0.92)_30%,rgba(13,13,11,0.6)_58%,rgba(13,13,11,0.2)_82%,rgba(13,13,11,0.08)_100%)]" />
            {/* Bottom wash so the jump list reads against the frame */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,13,11,0.9)_0%,transparent_42%)]" />
          </div>

          {/* ── Ghost numeral — atmosphere, not content ── */}
          <div
            aria-hidden="true"
            style={{
              opacity: vis ? 1 : 0,
              transform: vis || reduced ? 'none' : 'translateY(24px)',
              transition: 'opacity 1.4s ease 120ms, transform 1.4s cubic-bezier(0.16,1,0.3,1) 120ms',
            }}
            className="pointer-events-none absolute right-[-6%] bottom-[-12%] z-1 font-display
              text-[clamp(240px,44vw,660px)] leading-[0.72] tracking-[.02em]
              text-[rgba(232,224,208,0.05)] select-none"
          >
            404
          </div>

          {/* ── Left column ── */}
          <div className="relative z-2 w-full max-w-full px-6 pt-28 pb-16 md:max-w-[760px] md:px-14 md:pt-32 md:pb-20">
            <div style={fd(0)} className="mb-5 flex items-center gap-3">
              <span aria-hidden="true" className="block h-[1px] w-8 bg-accent-hi" />
              <span className="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
                Error 404 — Off Plan
              </span>
            </div>

            {/* Mixed weight: light intro / bold accent outro */}
            <h1 className="mb-[22px] font-body leading-none tracking-[-0.03em]">
              <span
                style={fd(70)}
                className="block text-[clamp(38px,5.2vw,76px)] leading-none font-normal text-[rgba(232,224,208,0.82)]"
              >
                Looks Like You
              </span>
              <span style={fd(170)} className="block text-[clamp(38px,5.2vw,76px)] leading-none">
                <span className="font-extrabold text-accent">Went Off</span>
                <span className="font-normal text-[rgba(232,224,208,0.82)]"> Track.</span>
              </span>
            </h1>

            <div style={fd(300)} className="mb-9 max-w-[460px]">
              <p className="text-base leading-[1.7] font-light text-muted">
                This page moved, or it never existed. Either way — nothing here to train with.
              </p>
            </div>

            {/* Primary route back + secondary text link */}
            <div style={fd(400)} className="mb-14 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                type="button"
                {...lift(1.03, '0 0 36px rgba(214,40,40,0.45)')}
                onClick={() => navigate('/')}
                className="inline-flex cursor-pointer items-center gap-3.5 rounded-full border-none bg-accent py-3 pr-3.5 pl-7 text-sm font-semibold text-on-accent transition-[transform,box-shadow] duration-220 ease-css"
              >
                Back To Home
                <span
                  aria-hidden="true"
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-bg text-[15px] text-accent-hi"
                >
                  ↗
                </span>
              </button>
              <button type="button" onClick={() => navigate('/get-started')} className="nav-link !text-[14px]">
                Book a discovery call
              </button>
            </div>

            {/* ── Jump list — every section is one tap away ── */}
            <div style={fd(520)}>
              <h2 className="mb-4 text-[11px] font-medium tracking-[0.2em] text-faint uppercase">
                Or Jump Straight To
              </h2>
              <nav aria-label="Site sections" className="flex flex-wrap gap-2.5">
                {jumps.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => navigate(`/#${label.toLowerCase()}`)}
                    className="cursor-pointer rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)]
                      px-5 py-2.5 text-[12px] font-medium tracking-[0.08em] text-muted uppercase
                      backdrop-blur-md transition-[border-color,color] duration-200 ease-css
                      hover:border-[rgba(255,255,255,0.22)] hover:text-text"
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
