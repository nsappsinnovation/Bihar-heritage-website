import React from 'react';
import { useInView } from 'react-intersection-observer';

// Category color map
const CATEGORY_STYLES = {
  'art-craft':        { bg: 'rgba(169,111,69,0.12)', text: '#A96F45', border: 'rgba(169,111,69,0.3)' },
  'festivals-rituals':{ bg: 'rgba(158,63,50,0.12)',  text: '#9E3F32', border: 'rgba(158,63,50,0.3)' },
  'music':            { bg: 'rgba(92,58,36,0.10)',   text: '#5C3A24', border: 'rgba(92,58,36,0.25)' },
  'dance-theatre':    { bg: 'rgba(196,154,82,0.15)', text: '#8B6A1E', border: 'rgba(196,154,82,0.35)' },
  'oral-traditions':  { bg: 'rgba(51,37,29,0.10)',   text: '#33251D', border: 'rgba(51,37,29,0.2)' },
  'food-customs':     { bg: 'rgba(123,143,93,0.12)', text: '#5A6B3A', border: 'rgba(123,143,93,0.3)' },
};

// Image placeholder (when imageStatus === NEEDS_IMAGE)
const ImagePlaceholder = ({ title }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center"
    style={{ background: 'linear-gradient(135deg, #EDE0C8 0%, #E0CEAE 100%)' }}
  >
    <svg viewBox="0 0 60 60" style={{ width: 36, height: 36, opacity: 0.3, marginBottom: 8 }}>
      <g fill="none" stroke="#A96F45" strokeWidth="1.2">
        {[0, 60, 120, 180, 240, 300].map(d => (
          <g key={d} transform={`rotate(${d} 30 30)`}>
            <path d="M30 12 Q36 21 30 26 Q24 21 30 12 Z" fill="#A96F45" opacity="0.3" />
          </g>
        ))}
        <circle cx="30" cy="30" r="8" />
        <circle cx="30" cy="30" r="3" fill="#A96F45" opacity="0.3" />
      </g>
    </svg>
    <span className="text-[10px] font-sans text-center px-4 leading-snug" style={{ color: '#A96F45', opacity: 0.7 }}>
      {title}
    </span>
    <span className="text-[9px] font-sans mt-1" style={{ color: '#A96F45', opacity: 0.45 }}>
      Image needed
    </span>
  </div>
);

const HeritageCard = ({ heritage, featured = false, onClick, index = 0 }) => {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true });
  const styles = CATEGORY_STYLES[heritage.category] || CATEGORY_STYLES['art-craft'];
  const hasImage = heritage.resolvedImage && heritage.imageStatus !== 'NEEDS_IMAGE';

  const categoryLabels = {
    'art-craft': 'Art & Craft',
    'festivals-rituals': 'Festivals & Rituals',
    'music': 'Music',
    'dance-theatre': 'Dance & Theatre',
    'oral-traditions': 'Oral Traditions',
    'food-customs': 'Food & Customs',
  };

  return (
    <article
      ref={ref}
      onClick={() => onClick && onClick(heritage)}
      className="lh-card group cursor-pointer overflow-hidden flex flex-col rounded-2xl"
      style={{
        background: '#FFF9EE',
        border: '1px solid rgba(196,154,82,0.2)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${Math.min(index * 0.07, 0.4)}s, transform 0.7s ease ${Math.min(index * 0.07, 0.4)}s`,
      }}
      role="button"
      aria-label={`Explore ${heritage.title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(heritage)}
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden flex-shrink-0 rounded-t-2xl"
        style={{ height: featured ? 280 : 220 }}
      >
        {hasImage ? (
          <img loading="lazy" decoding="async"
            src={heritage.resolvedImage}
            alt={heritage.title}
            data-no-lightbox="true"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] rounded-t-2xl"
          />
        ) : (
          <ImagePlaceholder title={heritage.title} />
        )}

        {/* Gradient overlay */}
        {hasImage && (
          <div
            className="absolute inset-0 rounded-t-2xl"
            style={{ background: 'linear-gradient(to top, rgba(33,18,8,0.5) 0%, transparent 55%)' }}
          />
        )}

        {/* Category badge on image */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[9px] font-sans font-bold tracking-[0.2em] uppercase px-2.5 py-1 backdrop-blur-sm rounded-full"
            style={{
              background: styles.bg,
              color: styles.text,
              border: `1px solid ${styles.border}`,
            }}
          >
            {categoryLabels[heritage.category] || heritage.category}
          </span>
        </div>
      </div>


      {/* Content area */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        {/* Title */}
        <h3
          className="font-['Playfair_Display',serif] font-bold leading-tight mb-3 transition-colors duration-300 group-hover:text-[#A96F45]"
          style={{
            fontSize: featured ? 'clamp(1.1rem, 1.8vw, 1.4rem)' : 'clamp(0.98rem, 1.4vw, 1.2rem)',
            color: '#33251D',
          }}
        >
          {heritage.title}
        </h3>

        {/* Short description */}
        <p
          className="font-sans leading-relaxed flex-1 mb-4"
          style={{
            fontSize: '0.82rem',
            color: '#5C3A24',
            opacity: 0.8,
            display: '-webkit-box',
            WebkitLineClamp: featured ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {heritage.shortDescription}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-4"
          style={{ borderTop: '1px solid rgba(196,154,82,0.2)' }}
        >
          {/* Region */}
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 12 12" style={{ width: 10, height: 10, opacity: 0.5 }}>
              <path d="M6 1C4.34 1 3 2.34 3 4c0 2.5 3 7 3 7s3-4.5 3-7c0-1.66-1.34-3-3-3zm0 4a1 1 0 110-2 1 1 0 010 2z" fill="#A96F45" />
            </svg>
            <span className="text-[10px] font-sans tracking-[0.08em] uppercase" style={{ color: '#A96F45', opacity: 0.8 }}>
              {heritage.region}
            </span>
          </div>

          {/* Explore arrow */}
          <span
            className="flex items-center gap-1.5 text-[11px] font-sans font-semibold tracking-[0.1em] uppercase transition-all duration-300"
            style={{ color: '#9E3F32' }}
          >
            Explore
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

export default HeritageCard;
