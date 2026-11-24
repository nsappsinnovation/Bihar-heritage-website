import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/layout/Header";
const Publication = lazy(() => import("./pages/Publication"));
const Footer = lazy(() => import("./components/layout/Footer"));
const Event = lazy(() => import("./pages/Event"));
const Contact = lazy(() => import("./pages/Contact"));
const VideoGalleryPage = lazy(() => import("./pages/VideoGalleryPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const Gallery = lazy(() => import("./pages/Gallery"));
const GoverningBody = lazy(() => import("./pages/GoverningBody"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const KeyFunctionaries = lazy(() => import("./pages/KeyFunctionaries"));
const ExecutiveCommittee = lazy(() => import("./pages/ExecutiveCommittee"));
const ArcheologicalTeam = lazy(() => import("./pages/ArcheologicalTeam"));
const ActivitiesPage = lazy(() => import("./pages/ActivitiesPage"));
import ScrollToTop from "./components/common/ScrollToTop";
const ProtectedSites = lazy(() => import("./pages/ProtectedSites"));
const Excavations = lazy(() => import("./pages/Excavations"));
const ExcavationDetail = lazy(() => import("./pages/ExcavationDetail"));
const News = lazy(() => import("./pages/News"));
const Tender = lazy(() => import("./pages/Tender"));
const BlogPage = lazy(() => import("./pages/BlogPage/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogPage/BlogDetailPage"));
const IntangibleHeritagePage = lazy(() => import("./pages/IntangibleHeritage/IntangibleHeritagePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { ImageLightboxProvider } from "./context/ImageLightboxContext";
import ImageLightboxModal from "./components/common/ImageLightboxModal";

const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publication" element={<Publication />} />
        <Route path="/events/*" element={<Event />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/VideoGalleryPage" element={<VideoGalleryPage />} />
        <Route path="/GalleryPage" element={<GalleryPage />} />
        <Route path="/Activities" element={<ActivitiesPage />} />
        <Route path="/governingbody" element={<GoverningBody />} />
        <Route path="/excavations" element={<Excavations />} />
        <Route path="/excavations/:slug" element={<ExcavationDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/protected-sites" element={<ProtectedSites />} />
        <Route path="/keyfunctionaries" element={<KeyFunctionaries />} />
        <Route path="/executive" element={<ExecutiveCommittee />} />
        <Route path="/archeologicalteam" element={<ArcheologicalTeam />} />
        <Route path="/news" element={<News />} />
        <Route path="/tender" element={<Tender />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/living-heritage" element={<IntangibleHeritagePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      </Suspense>
      <ImageLightboxModal />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ImageLightboxProvider>
        <AppLayout />
      </ImageLightboxProvider>
    </Router>
  );
};

export default App;

//end