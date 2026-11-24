import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Download,
  FileText,
  X,
  Search,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Globe,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { useLenis } from "lenis/react";
import Flipbook from "../components/common/Flipbook";
import { safeHref } from "../utils/safeUrl";
import { defaultPublications } from "../data/defaults/defaultPublications";

const ALL_STANDARD_PUB_CATEGORIES = [
  "Archaeological Atlas",
  "Folk Literature",
  "Linguistic Heritage",
  "Excavation Report",
  "Academic Monograph",
  "Research Journal",
  "Heritage Booklet"
];

/* ─── Interactive Flipbook Modal Portal ───────────────────────────────────── */
const FlipbookModal = ({ book, onClose }) => {
  const lenis = useLenis();

  // Prevent background scroll
  useEffect(() => {
    if (!book) return;
    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    } else {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [book, lenis]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!book) return null;

  const modalDOM = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 pointer-events-auto"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="bg-brand-dark border border-brand-accent/40 rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden relative z-10 my-auto text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/60 bg-brand-card/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 min-w-0 pr-4">
              <div className="p-2.5 rounded-xl bg-brand-accent/15 border border-brand-accent/30 text-brand-accent shrink-0">
                <BookOpen size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                    {book.category || "Publication"}
                  </span>
                  {book.year && (
                    <span className="text-[10px] font-sans text-brand-gold font-semibold hidden sm:inline">
                      • {book.year} Edition
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-text-primary truncate mt-0.5">
                  {book.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {book.pdfUrl && (
                <a
                  href={safeHref(book.pdfUrl)}
                  download={book.title ? `${book.title}.pdf` : "publication.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/30 hover:bg-brand-gold/20 transition-all font-sans cursor-pointer shadow-xs"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-brand-card hover:bg-brand-accent hover:text-white text-text-secondary border border-brand-border/60 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Close reader (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Body with Flipbook */}
          <div className="flex-1 overflow-hidden bg-brand-dark/50 relative flex items-center justify-center">
            {book.pdfUrl ? (
              <Flipbook pdfFile={book.pdfUrl} onClose={onClose} />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
                <FileText className="w-12 h-12 text-brand-accent/60 mb-3" />
                <h3 className="text-base font-serif font-bold text-text-primary">PDF File Not Linked</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  No digital PDF document is currently attached to this publication. You can upload or link the PDF from the admin portal.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalDOM, document.body);
};

/* ─── Main Publication Page ───────────────────────────────────────────────── */
export default function Publication() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // 6 publications per page (3x2 grid)

  
  const rawPublications = defaultPublications;

  // Filter out drafts and archived
  const livePublications = (rawPublications || []).filter(
    (p) => (p.status || "Published").toLowerCase() !== "draft" && (p.status || "Published").toLowerCase() !== "archived"
  );

  // Collect category options
  const presentCategories = Array.from(
    new Set([
      ...ALL_STANDARD_PUB_CATEGORIES.filter((cat) => livePublications.some((item) => item.category === cat)),
      ...livePublications.map((item) => item.category).filter(Boolean)
    ])
  );

  const categoryOptions = [
    { label: "All Publications", value: "All", count: livePublications.length },
    ...presentCategories.map((cat) => ({
      label: cat,
      value: cat,
      count: livePublications.filter((item) => item.category === cat).length
    }))
  ];

  // Filtering
  const filteredPublications = livePublications.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (item.title || "").toLowerCase();
    const subtitle = (item.subtitle || "").toLowerCase();
    const description = (item.description || item.details || "").toLowerCase();
    const author = (item.author || "").toLowerCase();
    const language = (item.language || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const year = (item.year || "").toLowerCase();

    return (
      title.includes(q) ||
      subtitle.includes(q) ||
      description.includes(q) ||
      author.includes(q) ||
      language.includes(q) ||
      category.includes(q) ||
      year.includes(q)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredPublications.length / pageSize) || 1;
  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const anchor = document.getElementById("publications-anchor");
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
            src="/images/remote/photo-1507842217343-583bb7270b66-d4eb6f29.webp"
            alt="Archival Publications Banner"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-brand-dark/35 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end h-full pb-8 text-left">
          <div className="max-w-3xl">
            <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] block mb-2 font-sans flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Research, Epigraphy & Literature
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary leading-tight">
              Archival Publications
            </h1>
            <p className="text-text-secondary text-sm md:text-base font-sans font-light mt-3 leading-relaxed">
              Explore official excavation monographs, cartographic atlases, ancient script treatises, and folklore literature compilations curated by the Bihar Heritage Development Society.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="publications-anchor" className="max-w-7xl mx-auto z-10 relative px-6 md:px-12 space-y-7">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, author, language, topic…"
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
              <label htmlFor="pub-category-select" className="text-xs font-semibold text-text-secondary mr-2 whitespace-nowrap">
                Category:
              </label>
              <select
                id="pub-category-select"
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

        {/* Showing Count Indicator */}
        <div className="flex items-center justify-between text-xs text-text-muted font-sans px-1">
          <span>
            Showing <span className="font-bold text-text-primary">{paginatedPublications.length}</span> of {filteredPublications.length} publications
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

        {/* Publications Grid */}
        {filteredPublications.length === 0 ? (
          <div className="bg-white border border-brand-border/60 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3 shadow-2xs">
            <BookOpen className="w-10 h-10 text-brand-accent/60 mx-auto" />
            <h3 className="text-base font-serif font-bold text-text-primary">No Publications Found</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              No matching publications found for "{searchQuery}". Try searching with different keywords or select another category.
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
            {paginatedPublications.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                className="bg-white border border-brand-border/60 hover:border-brand-accent/50 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300 group text-left"
              >
                {/* Top Category & Year Row */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold font-sans uppercase tracking-wider bg-[#B85C38]/10 text-[#B85C38] border border-[#B85C38]/20">
                    {item.category || "Publication"}
                  </span>
                  {item.year && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-[#8C6D3B] bg-[#8C6D3B]/10 border border-[#8C6D3B]/20">
                      {item.year}
                    </span>
                  )}
                </div>

                {/* 3D Realistic Book Showcase */}
                <div className="relative flex justify-center items-center py-6 bg-gradient-to-b from-[#FAF8F3] to-[#F3EFE9] border border-brand-border/40 rounded-xl mb-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/5 to-transparent opacity-30 pointer-events-none" />

                  {/* 3D Book Display */}
                  <div className="relative group-hover:scale-105 transition-transform duration-500 z-10">
                    {item.cover ? (
                      <div className="relative shadow-xl rounded-md overflow-hidden border border-brand-border/40">
                        <img loading="lazy" decoding="async"
                          src={item.cover}
                          alt={`${item.title} Cover`}
                          className="w-28 h-38 sm:w-32 sm:h-44 object-cover rounded-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "/images/remote/photo-1544644181-1484b3fdfc62-987d9fdd.webp";
                          }}
                        />
                        {/* Realistic Spine highlight */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/30 via-white/10 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <div className="w-28 h-38 sm:w-32 sm:h-44 bg-brand-dark border border-brand-border/50 flex flex-col items-center justify-center rounded-md shadow-xl text-brand-accent p-3 text-center">
                        <FileText className="w-8 h-8 mb-2 opacity-80" />
                        <span className="text-[10px] font-serif font-bold text-text-primary line-clamp-2">
                          {item.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Metadata Body */}
                <div className="space-y-2 flex-grow mb-5">
                  <div className="flex items-center gap-2 text-[10px] font-sans text-text-muted font-medium">
                    {item.language && <span>{item.language}</span>}
                    {item.pages && (
                      <>
                        <span>•</span>
                        <span>{item.pages}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-text-primary leading-snug group-hover:text-brand-accent transition-colors duration-200 line-clamp-2">
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="text-[11px] font-sans text-[#8C6D3B] font-medium line-clamp-1 italic">
                      {item.subtitle}
                    </p>
                  )}

                  <p className="text-text-secondary text-xs leading-relaxed font-sans line-clamp-3">
                    {item.description || item.details}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3.5 border-t border-brand-border/50">
                  <button
                    onClick={() => setSelectedBook(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F3] hover:bg-brand-accent hover:text-white text-[10px] font-bold text-brand-accent uppercase tracking-wider transition-all cursor-pointer border border-brand-border/50"
                  >
                    <BookOpen size={12} />
                    <span>View Flipbook</span>
                  </button>

                  {item.pdfUrl ? (
                    <a
                      href={safeHref(item.pdfUrl)}
                      download={item.title ? `${item.title}.pdf` : "publication.pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F3] hover:bg-[#8C6D3B] hover:text-white text-[10px] font-bold text-[#8C6D3B] uppercase tracking-wider transition-all cursor-pointer border border-brand-border/50"
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </a>
                  ) : (
                    <span className="text-[10px] font-sans text-text-muted">Digital Copy Pending</span>
                  )}
                </div>
              </motion.div>
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
                  className={`w-8 h-8 rounded-lg text-xs font-bold font-sans transition-colors cursor-pointer ${
                    currentPage === p
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

      {/* Interactive Flipbook Reader Modal */}
      {selectedBook && (
        <FlipbookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
