import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useScrollRadius } from '../hooks/useScrollRadius';
import { reveal } from '../lib/motion';
import { business, gyms } from '../data/content';
import { Img } from '../components/Img';
import { UserCircleIcon } from '../components/icons';

const mapsUrl = (addr) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;

/*
  Facade for the Google Maps embed.

  The iframe pulled several hundred KB of third-party script and set Google
  cookies on every page view, for a map most visitors never touch. It now
  loads on click — same map, same functionality, nothing shipped until it is
  actually wanted. Each address also links out, which is what a phone user
  wants anyway.
*/
const MapPanel = () => {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src="https://maps.google.com/maps?q=SoMa,San+Francisco,CA&t=&z=14&ie=UTF8&iwloc=&output=embed"
        className="block h-full min-h-[460px] w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Map of Apex Performance locations in San Francisco"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="group relative block h-full min-h-[460px] w-full cursor-pointer overflow-hidden border-0 p-0"
      aria-label="Load the interactive map (connects to Google Maps)"
    >
      <Img
        name="trainer-session"
        alt=""
        sizes="(max-width: 767px) 100vw, 580px"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.45] saturate-[0.6] transition-transform duration-500 ease-css group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[rgba(13,13,11,0.45)]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent">
          <svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,192.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-126a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
          </svg>
        </span>
        <span className="font-body text-[15px] font-semibold text-text">Show map</span>
        <span className="max-w-[240px] text-center text-[11px] leading-[1.5] font-light text-[rgba(232,224,208,0.72)]">
          Loads Google Maps, which sets its own cookies
        </span>
      </span>
    </button>
  );
};

/* ════════════════════════════════════════════════════════════
   LOCATION
   Job: make in-person feel real and reachable.
   Cream section, scroll-driven corners, info + photos + map.
   ════════════════════════════════════════════════════════════ */
export const Location = () => {
  const [ref, vis] = useInView(0.12, '0px 0px -8% 0px');
  useScrollRadius(ref);

  return (
    <section ref={ref} className="overflow-hidden bg-cream py-20 md:py-30">
      <div className="mx-auto max-w-[1200px] px-6 md:px-14">
        {/* Heading row */}
        <div className="mb-10 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end md:gap-0">
          <div>
            <div className="mb-5 inline-flex items-center gap-[7px]">
              <UserCircleIcon />
              <span className="text-[11px] font-medium tracking-[0.2em] text-[rgba(0,0,0,0.55)] uppercase">
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
            <div style={reveal(vis, 100, 'x')} className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8">
              {gyms.map((g, i) => (
                <div key={g.name} className={i === 0 ? 'mb-5 border-b border-[rgba(0,0,0,0.07)] pb-5' : ''}>
                  <div className="mb-[5px] font-body text-[15px] font-bold text-ink">{g.name}</div>
                  <a
                    href={mapsUrl(g.addr)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-[5px] block text-[13px] leading-[1.55] font-light text-ink-muted underline decoration-[rgba(0,0,0,0.2)] underline-offset-2 transition-colors hover:text-ink hover:decoration-[#a31212]"
                  >
                    {g.addr}
                  </a>
                  <div className="text-[11px] font-normal tracking-[0.02em] text-[rgba(0,0,0,0.5)]">{g.hrs}</div>
                </div>
              ))}

              {/* Direct contact — the site had no clickable phone or email at all */}
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[rgba(0,0,0,0.07)] pt-5">
                <a
                  href={`tel:${business.phone}`}
                  className="text-[13px] font-medium text-ink underline decoration-[rgba(0,0,0,0.25)] underline-offset-2 transition-colors hover:decoration-[#a31212]"
                >
                  {business.phoneDisplay}
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="text-[13px] font-medium text-ink underline decoration-[rgba(0,0,0,0.25)] underline-offset-2 transition-colors hover:decoration-[#a31212]"
                >
                  {business.email}
                </a>
              </div>
            </div>

            {/* Two gym photos */}
            <div className="grid flex-1 grid-cols-2 gap-3">
              <div style={reveal(vis, 180, 'x')} className="min-h-[200px] overflow-hidden rounded-2xl">
                <Img
                  name="dumbbell-rack"
                  alt="The weights floor at Apex Performance SoMa"
                  sizes="(max-width: 767px) 45vw, 290px"
                  className="block h-full w-full object-cover contrast-[1.05] saturate-[0.88]"
                />
              </div>
              <div style={reveal(vis, 240, 'x')} className="min-h-[200px] overflow-hidden rounded-2xl">
                <Img
                  name="trainer-session"
                  alt="A coaching session in progress"
                  sizes="(max-width: 767px) 45vw, 290px"
                  className="block h-full w-full object-cover contrast-[1.05] saturate-[0.88]"
                />
              </div>
            </div>
          </div>

          {/* Right — map */}
          <div style={reveal(vis, 160, 'right')} className="min-h-[460px] overflow-hidden rounded-2xl">
            <MapPanel />
          </div>
        </div>
      </div>
    </section>
  );
};
