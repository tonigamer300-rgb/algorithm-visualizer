import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

// Pages are code-split so each route only loads when first visited.
const HomePage = lazy(() => import('./pages/HomePage'));
const AlgorithmsPage = lazy(() => import('./pages/AlgorithmsPage'));
const VisualizationPage = lazy(() => import('./pages/VisualizationPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="algorithms" element={<AlgorithmsPage />} />
        <Route path="visualize/:id" element={<VisualizationPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
