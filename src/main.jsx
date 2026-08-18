import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';
import './index.css';

/*
  Analytics and Speed Insights are cookieless and same-origin (they post to
  /_vercel/*), so they pass the CSP unchanged and need no consent banner.
  Both are inert until enabled in the Vercel project dashboard.

  The site's entire purpose is conversion and there was no way to measure it.
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </StrictMode>
);
