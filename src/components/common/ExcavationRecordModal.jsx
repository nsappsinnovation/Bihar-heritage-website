import React, { useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Landmark, Building2 } from "lucide-react";
import { useLenis } from "lenis/react";
import { createPortal } from "react-dom";

import detailMap from "../../data/detailedInfo.json";
import { resolveImage, fallbackHeritageImage } from "../../utils/heritageImages";

const ExcavationRecordModal = ({ item, activeTab, onClose }) => {
  const detailsText =
    item?.details || detailMap[item?.title]?.details || item?.description || "No detailed description available.";

  const modalRef = useRef(null);
  const lenis = useLenis();

  // Lock background scroll
  useEffect(() => {
    if (!item) return;

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
  }, [item, lenis]);

  if (!item) return null;

  const modalImg = resolveImage(item.image);
  const isExcavation = (item.type || activeTab) === "excavation";

  // Split detailsText by double newlines to process and render paragraphs beautifully
  const formattedParagraphs = detailsText.split("\n\n").map((para, index) => (
    <p
      key={index}
      className="text-text-secondary font-sans text-xs md:text-sm leading-relaxed mb-4 text-justify"
    >
      {para.trim()}
    </p>
  ));

  const modalDOM = (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Solid Backdrop Overlay */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90"
          />

          {/* Modal Container */}
          <Motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-border max-h-[85vh] flex flex-col md:flex-row text-left z-10 my-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 z-30 p-2 bg-gray-100 hover:bg-brand-accent text-text-primary hover:text-white rounded-full border border-brand-border/40 transition-all duration-300 cursor-pointer shadow-md group"
              aria-label="Close modal"
            >
              <X size={15} className="transition-transform duration-300 group-hover:rotate-90" />
            </button>

            {/* Left Column: Image Section */}
            <div className="w-full md:w-[45%] h-56 md:h-auto relative overflow-hidden bg-black flex-shrink-0">
              <img loading="lazy" decoding="async"
                src={modalImg}
                alt={item.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackHeritageImage;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-1.5">
                <span
                  className={`inline-block w-max text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold shadow-md border backdrop-blur-md ${
                    isExcavation
                      ? "bg-amber-950/90 text-amber-300 border-amber-500/50"
                      : "bg-cyan-950/90 text-cyan-300 border-cyan-500/50"
                  }`}
                >
                  {isExcavation ? "Excavation Site" : "Exploration Activity"}
                </span>
                <span className="text-white font-serif font-bold text-lg drop-shadow-md line-clamp-1">
                  {item.title}
                </span>
              </div>
            </div>

            {/* Right Column: Scrollable Document Section */}
            <div className="w-full md:w-[55%] flex flex-col overflow-hidden bg-white">
              <div
                data-lenis-prevent
                className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow flex flex-col justify-between"
              >
                <div>
                  {/* Category tag */}
                  <span className="text-[10px] font-bold font-sans tracking-[0.2em] text-brand-accent uppercase block mb-1">
                    Archaeological Record File
                  </span>

                  {/* Main Title */}
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-text-primary tracking-wide leading-tight mb-2">
                    {item.title}
                  </h2>

                  {/* Location with Pin Icon */}
                  <p className="text-xs text-text-secondary font-sans flex items-center gap-1.5 mb-4">
                    <MapPin size={13} className="text-brand-accent flex-shrink-0" />
                    {item.location || (item.district ? `${item.district}, Bihar` : "Bihar, India")}
                  </p>

                  {/* Metadata Chips Grid */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center gap-1 bg-[#FAF8F3] text-[#2F241D] border border-brand-border/60 rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wider font-sans">
                      <Landmark size={11} className="text-brand-accent" /> {item.district || "Bihar"} District
                    </span>
                    {item.period && (
                      <span className="inline-flex items-center gap-1 bg-[#FAF8F3] text-[#2F241D] border border-brand-border/60 rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wider font-sans">
                        <Calendar size={11} className="text-brand-accent" /> {item.period}
                      </span>
                    )}
                    {item.lead_agency && (
                      <span className="inline-flex items-center gap-1 bg-[#FAF8F3] text-[#2F241D] border border-brand-border/60 rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wider font-sans">
                        <Building2 size={11} className="text-brand-accent" /> {item.lead_agency}
                      </span>
                    )}
                  </div>

                  {/* Description Body */}
                  <div className="prose max-w-none text-left mt-5">
                    {formattedParagraphs}
                  </div>
                </div>

                {/* Document Signature Footer */}
                <div className="mt-8 pt-5 border-t border-brand-border/40 flex-shrink-0 text-left">
                  <p className="text-[9px] text-text-muted font-sans uppercase tracking-[0.2em] mb-0.5">
                    Official Documentation Of
                  </p>
                  <p className="text-xs text-brand-gold font-bold font-serif">
                    Bihar Heritage Development Society
                  </p>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalDOM, document.body);
};

export default ExcavationRecordModal;
