/*
  One scroll listener for the whole page.

  There used to be five independent `scroll` handlers, each running its own
  rAF gate. They now share this one, so a scroll frame does a single pass over
  the subscriber list instead of scheduling five competing callbacks.

  Subscribers run inside the rAF, so they may read layout and write style;
  they must not call setState — that is what made scrolling expensive before.
*/
const subscribers = new Set();
let ticking = false;
let attached = false;

const flush = () => {
  ticking = false;
  for (const fn of subscribers) fn();
};

const schedule = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
};

export const onScrollFrame = (fn) => {
  subscribers.add(fn);

  if (!attached) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    attached = true;
  }

  fn(); // prime with the current position

  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && attached) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      attached = false;
    }
  };
};
