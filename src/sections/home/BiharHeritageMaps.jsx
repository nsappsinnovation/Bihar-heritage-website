import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Compass, ChevronRight, X, Clock, Layers, Star, Landmark, Map as MapIcon, ArrowLeft, Sparkles } from "lucide-react";

import biharGeoJson from "../../data/bihar_districts.json";
import { loadProtectedSites, loadExcavations, buildDistrictData, resolveAtlasEntry } from "../../utils/atlasData";
import culturalZones from "../../data/culturalZones.json";
import historicalRegions from "../../data/historicalRegions.json";
import heritageCircuits from "../../data/heritageCircuits.json";
import mapBackground from "../../assets/Banners/MapBackground.webp";

/* ─── SVG Map Projection ──────────────────────────────────────────────── */
const minLon = 83.316, maxLon = 88.292, minLat = 24.287, maxLat = 27.524;
const W = 800, H = 620, PAD = 20;
const project = (lon, lat) => ({
  x: PAD + ((lon - minLon) / (maxLon - minLon)) * (W - 2 * PAD),
  y: PAD + ((maxLat - lat) / (maxLat - minLat)) * (H - 2 * PAD),
});

/* ─── Tabs config ─────────────────────────────────────────────────────── */
const TABS = [
  { id: "district", label: "Explore Districts", short: "Districts", icon: MapPin },
  { id: "cultural", label: "Cultural Zones", short: "Cultural", icon: Layers },
  { id: "historical", label: "Historical Regions", short: "Historical", icon: Landmark },
  { id: "circuit", label: "Heritage Circuits", short: "Circuits", icon: MapIcon },
];

/* ─── Color helpers ───────────────────────────────────────────────────── */
const hexToRgba = (hex, a = 1) => {
  if (!hex || !hex.startsWith('#')) return `rgba(197,106,61,${a})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/* ─── Stagger animation container + children ─────────────────────────── */
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
};
const staggerChild = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

/* ─── Spring config for panel slides ─────────────────────────────────── */
const springConfig = { type: "spring", stiffness: 320, damping: 30, mass: 0.8 };

/* ─── Thumbnail for a site row: always renders an image, placeholder when missing/broken ─── */
const PLACEHOLDER_IMAGE = "/images/heritage-placeholder.svg";

const AtlasThumb = ({ src, alt }) => (
  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden ring-1 ring-[#E8DFC8] bg-[#FAF5EC]">
    <img
      loading="lazy"
      decoding="async"
      src={src || PLACEHOLDER_IMAGE}
      alt={alt}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = PLACEHOLDER_IMAGE;
      }}
    />
  </div>
);

/* ─── Excavation & exploration list (links to the excavation pages) ──── */
const DigList = ({ digs = [], accent = "#C56A3D" }) => {
  if (!digs.length) return null;
  return (
    <motion.div variants={staggerChild} className="space-y-2">
      <span className="text-[8.5px] font-sans font-bold uppercase tracking-[0.15em] text-[#8A7560] flex items-center gap-1.5 mb-1">
        <Sparkles className="w-3 h-3 text-[#C2A55D]" />
        Excavations & Explorations ({digs.length})
      </span>
      {digs.map((d) => (
        <Link
          key={d.id}
          to={d.link}
          className="group flex items-start gap-3 p-3 rounded-xl bg-white/75 border border-[rgba(224,208,180,0.55)] hover:bg-white hover:border-[#C56A3D]/30 transition-all duration-200"
        >
          <AtlasThumb src={d.image} alt={d.title} />
          <div className="flex-1 min-w-0">
            <span className="font-serif font-bold text-[12px] text-[#2C2419] leading-snug flex items-center gap-1">
              {d.title}
              <ChevronRight className="w-3 h-3 text-[#C56A3D] transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="text-[8px] font-sans font-bold uppercase tracking-wider mt-0.5 inline-block" style={{ color: accent }}>
              {d.category}{d.period ? ` · ${d.period}` : ""}
            </span>
          </div>
        </Link>
      ))}
    </motion.div>
  );
};

/* ─── Redesigned District Tooltip Card ───────────────────────────────── */
const DistrictTooltipCard = ({ data, name, side, onClose }) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    exit="exit"
    className="relative rounded-2xl overflow-hidden flex flex-col max-h-[640px]"
    style={{
      background: "linear-gradient(135deg, rgba(255,253,248,0.98), rgba(250,245,236,0.96))",
      backdropFilter: "blur(24px)",
      boxShadow: "0 24px 64px -12px rgba(44,36,25,0.2), 0 0 0 1px rgba(197,106,61,0.1)",
    }}
  >
    {/* Top accent gradient */}
    <div className="h-1.5 w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, #C56A3D, #C2A55D, #C56A3D)" }} />

    {/* Fixed Header */}
    <div className="p-5 pb-3 flex-shrink-0">
      <motion.div variants={staggerChild} className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center shadow-xs" style={{ background: "linear-gradient(135deg, #C56A3D, #A8522E)" }}>
              <MapPin className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-[9px] font-sans font-bold tracking-[0.2em] uppercase text-[#C56A3D]">District</span>
          </div>
          <h4 className="font-serif font-black text-2xl text-[#2C2419] leading-tight">{name}</h4>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[9.5px] font-sans font-bold px-2.5 py-1 rounded-lg text-[#7A5633]"
            style={{ background: "linear-gradient(135deg, #F5E9D0, #EDE3CF)", border: "1px solid #D5C3A580" }}>
            {(data.sites?.length || 0) + (data.digs?.length || 0)} sites
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-[#F5E9D0]/80 flex items-center justify-center text-[#7A5633] hover:bg-[#C56A3D] hover:text-white transition-all duration-200 hover:scale-105"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>

    {/* Scrollable Content Body */}
    <div className="px-5 pb-3 overflow-y-auto atlas-scroll flex-1 space-y-3.5 pr-2.5" data-lenis-prevent>
      {/* Summary */}
      {data.summary && (
        <motion.div variants={staggerChild}
          className="p-3.5 rounded-xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(250,245,236,0.85), rgba(244,228,193,0.35))",
            border: "1px solid rgba(213,195,165,0.45)",
          }}
        >
          <p className="text-[12.5px] font-sans text-[#6B5744] leading-relaxed italic relative z-10">
            {data.summary}
          </p>
        </motion.div>
      )}

      {/* Heritage sites */}
      {data.sites?.length > 0 && (
        <motion.div variants={staggerChild} className="space-y-2">
          <span className="text-[8.5px] font-sans font-bold uppercase tracking-[0.15em] text-[#8A7560] flex items-center gap-1.5 mb-1">
            <Star className="w-3 h-3 text-[#C2A55D]" />
            Protected Sites ({data.sites.length})
          </span>
          {data.sites.map((site, i) => (
            <motion.div
              key={i}
              variants={staggerChild}
              className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-default"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(224,208,180,0.55)",
              }}
              whileHover={{
                backgroundColor: "rgba(255,255,255,0.98)",
                borderColor: "rgba(197,106,61,0.3)",
                y: -1,
                transition: { duration: 0.15 },
              }}
            >
              <AtlasThumb src={site.image} alt={site.title} />
              <div className="flex-1 min-w-0">
                <span className="font-serif font-bold text-[13px] text-[#2C2419] leading-snug block">{site.title}</span>
                {site.category && (
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider mt-0.5 inline-block text-[#C56A3D]">{site.category}</span>
                )}
                {site.description && (
                  <p className="text-[11.5px] font-sans text-[#6B5744] leading-relaxed mt-1">{site.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <DigList digs={data.digs} />
    </div>

    {/* Fixed Footer */}
    <div className="px-5 py-3 flex-shrink-0 bg-gradient-to-t from-[#FAF5EC] to-transparent border-t border-[rgba(224,208,180,0.4)]">
      <Link to="/protected-sites"
        className="group text-[10.5px] font-serif font-bold text-[#C56A3D] hover:text-[#A94E2F] transition-colors flex items-center justify-end gap-1">
        Explore all sites
        <ChevronRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  </motion.div>
);

/* ─── Redesigned Classification Panel with In-Classification District View ─── */
const ClassificationPanel = ({
  item,
  activeTab,
  side,
  selectedDistrict,
  onSelectDistrict,
  onClearDistrict,
  onClose,
  allDistrictData = {},
}) => {
  if (!item) return null;
  const tabLabel = {
    cultural: 'Cultural Zone',
    historical: 'Historical Region',
    circuit: 'Heritage Circuit',
  }[activeTab] || '';

  const TabIcon = {
    cultural: Layers,
    historical: Landmark,
    circuit: MapIcon,
  }[activeTab] || Layers;

  const highlights = item.highlights || item.important_sites || item.stops || [];
  const districtList = useMemo(() => {
    return item.districts || item.stops?.map(s => s.district) || [];
  }, [item]);

  const focusedDistrictData = selectedDistrict ? allDistrictData[selectedDistrict] : null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative rounded-2xl overflow-hidden flex flex-col max-h-[640px]"
      style={{
        background: "linear-gradient(135deg, rgba(255,253,248,0.98), rgba(250,245,236,0.96))",
        backdropFilter: "blur(24px)",
        boxShadow: "0 24px 64px -12px rgba(44,36,25,0.2), 0 0 0 1px rgba(197,106,61,0.1)",
      }}
    >
      {/* Top accent gradient — uses item color */}
      <div className="h-1.5 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${item.color}44, ${item.color}, ${item.color}44)` }} />

      {/* Fixed Header - Stays identical whether a district is selected or not */}
      <div className="p-5 pb-3 flex-shrink-0">
        <motion.div variants={staggerChild} className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-lg flex items-center justify-center shadow-xs" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}DD)` }}>
                <TabIcon className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-[9px] font-sans font-bold tracking-[0.18em] uppercase truncate" style={{ color: item.color }}>
                {tabLabel} • {item.label}
              </span>
            </div>
            <h4 className="font-serif font-black text-2xl text-[#2C2419] leading-tight">{item.label}</h4>
            {item.era && <span className="text-[9.5px] font-sans text-[#8A7560] block mt-0.5">{item.era}</span>}
            {item.tagline && <p className="text-[10.5px] font-sans text-[#6B5744] italic mt-0.5 leading-snug">{item.tagline}</p>}
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-[#F5E9D0]/80 flex items-center justify-center text-[#7A5633] hover:text-white transition-all duration-200 hover:scale-105 flex-shrink-0"
            style={{ '--hover-bg': item.color }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = item.color}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Scrollable Body Content */}
      <div className="px-5 pb-3 overflow-y-auto atlas-scroll flex-1 pr-2.5 space-y-3" data-lenis-prevent>
        {/* ── VIEW A: FOCUSED DISTRICT HERITAGE INSIDE CLASSIFICATION (BELOW TITLE) ── */}
        {selectedDistrict ? (
          <motion.div
            key={`district-focus-${selectedDistrict}`}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-3"
          >
            {/* Active District Banner / Filter Chip */}
            <motion.div
              variants={staggerChild}
              className="flex items-center justify-between p-2.5 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${item.color}18, ${item.color}08)`,
                border: `1px solid ${item.color}35`,
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs"
                  style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}DD)` }}
                >
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-sm text-[#2C2419] truncate">{selectedDistrict}</span>
                    <span
                      className="text-[8.5px] font-sans font-bold px-1.5 py-0.2 rounded"
                      style={{ background: `${item.color}20`, color: item.color }}
                    >
                      {(focusedDistrictData?.sites?.length || 0) + (focusedDistrictData?.digs?.length || 0)} sites
                    </span>
                  </div>
                  <span className="text-[8.5px] font-sans text-[#8A7560] block">District Heritage</span>
                </div>
              </div>

              <button
                onClick={onClearDistrict}
                className="text-[9.5px] font-sans font-semibold px-2.5 py-1 rounded-lg text-[#7A5633] hover:text-[#2C2419] bg-white/85 hover:bg-white transition-all shadow-xs flex items-center gap-1 flex-shrink-0"
                title={`Show all ${item.label}`}
              >
                <ArrowLeft className="w-2.5 h-2.5" />
                All {item.label}
              </button>
            </motion.div>

            {/* District Summary */}
            {focusedDistrictData?.summary && (
              <motion.div
                variants={staggerChild}
                className="p-3.5 rounded-xl relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(250,245,236,0.85), rgba(244,228,193,0.35))",
                  border: "1px solid rgba(213,195,165,0.45)",
                }}
              >
                <p className="text-[12.5px] font-sans text-[#6B5744] leading-relaxed italic">
                  {focusedDistrictData.summary}
                </p>
              </motion.div>
            )}

            {/* District Heritage Sites */}
            <motion.div variants={staggerChild} className="space-y-2">
              <span className="text-[8.5px] font-sans font-bold uppercase tracking-[0.15em] text-[#8A7560] flex items-center gap-1.5 mb-1">
                <Star className="w-3 h-3" style={{ color: item.color }} />
                Heritage Sites in {selectedDistrict}
              </span>

              {focusedDistrictData?.sites?.length > 0 ? (
                <div className="space-y-2">
                  {focusedDistrictData.sites.map((site, i) => (
                    <motion.div
                      key={i}
                      variants={staggerChild}
                      className="group flex items-start gap-2.5 p-2.5 rounded-xl transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.75)",
                        border: "1px solid rgba(224,208,180,0.55)",
                      }}
                      whileHover={{
                        backgroundColor: "rgba(255,255,255,0.98)",
                        borderColor: `${item.color}40`,
                        y: -1,
                        transition: { duration: 0.15 },
                      }}
                    >
                      <AtlasThumb src={site.image} alt={site.title} />
                      <div className="flex-1 min-w-0">
                        <span className="font-serif font-bold text-[13px] text-[#2C2419] leading-snug block">{site.title}</span>
                        {site.category && (
                          <span
                            className="text-[9px] font-sans font-bold uppercase tracking-wider mt-0.5 inline-block px-1.5 py-0.5 rounded"
                            style={{ background: `${item.color}12`, color: item.color }}
                          >
                            {site.category}
                          </span>
                        )}
                        {site.description && (
                          <p className="text-[11.5px] font-sans text-[#6B5744] leading-relaxed mt-1">
                            {site.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl text-center bg-white/50 border border-[#E8DFC8]">
                  <p className="text-[10.5px] font-sans text-[#8A7560] italic">
                    Local cultural traditions & historical landmarks are preserved across {selectedDistrict}.
                  </p>
                </div>
              )}
            </motion.div>

            <DigList digs={focusedDistrictData?.digs} accent={item.color} />

            {/* Quick District Switcher Pills inside the zone */}
            {districtList.length > 1 && (
              <motion.div variants={staggerChild} className="pt-2 border-t border-[#E8DFC8]/50">
                <span className="text-[8.5px] font-sans font-bold uppercase tracking-[0.12em] text-[#8A7560] block mb-1.5">
                  Other {item.label} Districts:
                </span>
                <div className="flex flex-wrap gap-1">
                  {districtList.map((dName) => {
                    const isCur = dName === selectedDistrict;
                    return (
                      <button
                        key={dName}
                        onClick={() => onSelectDistrict(dName)}
                        className="text-[9.5px] font-sans px-2.5 py-1 rounded-md transition-all duration-150 flex items-center gap-1"
                        style={isCur ? {
                          background: item.color,
                          color: '#fff',
                          fontWeight: '700'
                        } : {
                          background: 'rgba(255,255,255,0.65)',
                          color: '#6B5744',
                          border: '1px solid rgba(213,195,165,0.5)'
                        }}
                      >
                        <MapPin className="w-2 h-2 flex-shrink-0" />
                        {dName}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* ── VIEW B: OVERVIEW OF THE CLASSIFICATION ──────────────────────── */
          <motion.div
            key="classification-overview"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-3"
          >
            {/* Description */}
            {item.description && (
              <motion.div variants={staggerChild}
                className="p-3.5 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(250,245,236,0.85), rgba(244,228,193,0.35))",
                  border: "1px solid rgba(213,195,165,0.45)",
                }}
              >
                <p className="text-[12.5px] font-sans text-[#6B5744] leading-relaxed italic">{item.description}</p>
              </motion.div>
            )}

            {/* Art forms — cultural tab */}
            {activeTab === 'cultural' && item.art_forms?.length > 0 && (
              <motion.div variants={staggerChild}>
                <span className="text-[8.5px] font-sans font-bold uppercase tracking-[0.15em] text-[#8A7560] block mb-2">Art Forms</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.art_forms.map((a) => (
                    <span
                      key={a}
                      className="text-[9.5px] font-sans font-medium px-2.5 py-1 rounded-lg transition-colors duration-200"
                      style={{
                        background: `${item.color}12`,
                        color: item.color,
                        border: `1px solid ${item.color}30`,
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Highlights / Sites / Stops */}
            {highlights.length > 0 && (
              <motion.div variants={staggerChild}>
                <span className="text-[8.5px] font-sans font-bold uppercase tracking-[0.15em] text-[#8A7560] flex items-center gap-1.5 mb-2">
                  <Star className="w-3 h-3 flex-shrink-0" style={{ color: item.color }} />
                  {activeTab === 'circuit' ? 'Stops' : 'Key Sites'}
                </span>
                <div className="space-y-2">
                  {highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      variants={staggerChild}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.75)",
                        border: "1px solid rgba(224,208,180,0.55)",
                      }}
                      whileHover={{
                        backgroundColor: "rgba(255,255,255,0.98)",
                        borderColor: `${item.color}40`,
                        y: -1,
                        transition: { duration: 0.15 },
                      }}
                    >
                      {activeTab === 'circuit' && h.order && (
                        <span
                          className="w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white mt-0.5"
                          style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)` }}
                        >
                          {h.order}
                        </span>
                      )}
                      <AtlasThumb src={h.image} alt={h.title} />
                      <div className="flex-1 min-w-0">
                        <span className="font-serif font-bold text-[13px] text-[#2C2419] leading-snug block">{h.title}</span>
                        {(h.period || h.type) && (
                          <span className="text-[9px] font-sans uppercase tracking-wider mt-0.5 block" style={{ color: item.color }}>{h.period || h.type}</span>
                        )}
                        {h.description && (
                          <p className="text-[11.5px] font-sans text-[#8A7560] leading-relaxed mt-0.5">{h.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Circuit stats */}
            {activeTab === 'circuit' && (item.circuit_length_km || item.best_time) && (
              <motion.div variants={staggerChild} className="grid grid-cols-2 gap-2">
                {item.circuit_length_km && (
                  <div className="p-2.5 rounded-xl text-center" style={{ background: `${item.color}0A`, border: `1px solid ${item.color}20` }}>
                    <span className="block font-serif font-black text-lg text-[#2C2419]">{item.circuit_length_km} km</span>
                    <span className="text-[8px] font-sans text-[#8A7560] uppercase tracking-wider">Length</span>
                  </div>
                )}
                {item.best_time && (
                  <div className="p-2.5 rounded-xl text-center" style={{ background: `${item.color}0A`, border: `1px solid ${item.color}20` }}>
                    <Clock className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: item.color }} />
                    <span className="text-[8px] font-sans text-[#8A7560] leading-snug">{item.best_time}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Interactive Districts In Zone List */}
            {districtList.length > 0 && (
              <motion.div variants={staggerChild} className="pt-2.5 border-t border-[#E8DFC8]/60">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8.5px] font-sans font-bold uppercase tracking-[0.14em] text-[#8A7560] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" style={{ color: item.color }} />
                    Click a district to view heritage:
                  </span>
                  <span className="text-[8.5px] font-sans font-semibold text-[#8A7560]">
                    {districtList.length} districts
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {districtList.map((dName) => (
                    <button
                      key={dName}
                      onClick={() => onSelectDistrict(dName)}
                      className="group flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9.5px] font-sans font-medium transition-all duration-150"
                      style={{
                        background: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(224,208,180,0.6)',
                        color: '#4A3B2C'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = item.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)';
                        e.currentTarget.style.borderColor = 'rgba(224,208,180,0.6)';
                      }}
                    >
                      <MapPin className="w-2.5 h-2.5 transition-transform duration-150 group-hover:scale-110" style={{ color: item.color }} />
                      <span>{dName}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="px-5 py-3 flex-shrink-0 bg-gradient-to-t from-[#FAF5EC] to-transparent border-t border-[rgba(224,208,180,0.4)]">
        <Link to="/protected-sites"
          className="group text-[10.5px] font-serif font-bold text-[#C56A3D] hover:text-[#A94E2F] transition-colors flex items-center justify-end gap-1">
          Explore all sites
          <ChevronRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};

/* ─── Smooth Cursor-Following Hover Tooltip ──────────────────────────── */
const HoverTooltip = ({
  hoveredDistrict,
  selected,
  selectedItem,
  selectedDistricts,
  activeTab,
  containerRef
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 450, damping: 30, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 450, damping: 30, mass: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onMove = (e) => {
      const r = container.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      mouseX.set(x + (x > r.width * 0.6 ? -160 : 16));
      mouseY.set(y - 16);
    };
    container.addEventListener("mousemove", onMove);
    return () => container.removeEventListener("mousemove", onMove);
  }, [containerRef, mouseX, mouseY]);

  const isPartOfActiveClassification = selectedItem && selectedDistricts?.includes(hoveredDistrict);

  return (
    <AnimatePresence>
      {hoveredDistrict && hoveredDistrict !== selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute pointer-events-none z-30"
          style={{ left: smoothX, top: smoothY }}
        >
          <div
            className="px-3.5 py-2 rounded-xl font-sans"
            style={{
              background: "linear-gradient(135deg, rgba(255,248,239,0.98), rgba(255,253,248,0.95))",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px -4px rgba(44,36,25,0.15), 0 0 0 1px rgba(197,106,61,0.1)",
            }}
          >
            <div className="flex items-center gap-2 font-semibold text-[13px] text-[#2C2419]">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: isPartOfActiveClassification && selectedItem?.color
                    ? selectedItem.color
                    : "linear-gradient(135deg, #C56A3D, #A8522E)"
                }}
              >
                <MapPin className="w-2.5 h-2.5 text-white" />
              </div>
              <span>{hoveredDistrict}</span>
            </div>

            {isPartOfActiveClassification && (
              <p className="text-[9px] font-sans font-medium text-[#7A5633] mt-0.5 pl-7">
                Part of {selectedItem.label} • Click to view heritage
              </p>
            )}
            {!selectedItem && activeTab !== "district" && (
              <p className="text-[9px] font-sans text-[#8A7560] mt-0.5 pl-7">
                Click to explore
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─── Idle Stats Panel ────────────────────────────────────────────────── */
const IdleStatsCard = ({ activeTab, stats }) => (
  <motion.div
    initial={{ opacity: 0, x: 20, scale: 0.96 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 20, scale: 0.96 }}
    transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.8 }}
    className="relative rounded-2xl overflow-hidden flex flex-col shadow-xl max-h-[640px]"
    style={{
      background: "linear-gradient(135deg, rgba(255,253,248,0.98), rgba(250,245,236,0.96))",
      backdropFilter: "blur(24px)",
      boxShadow: "0 24px 64px -12px rgba(44,36,25,0.2), 0 0 0 1px rgba(197,106,61,0.1)",
    }}
  >
    <div className="p-5 pb-4 flex-shrink-0 border-b border-[rgba(224,208,180,0.4)] bg-gradient-to-br from-[#FFFDF8]/80 to-[#F5EDD9]/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#C56A3D] flex items-center justify-center shadow-xs flex-shrink-0">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-[15px] text-[#2C2419] leading-snug">
            {activeTab === "district"
              ? "Explore by District"
              : activeTab === "cultural"
              ? "Explore Cultural Zones"
              : activeTab === "historical"
              ? "Explore Historical Regions"
              : "Explore Heritage Circuits"}
          </h3>
          <p className="text-[10px] font-sans text-[#8A7560] mt-0.5">
            {activeTab === "district"
              ? `Click any of ${stats.districts} districts on the map`
              : "Select a classification or district"}
          </p>
        </div>
      </div>
    </div>

    <div className="p-5 grid grid-cols-2 gap-3 bg-[#FAF5EC]/30 overflow-y-auto atlas-scroll min-h-0" data-lenis-prevent>
      {[
        { value: stats.protected, label: "Protected Sites" },
        { value: stats.digs, label: "Excavations" },
        { value: stats.zones, label: "Cultural Zones" },
        { value: stats.unesco, label: "UNESCO Sites" },
      ].map((s) => (
        <div
          key={s.label}
          className="py-3.5 px-2 rounded-2xl text-center transition-transform duration-200"
          style={{
            background: "rgba(250,245,236,0.7)",
            border: "1px solid rgba(232,223,200,0.7)",
          }}
        >
          <span className="block font-serif font-black text-[22px] text-[#2C2419] leading-none mb-1">
            {s.value}
          </span>
          <span className="text-[8px] font-sans font-bold uppercase tracking-[0.14em] text-[#8A7560] block mt-1">
            {s.label}
          </span>
        </div>
      ))}
    </div>

    <div className="p-4 border-t border-[rgba(224,208,180,0.4)] flex justify-center bg-gradient-to-t from-[#FAF5EC] to-transparent">
      <Link
        to="/protected-sites"
        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 w-full rounded-full border border-[#D5C3A5] bg-[#FFFDF8] text-[#9A6535] hover:border-[#C56A3D] hover:bg-[#C56A3D] hover:text-white transition-all duration-200 text-[11px] font-sans font-semibold group shadow-2xs"
      >
        All Sites
        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════ */
const BiharHeritageMaps = () => {
  const [activeTab, setActiveTab] = useState("district");
  const [selected, setSelected] = useState(null);
  const [selectedDistrictInClass, setSelectedDistrictInClass] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [clickTooltip, setClickTooltip] = useState(null);
  const [nonDistrictSide, setNonDistrictSide] = useState('right');
  const [isMobile, setIsMobile] = useState(false);
  const svgContainerRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 1024);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* Reset selection when tab changes */
  useEffect(() => {
    setSelected(null);
    setSelectedDistrictInClass(null);
    setHoveredDistrict(null);
    setClickTooltip(null);
  }, [activeTab]);

  /* ── Pre-compute district SVG paths + centroids ──────────────────── */
  const districtPaths = useMemo(() => {
    const ringToPath = (ring) =>
      "M " + ring.map(([lon, lat]) => {
        const { x, y } = project(lon, lat);
        return `${x.toFixed(1)} ${y.toFixed(1)}`;
      }).join(" L ") + " Z";

    const ringCentroid = (ring) => {
      let sx = 0, sy = 0;
      ring.forEach(([lon, lat]) => {
        const { x, y } = project(lon, lat);
        sx += x; sy += y;
      });
      return { cx: sx / ring.length, cy: sy / ring.length };
    };

    return biharGeoJson.features.map((f) => {
      const name = f.properties.Dist_Name;
      const id = f.properties.Dist_Code;
      const { type, coordinates } = f.geometry;
      let path = "";
      let centroid = { cx: 0, cy: 0 };

      if (type === "Polygon") {
        path = coordinates.map(ringToPath).join(" ");
        centroid = ringCentroid(coordinates[0]);
      } else if (type === "MultiPolygon") {
        path = coordinates.map(p => p.map(ringToPath).join(" ")).join(" ");
        const largest = coordinates.reduce((a, b) => b[0].length > a[0].length ? b : a);
        centroid = ringCentroid(largest[0]);
      }
      return { name, id, path, centroid };
    });
  }, []);

  /* ── Datasets for the panels ──────────────────────────────────────── */
  const protectedSites = useMemo(() => loadProtectedSites(), []);
  const excavations = useMemo(() => loadExcavations(), []);
  const districtData = useMemo(
    () => buildDistrictData(protectedSites, excavations),
    [protectedSites, excavations]
  );

  // Zone / region / circuit files hold references; resolve them to display cards
  const panelDatasets = useMemo(() => {
    const sitesById = new Map(protectedSites.map((s) => [String(s.id), s]));
    const resolve = (list) =>
      list.map((item) => {
        const out = { ...item };
        ["highlights", "important_sites", "stops"].forEach((key) => {
          if (item[key]) out[key] = item[key].map((e) => resolveAtlasEntry(e, sitesById)).filter(Boolean);
        });
        return out;
      });
    return {
      cultural: resolve(culturalZones),
      historical: resolve(historicalRegions),
      circuit: resolve(heritageCircuits),
    };
  }, [protectedSites]);
  const currentPanelItems = panelDatasets[activeTab] || [];
  const selectedItem = currentPanelItems.find(i => i.id === selected) || null;
  const selectedDistrictData = activeTab === "district" && selected ? districtData[selected] : null;

  /* ── Selected item's colour & districts ───────────────────────────── */
  const selectedItemMeta = useMemo(() => {
    if (activeTab === "district" || !selectedItem) return null;
    const districts = selectedItem.districts || selectedItem.stops?.map(s => s.district) || [];
    return { color: selectedItem.color, districts };
  }, [activeTab, selectedItem]);

  /* ── Selected-item's districts list ──────────────────────────────── */
  const selectedDistricts = selectedItemMeta?.districts ?? [];

  /* ── Compute which side to show panel for non-district tabs ─────── */
  useEffect(() => {
    if (activeTab === 'district' || !selectedItem) { setNonDistrictSide('right'); return; }
    
    // If a district within classification is selected, calculate side based on that district's centroid
    if (selectedDistrictInClass) {
      const d = districtPaths.find(p => p.name === selectedDistrictInClass);
      if (d) {
        setNonDistrictSide(d.centroid.cx > W / 2 ? 'left' : 'right');
        return;
      }
    }

    const districts = selectedItem.districts || selectedItem.stops?.map(s => s.district) || [];
    const relevantPaths = districtPaths.filter(d => districts.includes(d.name));
    if (relevantPaths.length === 0) { setNonDistrictSide('right'); return; }
    const avgCx = relevantPaths.reduce((sum, d) => sum + d.centroid.cx, 0) / relevantPaths.length;
    setNonDistrictSide(avgCx > W / 2 ? 'left' : 'right');
  }, [activeTab, selectedItem, selectedDistrictInClass, districtPaths]);

  /* ── Active Side for map translation ─────────────────────────────── */
  const activeSide = useMemo(() => {
    if (activeTab === "district" && selected && clickTooltip?.side) {
      return clickTooltip.side;
    }
    if (activeTab !== "district" && selectedItem) {
      return nonDistrictSide;
    }
    return null;
  }, [activeTab, selected, clickTooltip, selectedItem, nonDistrictSide]);

  // a panel is always open on desktop (idle stats card sits on the right), so keep the map beside it
  const mapShiftX = activeSide === "left" ? 215 : -215;

  /* ── Active District for SVG Markers ─────────────────────────────── */
  const activeDistrictForMarkers = activeTab === "district" ? selected : selectedDistrictInClass;
  const selectedDistrictMarkers = useMemo(() => {
    const data = activeDistrictForMarkers && districtData[activeDistrictForMarkers];
    if (!data) return [];
    const centroid = districtPaths.find((d) => d.name === activeDistrictForMarkers)?.centroid;
    return [...data.sites, ...data.digs]
      .map((s, i) => {
        if (s.coordinates?.lat && s.coordinates?.lng) return { ...s, ...project(s.coordinates.lng, s.coordinates.lat) };
        if (!centroid) return null;
        // no coordinates: spread around the district centre so pins don't stack
        const angle = i * 2.4;
        return { ...s, x: centroid.cx + Math.cos(angle) * (6 + i), y: centroid.cy + Math.sin(angle) * (6 + i) };
      })
      .filter(Boolean);
  }, [activeDistrictForMarkers, districtData, districtPaths]);

  /* ── Event handlers ───────────────────────────────────────────────── */
  const closeClickTooltip = useCallback(() => {
    setClickTooltip(null);
    setSelected(null);
    setSelectedDistrictInClass(null);
  }, []);

  const handleDistrictClick = useCallback((name, centroid) => {
    if (activeTab === "district") {
      if (selected === name) {
        setSelected(null);
        setClickTooltip(null);
      } else {
        setSelected(name);
        setHoveredDistrict(null);
        const side = centroid.cx > W / 2 ? 'left' : 'right';
        setClickTooltip({ name, side });
      }
    } else {
      // Classification tabs: Cultural Zones, Historical Regions, Circuits
      const items = panelDatasets[activeTab] || [];
      const current = items.find(i => i.id === selected);
      const currentDistricts = current ? (current.districts || current.stops?.map(s => s.district) || []) : [];

      if (current && currentDistricts.includes(name)) {
        // District belongs to current classification: toggle district view
        setSelectedDistrictInClass(prev => (prev === name ? null : name));
      } else {
        // Find which classification item this district belongs to
        const matchingItem = items.find(item => {
          const dList = item.districts || item.stops?.map(s => s.district) || [];
          return dList.includes(name);
        });

        if (matchingItem) {
          setSelected(matchingItem.id);
          setSelectedDistrictInClass(name);
        } else if (current) {
          setSelectedDistrictInClass(prev => (prev === name ? null : name));
        }
      }
    }
  }, [activeTab, selected, panelDatasets]);

  /* ── Colour for each district path ───────────────────────────────── */
  const getDistrictStyle = (name) => {
    const isDistrictSelected = activeTab === "district" && selected === name;
    const isFocusedInClass = activeTab !== "district" && selectedDistrictInClass === name;
    const isHovered = hoveredDistrict === name;
    const hasSelection = !!selectedItemMeta;
    const isHighlighted = hasSelection && selectedDistricts.includes(name);
    const accentColor = selectedItemMeta?.color || "#C56A3D";

    if (isDistrictSelected || isFocusedInClass) {
      return {
        fill: "#F7E8C8",
        stroke: accentColor,
        strokeWidth: 2.6,
        strokeOpacity: 1,
        filter: "url(#sel-shadow)"
      };
    }
    if (isHighlighted) {
      if (isHovered) {
        return {
          fill: hexToRgba(accentColor, 0.7),
          stroke: accentColor,
          strokeWidth: 2,
          strokeOpacity: 1,
          filter: "url(#sel-shadow)"
        };
      }
      return {
        fill: hexToRgba(accentColor, 0.45),
        stroke: accentColor,
        strokeWidth: 1.6,
        strokeOpacity: 0.95
      };
    }
    if (isHovered) {
      return { fill: "#FFF3E0", stroke: "#C56A3D", strokeWidth: 1.3, strokeOpacity: 0.9 };
    }
    if (activeTab === "district") {
      return { fill: "#FFFFFF", stroke: "#C8A882", strokeWidth: 0.7, strokeOpacity: 0.55 };
    }
    if (hasSelection) {
      return { fill: "#E1D5C5", stroke: "#AFA08C", strokeWidth: 0.8, strokeOpacity: 0.85 };
    }
    return { fill: "#FFFFFF", stroke: "#C8A882", strokeWidth: 0.7, strokeOpacity: 0.55 };
  };

  /* ── Sorted paths — selected district on top ──────────────────────── */
  const activeSelectedName = activeTab === "district" ? selected : selectedDistrictInClass;
  const sortedPaths = useMemo(() => {
    if (!activeSelectedName) return districtPaths;
    const top = districtPaths.find(d => d.name === activeSelectedName);
    const rest = districtPaths.filter(d => d.name !== activeSelectedName);
    return top ? [...rest, top] : districtPaths;
  }, [districtPaths, activeSelectedName]);

  /* ── Total sites count ────────────────────────────────────────────── */
  const stats = useMemo(() => ({
    districts: districtPaths.length,
    protected: protectedSites.length,
    digs: excavations.length,
    zones: culturalZones.length,
    unesco: protectedSites.filter((s) => s.managed_by === "unesco").length,
  }), [districtPaths, protectedSites, excavations]);

  /* ═══════════════════════════════════════════════════════════════════ */
  return (
    <section
      className="relative w-full overflow-hidden border-t border-b border-[#E8DFC8]/50"
      style={{ backgroundColor: '#FAF6EF' }}
    >
      {/* Background Image with soft elegant opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-50"
        style={{ backgroundImage: `url(${mapBackground})` }}
      />

      {/* Soft parchment brightening overlay */}
      <div className="absolute inset-0 bg-[#FFFDF9]/40 pointer-events-none" />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "radial-gradient(#8B5E3C 1px, transparent 0)", backgroundSize: "32px 32px" }} />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center pt-10 pb-6 px-4">
        <span className="text-[10px] font-sans font-bold tracking-[0.35em] uppercase text-[#C56A3D] mb-2 block">
          Interactive Map
        </span>
        <h2 className="text-3xl md:text-[2.6rem] font-serif font-black text-[#2C2419] leading-tight mb-2">
          Bihar Heritage Atlas
        </h2>
        <p className="text-[#6B5744] text-xs md:text-sm font-sans max-w-xl mx-auto leading-relaxed">
          Explore Bihar's cultural landscape across districts, civilisations, geographies and pilgrimage routes.
        </p>
      </div>

      {/* ── Classification Tabs ─────────────────────────────────────── */}
      <div className="relative z-10 px-4 pb-3 flex justify-center">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar bg-[#F5EDD9]/80 border border-[#D8CAB0] rounded-2xl p-1.5 shadow-sm max-w-full">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-shrink-0 px-3.5 py-1.5 rounded-xl text-[11px] md:text-xs font-sans font-semibold transition-all duration-200 whitespace-nowrap"
                style={active
                  ? { backgroundColor: "#C56A3D", color: "#FFFBF5", boxShadow: "0 2px 8px rgba(197,106,61,0.35)" }
                  : { color: "#7A5633", backgroundColor: "transparent" }
                }
              >
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Classification legend pills ────────────────────────────── */}
      {activeTab !== "district" && (
        <div className="relative z-10 px-4 pb-4 flex justify-center">
          <div className="flex flex-wrap justify-center gap-1.5 max-w-3xl">
            {({
              cultural: culturalZones,
              historical: historicalRegions,
              circuit: heritageCircuits,
            }[activeTab] || []).map(item => {
              const isActive = selected === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setSelected(prev => {
                      if (prev === item.id) {
                        setSelectedDistrictInClass(null);
                        return null;
                      }
                      setSelectedDistrictInClass(null);
                      return item.id;
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-sans font-semibold border transition-all duration-200"
                  style={isActive
                    ? { backgroundColor: item.color, color: "#fff", borderColor: item.color, boxShadow: `0 2px 10px ${hexToRgba(item.color, 0.4)}` }
                    : { backgroundColor: "#F5EDD9", color: "#6B5744", borderColor: "#D8CAB0" }
                  }
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: isActive ? "#fff" : item.color }} />
                  {item.label}
                  {isActive && <X className="w-2.5 h-2.5 ml-0.5 opacity-80" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MAP + SIDE PANEL LAYOUT ──────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-6 pb-6 min-h-[620px] flex justify-center items-center">
        
        {/* ── LEFT side panel slot (Absolute on Desktop, larger width) ── */}
        <div className="hidden lg:block absolute left-3 xl:left-8 top-8 z-40 w-[380px] xl:w-[430px]">
          <AnimatePresence mode="wait">
            {activeTab === "district" && clickTooltip?.side === 'left' && selectedDistrictData && (
              <motion.div
                key={`left-district-${clickTooltip.name}`}
                initial={{ opacity: 0, x: -30, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.96 }}
                transition={springConfig}
              >
                <DistrictTooltipCard
                  data={selectedDistrictData}
                  name={clickTooltip.name}
                  side="left"
                  onClose={closeClickTooltip}
                />
              </motion.div>
            )}

            {activeTab !== "district" && nonDistrictSide === 'left' && selectedItem && (
              <motion.div
                key={`left-${activeTab}-${selected}`}
                initial={{ opacity: 0, x: -30, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.96 }}
                transition={springConfig}
              >
                <ClassificationPanel
                  item={selectedItem}
                  activeTab={activeTab}
                  side="left"
                  selectedDistrict={selectedDistrictInClass}
                  onSelectDistrict={(d) => setSelectedDistrictInClass(d)}
                  onClearDistrict={() => setSelectedDistrictInClass(null)}
                  onClose={() => { setSelected(null); setSelectedDistrictInClass(null); }}
                  allDistrictData={districtData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── MAP (Smoothly translates on active side to give breathing room) ── */}
        <motion.div
          ref={svgContainerRef}
          className="relative w-full"
          style={{ maxWidth: isMobile ? 880 : "min(880px, calc(100% - 470px))" }}
          animate={{ x: isMobile ? 0 : mapShiftX }}
          transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
          onMouseLeave={() => setHoveredDistrict(null)}
        >
          <svg viewBox="0 0 800 620" className="w-full h-auto drop-shadow-sm select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="sel-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* District paths */}
            <g>
              {sortedPaths.map((d) => {
                const style = getDistrictStyle(d.name);
                return (
                  <path
                    key={d.id}
                    d={d.path}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    strokeOpacity={style.strokeOpacity}
                    filter={style.filter}
                    strokeLinejoin="round"
                    className="transition-all duration-300 ease-out cursor-pointer"
                    onMouseEnter={() => {
                      if (d.name !== selected && d.name !== selectedDistrictInClass) {
                        setHoveredDistrict(d.name);
                      }
                    }}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    onClick={() => handleDistrictClick(d.name, d.centroid)}
                  />
                );
              })}
            </g>

            {/* Heritage site markers (District tab OR focused district in classification) */}
            <AnimatePresence>
              {selectedDistrictMarkers.map((m, i) => (
                <motion.g
                  key={`mk-${activeDistrictForMarkers}-${m.kind}-${m.id ?? i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ ...springConfig, delay: i * 0.04 }}
                >
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r="8"
                    fill="none"
                    stroke={selectedItemMeta?.color || "#C56A3D"}
                    strokeWidth="1.5"
                    opacity="0.35"
                    className="animate-pulse"
                    style={{ transformOrigin: `${m.x}px ${m.y}px` }}
                  />
                  {m.kind === "excavation" ? (
                    <rect
                      x={m.x - 4.5}
                      y={m.y - 4.5}
                      width="9"
                      height="9"
                      fill="#C2A55D"
                      stroke="#FFFDF9"
                      strokeWidth="1.8"
                      transform={`rotate(45 ${m.x} ${m.y})`}
                    />
                  ) : m.kind === "exploration" ? (
                    <circle cx={m.x} cy={m.y} r="4.5" fill="#FFFDF9" stroke="#7A5633" strokeWidth="2.2" />
                  ) : (
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r="5"
                      fill={selectedItemMeta?.color || "#C56A3D"}
                      stroke="#FFFDF9"
                      strokeWidth="2"
                    />
                  )}
                  <title>{`${m.title} — ${m.kind === "protected" ? "Protected Site" : m.category}`}</title>
                </motion.g>
              ))}
            </AnimatePresence>

            {/* District name labels — highlighted districts (non-district tabs) */}
            <AnimatePresence>
              {activeTab !== "district" && selectedItemMeta && districtPaths
                .filter(d => selectedDistricts.includes(d.name))
                .map((d) => {
                  const { cx, cy } = d.centroid;
                  const label = d.name.length > 12 ? d.name.split(" ")[0] : d.name;
                  const isFocused = selectedDistrictInClass === d.name;
                  return (
                    <motion.g
                      key={`lbl-${d.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ pointerEvents: "none" }}
                    >
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={isFocused ? "10.5" : "9"}
                        fontWeight={isFocused ? "900" : "700"}
                        fontFamily="Poppins, sans-serif"
                        fill="#ffffff"
                        stroke="#ffffff"
                        strokeWidth={isFocused ? "4" : "3"}
                        strokeLinejoin="round"
                        paintOrder="stroke"
                      >
                        {label}
                      </text>
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={isFocused ? "10.5" : "9"}
                        fontWeight={isFocused ? "900" : "700"}
                        fontFamily="Poppins, sans-serif"
                        fill={isFocused ? "#2C2419" : selectedItemMeta.color}
                      >
                        {label}
                      </text>
                    </motion.g>
                  );
                })
              }
            </AnimatePresence>

            {/* District name labels — all districts on district tab */}
            {activeTab === "district" && (
              <g style={{ pointerEvents: "none" }}>
                {districtPaths.filter(d => d.name !== selected).map((d) => {
                  const { cx, cy } = d.centroid;
                  const label = d.name.length > 10 ? d.name.split(" ")[0] : d.name;
                  const isHovered = hoveredDistrict === d.name;
                  return (
                    <g key={`all-lbl-${d.id}`}>
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={isHovered ? "9.5" : "7.5"} fontWeight="700" fontFamily="Poppins, sans-serif" fill="#ffffff" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" style={{ transition: "all 0.2s ease" }}>
                        {label}
                      </text>
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={isHovered ? "9.5" : "7.5"} fontWeight="700" fontFamily="Poppins, sans-serif" fill={isHovered ? "#C56A3D" : "#6B4C2A"} opacity={isHovered ? 1 : 0.75} style={{ transition: "all 0.2s ease" }}>
                        {label}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
          {selectedDistrictMarkers.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-sans text-[#6B5744]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C56A3D] ring-2 ring-white" />Protected Site</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rotate-45 bg-[#C2A55D] ring-2 ring-white" />Excavation</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-[#7A5633] bg-white" />Exploration</span>
            </div>
          )}

          {/* Smooth hover tooltip */}
          <HoverTooltip
            hoveredDistrict={hoveredDistrict}
            selected={activeTab === "district" ? selected : selectedDistrictInClass}
            selectedItem={selectedItem}
            selectedDistricts={selectedDistricts}
            activeTab={activeTab}
            containerRef={svgContainerRef}
          />
        </motion.div>

        {/* ── RIGHT side panel slot (Absolute on Desktop, larger width) ── */}
        <div className="hidden lg:block absolute right-3 xl:right-8 top-8 z-40 w-[380px] xl:w-[430px]">
          <AnimatePresence mode="wait">
            {activeTab === "district" && clickTooltip?.side === 'right' && selectedDistrictData && (
              <motion.div
                key={`right-district-${clickTooltip.name}`}
                initial={{ opacity: 0, x: 30, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.96 }}
                transition={springConfig}
              >
                <DistrictTooltipCard
                  data={selectedDistrictData}
                  name={clickTooltip.name}
                  side="right"
                  onClose={closeClickTooltip}
                />
              </motion.div>
            )}

            {activeTab !== "district" && nonDistrictSide === 'right' && selectedItem && (
              <motion.div
                key={`right-${activeTab}-${selected}`}
                initial={{ opacity: 0, x: 30, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.96 }}
                transition={springConfig}
              >
                <ClassificationPanel
                  item={selectedItem}
                  activeTab={activeTab}
                  side="right"
                  selectedDistrict={selectedDistrictInClass}
                  onSelectDistrict={(d) => setSelectedDistrictInClass(d)}
                  onClearDistrict={() => setSelectedDistrictInClass(null)}
                  onClose={() => { setSelected(null); setSelectedDistrictInClass(null); }}
                  allDistrictData={districtData}
                />
              </motion.div>
            )}

            {!selected && !selectedDistrictInClass && (
              <IdleStatsCard key="idle-stats-right" activeTab={activeTab} stats={stats} />
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* ── Mobile Side Panel (Below map on small screens) ───────────── */}
      <div className="lg:hidden px-4 pb-6">
        <AnimatePresence mode="wait">
          {activeTab === "district" && selected && selectedDistrictData && (
            <motion.div
              key={`mobile-district-${selected}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={springConfig}
            >
              <DistrictTooltipCard
                data={selectedDistrictData}
                name={selected}
                side="bottom"
                onClose={closeClickTooltip}
              />
            </motion.div>
          )}

          {activeTab !== "district" && selectedItem && (
            <motion.div
              key={`mobile-${activeTab}-${selected}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={springConfig}
            >
              <ClassificationPanel
                item={selectedItem}
                activeTab={activeTab}
                side="bottom"
                selectedDistrict={selectedDistrictInClass}
                onSelectDistrict={(d) => setSelectedDistrictInClass(d)}
                onClearDistrict={() => setSelectedDistrictInClass(null)}
                onClose={() => { setSelected(null); setSelectedDistrictInClass(null); }}
                allDistrictData={districtData}
              />
            </motion.div>
          )}

          {!selected && !selectedDistrictInClass && (
            <IdleStatsCard key="idle-stats-mobile" activeTab={activeTab} stats={stats} />
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom stats bar removed in favor of idle side panel ──────── */}

      <style>{`
        .atlas-scroll::-webkit-scrollbar { width: 5px; }
        .atlas-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.03); border-radius: 4px; }
        .atlas-scroll::-webkit-scrollbar-thumb { background: rgba(197, 106, 61, 0.45); border-radius: 4px; }
        .atlas-scroll::-webkit-scrollbar-thumb:hover { background: #C56A3D; }
      `}</style>
    </section>
  );
};

export default BiharHeritageMaps;
