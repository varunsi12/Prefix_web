import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { site } from './config/site';
import { initCloudflareBeacon } from './lib/analytics';
import '@fontsource-variable/lora/index.css';
import '@fontsource-variable/lora/wght-italic.css';
import './styles/global.css';

// Signals to CSS that JS is running (enables scroll-reveal; see Reveal.module.css).
document.documentElement.classList.add('js');

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages ship with markup — hydrate. Dev / shell.html routes mount fresh.
// (Element check, not hasChildNodes(): in dev the placeholder comment is still present.)
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

initCloudflareBeacon(site.analytics.cloudflareBeaconToken);
