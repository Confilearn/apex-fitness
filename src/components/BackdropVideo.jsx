import heroMp4 from '../assets/media/hero-loop.mp4';
import heroWebm from '../assets/media/hero-loop.webm';
import heroPoster from '../assets/media/hero-poster.webp';
import { useReducedMotion } from '../hooks/useReducedMotion';

export { heroPoster };

/*
  The single decorative video on the site, shared by the intro overlay and the
  hero so the file is requested once rather than by two elements at the same
  time.

  `poster` paints immediately while the video buffers. Reduced motion gets the
  poster and nothing else — an autoplaying background loop is exactly what
  that setting is asking us not to do.

  `load` defers the request entirely; the hero passes false until the intro
  overlay has released.
*/
export const BackdropVideo = ({ className = '', load = true, objectPosition = '65% 30%' }) => {
  const reduced = useReducedMotion();

  if (reduced || !load) {
    return (
      <img
        src={heroPoster}
        alt=""
        width={1920}
        height={1080}
        decoding="async"
        fetchPriority={load ? 'high' : undefined}
        className={className}
        style={{ objectPosition }}
      />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster={heroPoster}
      preload="auto"
      aria-hidden="true"
      className={className}
      style={{ objectPosition }}
    >
      <source src={heroWebm} type="video/webm" />
      <source src={heroMp4} type="video/mp4" />
    </video>
  );
};
