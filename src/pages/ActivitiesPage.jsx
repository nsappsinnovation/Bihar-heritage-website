import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  ArrowRight,
  MapPin,
  Award,
  BookOpen,
  Search,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react";
import { useLenis } from "lenis/react";
import { defaultWorkshops } from "../data/defaults/defaultWorkshops";

const ALL_STANDARD_CATEGORIES = [
  "Workshop",
  "Seminar",
  "National Seminar",
  "Celebration",
  "Inauguration",
  "Exhibition",
  "Cultural Program",
  "Lecture",
  "Conservation",
  "Heritage Walk",
  "Expert Inspection",
  "Documentation",
  "Awareness Session",
  "Training",
  "Excavation"
];

/* ─── Detail Modal Component rendered via Portal ─────────────────────────── */
const ActivityDetailModal = ({ activity, onClose }) => {
  const modalRef = useRef(null);
  const lenis = useLenis();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!activity) return;

    if (lenis) {
      lenis.stop();
      return () => {
        lenis.start();
      };
    } else {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activity, lenis]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!activity) return null;

  const imgSrc =
    activity.image ||
    activity.link ||
    activity.imageUrl ||
    activity.url ||
    "/images/remote/photo-1590050752117-238cb0fb12b1-ed8a5f46.webp";

  // Parse detailed documentation paragraphs and lists
  const detailsText = activity.details || activity.description || activity.subtitle || "No archival notes recorded.";
  const paragraphs = detailsText.split("\n\n").map((para, index) => {
    if (para.includes(":\n")) {
      const [subheader, ...rest] = para.split(":\n");
      const content = rest.join(":\n").trim();
      const isList = content.includes("\n- ") || content.startsWith("- ");
      const items = isList
        ? content.split(/\n-\s*|-\s*/g).map((i) => i.trim()).filter(Boolean)
        : [];

      return (
        <div key={index} className="my-3 text-left">
          <h4 className="font-serif font-bold text-xs md:text-sm text-[#B85C38] mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#B85C38] rounded-full inline-block" />
            {subheader.trim()}
          </h4>
          {isList ? (
            <ul className="pl-4 space-y-1.5">
              {items.map((it, idx) => (
                <li key={idx} className="text-xs md:text-sm text-[#5C534B] font-sans leading-relaxed flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#B85C38] mt-1.5 shrink-0" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs md:text-sm text-[#5C534B] font-sans leading-relaxed pl-3 border-l-2 border-[#E7DED3]">
              {content}
            </p>
          )}
        </div>
      );
    }

    if (para.includes("\n- ") || para.startsWith("- ")) {
      const items = para.split(/\n-\s*|-\s*/g).map((i) => i.trim()).filter(Boolean);
      return (
        <ul key={index} className="pl-4 my-2.5 space-y-1.5 text-left">
          {items.map((it, idx) => (
            <li key={idx} className="text-xs md:text-sm text-[#5C534B] font-sans leading-relaxed flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#B85C38] mt-1.5 shrink-0" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="text-xs md:text-sm text-[#5C534B] font-sans leading-relaxed mb-3 text-justify">
        {para}
      </p>
    );
  });

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        {/* Dark Solid Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Centered Modal Card Container */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E7DED3] max-h-[85vh] flex flex-col md:flex-row text-left z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-[#FAF8F3]/90 hover:bg-[#B85C38] text-[#5C534B] hover:text-white border border-[#E7DED3] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md group"
            aria-label="Close modal"
          >
            <X size={15} className="transition-transform duration-200 group-hover:rotate-90" />
          </button>

          {/* Left Column: Photograph Section */}
          <div className="w-full md:w-[45%] h-52 md:h-auto relative overflow-hidden bg-[#1E1915] shrink-0">
            <img loading="lazy" decoding="async"
              src={imgSrc}
              alt={activity.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "/images/remote/photo-1590050752117-238cb0fb12b1-ed8a5f46.webp";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-1.5">
              <span className="inline-block w-max text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold shadow-md border backdrop-blur-md bg-[#B85C38]/90 text-white border-white/20">
                {activity.category || "Heritage Activity"}
              </span>
              <span className="text-white font-serif font-bold text-base md:text-lg drop-shadow-md line-clamp-2">
                {activity.title}
              </span>
            </div>
          </div>

          {/* Right Column: Scrollable Document Section */}
          <div className="w-full md:w-[55%] flex flex-col overflow-hidden bg-white">
            <div
              data-lenis-prevent
              className="p-6 md:p-7 overflow-y-auto flex-grow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                {/* Category & District Badges */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-sans tracking-[0.2em] text-[#B85C38] uppercase px-2.5 py-0.5 rounded-md bg-[#B85C38]/10 border border-[#B85C38]/20">
                    {activity.category} Record
                  </span>
                  {activity.district && (
                    <span className="text-[10px] font-bold font-sans text-[#8C6D3B] uppercase px-2.5 py-0.5 rounded-md bg-[#8C6D3B]/10 border border-[#8C6D3B]/20">
                      {activity.district} District
                    </span>
                  )}
                </div>

                {/* Main Title */}
                <h2 className="text-lg md:text-xl font-serif font-bold text-[#2F241D] tracking-wide leading-snug">
                  {activity.title}
                </h2>

                {/* Subtitle */}
                {activity.subtitle && (
                  <p className="text-xs md:text-sm font-sans font-medium text-[#B85C38] leading-relaxed italic">
                    "{activity.subtitle}"
                  </p>
                )}

                {/* Metadata Grid */}
                <div className="bg-[#FAF8F3] border border-[#E7DED3] rounded-2xl p-3.5 grid grid-cols-2 gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#8C827A] uppercase tracking-wider block">
                      Event Date
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F241D]">
                      <Calendar size={12} className="text-[#B85C38]" />
                      <span>{activity.date || "Recorded"}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#8C827A] uppercase tracking-wider block">
                      Venue / Location
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F241D]">
                      <MapPin size={12} className="text-[#B85C38] shrink-0" />
                      <span className="truncate">{activity.location || "Patna, Bihar"}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#8C827A] uppercase tracking-wider block">
                      Organizer
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F241D]">
                      <Award size={12} className="text-[#B85C38]" />
                      <span>BHDS Bihar</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#8C827A] uppercase tracking-wider block">
                      Record Status
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F241D]">
                      <BookOpen size={12} className="text-[#B85C38]" />
                      <span>Archived Documentation</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Documentation Body */}
                <div className="pt-2 border-t border-[#E7DED3]">
                  <span className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider block mb-2">
                    Event Overview & Documentation
                  </span>
                  <div className="space-y-1">
                    {paragraphs}
                  </div>
                </div>
              </div>

              {/* Decorative Footer */}
              <div className="pt-3 border-t border-[#E7DED3] flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-[#8C827A] font-bold uppercase tracking-wider">
                    Bihar Heritage Development Society
                  </p>
                  <p className="text-[10px] text-[#B85C38] font-serif font-bold">
                    Department of Arts, Culture & Youth, Govt. of Bihar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

/* ─── Main Activities & Workshops Page Component ─────────────────────────── */
export default function ActivitiesPage() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // 6 cards per page for a balanced 3x2 grid

  const getImgSrc = (item) => {
    return (
      item?.image ||
      item?.link ||
      item?.imageUrl ||
      item?.url ||
      "/images/remote/photo-1590050752117-238cb0fb12b1-ed8a5f46.webp"
    );
  };

  
  const rawActivities = defaultWorkshops;

  // Filter out drafts
  const liveActivities = (rawActivities || []).filter(
    (e) => (e.status || "Published").toLowerCase() !== "draft"
  );

  // Build full category options list with exact counts
  const presentCategories = Array.from(
    new Set([
      ...ALL_STANDARD_CATEGORIES.filter((cat) => liveActivities.some((item) => item.category === cat)),
      ...liveActivities.map((item) => item.category).filter(Boolean)
    ])
  );

  const categoryOptions = [
    { label: "All Activities", value: "All", count: liveActivities.length },
    ...presentCategories.map((cat) => ({
      label: cat,
      value: cat,
      count: liveActivities.filter((item) => item.category === cat).length
    }))
  ];

  // Search & Category filtering
  const filteredActivities = liveActivities.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (item.title || "").toLowerCase();
    const subtitle = (item.subtitle || "").toLowerCase();
    const location = (item.location || "").toLowerCase();
    const district = (item.district || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const details = (item.details || "").toLowerCase();

    return (
      title.includes(q) ||
      subtitle.includes(q) ||
      location.includes(q) ||
      district.includes(q) ||
      category.includes(q) ||
      details.includes(q)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredActivities.length / pageSize) || 1;
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const anchor = document.getElementById("activities-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-text-primary pb-24 relative overflow-hidden">
      {/* Decorative fine-grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `70px 70px`,
        }}
      />

      {/* Premium Header Banner with Full-Width Background Image */}
      <div className="relative h-72 md:h-84 w-full overflow-hidden bg-brand-dark flex items-center mb-10 pt-16 border-b border-brand-border/60">
        {/* Full-Width Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img loading="lazy" decoding="async"
            src="/images/remote/photo-1511578314322-379afb476865-7bb9b7af.webp"
            alt="Workshops & Seminars Banner"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-brand-dark/30 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />
        </div>

        {/* Header Text Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end h-full pb-8 text-left">
          <div className="max-w-3xl">
            <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] block mb-2 font-sans flex items-center gap-2">
              Initiatives & Programs
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary leading-tight">
              Workshops & Seminars
            </h1>
            <p className="text-text-secondary text-sm md:text-base font-sans font-light mt-3 leading-relaxed">
              Discover Bihar's rich cultural initiatives. Explore the educational seminars, collaborative conservation workshops, and community events organized by the Bihar Heritage Development Society.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="activities-anchor" className="max-w-7xl mx-auto z-10 relative px-6 md:px-12 space-y-7">
        {/* Clean Filter Dropdown & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5">
          {/* Search Input Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search activities by title, venue, district, keywords…"
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-brand-border/80 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-accent shadow-2xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-primary cursor-pointer p-1"
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="relative flex items-center bg-white border border-brand-border/80 rounded-xl px-3.5 py-2.5 shadow-2xs hover:border-brand-accent/50 transition-colors">
              <Filter className="w-3.5 h-3.5 text-brand-accent mr-2 shrink-0" />
              <label htmlFor="public-category-select" className="text-xs font-semibold text-text-secondary mr-2 whitespace-nowrap">
                Category:
              </label>
              <select
                id="public-category-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-text-primary focus:outline-none cursor-pointer pr-6 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232F241D'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                  backgroundSize: "0.85em",
                }}
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Showing Records Count Indicator */}
        <div className="flex items-center justify-between text-xs text-text-muted font-sans px-1">
          <span>
            Showing <span className="font-bold text-text-primary">{paginatedActivities.length}</span> of {filteredActivities.length} activities
            {totalPages > 1 && (
              <span className="text-text-muted ml-1.5">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </span>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setCurrentPage(1);
              }}
              className="text-brand-accent hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Activity Cards Grid */}
        {filteredActivities.length === 0 ? (
          <div className="bg-white border border-brand-border/60 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3 shadow-2xs">
            <FileText className="w-10 h-10 text-brand-accent/60 mx-auto" />
            <h3 className="text-base font-serif font-bold text-text-primary">No Activities Found</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              No matching records found for "{searchQuery}". Try searching with different keywords or select a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setCurrentPage(1);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {paginatedActivities.map((activity, index) => (
              <motion.article
                key={activity.id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.04 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedActivity(activity)}
                className="group flex h-full cursor-pointer flex-col rounded-3xl border border-[#EADFCB] bg-white p-2.5 text-left shadow-[0_2px_10px_rgba(51,37,29,0.04)] transition-all duration-300 hover:border-[#D9B68C] hover:shadow-[0_18px_40px_-18px_rgba(51,37,29,0.35)]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-brand-dark">
                  <img decoding="async"
                    src={getImgSrc(activity)}
                    alt={activity.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "/images/remote/photo-1590050752117-238cb0fb12b1-ed8a5f46.webp";
                    }}
                  />
                  {activity.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#FFF9EE]/95 px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-[0.18em] text-[#A0502F] shadow-sm backdrop-blur-sm">
                      {activity.category}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-grow flex-col px-3 pb-2 pt-4">
                  <div className="flex items-center gap-3 text-[11px] font-sans text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#B85C38]" />
                      {activity.date}
                    </span>
                    {(activity.location || activity.district) && (
                      <span className="flex min-w-0 items-center gap-1.5">
                        <MapPin size={12} className="shrink-0 text-[#B85C38]" />
                        <span className="truncate">{activity.location || activity.district}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2.5 line-clamp-2 font-serif text-lg font-bold leading-snug text-text-primary transition-colors duration-200 group-hover:text-brand-accent">
                    {activity.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 flex-grow font-sans text-[13px] leading-relaxed text-text-secondary">
                    {activity.subtitle || activity.details}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[11px] font-sans font-semibold text-text-secondary transition-colors group-hover:text-brand-accent">
                      Read report
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3D3BB] text-[#B85C38] transition-all duration-300 group-hover:border-[#B85C38] group-hover:bg-[#B85C38] group-hover:text-white">
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Bottom Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-brand-border/40">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed border border-brand-border/60 bg-white rounded-xl transition cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold font-sans transition-colors cursor-pointer ${currentPage === p
                    ? "bg-brand-accent text-white shadow-sm"
                    : "text-text-secondary hover:bg-white hover:text-text-primary border border-transparent hover:border-brand-border/60"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed border border-brand-border/60 bg-white rounded-xl transition cursor-pointer shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Portal Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
}
