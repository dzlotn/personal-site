import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { Analytics } from '@vercel/analytics/react';
import Main from './layouts/Main'; // fallback for lazy pages
import './static/css/main.scss'; // All of our styles

const { PUBLIC_URL } = process.env;

// Every route - we lazy load so that each page can be chunked
// NOTE that some of these chunks are very small. We should optimize
// which pages are lazy loaded in the future.
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Projects = lazy(() => import('./pages/Projects'));
const AttritionAnalytics = lazy(() => import('./pages/AttritionAnalytics'));
const CampusQuest = lazy(() => import('./pages/CampusQuest'));
const Fortress = lazy(() => import('./pages/Fortress'));
const TremorTrackr = lazy(() => import('./pages/TremorTrackr'));
const ProjectNexus = lazy(() => import('./pages/ProjectNexus'));

// const Stats = lazy(() => import('./pages/Stats'));

const App = () => (
  <BrowserRouter basename={PUBLIC_URL}>
    <Suspense fallback={<Main />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/AttritionAnalytics" element={<AttritionAnalytics />} />
        {/* <Route path="/resume" element={<Resume />} /> */}
        <Route path="/projects/CampusQuest" element={<CampusQuest />} />
        <Route path="/projects/TremorTrackr" element={<TremorTrackr />} />
        <Route path="/projects/Fortress" element={<Fortress />} />
        <Route path="/projects/ProjectNexus" element={<ProjectNexus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <Analytics />
  </BrowserRouter>
);

export default App;
