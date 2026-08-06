import { useEffect } from 'react';

/* Preserves the per-page <title> the two standalone HTML files had. */
export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};
