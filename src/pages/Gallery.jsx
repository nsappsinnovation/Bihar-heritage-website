import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Play, ArrowRight, Video } from "lucide-react";
import { getData, STORAGE_KEYS } from "../utils/cmsStorage";
import { defaultPopularSites, defaultLivingHeritageVideos } from "../data/defaults/cmsDefaults";
import { useInView } from "react-intersection-observer";

// Image Imports
import BodhGaya from "../assets/GalleryImg/BodhGaya.webp";
import JalMandir from "../assets/GalleryImg/JalMandir.webp";
import MahabodhiTemple from "../assets/GalleryImg/MahabodhiTemple.webp";
import ShantiBabaMandir from "../assets/GalleryImg/ShantiBaba.webp";
import RohtasGarhFort from "../assets/UniqueBiharImg/RohtasFort.webp";
import NalandaUniversity from "../assets/UniqueBiharImg/NalandaUniversity.webp";
import PatnaSahib from "../assets/UniqueBiharImg/PatnaSahib.webp";
import VikramShila from "../assets/UniqueBiharImg/VIKRAMSHILA_UNIVERSITY.webp";
import VaishaliBihar from "../assets/GalleryImg/VaishaliBihar.webp";
import AjatshatruFort from "../assets/GalleryImg/AjatshatruFort.avif";

// Card preview: fetch and play the video only while the card is on screen.
const PreviewVideo = ({ src, className }) => {
  const { ref, inView } = useInView({ rootMargin: "200px" });
  const videoRef = useRef(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (inView) setArmed(true);
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, armed]);

  return (
    <div ref={ref} className="absolute inset-0">
      {armed && (
        <video ref={videoRef} loop muted playsInline preload="metadata" className={className}>
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

// Video Imports
import video1 from "../assets/Videos/BiharHeritage1.mp4";
import video2 from "../assets/Videos/BiharHeritage_2.mp4";
import video3 from "../assets/Videos/BiharHistory.mp4";
import { safeHref } from "../utils/safeUrl";

const imageMap = {
  "BodhGaya.webp": BodhGaya,
  "JalMandir.jpg": JalMandir,
  "MahabodhiTemple.jpg": MahabodhiTemple,
  "ShantiBaba.jpg": ShantiBabaMandir,
  "RohtasFort.webp": RohtasGarhFort,
  "NalandaUniversity.jpg": NalandaUniversity,
  "PatnaSahib.jpeg": PatnaSahib,
  "VIKRAMSHILA_UNIVERSITY.png": VikramShila,
  "VaishaliBihar.webp": VaishaliBihar,
  "AjatshatruFort.avif": AjatshatruFort,
};

const resolvePopularImage = (img) => {
  if (!img) return "";
  if (typeof img !== "string") return img;
  if (imageMap[img]) return imageMap[img];
  const basename = img.split("/").pop();
  if (imageMap[basename]) return imageMap[basename];
  return img;
};

const videoMap = {
  "BiharHeritage1.mp4": video1,
  "BiharHeritage_2.mp4": video2,
  "BiharHistory.mp4": video3,
};

const resolveVideoUrl = (url) => {
  if (!url) return video2;
  if (typeof url !== "string") return url;
  if (videoMap[url]) return videoMap[url];
  const basename = url.split("/").pop();
  if (videoMap[basename]) return videoMap[basename];
  return url;
};

const Gallery = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const getSitesData = () => {
    const isSiteActive = (s) => (s.status || "Active") !== "Draft" && (s.status || "Active") !== "Inactive";
    const raw = getData(STORAGE_KEYS?.POPULAR_SITES || "bh_popular_sites", defaultPopularSites);
    if (Array.isArray(raw) && raw.length > 0) {
      const active = raw.filter(isSiteActive);
      return active.length > 0 ? active : raw;
    }
    return defaultPopularSites;
  };

  const getVideosData = () => {
    const isVideoActive = (v) => (v.status || "Active") !== "Draft" && (v.status || "Active") !== "Inactive";
    const raw = getData(STORAGE_KEYS?.HERITAGE_VIDEOS || "bh_living_heritage_videos", defaultLivingHeritageVideos);
    if (Array.isArray(raw) && raw.length > 0) {
      const active = raw.filter(isVideoActive);
      return active.length > 0 ? active : raw;
    }
    return defaultLivingHeritageVideos;
  };

  const [popularSites, setPopularSites] = useState(getSitesData);
  const [videosList, setVideosList] = useState(getVideosData);

  useEffect(() => {
    const handleSync = () => {
      setPopularSites(getSitesData());
      setVideosList(getVideosData());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("bh_storage_update", handleSync);
    window.addEventListener("bh_cms_update", handleSync);
    window.addEventListener("focus", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("bh_storage_update", handleSync);
      window.removeEventListener("bh_cms_update", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  // Triple duplicated list for seamless, gapless infinite scrolling loop
  const displaySites = popularSites.length > 0
    ? [...popularSites, ...popularSites, ...popularSites]
    : [];

  // Continuous smooth auto-scrolling loop matching ProtectedSitesDetails
  const isHoveredRef = useRef(isHovered);
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animId;
    let lastTime = null;
    const speed = 0.05; // px per ms — tune this instead of a per-frame increment

    const step = (time) => {
      if (lastTime === null) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      if (!isHoveredRef.current) {
        container.scrollLeft += speed * delta;
        const oneSetWidth = container.scrollWidth / 3;
        if (container.scrollLeft >= oneSetWidth * 2) {
          container.scrollLeft -= oneSetWidth;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [popularSites]);

  const modalVideoRef = useRef(null);

  useEffect(() => {
    if (activeVideo && modalVideoRef.current) {
      modalVideoRef.current.muted = false;
      modalVideoRef.current.volume = 1.0;
      modalVideoRef.current.play().catch(() => {});
    }
  }, [activeVideo]);

  return (
    <div className="relative bg-brand-dark pt-8 sm:pt-10 pb-12 overflow-hidden border-t border-brand-border/60">

      {/* Decorative fine-line background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `80px 80px`
        }}
      />

      {/* Page Header (Centered Container) */}
      <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
        <div className="w-full flex flex-col items-center justify-center mb-5 gap-3 pb-4 border-b border-brand-border/60 text-center">
          <div className="max-w-3xl text-center mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-brand-accent text-xs font-bold tracking-[0.25em] uppercase mb-2 inline-block font-sans"
            >
              Visual Journey
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-3 leading-tight"
            >
              Popular Heritage Sites
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-text-secondary text-xs sm:text-sm font-light font-sans leading-relaxed"
            >
              Discover the monumental stories, sacred shrines, and timeless architectures of Bihar. Hover over the cards to rotate them and reveal their history.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Full Screen Width Auto Sliding & Hover-Paused Infinite Carousel Track */}
      <div className="relative w-full z-10 mb-12">
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-4 select-none"
        >
          <div className="flex items-center gap-5 w-max">
            {displaySites.map((site, index) => (
              <div
                key={`${site.title}-${index}`}
                className="group flex-shrink-0 w-[240px] sm:w-[275px] h-[330px] perspective cursor-pointer transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Outer animated 3D container */}
                <div
                  className="relative w-full h-full transition-transform [transition-duration:900ms] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transformStyle: "preserve-3d" }}
                >

                  {/* CARD FRONT FACE */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-[1.75rem] overflow-hidden border border-brand-border/60 bg-white shadow-sm flex flex-col justify-end p-5 pointer-events-auto group-hover:pointer-events-none"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "translateZ(0)",
                      WebkitTransform: "translateZ(0)"
                    }}
                  >
                    <img decoding="async"
                      src={resolvePopularImage(site.image)}
                      alt={site.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

                    {/* Front Face Content */}
                    <div className="relative z-10 text-left">
                      <div className="flex items-center gap-1 text-[10px] text-brand-gold font-bold uppercase tracking-wider mb-1.5 font-sans">
                        <MapPin size={10} />
                        <span>{site.location}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white leading-tight">
                        {site.title}
                      </h3>
                    </div>
                  </div>

                  {/* CARD BACK FACE */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-[1.75rem] overflow-hidden border border-brand-accent/20 bg-white shadow-md flex flex-col items-center p-5 text-center justify-between pointer-events-none group-hover:pointer-events-auto"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg) translateZ(1px)",
                      WebkitTransform: "rotateY(180deg) translateZ(1px)"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 to-brand-alt/10 pointer-events-none" />

                    <div className="flex flex-col items-center w-full mt-0.5 relative z-10">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-brand-border group-hover:border-brand-accent transition-colors duration-500 shadow-sm mb-2 flex-shrink-0">
                        <img decoding="async"
                          src={resolvePopularImage(site.image)}
                          alt={site.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <h3 className="text-base font-serif font-bold text-text-primary mb-0.5 leading-tight group-hover:text-brand-accent transition-colors">
                        {site.title}
                      </h3>

                      <div className="flex items-center gap-1 justify-center text-[10px] text-brand-accent font-bold uppercase tracking-widest font-sans mb-2">
                        <MapPin size={9} />
                        <span>{site.location}</span>
                      </div>

                      <div className="w-6 h-[1px] bg-brand-border mb-2" />

                      <p className="text-xs text-text-secondary font-normal leading-relaxed font-sans px-1 line-clamp-4 sm:line-clamp-5 antialiased">
                        {site.subtitle}
                      </p>
                    </div>

                    <a
                      href={safeHref(site.wikipedia)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-4 py-1.5 mt-auto bg-brand-accent hover:bg-brand-accent-hover text-white font-sans font-bold text-[9px] uppercase tracking-wider rounded-full transition-all duration-300 shadow-sm group/btn cursor-pointer relative z-10"
                    >
                      <span>Explore History</span>
                      <ArrowRight size={10} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Living History Archives (Constrained Width Container) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="border-t border-brand-border/60 pt-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-left">
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary leading-tight">
                Living Heritage Video Series
              </h3>
              <p className="text-text-secondary text-xs sm:text-sm font-light font-sans max-w-xl mt-1.5 leading-relaxed">
                Experience Bihar's ancient monuments and living history through high-definition vlog series and cinematic documentaries.
              </p>
            </div>
          </div>

          {/* Professional Reel & Vlog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {videosList.map((vid, idx) => {
              const videoSrc = resolveVideoUrl(vid.url);
              return (
                <div
                  key={vid.id || idx}
                  onClick={() => setActiveVideo(vid)}
                  className="group relative bg-brand-dark/80 rounded-2xl overflow-hidden border border-brand-border/60 hover:border-brand-accent/60 transition-all duration-500 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-end aspect-[16/10] sm:aspect-[4/3] max-h-[380px] text-left"
                >
                  {/* Background Loop Video */}
                  <PreviewVideo
                    src={videoSrc}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out pointer-events-none no-audio-symbol"
                  />

                  {/* Dark Vignette Overlay for Reel Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 pointer-events-none transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/25" />

                  {/* Top Reel Badge & Duration Tag */}
                  <div className="absolute top-0 inset-x-0 p-3.5 flex items-center justify-between z-10 pointer-events-none">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-sm">
                      <Video size={11} className="text-brand-accent" />
                      <span className="text-[10px] font-sans font-semibold text-white tracking-wide">
                        {vid.category || "Reel"}
                      </span>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-sans font-medium text-white/90">
                      {vid.duration || "HD"}
                    </div>
                  </div>

                  {/* Glassmorphic Play Button Center */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-13 h-13 rounded-full bg-brand-accent/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-accent transition-all duration-300 border border-white/30 backdrop-blur-sm">
                      <Play size={16} className="fill-white translate-x-[1px]" />
                    </div>
                  </div>

                  {/* Reel Card Details (Bottom Panel) */}
                  <div className="relative z-10 p-4 pt-10 text-left">
                    <div className="flex items-center justify-between text-[10px] font-sans text-brand-gold font-bold uppercase tracking-wider mb-1">
                      <span>{vid.author || "@BiharHeritage"}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-brand-gold transition-colors leading-snug mb-1">
                      {vid.title}
                    </h4>

                    <p className="text-xs text-white/80 font-sans font-light leading-relaxed line-clamp-2">
                      {vid.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* POPUP VIDEO MODAL LIGHTBOX */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pt-20 sm:pt-24 pb-6 px-4 sm:px-6 overflow-hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="relative bg-white border border-brand-border/80 rounded-2xl max-w-3xl w-full max-h-[80vh] sm:max-h-[82vh] overflow-hidden shadow-2xl z-10 flex flex-col my-auto"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3.5 right-3.5 z-30 bg-black/60 hover:bg-brand-accent text-white p-2 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer border border-white/20 shadow-md group"
                aria-label="Close video"
              >
                <X size={15} className="transition-transform duration-300 group-hover:rotate-90" />
              </button>

              {/* Large Video Player inside the Popup Box with Full Audio */}
              <div className="relative aspect-video w-full max-h-[52vh] sm:max-h-[55vh] bg-black shrink-0 flex items-center justify-center overflow-hidden">
                <video
                  ref={modalVideoRef}
                  key={activeVideo?.id || activeVideo?.title}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  <source src={resolveVideoUrl(activeVideo.url)} type="video/mp4" />
                </video>
              </div>

              {/* Minimal Video Details Panel */}
              <div className="p-4 sm:p-5 bg-white text-left overflow-y-auto flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[9px] font-sans font-bold uppercase tracking-widest rounded">
                    {activeVideo.category || "Vlog Reel"}
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-serif font-bold text-text-primary leading-tight mb-1.5">
                  {activeVideo.title}
                </h4>

                <p className="text-xs sm:text-sm text-text-secondary font-sans font-light leading-relaxed">
                  {activeVideo.desc}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;