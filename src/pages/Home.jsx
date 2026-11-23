import React, { lazy, useEffect, useRef } from "react";
import Hero from "../sections/home/Hero";
import LazySection from "../components/common/LazySection";
import { useLocation } from "react-router-dom";

// Everything below the hero is split out and mounted as it nears the viewport.
const ExploreHeritageSites = lazy(() => import("../sections/home/ExploreHeritageSites"));
const ExcavationCarousel = lazy(() => import("../sections/home/ExcavationCarousel"));
const ProtectedSitesDetails = lazy(() => import("../sections/home/ProtectedSitesDetails"));
const LivingHeritage = lazy(() => import("../sections/home/LivingHeritage"));
const BiharHeritageMaps = lazy(() => import("../sections/home/BiharHeritageMaps"));
const Gallery = lazy(() => import("./Gallery"));
const ExploreJoin = lazy(() => import("../sections/home/ExploreJoin"));
const GoverningComponents = lazy(() => import("../sections/home/GoverningComponents"));

import { ReactLenis, useLenis } from "lenis/react";



const Home = () => {
  const excavationRef = useRef(null);
  const exploreJoinRef = useRef(null);
  const conservationRef = useRef(null);
  const location = useLocation();

  const lenis = useLenis();
  // Deep links (#excavation etc.) need the real sections in place to scroll to.
  const eager = Boolean(location.hash);

  useEffect(() => {
    if (!lenis) return;

    const hash = location.hash.replace("#", "");
    const sectionRefs = {
      excavation: excavationRef,
      explorejoin: exploreJoinRef,
      conservation: conservationRef,
    };

    const targetRef = sectionRefs[hash];

    if (targetRef?.current) {
      lenis.scrollTo(targetRef.current, {
        offset: -80, // Adjust if you have a fixed navbar (e.g. :  -80px)
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }, [location, lenis]);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
      }}
    >
      {/* Unified dark page container */}
      <div className="relative min-h-screen bg-brand-dark">
        {/* All your content - sits on top of background */}
        <main className="relative z-10 overflow-x-hidden">
          <Hero />
          <LazySection eager={eager}><ExploreHeritageSites /></LazySection>
          <LazySection eager={eager}><BiharHeritageMaps /></LazySection>
           <LazySection eager={eager}><ProtectedSitesDetails /></LazySection>
          <section ref={excavationRef} id="excavation">
            <LazySection eager={eager}><ExcavationCarousel /></LazySection>
          </section>
         
          <LazySection eager={eager}><LivingHeritage /></LazySection>
         
          <LazySection eager={eager}><Gallery /></LazySection>
          <section ref={exploreJoinRef} id="explorejoin">
            <LazySection eager={eager}><ExploreJoin /></LazySection>
          </section>
          <LazySection eager={eager}><GoverningComponents /></LazySection>
        </main>
      </div>
    </ReactLenis>
  );
};

export default Home;