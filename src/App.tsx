import { Route, Routes } from 'react-router';
import { Home } from './pages/Home';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { NotFound } from './pages/NotFound';
import { EventOrVenue, Invite } from './pages/DeepLink';

/**
 * Route table. Static routes are prerendered to HTML at build time
 * (scripts/prerender.mjs); dynamic routes are served via public/_redirects.
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Future deep links (app Universal Links will target these paths). */}
      <Route path="/invite/:code?" element={<Invite />} />
      <Route path="/event/:id" element={<EventOrVenue kind="event" />} />
      <Route path="/venue/:id" element={<EventOrVenue kind="venue" />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
