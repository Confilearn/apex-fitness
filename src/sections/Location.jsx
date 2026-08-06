import { useInView } from '../hooks/useInView';
import { useScrollRadius } from '../hooks/useScrollRadius';
import { reveal } from '../lib/motion';
import { gyms } from '../data/content';
import { UserCircleIcon } from '../components/icons';

/* ════════════════════════════════════════════════════════════
   LOCATION
   Job: make in-person feel real and reachable.
   Cream section, scroll-driven corners, info + photos + map.
   ════════════════════════════════════════════════════════════ */
export const Location = () => {
  const [ref, vis] = useInView(0.12, '0px 0px -8% 0px');
  const br = useScrollRadius(ref);

  return (
    <section
      ref={ref}
      className="overflow-hidden bg-cream py-20 md:py-30"
      style={{ borderRadius: `${br}px`, transition: 'border-radius 0.05s linear' }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-14">
        {/* Heading row */}
        <div className="mb-10 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end md:gap-0">
          <div>
            <div className="mb-5 inline-flex items-center gap-[7px]">
              <UserCircleIcon />
              <span className="text-[11px] font-medium tracking-[0.2em] text-[rgba(0,0,0,0.4)] uppercase">
                Location
              </span>
            </div>
            <h2
              style={reveal(vis, 80)}
              className="font-body text-[clamp(36px,5vw,64px)] leading-none font-extrabold tracking-[-0.035em] text-ink"
            >
              Come Train
              <br />
              With Us
            </h2>
          </div>
          <p
            style={reveal(vis, 160)}
            className="hidden max-w-[260px] pb-1 text-sm leading-[1.72] font-light text-ink-muted md:block"
          >
            In-person sessions at two locations across San Francisco.
          </p>
        </div>

        {/* Grid: info + photos / map */}
        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2">
          {/* Left */}
          <div className="flex flex-col gap-3">
            {/* Info card */}
            <div
              style={reveal(vis, 100, 'x')}
              className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8"
            >
              {gyms.map((g, i) => (
                <div
                  key={g.name}
                  className={i === 0 ? 'mb-5 border-b border-[rgba(0,0,0,0.07)] pb-5' : ''}
                >
                  <div className="mb-[5px] font-body text-[15px] font-bold text-ink">{g.name}</div>
                  <div className="mb-[5px] text-[13px] leading-[1.55] font-light text-ink-muted">{g.addr}</div>
                  <div className="text-[11px] font-normal tracking-[0.02em] text-[rgba(0,0,0,0.32)]">
                    {g.hrs}
                  </div>
                </div>
              ))}
            </div>

            {/* Two gym photos */}
            <div className="grid flex-1 grid-cols-2 gap-3">
              <div style={reveal(vis, 180, 'x')} className="min-h-[200px] overflow-hidden rounded-2xl">
                <img
                  src="/assets/images/dumbbell-rack.jpg"
                  alt="Gym"
                  className="block h-full w-full object-cover contrast-[1.05] saturate-[0.88]"
                />
              </div>
              <div style={reveal(vis, 240, 'x')} className="min-h-[200px] overflow-hidden rounded-2xl">
                <img
                  src="/assets/images/trainer-session.jpg"
                  alt="Training"
                  className="block h-full w-full object-cover contrast-[1.05] saturate-[0.88]"
                />
              </div>
            </div>
          </div>

          {/* Right — map */}
          <div style={reveal(vis, 160, 'right')} className="min-h-[460px] overflow-hidden rounded-2xl">
            <iframe
              src="https://maps.google.com/maps?q=SoMa,San+Francisco,CA&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="block h-full min-h-[460px] w-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gym Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
