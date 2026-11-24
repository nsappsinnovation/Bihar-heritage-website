import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  MapPin,
  Shield,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Award,
  Compass,
  Landmark,
  Grid,
  List,
  Building2,
  Info,
  RefreshCw,
  Sparkles,
  ExternalLink
} from "lucide-react";

import defaultProtectedSites from "../data/defaults/defaultProtectedSites.json";

const DEMO_HERITAGE_IMAGES = [
  "/images/remote/photo-1548013146-72479768bada-d369989e.webp",
  "/images/heritage-placeholder.svg",
  "/images/remote/photo-1599661046289-e31897846e41-5f74d88e.webp",
  "/images/remote/photo-1590050752117-238cb0fb12b1-dc3c9ff0.webp",
  "/images/remote/photo-1564507592333-c60657eea523-a198d177.webp",
  "/images/remote/photo-1598890777032-bde835ba27c2-b66629ae.webp",
  "/images/remote/photo-1626621341517-bbf3d9990a23-a27c2c90.webp",
  "/images/remote/photo-1582510003544-4d00b7f74220-ff995634.webp",
  "/images/remote/photo-1524492412937-b28074a5d7da-42ffe6c1.webp",
  "/images/remote/photo-1605649487212-47bdab064df7-8dc44ef8.webp",
  "/images/remote/photo-1567157577867-05ccb1388e66-4533806b.webp",
  "/images/remote/photo-1609137144813-7d9921338f24-62ae3aad.webp",
  "/images/remote/photo-1587474260584-136574528ed5-26181deb.webp",
  "/images/heritage-placeholder.svg",
  "/images/heritage-placeholder.svg",
  "/images/remote/photo-1572099606223-6e29045d7de3-8972db17.webp",
  "/images/heritage-placeholder.svg",
  "/images/heritage-placeholder.svg",
  "/images/remote/photo-1544735716-392fe2489ffa-9aa011f5.webp",
  "/images/heritage-placeholder.svg",
];
import { safeHref } from "../utils/safeUrl";

export default function ProtectedSites() {
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'state', 'central', 'unesco', 'other'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [sortBy, setSortBy] = useState("sl_no");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSite, setSelectedSite] = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const sitesData = defaultProtectedSites;

  const itemsPerPage = viewMode === "grid" ? 12 : 16;

  // Reset image carousel index when active site changes
  useEffect(() => {
    setActiveImgIdx(0);
  }, [selectedSite]);

  // Combine datasets in strict user order: STATE PROTECTED FIRST, THEN ASI MANAGED, THEN UNESCO, THEN OTHER
  const allSites = useMemo(() => {
    return (sitesData || []).map((site) => ({
      ...site,
      managed_by: site.managed_by || "state",
      district: site.district || site.location?.split(",").slice(-2, -1)[0]?.trim() || "Patna",
      subtitle: site.subtitle || site.description || "",
      protected_since: site.protected_since || (site.managed_by === "central" ? "Centrally Protected (ASI)" : "Protected Monument"),
    }));
  }, [sitesData]);

  // Extract unique districts dynamically for filters
  const districts = useMemo(() => {
    const list = allSites.map((site) => site.district || site.location?.split(",").slice(-2, -1)[0]?.trim() || "Bihar").filter(Boolean);
    return ["all", ...new Set(list)].sort();
  }, [allSites]);

  // Filter and sort items based on tab, search query, district, and sort selection
  const filteredSites = useMemo(() => {
    let result = allSites.filter((site) => {
      const matchesTab =
        activeTab === "all" || site.managed_by === activeTab;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        site.name.toLowerCase().includes(searchLower) ||
        site.location?.toLowerCase().includes(searchLower) ||
        site.locality?.toLowerCase().includes(searchLower) ||
        site.district?.toLowerCase().includes(searchLower) ||
        (site.subtitle && site.subtitle.toLowerCase().includes(searchLower));

      const matchesDistrict =
        selectedDistrict === "all" ||
        (site.district &&
          site.district.toLowerCase() === selectedDistrict.toLowerCase()) ||
        site.location?.toLowerCase().includes(selectedDistrict.toLowerCase());

      return matchesTab && matchesSearch && matchesDistrict;
    });

    // Custom sorting: default preserves state-first order
    if (sortBy === "sl_no") {
      return result; // Default preserves state-first dataset order!
    }

    return result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "distance") {
        return (a.distance || 0) - (b.distance || 0);
      }
      if (sortBy === "district") {
        return (a.district || "").localeCompare(b.district || "");
      }
      return 0;
    });
  }, [allSites, activeTab, searchQuery, selectedDistrict, sortBy]);

  // Count metrics for tab counters dynamically updated by search query and district filter
  const counts = useMemo(() => {
    const baseFiltered = allSites.filter((site) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        site.name.toLowerCase().includes(searchLower) ||
        site.location?.toLowerCase().includes(searchLower) ||
        site.locality?.toLowerCase().includes(searchLower) ||
        site.district?.toLowerCase().includes(searchLower) ||
        (site.subtitle && site.subtitle.toLowerCase().includes(searchLower));

      const matchesDistrict =
        selectedDistrict === "all" ||
        (site.district &&
          site.district.toLowerCase() === selectedDistrict.toLowerCase()) ||
        site.location?.toLowerCase().includes(selectedDistrict.toLowerCase());

      return matchesSearch && matchesDistrict;
    });

    return {
      all: baseFiltered.length,
      state: baseFiltered.filter((s) => s.managed_by === "state").length,
      central: baseFiltered.filter((s) => s.managed_by === "central").length,
      unesco: baseFiltered.filter((s) => s.managed_by === "unesco").length,
      other: baseFiltered.filter((s) => s.managed_by === "other").length,
    };
  }, [allSites, searchQuery, selectedDistrict]);

  // Reset pagination when filter criteria change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedDistrict, sortBy, viewMode]);

  // Calculate paginated list
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage) || 1;
  const paginatedSites = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSites.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSites, currentPage, itemsPerPage]);

  // Function to handle image loading errors gracefully
  const handleImageError = (e, site, fallbackOffset = 0) => {
    e.target.onerror = null;
    e.target.src = DEMO_HERITAGE_IMAGES[fallbackOffset % DEMO_HERITAGE_IMAGES.length];
  };

  return (
    <div className="min-h-screen bg-brand-dark text-text-primary pb-24 relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `60px 60px`,
        }}
      />

      {/* Header Banner - Perfectly Proportioned Height Banner with Centered Category Navigation Pills */}
      <div className="relative min-h-[320px] md:min-h-[360px] w-full overflow-hidden flex flex-col justify-between mb-8 pt-16 pb-6">
        {/* Crystal Clear Background Image */}
        <div className="absolute inset-0 z-0">
          <img loading="lazy" decoding="async"
            src="https://upload.wikimedia.org/wikipedia/commons/0/09/Kabuli_Gate_-_Rohtas_Fort_by_Usman_Ghani.jpg"
            alt="Protected Sites Banner"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-[1.02]"
          />
          {/* Subtle soft left gradient only for black text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50/85 via-amber-50/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 md:px-12 flex flex-col justify-between h-full">
          {/* Text Container with Top Margin */}
          <div className="max-w-3xl mt-6 md:mt-10">
            <div className="text-brand-accent text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] font-sans mb-2.5 mt-2">
              Official Heritage Directory
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-black leading-tight tracking-tight drop-shadow-sm">
              Protected & Historical Monuments
            </h1>
            <p className="text-slate-900 text-xs sm:text-sm font-sans font-normal mt-2.5 leading-relaxed max-w-xl">
              Explore Bihar’s official registry of State-Protected, ASI Centrally Protected, and UNESCO World Heritage Sites.
            </p>
          </div>

          {/* Centered Category Navigation Pills rendered inside the Header Banner */}
          <div className="flex justify-center mt-6 md:mt-8">
            <div className="inline-flex bg-brand-card/95 backdrop-blur-md border border-brand-border/80 rounded-full p-2 shadow-xl flex-wrap justify-center gap-2 max-w-full">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-5 py-2.5 text-xs font-sans font-semibold rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2 ${activeTab === "all"
                    ? "bg-brand-accent text-white shadow"
                    : "text-text-secondary hover:text-brand-accent hover:bg-brand-alt/10"
                  }`}
              >
                <span>All Monuments</span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold ${activeTab === "all"
                      ? "bg-white/20 text-white"
                      : "bg-brand-border/80 text-text-secondary"
                    }`}
                >
                  {counts.all}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("state")}
                className={`px-5 py-2.5 text-xs font-sans font-semibold rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2 ${activeTab === "state"
                    ? "bg-brand-accent text-white shadow"
                    : "text-text-secondary hover:text-brand-accent hover:bg-brand-alt/10"
                  }`}
              >
                <Shield size={13} />
                <span>State Protected</span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold ${activeTab === "state"
                      ? "bg-white/20 text-white"
                      : "bg-brand-border/80 text-text-secondary"
                    }`}
                >
                  {counts.state}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("central")}
                className={`px-5 py-2.5 text-xs font-sans font-semibold rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2 ${activeTab === "central"
                    ? "bg-brand-accent text-white shadow"
                    : "text-text-secondary hover:text-brand-accent hover:bg-brand-alt/10"
                  }`}
              >
                <Landmark size={13} />
                <span>ASI Centrally Protected</span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold ${activeTab === "central"
                      ? "bg-white/20 text-white"
                      : "bg-brand-border/80 text-text-secondary"
                    }`}
                >
                  {counts.central}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("unesco")}
                className={`px-5 py-2.5 text-xs font-sans font-semibold rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2 ${activeTab === "unesco"
                    ? "bg-brand-accent text-white shadow"
                    : "text-text-secondary hover:text-brand-accent hover:bg-brand-alt/10"
                  }`}
              >
                <Award size={13} />
                <span>UNESCO Sites</span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold ${activeTab === "unesco"
                      ? "bg-white/20 text-white"
                      : "bg-brand-border/80 text-text-secondary"
                    }`}
                >
                  {counts.unesco}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("other")}
                className={`px-5 py-2.5 text-xs font-sans font-semibold rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2 ${activeTab === "other"
                    ? "bg-brand-accent text-white shadow"
                    : "text-text-secondary hover:text-brand-accent hover:bg-brand-alt/10"
                  }`}
              >
                <span>Other Heritage Sites</span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold ${activeTab === "other"
                      ? "bg-white/20 text-white"
                      : "bg-brand-border/80 text-text-secondary"
                    }`}
                >
                  {counts.other}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto z-10 relative px-6 md:px-12">
        {/* Filter & Toolbar Controls Bar - Circular Pill Shaped Corners with Reset Filter option */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-brand-card p-4 rounded-3xl lg:rounded-full border border-brand-border/60 shadow-lg px-6 py-4 lg:py-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50"
            />
            <input
              type="text"
              placeholder="Search by monument name, locality, district, sub-circle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-dark border border-brand-border/60 rounded-full pl-10 pr-10 py-2.5 text-xs text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-brand-accent/60 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/40 hover:text-brand-accent cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Select Dropdowns, Reset & View Mode */}
          <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
            {/* District Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-sans hidden sm:inline">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-brand-dark border border-brand-border/60 text-xs text-text-primary rounded-full px-4 py-2.5 focus:outline-none focus:border-brand-accent/60 font-sans cursor-pointer min-w-[130px]"
              >
                <option value="all">All Districts</option>
                {districts
                  .filter((d) => d !== "all")
                  .map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
              </select>
            </div>



            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-sans hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-brand-dark border border-brand-border/60 text-xs text-text-primary rounded-full px-4 py-2.5 focus:outline-none focus:border-brand-accent/60 font-sans cursor-pointer"
              >
                <option value="sl_no">Default Order (State First)</option>
                <option value="name">Name (A-Z)</option>
                <option value="distance">Distance from Patna</option>
                <option value="district">District</option>
              </select>
            </div>

            {/* Reset Filters Pill Button */}
            {(searchQuery || selectedDistrict !== "all" || activeTab !== "all" || sortBy !== "sl_no") ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDistrict("all");
                  setActiveTab("all");
                  setSortBy("sl_no");
                }}
                className="bg-brand-accent/15 hover:bg-brand-accent text-brand-accent hover:text-white border border-brand-accent/40 text-xs font-semibold rounded-full px-4 py-2.5 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
                title="Reset all search filters and tab categories"
              >
                <RefreshCw size={13} className="shrink-0" />
                <span className="font-sans">Reset Filter</span>
              </button>
            ) : (
              <button
                disabled
                className="bg-brand-dark/40 text-text-muted/40 border border-brand-border/30 text-xs font-semibold rounded-full px-4 py-2.5 flex items-center gap-1.5 shrink-0 cursor-not-allowed opacity-50"
              >
                <RefreshCw size={13} className="shrink-0" />
                <span className="font-sans">Reset Filter</span>
              </button>
            )}

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-brand-dark border border-brand-border/60 rounded-full p-1 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${viewMode === "grid"
                    ? "bg-brand-accent text-white"
                    : "text-text-muted hover:text-text-primary"
                  }`}
                title="Grid View"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${viewMode === "list"
                    ? "bg-brand-accent text-white"
                    : "text-text-muted hover:text-text-primary"
                  }`}
                title="List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-text-secondary mb-6 font-sans px-1">
          <div>
            Showing <span className="font-bold text-text-primary">{filteredSites.length}</span> monuments
            {activeTab !== "all" && (
              <span> in <span className="text-brand-accent font-semibold capitalize">{activeTab}</span> protection</span>
            )}
            {selectedDistrict !== "all" && (
              <span> • District: <span className="text-brand-accent font-semibold">{selectedDistrict}</span></span>
            )}
          </div>
          {(searchQuery || selectedDistrict !== "all" || activeTab !== "all" || sortBy !== "sl_no") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDistrict("all");
                setActiveTab("all");
                setSortBy("sl_no");
              }}
              className="text-brand-accent hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw size={12} /> Clear all filters
            </button>
          )}
        </div>

        {/* Content Display: Grid or List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}_${currentPage}_${viewMode}_${searchQuery}_${selectedDistrict}_${sortBy}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {filteredSites.length === 0 ? (
              <div className="text-center py-24 text-text-secondary border border-dashed border-brand-border/60 rounded-2xl bg-brand-card/50">
                <Landmark size={48} className="mx-auto text-brand-accent/40 mb-4" />
                <h3 className="text-lg font-serif font-bold text-text-primary mb-2">
                  No protected monuments found
                </h3>
                <p className="text-xs font-sans font-light max-w-md mx-auto text-text-secondary mb-6">
                  We couldn't find any monuments matching your current search query or filter selections.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDistrict("all");
                      setActiveTab("all");
                    setSortBy("sl_no");
                  }}
                  className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 rounded-xl text-xs text-white font-semibold cursor-pointer transition-all shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid View Layout with Completely Clean Photo Container & Static Visible Dark Name */
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[500px]">
                  {paginatedSites.map((site, index) => {
                    const isUnesco = site.managed_by === "unesco";
                    const isCentral = site.managed_by === "central";
                    const isState = site.managed_by === "state";
                    const cardImg = site.image || DEMO_HERITAGE_IMAGES[index % DEMO_HERITAGE_IMAGES.length];

                    return (
                      <div
                        key={site.id || site.sl_no || index}
                        className="flex flex-col bg-brand-card border border-brand-border/50 hover:border-brand-accent rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group cursor-pointer h-full"
                        onClick={() => setSelectedSite(site)}
                      >
                        {/* Clean Card Image Container - No overlays/shadows */}
                        <div className="h-52 w-full overflow-hidden relative rounded-t-2xl bg-black">
                          <img decoding="async"
                            src={cardImg}
                            alt={site.name}
                            onError={(e) => handleImageError(e, site, index)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />

                          {/* Top Authority Badge */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                            <span
                              className="text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold shadow-md border backdrop-blur-md bg-stone-900/85 text-[#F8F5F0] border-stone-700/40"
                            >
                              {isUnesco
                                ? "UNESCO Site"
                                : isCentral
                                  ? "ASI Protected"
                                  : isState
                                    ? "State Protected"
                                    : "Other Heritage Site"}
                            </span>
                          </div>
                        </div>

                        {/* Card Content Body - Title ALWAYS visible in high-contrast text-text-primary */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-[11px] text-brand-accent mb-2.5 font-sans font-medium">
                              <MapPin size={12} className="shrink-0" />
                              <span className="truncate">
                                {site.location || [site.locality, site.district].filter(Boolean).join(", ") || "Bihar, India"}
                              </span>
                            </div>

                            {/* Site Title ALWAYS Clearly Visible Statically in High-Contrast Dark Color */}
                            <h3 className="text-base font-serif font-bold text-text-primary mb-2 leading-snug group-hover:text-brand-accent transition-colors line-clamp-2">
                              {site.name}
                            </h3>

                            {site.subtitle && (
                              <p className="text-xs text-text-secondary font-light leading-relaxed line-clamp-3 font-sans opacity-90">
                                {site.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-end mt-4 pt-3 border-t border-brand-border/40 text-[11px] font-sans">
                            <span className="text-brand-accent font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              Explore <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* List View Layout */
              <div className="bg-brand-card border border-brand-border/60 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-dark/60 text-[11px] text-text-muted uppercase tracking-wider font-sans border-b border-brand-border/60">
                        <th className="py-3.5 px-4 font-semibold w-12 text-center">#</th>
                        <th className="py-3.5 px-4 font-semibold">Monument Name</th>
                        <th className="py-3.5 px-4 font-semibold">District</th>
                        <th className="py-3.5 px-4 font-semibold">Authority</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40 font-sans text-xs">
                      {paginatedSites.map((site, index) => {
                        const isUnesco = site.managed_by === "unesco";
                        const isCentral = site.managed_by === "central";
                        const isState = site.managed_by === "state";
                        const cardImg = site.image || DEMO_HERITAGE_IMAGES[index % DEMO_HERITAGE_IMAGES.length];

                        return (
                          <tr
                            key={site.id || site.sl_no || index}
                            onClick={() => setSelectedSite(site)}
                            className="hover:bg-brand-alt/10 transition-colors cursor-pointer group"
                          >
                            <td className="py-3 px-4 text-center font-mono text-text-muted">
                              {site.sl_no || index + 1}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img loading="lazy" decoding="async"
                                  src={cardImg}
                                  alt={site.name}
                                  onError={(e) => handleImageError(e, site, index)}
                                  className="w-10 h-10 rounded-lg object-cover bg-brand-dark shrink-0 border border-brand-border/40"
                                />
                                <div>
                                  <div className="font-serif font-bold text-text-primary group-hover:text-brand-accent transition-colors">
                                    {site.name}
                                  </div>
                                  {site.subtitle && (
                                    <div className="text-[11px] text-text-muted truncate max-w-xs font-light">
                                      {site.subtitle}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium text-text-primary">
                              {site.district || site.location.split(",").slice(-2, -1)[0] || "Patna"}
                            </td>
                            <td className="py-3 px-4">
                              <span
                               className="inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-stone-100 text-stone-700 border border-stone-300/80"
                              >
                                {isUnesco
                                  ? "UNESCO"
                                  : isCentral
                                    ? "ASI Central"
                                    : isState
                                      ? "State Protected"
                                      : "Other Heritage Site"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSite(site);
                                }}
                                className="px-3 py-1.5 bg-brand-dark hover:bg-brand-accent text-text-secondary hover:text-white rounded-lg border border-brand-border/60 hover:border-brand-accent transition-all cursor-pointer font-semibold text-[11px]"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-6 border-t border-brand-border/40 font-sans">
            <div className="text-xs text-text-muted">
              Page <span className="text-text-primary font-bold">{currentPage}</span> of{" "}
              <span className="text-text-primary font-bold">{totalPages}</span> (Total {filteredSites.length} items)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="bg-brand-card border border-brand-border/60 hover:border-brand-accent text-text-primary disabled:text-text-muted disabled:border-brand-border/20 disabled:pointer-events-none px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer text-xs"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .map((page, idx, arr) => {
                    const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="text-text-muted px-1 text-xs">...</span>}
                        <button
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 300, behavior: "smooth" });
                          }}
                          className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${currentPage === page
                              ? "bg-brand-accent text-white shadow-md scale-105"
                              : "bg-brand-card text-text-secondary hover:text-brand-accent border border-brand-border/60"
                            }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="bg-brand-card border border-brand-border/60 hover:border-brand-accent text-text-primary disabled:text-text-muted disabled:border-brand-border/20 disabled:pointer-events-none px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer text-xs"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Monument Profile Modal */}
      <AnimatePresence>
        {selectedSite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSite(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="relative bg-brand-card border border-brand-border/80 max-w-5xl w-full overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[90vh] font-sans rounded-3xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSite(null)}
                className="absolute top-4 right-4 z-30 bg-brand-dark/80 border border-brand-border/60 hover:bg-brand-accent hover:border-brand-accent text-text-secondary hover:text-white rounded-full p-2.5 transition-all duration-300 cursor-pointer shadow-lg hover:rotate-90"
              >
                <X size={18} />
              </button>

              {/* Modal Image Column */}
              <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden flex-shrink-0 bg-brand-dark flex flex-col justify-between">
                <div className="relative flex-1 w-full h-full min-h-[260px]">
                  <img loading="lazy" decoding="async"
                    src={
                      selectedSite.images && selectedSite.images[activeImgIdx]
                        ? selectedSite.images[activeImgIdx]
                        : selectedSite.image || DEMO_HERITAGE_IMAGES[0]
                    }
                    alt={selectedSite.name}
                    onError={(e) => handleImageError(e, selectedSite, activeImgIdx)}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Carousel Nav Controls if images exist */}
                  {selectedSite.images && selectedSite.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImgIdx((prev) => (prev === 0 ? selectedSite.images.length - 1 : prev - 1));
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-dark/70 text-white hover:text-brand-accent border border-brand-border/50 transition-all cursor-pointer z-20 hover:scale-110"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImgIdx((prev) => (prev === selectedSite.images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-dark/70 text-white hover:text-brand-accent border border-brand-border/50 transition-all cursor-pointer z-20 hover:scale-110"
                      >
                        <ChevronRight size={16} />
</button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10">
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md font-sans shadow-md border bg-stone-900/85 text-[#F8F5F0] border-stone-700/40"
                    >
                      {selectedSite.managed_by === "unesco"
                        ? "UNESCO World Heritage"
                        : selectedSite.managed_by === "central"
                          ? "ASI Centrally Protected Monument"
                          : selectedSite.managed_by === "state"
                            ? "State Protected Monument"
                            : "Other Heritage Site"}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2.5 leading-tight drop-shadow-md">
                      {selectedSite.name}
                    </h4>
                  </div>
                </div>

                {/* Gallery Thumbnails */}
                {selectedSite.images && selectedSite.images.length > 1 && (
                  <div className="p-3 bg-brand-dark/95 border-t border-brand-border/50 flex items-center justify-center gap-2 z-10 shrink-0">
                    {selectedSite.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImgIdx(idx);
                        }}
                        className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${activeImgIdx === idx
                            ? "border-brand-accent scale-105 shadow-md"
                            : "border-brand-border/50 opacity-60 hover:opacity-100"
                          }`}
                      >
                        <img loading="lazy" decoding="async"
                          src={img}
                          alt="Gallery thumbnail"
                          onError={(e) => handleImageError(e, selectedSite, idx)}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Details Column */}
              <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar max-h-[55vh] md:max-h-none">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-brand-accent text-[11px] font-extrabold uppercase tracking-widest font-sans">
                      Official Monument Profile
                    </span>
                    {selectedSite.sl_no && (
                      <span className="text-text-muted text-xs font-mono">
                        • SL NO: {selectedSite.sl_no}
                      </span>
                    )}
                  </div>

                  <p className="text-text-secondary text-xs sm:text-sm font-light leading-relaxed mb-6 font-sans">
                    {selectedSite.subtitle ||
                      "This monument is officially preserved under historical heritage conservation laws in Bihar. It represents a vital architectural and cultural artifact of India's ancient history."}
                  </p>

                  {/* Detailed Specs Grid */}
                  <div className="bg-brand-dark/60 p-4 border border-brand-border/60 rounded-2xl mb-6">
                    <h5 className="text-text-primary text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b border-brand-border/40 font-sans flex items-center gap-1.5">
                      <Info size={14} className="text-brand-accent" /> Heritage Preservation Metadata
                    </h5>

                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider font-sans flex items-center gap-1">
                          <Landmark size={11} className="text-brand-accent shrink-0" /> District
                        </span>
                        <span className="text-xs text-text-primary font-medium mt-0.5 font-sans">
                          {selectedSite.district || selectedSite.location}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider font-sans flex items-center gap-1">
                          <Shield size={11} className="text-brand-accent shrink-0" /> Protected Status / Era
                        </span>
                        <span className="text-xs text-text-primary font-medium mt-0.5 font-sans">
                          {selectedSite.protected_since || (selectedSite.managed_by === "central" ? "Centrally Protected (ASI)" : "Officially Protected")}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider font-sans flex items-center gap-1">
                          <Compass size={11} className="text-brand-accent shrink-0" /> Authority Tier
                        </span>
                        <span className="text-xs text-brand-gold font-bold mt-0.5 font-sans">
                          {selectedSite.category ||
                            (selectedSite.managed_by === "unesco"
                              ? "UNESCO World Heritage"
                              : selectedSite.managed_by === "central"
                              ? "ASI Central Protected"
                              : selectedSite.managed_by === "state"
                              ? "State Protected"
                              : "Other Heritage Site")}
                        </span>
                      </div>

                      <div className="col-span-2 flex flex-col pt-2 border-t border-brand-border/40">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider font-sans flex items-center gap-1">
                          <Building2 size={11} className="text-brand-accent shrink-0" /> Management Body
                        </span>
                        <span className="text-xs text-text-primary font-medium mt-0.5 font-sans">
                          {selectedSite.management_body ||
                            (selectedSite.managed_by === "unesco"
                              ? "UNESCO & Govt of Bihar"
                              : selectedSite.managed_by === "central"
                                ? "Archaeological Survey of India (ASI)"
                                : selectedSite.managed_by === "state"
                                  ? "Directorate of Archaeology, Govt of Bihar"
                                  : "Local Heritage Trust / Administration")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                {selectedSite.map_url && (
                  <div className="flex items-center pt-4 border-t border-brand-border/40">
                    <a
                      href={safeHref(selectedSite.map_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-emerald-900/30 transition-all font-sans cursor-pointer"
                    >
                      <MapPin size={13} className="text-emerald-300" />
                      <span>Visit on Google Maps</span>
                      <ExternalLink size={12} className="opacity-70" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
