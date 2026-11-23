import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminModulePage = lazy(() => import("./pages/admin/AdminModulePage"));
const AdminGuard = lazy(() => import("./pages/admin/AdminGuard"));
const VaishaliEventPage = lazy(() => import("./pages/VaishaliEvent/VaishaliEventPage"));
const GuestRegistrationPage = lazy(() => import("./pages/VaishaliEvent/guest/GuestRegistrationPage"));
const GuestDashboardPage = lazy(() => import("./pages/VaishaliEvent/guest/GuestDashboardPage"));
const VolunteerRegistrationPage = lazy(() => import("./pages/VaishaliEvent/volunteer/VolunteerRegistrationPage"));
const VolunteerDashboardPage = lazy(() => import("./pages/VaishaliEvent/volunteer/VolunteerDashboardPage"));
const IntangibleHeritagePage = lazy(() => import("./pages/IntangibleHeritage/IntangibleHeritagePage"));

import { ImageLightboxProvider } from "./context/ImageLightboxContext";
import ImageLightboxModal from "./components/common/ImageLightboxModal";

// Inner layout that conditionally shows Header/Footer only on public route
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  React.useEffect(() => {
    if (isAdminRoute) {
      document.body.classList.add("admin-body");
    } else {
      document.body.classList.remove("admin-body");
    }
    return () => {
      document.body.classList.remove("admin-body");
    };
  }, [isAdminRoute]);

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Header />}
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
        <Route path="/vaishali-buddhist-conference-2026" element={<VaishaliEventPage />} />
        <Route path="/vaishali-buddhist-conference-2026/register" element={<GuestRegistrationPage />} />
        <Route path="/vaishali-buddhist-conference-2026/dashboard" element={<GuestDashboardPage />} />
        <Route path="/vaishali-buddhist-conference-2026/volunteer/register" element={<VolunteerRegistrationPage />} />
        <Route path="/vaishali-buddhist-conference-2026/volunteer/dashboard" element={<VolunteerDashboardPage />} />

        {/* Admin CMS Routes — no public Header/Footer */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/:moduleKey"
          element={
            <AdminGuard>
              <AdminModulePage />
            </AdminGuard>
          }
        />
      </Routes>
      {!isAdminRoute && <Footer />}
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