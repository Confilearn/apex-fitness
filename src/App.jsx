import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { ScrollToHash } from './components/ScrollToHash';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';

/*
  Home stays eager — it is the landing route, and lazy-loading it would only
  add a round trip before first paint. The booking page (which carries the
  form and the maps embed) and the 404 split out.
*/
const GetStarted = lazy(() => import('./pages/GetStarted'));
const NotFound = lazy(() => import('./pages/NotFound'));

/*
  Nav is shared across every route — it was duplicated between the two
  standalone documents and behaves identically apart from where its
  links point, which it now derives from the current route.
*/
export default function App() {
  return (
    <ErrorBoundary>
      {/* First tab stop on every page. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollToHash />
      <Nav />
      <Suspense fallback={<div className="min-h-screen bg-bg" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
