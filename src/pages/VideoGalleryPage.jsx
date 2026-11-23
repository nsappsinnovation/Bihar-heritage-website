import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video as VideoIcon, 
  Play, 
  ExternalLink, 
  X, 
  Film, 
  Clock, 
  Search, 
  MapPin, 
  Sparkles,
  Share2,
  Check
} from "lucide-react";
import { getData, STORAGE_KEYS } from "../utils/cmsStorage";
import { safeHref, safeEmbedUrl } from "../utils/safeUrl";
import { defaultVideos } from "../data/defaults/defaultVideos";

const STANDARD_CATEGORIES = [
  "All Videos",
  "History & Empire",
  "Academic Tradition",
  "Special Events",
  "Museum & Culture",
  "Archaeological Excavations",
  "Documentary"
];

const VideoGalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Videos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reactive state synced with CMS
  const [rawVideos, setRawVideos] = useState(() =>
    getData(STORAGE_KEYS.VIDEOS, defaultVideos)
  );

  // Multi-event synchronization
  useEffect(() => {
    const refreshData = () => {
      const fresh = getData(STORAGE_KEYS.VIDEOS, defaultVideos);
      setRawVideos(fresh);
    };

    window.addEventListener("storage", refreshData);
    window.addEventListener("bh_cms_update", refreshData);
    window.addEventListener("bh_storage_update", refreshData);
    window.addEventListener("focus", refreshData);
    document.addEventListener("visibilitychange", refreshData);

    return () => {
      window.removeEventListener("storage", refreshData);
      window.removeEventListener("bh_cms_update", refreshData);
      window.removeEventListener("bh_storage_update", refreshData);
      window.removeEventListener("focus", refreshData);
      document.removeEventListener("visibilitychange", refreshData);
    };
  }, []);

  // Filter out drafts / archived
  const publishedVideos = rawVideos
    .filter((v) => (v.status || "Published") !== "Draft" && v.status !== "Archived")
    .map((v) => {
      const ytId = v.youtubeId || (typeof v.id === "string" && v.id.length === 11 ? v.id : "");
      return {
        ...v,
        youtubeId: ytId,
        embedUrl: safeEmbedUrl(v.embedUrl) || (ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1` : ""),
        youtubeUrl: v.youtubeUrl || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : ""),
        thumbnail: v.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "")
      };
    });

  // Dynamic categories with live counters
  const allCategories = Array.from(
    new Set([
      "All Videos",
      ...STANDARD_CATEGORIES.slice(1),
      ...publishedVideos.map((v) => v.category).filter(Boolean)
    ])
  );

  // Filter by category & search query
  const filteredVideos = publishedVideos.filter((v) => {
    const matchesCat =
      selectedCategory === "All Videos" || v.category === selectedCategory;
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = v.title?.toLowerCase().includes(q);
    const descMatch = v.description?.toLowerCase().includes(q);
    const regionMatch = v.region?.toLowerCase().includes(q);
    const catMatch = v.category?.toLowerCase().includes(q);

    return titleMatch || descMatch || regionMatch || catMatch;
  });

  const handleShare = (video) => {
    const url = video.youtubeUrl || window.location.href;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-text-primary pt-28 sm:pt-32 pb-24 px-6 md:px-12 lg:px-20 relative overflow-hidden text-left">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `80px 80px`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 pb-8 border-b border-brand-border/60 w-full"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-brand-accent text-xs font-sans font-bold tracking-[0.2em] uppercase">
              Film & Documentary Vault
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-primary mb-3 leading-tight">
            Bihar Heritage Video Gallery
          </h1>

          <p className="text-text-secondary text-sm md:text-base font-sans font-light max-w-3xl leading-relaxed">
            A curated streaming exhibition of documentaries detailing ancient civilizations, monastic universities, archaeological excavations, and living cultural traditions.
          </p>
        </motion.div>

        {/* Filter Controls Row: Search + Category Pills */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {allCategories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count =
                  cat === "All Videos"
                    ? publishedVideos.length
                    : publishedVideos.filter((v) => v.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all duration-300 cursor-pointer border flex items-center gap-1.5 ${
                      isActive
                        ? "bg-brand-accent text-white border-brand-accent shadow-sm"
                        : "bg-white text-text-secondary border-brand-border/80 hover:border-brand-accent/40 hover:text-text-primary"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-white/20 text-white font-bold"
                          : "bg-brand-dark/5 text-text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentaries, topics..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-brand-border/80 text-text-primary text-xs font-sans placeholder:text-text-muted focus:outline-hidden focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Video Exhibition List */}
        <div className="space-y-4">
          <motion.div layout className="flex flex-col gap-5 sm:gap-6">
            <AnimatePresence>
              {filteredVideos.map((video, idx) => (
                <motion.div
                  key={video.id || video.youtubeId || idx}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  onClick={() => setActiveVideo(video)}
                  className="bg-white border border-brand-border/70 hover:border-brand-accent/50 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(197,106,61,0.08)] transition-all duration-300 group cursor-pointer flex flex-col md:flex-row items-center gap-5 sm:gap-6 text-left"
                >
                  {/* 16:9 Thumbnail Frame */}
                  <div className="relative aspect-video w-full md:w-64 rounded-xl overflow-hidden bg-black shrink-0 group/thumb shadow-sm">
                    <img decoding="async"
                      src={video.thumbnail || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop"}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-90 group-hover/thumb:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/40 transition-colors duration-300" />

                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-medium text-white flex items-center gap-1">
                        <Clock size={10} className="text-brand-gold" />
                        <span>{video.duration}</span>
                      </div>
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-md group-hover/thumb:scale-110 transition-all duration-300 border border-white/20">
                        <Play size={13} className="fill-white translate-x-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Video Info Panel */}
                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-brand-accent">
                          {video.category || "Documentary"}
                        </span>
                        {video.region && (
                          <span className="text-[10px] font-sans text-text-muted flex items-center gap-1">
                            • <MapPin size={10} className="text-brand-accent" /> {video.region}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-serif font-bold text-text-primary group-hover:text-brand-accent transition-colors duration-300 leading-snug mb-2">
                        {video.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-text-secondary font-sans font-light leading-relaxed max-w-2xl line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <div className="shrink-0 flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-brand-border/40 w-full md:w-auto justify-between md:justify-end">
                    <div className="w-11 h-11 rounded-full border border-brand-border text-brand-accent group-hover:bg-brand-accent group-hover:text-white group-hover:border-brand-accent flex items-center justify-center transition-all duration-300 shadow-xs">
                      <Play size={14} className="fill-current translate-x-[1px]" />
                    </div>

                    {video.youtubeUrl && (
                      <a
                        href={safeHref(video.youtubeUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="md:hidden inline-flex items-center gap-1 text-xs font-sans text-text-muted hover:text-brand-accent"
                      >
                        <span>YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-brand-border/40 mt-4">
              <Film className="w-10 h-10 text-brand-accent mx-auto mb-3 opacity-60" />
              <h3 className="font-serif font-bold text-text-primary text-lg mb-1">
                No matching documentary videos found
              </h3>
              <p className="text-text-secondary text-xs max-w-sm mx-auto font-sans">
                Try selecting a different category filter or clearing your search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Videos");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-brand-accent-hover transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CENTERED LIGHTBOX VIDEO MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Solid Clean Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white border border-brand-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl z-10 flex flex-col my-auto text-left"
            >
              {/* Modal Top Header Bar */}
              <div className="px-5 py-3.5 bg-white border-b border-brand-border/60 flex items-center justify-between z-20">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[9px] font-sans font-bold uppercase tracking-widest rounded">
                    {activeVideo.category || "Documentary"}
                  </span>
                  {activeVideo.region && (
                    <span className="text-[11px] font-sans font-medium text-text-muted hidden sm:inline-block">
                      • {activeVideo.region} Heritage Archive
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setActiveVideo(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-brand-accent hover:text-white text-text-primary text-xs font-sans font-medium transition-all duration-300 cursor-pointer border border-brand-border/40 group shadow-xs"
                  aria-label="Close video player"
                >
                  <X size={13} className="transition-transform duration-300 group-hover:rotate-90" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Close</span>
                </button>
              </div>

              {/* YouTube Player */}
              <div className="relative aspect-video w-full max-h-[55vh] bg-black shrink-0 flex items-center justify-center overflow-hidden">
                {activeVideo.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&enablejsapi=1`}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : activeVideo.embedUrl ? (
                  <iframe
                    src={activeVideo.embedUrl}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="text-white text-xs">Video unavailable</div>
                )}
              </div>

              {/* Information Details Panel */}
              <div className="p-5 sm:p-6 bg-white text-left overflow-y-auto flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-text-primary leading-tight mb-2">
                    {activeVideo.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-secondary font-sans font-light leading-relaxed mb-4">
                    {activeVideo.description}
                  </p>
                </div>

                {/* Footer Action Links */}
                <div className="flex items-center justify-between pt-3 border-t border-brand-border/40 mt-2">
                  <span className="text-[10px] font-sans text-text-muted uppercase tracking-wider font-semibold">
                    HD 1080p • Archival Stream {activeVideo.duration ? `• ${activeVideo.duration}` : ""}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShare(activeVideo)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-border hover:border-brand-accent text-text-secondary hover:text-brand-accent rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                    >
                      {copiedLink ? <Check size={12} className="text-emerald-600" /> : <Share2 size={12} />}
                      <span>{copiedLink ? "Copied" : "Share"}</span>
                    </button>

                    {activeVideo.youtubeUrl && (
                      <a
                        href={safeHref(activeVideo.youtubeUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-accent/10 hover:bg-brand-accent text-brand-accent hover:text-white rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                      >
                        <span>Watch on YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoGalleryPage;
