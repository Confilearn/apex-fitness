import { useCallback, useSyncExternalStore } from 'react';

const lists = new Map();
const list = (query) => {
  let mql = lists.get(query);
  if (!mql) {
    mql = window.matchMedia(query);
    lists.set(query, mql);
  }
  return mql;
};

/*
  matchMedia rather than a resize listener: it fires only when the query
  actually flips, instead of on every pixel of a window drag.
*/
export const useMediaQuery = (query) => {
  const subscribe = useCallback(
    (onChange) => {
      const mql = list(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => list(query).matches,
    () => false // server / pre-hydration
  );
};
