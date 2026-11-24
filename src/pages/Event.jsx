import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  Info,
  Search,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  Users,
  Building,
  DollarSign,
  Tag,
  ArrowRight
} from "lucide-react";
import { useLenis } from "lenis/react";
import { defaultEvents } from "../data/defaults/defaultEvents";
import MadhubaniArtImg from "../assets/UniqueBiharImg/MadhubaniArt.webp";
import EventsBannerImg from "../assets/Banners/EventsBanner.webp";
import ChhathFestivalImg from "../assets/HeroStrips/chhath_festival.webp";
import MadhubaniStripImg from "../assets/HeroStrips/madhubani_art.webp";
import ArtCraftImg from "../assets/HeroStrips/ArtandCraft.webp";
import GolgharImg from "../assets/heritage/GolgharImg.webp";
import NalandaImg from "../assets/heritage/NalandaUniversity.webp";
import VikramshilaImg from "../assets/heritage/Vikramshila.webp";
import BodhGayaImg from "../assets/heritage/BodhGayaImg.webp";
import AwarenessImg from "../assets/UniqueBiharImg/Awareness.webp";
import MuseumImg from "../assets/heritage/museum_gallery.webp";

// Pick a relevant photo for an event based on its category/title
const EVENT_IMAGE_RULES = [
  [/awareness/, AwarenessImg],
  [/madhubani|mithila|art|craft|workshop/, MadhubaniStripImg],
  [/walk|patna|golghar|pataliputra/, GolgharImg],
  [/nalanda|archaeolog|excavat|epigraph/, NalandaImg],
  [/vikramshila|exhibition|relic/, VikramshilaImg],
  [/bodh|buddh|seminar|symposium|colloquium|lecture/, BodhGayaImg],
  [/museum/, MuseumImg],
  [/festival|fest|cultural|music|dance/, ChhathFestivalImg],
];

const getEventImage = (event = {}) => {
  if (event.image) return event.image;
  return getFallbackEventImage(event);
};

const getFallbackEventImage = (event = {}) => {
  const text = `${event.category || ""} ${event.title || ""}`.toLowerCase();
  const match = EVENT_IMAGE_RULES.find(([re]) => re.test(text));
  return match ? match[1] : ArtCraftImg;
};

const STANDARD_EVENT_CATEGORIES = [
  "Cultural Festival",
  "Art Workshop",
  "Heritage Walk",
  "Seminar / Symposium",
  "Archaeology Camp",
  "Exhibition"
];

/* ─── Event Details & Registration Modal Portal ───────────────────────────── */
const EventDetailsModal = ({ event, onClose }) => {
  const lenis = useLenis();

  useEffect(() => {
    if (!event) return;
    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    } else {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [event, lenis]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const tags = Array.isArray(event.tags)
    ? event.tags
    : event.tagsString
    ? event.tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [event.category || "Heritage"];

  const modalDOM = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 pointer-events-auto"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="bg-white border border-[#E7DED3] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row overflow-hidden relative z-10 my-auto text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-[#B85C38] hover:text-white text-[#6F665E] rounded-full p-2 border border-[#E7DED3] transition-all z-30 cursor-pointer shadow-sm"
            title="Close modal (Esc)"
          >
            <X size={16} />
          </button>

          {/* Left Column: Image Banner */}
          <div className="w-full md:w-[45%] h-56 md:h-auto overflow-hidden bg-brand-dark flex-shrink-0 relative">
            <img loading="lazy" decoding="async"
              src={getEventImage(event)}
              alt={event.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = MadhubaniArtImg;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#B85C38] text-[10px] font-sans font-bold uppercase tracking-wider mb-1.5 shadow-sm">
                {event.category || "Heritage Event"}
              </span>
              <p className="text-xs font-sans text-white/90 font-medium line-clamp-1">
                {event.venue || event.location}
              </p>
            </div>
          </div>

          {/* Right Column: Event Details & Register */}
          <div className="w-full md:w-[55%] p-6 sm:p-8 overflow-y-auto flex flex-col justify-between" data-lenis-prevent="true">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold font-sans tracking-[0.18em] text-[#B85C38] uppercase">
                  Official Heritage Program
                </span>
                <span className="text-text-muted text-xs">•</span>
                <span className="text-[10px] font-sans font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {event.entryFee || "Free Entry"}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2F241D] leading-tight mb-4">
                {event.title}
              </h2>

              {/* Event Metadata Matrix */}
              <div className="bg-[#FAF8F3] border border-[#E7DED3] rounded-2xl p-4 mb-5 grid grid-cols-2 gap-3.5">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-[#6F665E] uppercase tracking-wider block">
                    Event Date
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F241D]">
                    <CalendarDays size={13} className="text-[#B85C38] shrink-0" />
                    <span>{event.date}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-[#6F665E] uppercase tracking-wider block">
                    Schedule / Time
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F241D]">
                    <Clock size={13} className="text-[#8C6D3B] shrink-0" />
                    <span>{event.time || "10:00 AM - 05:00 PM"}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-[#6F665E] uppercase tracking-wider block">
                    Location / District
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F241D] truncate">
                    <MapPin size={13} className="text-[#B85C38] shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-[#6F665E] uppercase tracking-wider block">
                    Organizer
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F241D] truncate">
                    <Users size={13} className="text-[#8C6D3B] shrink-0" />
                    <span className="truncate">{event.organizer || "BHDS"}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 mb-5">
                <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-[#2F241D]">
                  About this Event
                </h4>
                <p className="text-[#6F665E] text-xs sm:text-sm font-sans leading-relaxed text-justify">
                  {event.description}
                </p>
              </div>

              {/* Highlights if present */}
              {event.highlights && (
                <div className="space-y-2 mb-5 p-3.5 bg-[#FAF8F3] border border-[#E7DED3] rounded-xl">
                  <h4 className="text-[11px] font-bold font-sans uppercase tracking-wider text-[#8C6D3B] flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>Key Highlights</span>
                  </h4>
                  <p className="text-[#6F665E] text-xs font-sans leading-relaxed">
                    {event.highlights}
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium font-sans text-[#6F665E] bg-[#FAF8F3] px-2.5 py-0.5 rounded-lg border border-[#E7DED3]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Admission info (no data is collected on this site) */}
            <div className="pt-4 border-t border-[#E7DED3]">
              <p className="text-[9px] text-[#6F665E] font-bold uppercase tracking-wider">
                Admission Policy
              </p>
              <p className="text-[11px] text-[#8C6D3B] font-serif font-bold">
                {event.entryFee || "Free Entry / Open to Public"}
              </p>
              <p className="mt-2 text-[11px] text-[#6F665E]">
                For participation details, please contact the Society through the Contact page.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalDOM, document.body);
};

/* ─── Main Public Event Component ─────────────────────────────────────────── */
export default function Event() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // 6 events per page (3x2 grid)

  const eventsData = defaultEvents;

  // Filter out drafts and archived
  const liveEvents = (eventsData || []).filter(
    (e) => (e.status || "Published").toLowerCase() !== "draft" && (e.status || "Published").toLowerCase() !== "archived"
  );

  // Categories
  const presentCategories = Array.from(
    new Set([
      ...STANDARD_EVENT_CATEGORIES.filter((cat) => liveEvents.some((item) => item.category === cat)),
      ...liveEvents.map((item) => item.category).filter(Boolean)
    ])
  );

  const categoryOptions = [
    { label: "All Categories", value: "All", count: liveEvents.length },
    ...presentCategories.map((cat) => ({
      label: cat,
      value: cat,
      count: liveEvents.filter((item) => item.category === cat).length
    }))
  ];

  // Filtering
  const filteredEvents = liveEvents.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (item.title || "").toLowerCase();
    const location = (item.location || "").toLowerCase();
    const venue = (item.venue || "").toLowerCase();
    const district = (item.district || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const organizer = (item.organizer || "").toLowerCase();
    const tags = Array.isArray(item.tags)
      ? item.tags.join(" ").toLowerCase()
      : (item.tagsString || "").toLowerCase();

    return (
      title.includes(q) ||
      location.includes(q) ||
      venue.includes(q) ||
      district.includes(q) ||
      description.includes(q) ||
      category.includes(q) ||
      organizer.includes(q) ||
      tags.includes(q)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredEvents.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredEvents.length);
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const anchor = document.getElementById("events-anchor");
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

      {/* Premium Header Banner with Background Image */}
      <div className="relative h-72 md:h-84 w-full overflow-hidden bg-brand-dark flex items-center mb-10 pt-16 border-b border-brand-border/60">
        {/* Background Image with Tint Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img loading="lazy" decoding="async"
            src={EventsBannerImg}
            alt="Events Banner"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-brand-dark/35 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end h-full pb-8 text-left">
          <div className="max-w-3xl">
            <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] block mb-2 font-sans">
              Cultural Calendar & Programs
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary leading-tight">
              Upcoming Heritage Events
            </h1>
            <p className="text-text-secondary text-sm md:text-base font-sans font-light mt-3 leading-relaxed">
              Participate in curated community celebrations, artisan masterclasses, guided architectural walks, and academic symposiums organized by the Bihar Heritage Development Society.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="events-anchor" className="max-w-7xl mx-auto z-10 relative px-6 md:px-12 space-y-7">
        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl border border-brand-border/70 p-4 sm:p-4.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by event title, location, category, organizer…"
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#FAF8F3] hover:bg-white focus:bg-white border border-[#E7DED3] focus:border-[#B85C38] focus:ring-2 focus:ring-[#B85C38]/15 text-xs text-[#2F241D] placeholder:text-[#6F665E]/60 focus:outline-none transition shadow-2xs"
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
            <div className="relative flex items-center bg-[#FAF8F3] hover:bg-white border border-[#E7DED3] hover:border-[#B85C38]/60 focus-within:border-[#B85C38] focus-within:ring-2 focus-within:ring-[#B85C38]/15 rounded-xl px-3.5 py-2 shadow-2xs transition-all">
              <div className="p-1 rounded-lg bg-[#B85C38]/10 text-[#B85C38] mr-2.5 shrink-0">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <label htmlFor="event-category-select" className="text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mr-2 whitespace-nowrap">
                Category:
              </label>
              <select
                id="event-category-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-[#2F241D] hover:text-[#B85C38] focus:outline-none cursor-pointer pr-6 appearance-none transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23B85C38'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
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

        {/* Showing Count Indicator */}
        <div className="flex items-center justify-between text-xs text-text-muted font-sans px-1">
          <span>
            Showing <span className="font-bold text-text-primary">{filteredEvents.length === 0 ? 0 : `${startIndex + 1}–${endIndex}`}</span> of <span className="font-bold text-text-primary">{filteredEvents.length}</span> events
            {totalPages > 1 && (
              <span className="text-text-muted ml-1.5 font-medium">
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

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white border border-brand-border/60 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3 shadow-2xs">
            <CalendarDays className="w-10 h-10 text-brand-accent/60 mx-auto" />
            <h3 className="text-base font-serif font-bold text-text-primary">No Events Found</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              No matching events found for "{searchQuery}". Try selecting another category or resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedEvents.map((event, index) => {
              return (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                  className="bg-white border border-brand-border/50 hover:border-brand-accent/40 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group text-left"
                >
                  {/* Image */}
                  <div className="h-52 w-full overflow-hidden bg-brand-dark">
                    <img decoding="async"
                      src={getEventImage(event)}
                      alt={event.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getFallbackEventImage(event);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-[11px] font-sans text-text-muted font-medium">
                      <CalendarDays size={13} className="text-[#B85C38]" />
                      <span>{event.date}</span>
                      <span>·</span>
                      <MapPin size={13} className="text-[#B85C38] shrink-0" />
                      <span className="truncate">{event.location?.split(",")[0] || event.district || "Patna"}</span>
                    </div>

                    <h3 className="mt-2.5 text-base sm:text-lg font-serif font-bold text-text-primary leading-snug group-hover:text-brand-accent transition-colors duration-200 line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-text-secondary text-xs leading-relaxed font-sans line-clamp-2 flex-grow">
                      {event.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="text-[11px] font-bold text-brand-accent uppercase tracking-wider hover:underline cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-brand-border/40 bg-white p-4.5 rounded-2xl border border-brand-border/60 shadow-2xs">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#2F241D] hover:text-[#B85C38] disabled:opacity-30 disabled:cursor-not-allowed border border-[#E7DED3] bg-[#FAF8F3] hover:bg-white rounded-xl transition cursor-pointer shadow-2xs hover:border-[#B85C38]/40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`min-w-[38px] h-9 px-3.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                    currentPage === p
                      ? "bg-[#B85C38] text-white shadow-md scale-105"
                      : "bg-[#FAF8F3] text-[#6F665E] hover:text-[#2F241D] hover:bg-white hover:border-[#B85C38]/40 border border-[#E7DED3] shadow-2xs"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#2F241D] hover:text-[#B85C38] disabled:opacity-30 disabled:cursor-not-allowed border border-[#E7DED3] bg-[#FAF8F3] hover:bg-white rounded-xl transition cursor-pointer shadow-2xs hover:border-[#B85C38]/40"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Event Details & Registration Modal Portal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
