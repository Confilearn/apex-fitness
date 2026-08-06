import { Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { ScrollToHash } from './components/ScrollToHash';
import Home from './pages/Home';
import GetStarted from './pages/GetStarted';

/*
  Nav is shared across both routes — it was duplicated between the two
  standalone documents and behaves identically apart from where its
  links point, which it now derives from the current route.
*/
export default function App() {
  return (
    <>
      <ScrollToHash />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
      </Routes>
    </>
  );
}
