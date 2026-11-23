import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_LABELS = {
  'art-craft': 'Art & Craft',
  'festivals-rituals': 'Festivals & Rituals',
  'music': 'Music',
  'dance-theatre': 'Dance & Theatre',
  'oral-traditions': 'Oral Traditions',
  'food-customs': 'Food & Customs',
};

const CATEGORY_COLORS = {
  'art-craft': '#A96F45',
  'festivals-rituals': '#9E3F32',
  'music': '#5C3A24',
  'dance-theatre': '#8B6A1E',
  'oral-traditions': '#33251D',
  'food-customs': '#5A6B3A',
};

const HeritageDetailModal = ({ heritage, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const hasImage = heritage.resolvedImage && heritage.imageStatus !== 'NEEDS_IMAGE';
  const catColor = CATEGORY_COLORS[heritage.category] || '#A96F45';
  const catLabel = CATEGORY_LABELS[heritage.category] || heritage.category;

  return (
    <AnimatePresence>
      <motion.div
        id="heritage-detail-modal"
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(33,18,8,0.65)', backdropFilter: 'blur(4px)' }}
        />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full max-w-[900px] max-h-[92vh] md:max-h-[90vh] overflow-y-auto rounded-[24px] bg-[#F7EEDC] shadow-2xl flex-shrink-0 border border-[#E8DFC8]/60"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image header */}
          <div className="relative" style={{ height: hasImage ? 360 : 180 }}>
            {hasImage ? (
              <>
                <img loading="lazy" decoding="async"
                  src={heritage.resolvedImage}
                  alt={heritage.title}
                  data-no-lightbox="true"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(33,18,8,0.75) 0%, rgba(33,18,8,0.1) 60%)' }}
                />
              </>
            ) : (
              <div style={{ height: '100%', background: 'linear-gradient(135deg, #EDE0C8, #D4B87A)' }} />
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close heritage detail"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center transition-colors duration-200 rounded-full"
              style={{
                background: 'rgba(33,18,8,0.5)',
                border: '1px solid rgba(196,154,82,0.4)',
                color: '#F4E4C1',
              }}
            >
              <svg viewBox="0 0 14 14" className="w-3.5 h-3.5">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {/* Title overlay on image */}
            {hasImage && (
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                  className="inline-block text-[9px] font-sans font-bold tracking-[0.25em] uppercase px-2.5 py-1 mb-3 rounded-full"
                  style={{ background: `${catColor}25`, color: '#F4E4C1', border: `1px solid rgba(255,255,255,0.2)` }}
                >
                  {catLabel}
                </span>
                <h2
                  className="font-['Playfair_Display','Cinzel',serif] font-bold leading-tight text-white"
                  style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
                >
                  {heritage.title}
                </h2>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Title (no image variant) */}
            {!hasImage && (
              <>
                <span
                  className="inline-block text-[9px] font-sans font-bold tracking-[0.25em] uppercase px-2.5 py-1 mb-4 rounded-full"
                  style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}30` }}
                >
                  {catLabel}
                </span>
                <h2
                  className="font-['Playfair_Display','Cinzel',serif] font-bold leading-tight mb-5"
                  style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#33251D' }}
                >
                  {heritage.title}
                </h2>
              </>
            )}

            {/* Region */}
            <div className="flex items-center gap-2 mb-6 mt-2">
              <svg viewBox="0 0 12 12" style={{ width: 12, height: 12 }}>
                <path d="M6 1C4.34 1 3 2.34 3 4c0 2.5 3 7 3 7s3-4.5 3-7c0-1.66-1.34-3-3-3zm0 4a1 1 0 110-2 1 1 0 010 2z" fill="#A96F45" />
              </svg>
              <span className="text-[11px] font-sans tracking-[0.1em] uppercase" style={{ color: '#A96F45' }}>
                {heritage.region}
              </span>
            </div>

            {/* Divider */}
            <div className="mb-6 h-px" style={{ background: 'linear-gradient(90deg, rgba(196,154,82,0.4), transparent)' }} />

            {/* Short intro */}
            <p
              className="font-['Playfair_Display',serif] italic leading-relaxed mb-7"
              style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: '#5C3A24' }}
            >
              {heritage.shortDescription}
            </p>

            {/* About section */}
            <div className="mb-7">
              <h3
                className="font-['Cinzel',serif] font-bold mb-3"
                style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#A96F45' }}
              >
                About the Tradition
              </h3>
              <p className="font-sans leading-[1.85] text-sm" style={{ color: '#33251D', opacity: 0.85 }}>
                {heritage.description}
              </p>
            </div>

            {/* Origin */}
            {heritage.origin && (
              <div className="mb-7 pl-4" style={{ borderLeft: '2px solid rgba(169,111,69,0.35)' }}>
                <h3
                  className="font-['Cinzel',serif] font-bold mb-2"
                  style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A96F45' }}
                >
                  Origin
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: '#5C3A24' }}>
                  {heritage.origin}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HeritageDetailModal;
