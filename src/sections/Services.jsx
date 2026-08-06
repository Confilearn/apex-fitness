import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useMobile } from '../hooks/useMobile';
import { reveal } from '../lib/motion';
import { svcData } from '../data/content';
import { Label } from '../components/Label';
import { PlantIcon } from '../components/icons';

const SvcCard = ({ img, n, title, desc, delay, vis, fontSize, icon, className = '' }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`relative overflow-hidden rounded-card ${className}`}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : 'translateY(28px)',
        transition: `opacity .55s ease ${delay}ms, transform .55s var(--ease) ${delay}ms`,
      }}
    >
      <img
        src={`/assets/images/${img}`}
        alt={title}
        className={`block h-full w-full object-cover contrast-[1.1] transition-[filter,transform] duration-350 ease-css
          ${hov ? 'scale-[1.03] brightness-[.8]' : 'scale-100 brightness-[.52]'}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.92)_0%,rgba(0,0,0,.05)_60%,transparent_100%)]" />
      <div className="absolute inset-0 flex flex-col justify-end p-7">
        {icon && (
          <div className="mb-3">
            <PlantIcon />
          </div>
        )}
        <div className="mb-2 text-[10px] font-medium tracking-[0.2em] text-[rgba(255,255,255,.36)] uppercase">
          {n}
        </div>
        <div
          className="mb-2.5 font-body leading-none font-extrabold tracking-[-0.02em] whitespace-pre-line text-text"
          style={{ fontSize: fontSize || '36px' }}
        >
          {title}
        </div>
        <div
          className={`max-w-[220px] text-[13px] leading-[1.55] font-light text-[rgba(232,224,208,.62)] transition-opacity duration-300 ease-css
            ${hov ? 'opacity-100' : 'opacity-65'}`}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   4. SERVICES
   Job: show what's offered without turning it into a menu.
   Unequal 55/45 grid at two row heights — hierarchy, not a grid of
   equal boxes.
   ════════════════════════════════════════════════════════════ */
export const Services = () => {
  const [ref, vis] = useInView(0.1);
  const isMobile = useMobile();

  return (
    <section id="services" ref={ref} className="relative overflow-hidden bg-surface-2 py-20 md:py-40">
      {/* Ghost section counter */}
      <div className="pointer-events-none absolute top-[-20px] right-10 z-0 hidden font-display text-[clamp(180px,18vw,240px)] leading-none tracking-[.04em] text-[rgba(255,255,255,0.025)] select-none md:block">
        02
      </div>
      <div className="relative z-1 mx-auto max-w-[1200px] px-6 md:px-14">
        <div className="mb-10 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end md:gap-0">
          <div>
            <Label vis={vis}>What I Offer</Label>
            <h2
              style={reveal(vis, 80)}
              className="font-body text-[clamp(36px,5vw,64px)] leading-[0.98] font-extrabold tracking-[-0.035em] text-text"
            >
              Designed Around
              <br />
              Your Goals
            </h2>
          </div>
          <div style={reveal(vis, 160)} className="hidden max-w-[320px] pb-1 md:block">
            <p className="text-sm leading-[1.7] font-light text-muted">
              Four programs, one philosophy: build a body that performs as well as it looks.
            </p>
          </div>
        </div>

        {/* Unequal 55/45 grid, two row heights. Single column on mobile. */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[55%_45%] md:grid-rows-[370px_248px]">
          <SvcCard
            {...svcData[0]}
            delay={0}
            vis={vis}
            fontSize={isMobile ? '36px' : '52px'}
            className="h-[220px] md:h-auto"
          />
          <SvcCard {...svcData[1]} delay={80} vis={vis} fontSize="32px" className="h-[200px] md:h-auto" />
          <SvcCard {...svcData[2]} delay={140} vis={vis} fontSize="32px" className="h-[200px] md:h-auto" />
          <SvcCard
            {...svcData[3]}
            delay={200}
            vis={vis}
            fontSize={isMobile ? '28px' : '32px'}
            className="h-[200px] md:h-auto"
          />
        </div>
      </div>
    </section>
  );
};
