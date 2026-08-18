import { useCallback, useSyncExternalStore } from 'react';

/*
  The homepage intro overlay covers the viewport while it is up, so anything
  behind it — the hero video especially — should not be competing for
  bandwidth yet. Two other places need to know when it releases:
  the hero (to start loading), and ScrollToHash (the overlay pins
  `body { overflow: hidden }`, which clamps scrollTo).

  Defaults to open, so routes without an intro behave normally.
*/
let open = true;
const subscribers = new Set();

const emit = () => subscribers.forEach((fn) => fn());

export const closeIntroGate = () => {
  if (!open) return;
  open = false;
  emit();
};

export const openIntroGate = () => {
  if (open) return;
  open = true;
  emit();
};

export const isIntroGateOpen = () => open;

export const useIntroGateOpen = () => {
  const subscribe = useCallback((fn) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }, []);
  return useSyncExternalStore(subscribe, () => open, () => true);
};
