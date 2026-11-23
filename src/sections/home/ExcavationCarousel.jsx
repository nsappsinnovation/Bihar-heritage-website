import React, { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { MapPin, Compass, ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// Load defaults, shared metadata & CMS helper
import { defaultExcavations } from "../../data/defaults/defaultExcavations";
import { siteMetadata } from "../../data/siteMetadata";
import { getData } from "../../utils/cmsStorage";
import { resolveImage, fallbackHeritageImage } from "../../utils/heritageImages";
import ExcavationRecordModal from "../../components/common/ExcavationRecordModal";

// How many quick-select chips fit on a single row under the image plate.
const VISIBLE_CHIPS = 4;

const slideVariants = {
  enter: {
    scale: 0.75,
    opacity: 0,
    y: 0
  },
  center: {
    scale: 1.0,
    opacity: 1,
    y: 0,
    transition: {
      scale: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.65, ease: "easeOut" }
    }
  },
  exit: {
    scale: 1.2,
    opacity: 0,
    y: 0,
    transition: {
      scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.5, ease: "easeIn" }
    }
  }
};

const ExcavationCarousel = () => {
  const [activeTab, setActiveTab] = useState("excavation");
  const [[currentIndex, _direction], setCurrentIndexAndDirection] = useState([0, 0]);
  const [modalItem, setModalItem] = useState(null);

  // Load dynamically from localStorage synchronized with admin Excavation CMS
  const localData = getData("bh_excavation_sites", defaultExcavations);

  const excavationSites = localData.filter(
    (item) => (item.type || "excavation") === "excavation" && item.status !== "Draft" && item.status !== "Archived"
  );
  const explorationActivities = localData.filter(
    (item) => item.type === "exploration" && item.status !== "Draft" && item.status !== "Archived"
  );

  const items =
    activeTab === "excavation"
      ? (excavationSites.length > 0 ? excavationSites : defaultExcavations.filter((d) => (d.type || "excavation") === "excavation"))
      : (explorationActivities.length > 0 ? explorationActivities : defaultExcavations.filter((d) => d.type === "exploration"));

  const safeIndex = currentIndex < items.length ? currentIndex : 0;
  const activeItem = items[safeIndex] || items[0];

  // Auto reset index when tab changes or items change
  useEffect(() => {
    setCurrentIndexAndDirection([0, 0]);
  }, [activeTab, items.length]);

  const handleNext = () => {
    if (items.length <= 1) return;
    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentIndexAndDirection([nextIndex, 1]);
  };

  const handlePrev = () => {
    if (items.length <= 1) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndexAndDirection([prevIndex, -1]);
  };

  const handleSelect = (idx) => {
    if (idx === currentIndex) return;
    const dir = idx > currentIndex ? 1 : -1;
    setCurrentIndexAndDirection([idx, dir]);
  };

  // Scroll animations
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [0.93, 1.03]);
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Only the on-image stamps are rendered here now; the full record fields live on
  // the excavation detail page.
  const fallbackMeta = siteMetadata[activeItem?.title] || {};
  const currentMeta = {
    coords: activeItem?.coords || fallbackMeta.coords || "25.0961° N, 85.3131° E",
    status: (activeItem?.type || activeTab) === "excavation" ? "Excavation Site" : "Exploration Study"
  };

  // Keep the quick-select chips to a single row: a sliding window of VISIBLE_CHIPS
  // that always contains the active site. The arrows still traverse every item.
  const chipStart = Math.max(
    0,
    Math.min(safeIndex - 1, items.length - VISIBLE_CHIPS)
  );
  const visibleChips = items.slice(chipStart, chipStart + VISIBLE_CHIPS);

  const activeImg = resolveImage(activeItem?.image);

  return (
    <section
      className="relative pt-20 pb-10 px-6 md:px-12 lg:px-20 border-t border-brand-border overflow-hidden"
      style={{ backgroundColor: '#E4D6BC' }}
    >


      <div className="absolute inset-0 bg-[#F8F5F0] opacity-55 pointer-events-none" />
      {/* Editorial Decorative Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--color-brand-accent) 1px, transparent 0), linear-gradient(to right, var(--color-brand-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-border) 1px, transparent 1px)`,
          backgroundSize: `40px 40px, 120px 120px, 120px 120px`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header Section - Editorial & Left-Aligned */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-4 border-b border-brand-border/60">
          <div>
            <span className="text-brand-accent text-xs md:text-sm font-sans uppercase tracking-[0.25em] font-bold block mb-3">
              Chronicles of Archaeology
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-text-primary tracking-tight">
              Discoveries Through Time
            </h2>
          </div>

          {/* Minimal Pill Selector */}
          <div className="inline-flex bg-white/80 border border-brand-border/60 rounded-full p-1 shadow-sm backdrop-blur-sm self-start">
            <button
              onClick={() => setActiveTab("excavation")}
              className={`px-6 py-2.5 text-xs md:text-sm font-sans font-semibold rounded-full transition-all duration-300 cursor-pointer ${activeTab === "excavation"
                ? "bg-brand-accent text-white shadow-sm"
                : "text-text-secondary hover:text-brand-accent"
                }`}
            >
              Excavation Sites ({excavationSites.length})
            </button>
            <button
              onClick={() => setActiveTab("exploration")}
              className={`px-6 py-2.5 text-xs md:text-sm font-sans font-semibold rounded-full transition-all duration-300 cursor-pointer ${activeTab === "exploration"
                ? "bg-brand-accent text-white shadow-sm"
                : "text-text-secondary hover:text-brand-accent"
                }`}
            >
              Exploration Activities ({explorationActivities.length})
            </button>
          </div>
        </div>

        {/* Main Split Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          {/* Left Column: Visual Panel (aspect 4/3 image slate) */}
          <div className="lg:col-span-7 w-full flex flex-col">
            <Motion.div
              ref={scrollRef}
              style={{ scale: imageScale, y: imageY }}
              className="relative aspect-[16/11] md:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-brand-alt/30 border border-brand-border/60 shadow-md group"
            >
              <div className="absolute inset-0 w-full h-full">
                <AnimatePresence initial={false} mode="popLayout">
                  <Motion.img
                    key={(activeItem?.id || "img") + activeTab}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    src={activeImg}
                    alt={activeItem?.title || "Archaeological Site"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackHeritageImage;
                    }}
                    className="w-full h-full object-cover filter brightness-[0.95] absolute inset-0"
                  />
                </AnimatePresence>
                {/* Visual overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
              </div>

              {/* Floating coordinates stamp */}
              <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3.5 py-2 flex flex-col gap-0.5 text-white">
                <span className="text-[9px] font-sans font-bold tracking-widest text-brand-gold uppercase">
                  Location / Coordinates
                </span>
                <span className="text-xs font-mono font-medium text-white/95">
                  {currentMeta.coords}
                </span>
              </div>


            </Motion.div>
          </div>

          {/* Right Column: Editorial Details — stretched to the image plate's height and
              vertically centred within it, so the copy block sits level with the middle of
              the image with even space above and below. */}
          <div className="lg:col-span-5 flex flex-col text-left">
            <AnimatePresence mode="wait">
              <Motion.div
                key={(activeItem?.id || "text") + activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col justify-center gap-6"
              >
                <div>
                  {/* Location with Terracotta Pin */}
                  <div className="flex items-center gap-1.5 mb-2.5 text-brand-accent">
                    <MapPin size={14} />
                    <span className="text-xs font-sans font-bold tracking-wider uppercase">
                      {activeItem?.location || (activeItem?.district ? `${activeItem.district}, Bihar` : "Bihar, India")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-text-primary leading-tight mb-4">
                    {activeItem?.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed font-sans font-light line-clamp-3">
                    {activeItem?.description}
                  </p>
                </div>

                {/* Action CTA & Full Directory Link */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalItem(activeItem)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-accent hover:bg-brand-accent-hover text-white font-sans font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer group"
                  >
                    <span>Read Archival Records</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <Link to={activeTab === "excavation" ? "/excavations" : "/excavations?tab=exploration"}>
                    <button className="inline-flex items-center gap-1.5 px-5 py-3.5 bg-white hover:bg-[#FAF8F3] text-[#2F241D] border border-brand-border font-sans font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-2xs hover:shadow-sm cursor-pointer">
                      <span>{activeTab === "excavation" ? "View All Excavations" : "View All Explorations"}</span>
                      <ExternalLink size={13} className="text-brand-accent" />
                    </button>
                  </Link>
                </div>
              </Motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Site Selector Tabs & Navigation — lifted out of the split row above so that
            row's height is exactly the image plate's height; kept to the plate's width. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mt-6 pt-5 border-t border-brand-border/40">
              <div className="flex flex-nowrap items-center gap-2.5 flex-1 overflow-hidden">
                {visibleChips.map((item, offset) => {
                  const idx = chipStart + offset;
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={item.id || idx}
                      onClick={() => handleSelect(idx)}
                      className={`relative px-3.5 py-2 rounded-full border text-xs font-sans transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${isActive
                        ? "bg-white border-brand-accent text-brand-accent font-semibold shadow-xs"
                        : "bg-transparent border-brand-border/60 text-text-secondary hover:border-brand-accent/50 hover:text-brand-accent"
                        }`}
                    >
                      <span className={`text-[10px] font-mono ${isActive ? "text-brand-accent" : "text-text-muted"}`}>
                        {String(idx + 1).padStart(2, "0")}.
                      </span>
                      <span className="whitespace-nowrap">{item.title}</span>
                      {isActive && (
                        <Motion.span
                          layoutId="activeDot"
                          className="w-1.5 h-1.5 rounded-full bg-brand-accent"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Highlighted visual navigation controls */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 border-2 border-brand-accent bg-white hover:bg-brand-accent text-brand-accent hover:text-white rounded-full transition-all duration-300 shadow-md hover:scale-105 flex items-center justify-center cursor-pointer"
                  aria-label="Previous Site"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 border-2 border-brand-accent bg-white hover:bg-brand-accent text-brand-accent hover:text-white rounded-full transition-all duration-300 shadow-md hover:scale-105 flex items-center justify-center cursor-pointer"
                  aria-label="Next Site"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExcavationRecordModal
        item={modalItem}
        activeTab={activeTab}
        onClose={() => setModalItem(null)}
      />
    </section>
  );
};

export default ExcavationCarousel;
