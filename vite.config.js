import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Surface a regression rather than letting the bundle creep back up.
    chunkSizeWarningLimit: 200,
    rollupOptions: {
      output: {
        /*
          React, the DOM renderer and the router change on their own release
          cadence, not with site copy. Splitting them means a content edit
          reships ~12 kB of app code instead of busting the whole 265 kB.

          Vite 8 runs Rolldown, which only accepts the function form here —
          the Rollup object map throws.
        */
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // Must precede the react test: react-router-dom contains "react".
          if (/node_modules[\\/](react-router|@remix-run)/.test(id)) return 'router';
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
        },
      },
    },
  },
});
