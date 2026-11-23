import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Compass,
  Calendar,
  Landmark,
  Building2,
  FileText,
  ExternalLink,
} from "lucide-react";

import detailMap from "../data/detailedInfo.json";
import { siteMetadata } from "../data/siteMetadata";
import { defaultExcavations } from "../data/defaults/defaultExcavations";
import { getData } from "../utils/cmsStorage";
import { resolveImage, fallbackHeritageImage } from "../utils/heritageImages";
import { findExcavationBySlug } from "../utils/excavationLinks";
import { safeHref } from "../utils/safeUrl";

/**
 * Turn the flat `details` string into structured blocks.
 *
 * The source text mixes plain paragraphs, "Heading:" lines and "- bullet" lines,
 * so parse line-by-line rather than only splitting on blank lines.
 */
const parseDetails = (text = "") => {
  const blocks = [];
  let list = null;

  const flushList = () => {
    if (list && list.items.length) blocks.push(list);
    list = null;
  };

  text.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    if (/^[-•*]\s+/.test(line)) {
      if (!list) list = { type: "list", items: [] };
      list.items.push(line.replace(/^[-•*]\s+/, ""));
      return;
    }

    flushList();

    // A short line ending in a colon reads as a section heading, not a sentence.
    if (line.endsWith(":") && line.length < 90) {
      blocks.push({ type: "heading", text: line.replace(/:$/, "") });
      return;
    }

    const previous = blocks[blocks.length - 1];
    if (previous?.type === "paragraph") {
      previous.text = `${previous.text} ${line}`;
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  });

  flushList();
  return blocks;
};

const Reveal = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const RecordField = ({ icon: Icon, label, value, accent = false }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-sans font-bold flex items-center gap-1.5">
      <Icon size={11} className="text-brand-accent shrink-0" />
      {label}
    </span>
    <span
      className={`text-sm font-semibold ${
        accent ? "text-brand-accent font-sans" : "text-text-primary font-serif"
      }`}
    >
      {value}
    </span>
  </div>
);

const ExcavationDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const item = useMemo(() => {
    const records = getData("bh_excavation_sites", defaultExcavations).filter(
      (record) => record.status !== "Draft" && record.status !== "Archived"
    );
    return (
      findExcavationBySlug(records, slug) ||
      findExcavationBySlug(defaultExcavations, slug)
    );
  }, [slug]);

  const isExcavation = (item?.type || "excavation") === "excavation";
  const fallbackMeta = siteMetadata[item?.title] || {};

  const detailsText =
    item?.details ||
    detailMap[item?.title]?.details ||
    item?.description ||
    "No detailed description available for this record yet.";

  const blocks = useMemo(() => parseDetails(detailsText), [detailsText]);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
        <span className="text-brand-accent text-xs font-sans font-bold uppercase tracking-[0.25em] mb-3">
          Archival Record
        </span>
        <h2 className="text-3xl font-serif font-bold text-text-primary mb-3">
          Record Not Found
        </h2>
        <p className="text-sm text-text-secondary font-sans max-w-md mb-8">
          This excavation record does not exist, or it has been unpublished from the archive.
        </p>
        <button
          onClick={() => navigate("/excavations")}
          className="px-6 py-3 rounded-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-sans font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          Browse All Excavations
        </button>
      </div>
    );
  }

  const heroImage = resolveImage(item.image);
  const coords = item.coords || fallbackMeta.coords;
  const period = item.period || fallbackMeta.period || "Ancient Era";
  const classification = item.district
    ? `${item.district} District`
    : fallbackMeta.category || "Historical Site";
  const leadAgency = item.lead_agency || fallbackMeta.excavation || "Documented Excavation";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: item.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-text-primary pt-28 md:pt-36 pb-28 relative overflow-hidden">
      {/* Reading progress */}
      <div
        style={{ transform: `scaleX(${progress})`, transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-brand-accent z-50 transition-transform duration-75"
      />

      {/* Editorial grid wash */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `100px 100px`,
        }}
      />

      <div className="relative z-10 max-w-[calc((100%+1050px)/2)] mx-auto px-1.5 md:px-2.5">

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-5 mb-10">
          <Link
            to={isExcavation ? "/excavations" : "/excavations?tab=exploration"}
            className="flex items-center gap-2 text-xs md:text-sm font-sans font-bold uppercase tracking-wider text-text-primary hover:text-brand-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isExcavation ? "Back to Excavations" : "Back to Explorations"}</span>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider text-text-secondary hover:text-brand-accent transition-colors cursor-pointer"
            aria-label="Share record"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">Share</span>
          </button>
        </div>

        {/* Title block */}
        <Reveal className="mb-8">
          <span className="text-brand-accent text-[11px] md:text-xs font-sans font-bold uppercase tracking-[0.25em] block mb-3">
            {isExcavation ? "Excavation Record File" : "Exploration Record File"}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary leading-tight tracking-tight mb-4">
            {item.title}
          </h1>
          <p className="text-xs md:text-sm font-sans font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <MapPin size={14} className="text-brand-accent shrink-0" />
            {item.location || (item.district ? `${item.district}, Bihar` : "Bihar, India")}
          </p>
        </Reveal>

        {/* Hero plate */}
        <Reveal className="mb-10">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-brand-border/60 shadow-md group bg-brand-alt/30">
            <img loading="lazy" decoding="async"
              src={heroImage}
              alt={item.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackHeritageImage;
              }}
              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />

            <div className="absolute top-4 left-4 bg-brand-accent/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
              <Compass size={12} className="text-white" />
              <span className="text-[9px] font-sans font-bold tracking-widest text-white uppercase">
                {isExcavation ? "Excavation Site" : "Exploration Study"}
              </span>
            </div>

            {coords && (
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3.5 py-2 flex flex-col gap-0.5">
                <span className="text-[9px] font-sans font-bold tracking-widest text-brand-gold uppercase">
                  Location / Coordinates
                </span>
                <span className="text-xs font-mono font-medium text-white/95">{coords}</span>
              </div>
            )}
          </div>
        </Reveal>

        {/* Record metadata — the fields the home carousel no longer duplicates */}
        <Reveal className="mb-12">
          <div className="bg-white border border-brand-border/70 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <RecordField icon={Calendar} label="Historical Era" value={period} />
              <RecordField icon={Landmark} label="District / Classification" value={classification} />
              <RecordField
                icon={FileText}
                label="Documentation Status"
                value={isExcavation ? "Excavation File" : "Exploration Study"}
                accent
              />
              <RecordField icon={Building2} label="Lead Agency" value={leadAgency} />
            </div>

            {item.map_url && (
              <a
                href={safeHref(item.map_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-7 pt-6 border-t border-brand-border/60 text-xs font-sans font-bold uppercase tracking-wider text-brand-accent hover:text-brand-accent-hover transition-colors"
              >
                <span>View on Map</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </Reveal>

        {/* Summary */}
        {item.description && (
          <Reveal className="mb-12">
            <p className="font-serif text-lg md:text-2xl leading-[1.6] text-text-primary/90 border-l-2 border-brand-accent/50 pl-6">
              {item.description}
            </p>
          </Reveal>
        )}

        {/* Full archival narrative */}
        <Reveal>
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-brand-accent block mb-6 pb-4 border-b border-brand-border/60">
            Archival Records
          </span>

          <div className="max-w-[820px]">
            {blocks.map((block, idx) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={idx}
                    className="font-serif text-xl md:text-2xl font-bold text-text-primary mt-10 mb-4 first:mt-0"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "list") {
                return (
                  <ul key={idx} className="space-y-2.5 mb-6 pl-5 list-disc marker:text-brand-accent">
                    {block.items.map((entry, i) => (
                      <li
                        key={i}
                        className="font-sans text-[15px] md:text-base leading-[1.8] text-text-secondary font-light"
                      >
                        {entry}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={idx}
                  className="font-sans text-[15px] md:text-base leading-[1.85] text-text-secondary font-light mb-6"
                >
                  {block.text}
                </p>
              );
            })}
          </div>
        </Reveal>

        {/* Signature footer */}
        <div className="mt-16 pt-6 border-t border-brand-border/60">
          <p className="text-[9px] text-text-muted font-sans uppercase tracking-[0.2em] mb-1">
            Official Documentation Of
          </p>
          <p className="text-sm text-brand-gold font-bold font-serif">
            Bihar Heritage Development Society
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExcavationDetail;
