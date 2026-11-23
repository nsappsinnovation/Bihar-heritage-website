import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, MapPin, ArrowRight, Building2, Search, Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Load data & defaults
import { defaultExcavations } from "../data/defaults/defaultExcavations";
import { getData } from "../utils/cmsStorage";
import { resolveImage, fallbackHeritageImage } from "../utils/heritageImages";
import ExcavationRecordModal from "../components/common/ExcavationRecordModal";
import ExcavationExplorationBanner from "../assets/Banners/ExcavationExploration.webp";

const Excavations = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") === "exploration" ? "exploration" : "excavation";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [modalItem, setModalItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab === "exploration" || tab === "excavation") {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Initialize and load dynamically from localStorage with defaultExcavations
  const localData = getData("bh_excavation_sites", defaultExcavations);

  const excavationSites = localData.filter(
    (item) => (item.type || "excavation") === "excavation" && item.status !== "Draft" && item.status !== "Archived"
  );
  const explorationActivities = localData.filter(
    (item) => item.type === "exploration" && item.status !== "Draft" && item.status !== "Archived"
  );

  const items = activeTab === "excavation" ? excavationSites : explorationActivities;

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(q) ||
      (item.description || "").toLowerCase().includes(q) ||
      (item.location || "").toLowerCase().includes(q) ||
      (item.district || "").toLowerCase().includes(q) ||
      (item.period || "").toLowerCase().includes(q) ||
      (item.lead_agency || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-brand-dark text-text-primary pb-24 relative overflow-hidden">
      {/* Decorative fine-grid background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `80px 80px`,
        }}
      />

      {/* Premium Header Banner with Full-Width Background Image */}
      <div className="relative h-72 md:h-84 w-full overflow-hidden bg-brand-dark flex items-center mb-12 pt-16 border-b border-brand-border/60">
        {/* Full-Width Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img loading="lazy" decoding="async"
            src={ExcavationExplorationBanner}
            alt="Full HD Archaeological Excavation Background"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/85 via-brand-dark/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end h-full pb-8 text-left">
          <div className="max-w-3xl">
            <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] block mb-2 font-sans">
              Archaeology & Discoveries
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary leading-tight">
              Discoveries Through Time
            </h1>
            <p className="text-text-secondary text-sm md:text-base font-sans font-light mt-3 leading-relaxed">
              Chronicles of archaeological digs, ancient stupas, and scientific explorations across Bihar's historical landscapes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area - max-w-6xl */}
      <div className="max-w-6xl mx-auto relative z-10 px-6 md:px-12">
        {/* Category Filter Tabs with live dynamic counts */}
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-5 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("excavation")}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all duration-300 cursor-pointer border ${
                activeTab === "excavation"
                  ? "bg-brand-accent text-white border-brand-accent shadow-sm"
                  : "bg-white text-text-secondary border-brand-border/80 hover:border-brand-accent/40 hover:text-text-primary"
              }`}
            >
              Excavation Sites ({excavationSites.length})
            </button>
            <button
              onClick={() => setActiveTab("exploration")}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all duration-300 cursor-pointer border ${
                activeTab === "exploration"
                  ? "bg-brand-accent text-white border-brand-accent shadow-sm"
                  : "bg-white text-text-secondary border-brand-border/80 hover:border-brand-accent/40 hover:text-text-primary"
              }`}
            >
              Exploration Activities ({explorationActivities.length})
            </button>
          </div>

          {/* Functional Search Bar */}
          <div className="relative w-full md:w-72">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50"
            />
            <input
              type="text"
              placeholder="Search discoveries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-brand-border/80 rounded-xl pl-9 pr-8 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-accent shadow-2xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/40 hover:text-brand-accent cursor-pointer p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Minimalist Horizontal Excavation Slate List / Empty State */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-brand-border/60 rounded-2xl bg-brand-card/50">
            <Compass size={40} className="mx-auto text-brand-accent/40 mb-3 animate-spin-slow" />
            <h3 className="text-base font-serif font-bold text-text-primary mb-1">
              No Discoveries Match
            </h3>
            <p className="text-xs font-sans font-light max-w-xs mx-auto text-text-secondary">
              We couldn't find any sites matching "{searchQuery}". Try searching for another keyword.
            </p>
          </div>
        ) : (
          <Motion.div layout className="flex flex-col gap-5 sm:gap-6 mb-12">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => {
              const cardImg = resolveImage(item.image);
              const isExc = (item.type || activeTab) === "excavation";

              return (
                <Motion.div
                  key={item.id || idx}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setModalItem(item)}
                  className="bg-white border border-brand-border/70 hover:border-brand-accent/50 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(197,106,61,0.08)] transition-all duration-300 group cursor-pointer flex flex-col md:flex-row items-center gap-5 sm:gap-6 text-left"
                >
                  {/* Left Column: Fixed aspect ratio image slate */}
                  <div className="w-full md:w-64 h-48 md:h-38 rounded-xl overflow-hidden relative flex-shrink-0 bg-brand-alt/40 border border-brand-border/60">
                    <img loading="lazy" decoding="async"
                      src={cardImg}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackHeritageImage;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Tag badge on image */}
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold shadow-xs border ${
                          isExc
                            ? "bg-amber-950/80 text-amber-300 border-amber-500/30"
                            : "bg-cyan-950/80 text-cyan-300 border-cyan-500/30"
                        }`}
                      >
                        {isExc ? "Excavation" : "Exploration"}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Core Content */}
                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0 w-full">
                    <div>
                      {/* Sub-Header: District and Period */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-text-secondary font-sans">
                        <span className="font-semibold text-brand-accent flex items-center gap-1">
                          <MapPin size={12} /> {item.district || "Bihar"} District
                        </span>
                        {item.period && (
                          <>
                            <span className="text-brand-border">•</span>
                            <span className="text-text-muted">{item.period}</span>
                          </>
                        )}
                      </div>

                      {/* Main Title */}
                      <h2 className="text-lg md:text-xl font-serif font-bold text-text-primary group-hover:text-brand-accent transition-colors duration-300 mb-2 truncate">
                        {item.title}
                      </h2>

                      {/* Short Description */}
                      <p className="text-text-secondary text-xs sm:text-sm font-sans line-clamp-2 leading-relaxed mb-3 font-light">
                        {item.description}
                      </p>
                    </div>

                    {/* Agency & Action Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-border/40 text-[11px] font-sans">
                      <span className="text-text-muted flex items-center gap-1.5">
                        <Building2 size={12} className="text-brand-accent/80" />
                        <span className="truncate max-w-[200px] sm:max-w-[280px]">
                          {item.lead_agency || "Directorate of Archaeology, Bihar"}
                        </span>
                      </span>

                      <span className="text-brand-accent font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                        View Archaeological File <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <div className="shrink-0 flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-brand-border/40 w-full md:w-auto justify-between md:justify-end">
                    <div className="w-11 h-11 rounded-full border border-brand-border text-brand-accent group-hover:bg-brand-accent group-hover:text-white group-hover:border-brand-accent flex items-center justify-center transition-all duration-300 shadow-xs">
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </Motion.div>
      )}

        {/* Bottom CTA Button */}
        <div className="flex justify-center mb-4">
          <Link to="/protected-sites">
            <button className="bg-brand-accent hover:bg-brand-accent-hover text-white px-6 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-pointer">
              Explore All Protected Monuments
            </button>
          </Link>
        </div>

        <ExcavationRecordModal item={modalItem} activeTab={activeTab} onClose={() => setModalItem(null)} />
      </div>

      {/* Custom Styles */}
      <style>{`
        /* Custom scrollbar for modal */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-brand-dark);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-brand-accent);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-brand-accent-hover);
        }
      `}</style>
    </div>
  );
};

export default Excavations;
