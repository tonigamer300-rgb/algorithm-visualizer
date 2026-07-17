import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import './styles/index.css';

// HashRouter is used instead of BrowserRouter because GitHub Pages serves the
// site statically and cannot rewrite deep links to index.html. Hash routing
// keeps every route working on a refresh without extra server config.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </HashRouter>
  </StrictMode>
);
