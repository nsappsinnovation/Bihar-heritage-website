import React, { memo, useMemo } from 'react';
import HeritageCard from './HeritageCard';
import { useInView } from 'react-intersection-observer';

/* ────────────────────────────────────────────────────────────────────────────
 * Static constants — created once at module load, never re-allocated on render.
 * ──────────────────────────────────────────────────────────────────────────── */

const CATEGORY_LABELS = {
  all: 'All',
  'art-craft': 'Art & Craft',
  'festivals-rituals': 'Festivals & Rituals',
  'music': 'Music',
  'dance-theatre': 'Dance & Theatre',
  'oral-traditions': 'Oral Traditions',
  'food-customs': 'Food & Customs',
};

const IN_VIEW_OPTIONS = { threshold: 0.05, triggerOnce: true };

const SECTION_STYLE = { background: '#F7EEDC' };

const TEXTURE_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='0.8' fill='%23A96F45' opacity='0.07'/%3E%3C/svg%3E")`,
  backgroundSize: '80px 80px',
};

const ACCENT_STYLE = { background: '#A96F45' };
const EYEBROW_STYLE = { color: '#A96F45' };
const HEADING_STYLE = { fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', color: '#33251D' };
const RESET_BTN_STYLE = { color: '#A96F45' };
const COUNT_STYLE = { color: '#A96F45', opacity: 0.7 };
const EMPTY_STYLE = { color: '#5C3A24', opacity: 0.6 };

const PILL_ACTIVE_STYLE = {
  background: '#A96F45',
  color: '#FFF9EE',
  border: '1px solid #A96F45',
  opacity: 0.95,
};
const PILL_INACTIVE_STYLE = {
  background: 'transparent',
  color: '#5C3A24',
  border: '1px solid rgba(169,111,69,0.35)',
  opacity: 0.95,
};

// Reveal animation styles — two fixed states per block, so they're pre-built.
const makeReveal = (offset, transition) => ({
  hidden: { opacity: 0, transform: `translateY(${offset}px)`, transition },
  visible: { opacity: 1, transform: 'translateY(0)', transition },
});
const HEADING_REVEAL = makeReveal(20, 'opacity 0.8s ease, transform 0.8s ease');
const PILLS_REVEAL = makeReveal(16, 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s');

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ────────────────────────────────────────────────────────────────────────────
 * Filter pill — memoized so clicking one pill doesn't re-render all of them
 * unnecessarily (only the previously-active and newly-active ones change).
 * ──────────────────────────────────────────────────────────────────────────── */

const CategoryPill = memo(function CategoryPill({ id, label, isActive, onSelect }) {
  return (
    <button
      id={`filter-${id}`}
      onClick={() => onSelect(id)}
      className="lh-filter-pill flex-shrink-0 text-[11px] font-sans font-semibold tracking-[0.12em] uppercase px-5 py-2.5 transition-all duration-300 rounded-full"
      style={isActive ? PILL_ACTIVE_STYLE : PILL_INACTIVE_STYLE}
    >
      {label}
    </button>
  );
});

/* ────────────────────────────────────────────────────────────────────────────
 * Section
 * ──────────────────────────────────────────────────────────────────────────── */

const HeritageFiltersGrid = ({
  categories,
  heritages,
  activeCategory,
  onCategoryChange,
  onCardClick,
  activeRegion,
  onRegionReset,
}) => {
  const { ref, inView } = useInView(IN_VIEW_OPTIONS);

  // Filtering runs only when its inputs change, not on every render
  // (e.g. when `inView` flips once on scroll).
  const filtered = useMemo(
    () =>
      heritages.filter((h) => {
        const catMatch = activeCategory === 'all' || h.category === activeCategory;
        const regionMatch = !activeRegion || h.regions?.includes(activeRegion);
        return catMatch && regionMatch;
      }),
    [heritages, activeCategory, activeRegion]
  );

  const regionLabel = useMemo(
    () => (activeRegion ? capitalize(activeRegion) : ''),
    [activeRegion]
  );

  const headingStyle = inView ? HEADING_REVEAL.visible : HEADING_REVEAL.hidden;
  const pillsStyle = inView ? PILLS_REVEAL.visible : PILLS_REVEAL.hidden;

  return (
    <section
      id="heritage-explorer"
      ref={ref}
      className="lh-explorer relative py-16 md:py-24"
      style={SECTION_STYLE}
    >
      {/* Subtle texture */}
      <div className="absolute inset-0 pointer-events-none" style={TEXTURE_STYLE} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Section heading */}
        <div className="mb-10 md:mb-14" style={headingStyle}>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8" style={ACCENT_STYLE} />
            <span
              className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase"
              style={EYEBROW_STYLE}
            >
              Heritage Archive
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="font-['Playfair_Display','Cinzel',serif] font-bold leading-tight"
              style={HEADING_STYLE}
            >
              Explore Bihar's Living Heritage
            </h2>
            {activeRegion && (
              <button
                onClick={onRegionReset}
                className="text-[11px] font-sans tracking-[0.15em] uppercase flex items-center gap-2 transition-colors hover:text-[#9E3F32]"
                style={RESET_BTN_STYLE}
              >
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Clear region filter
              </button>
            )}
          </div>
        </div>

        {/* Category filter pills */}
        <div
          className="flex gap-2 md:gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar"
          style={pillsStyle}
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              id={cat.id}
              label={CATEGORY_LABELS[cat.id] || cat.label}
              isActive={activeCategory === cat.id}
              onSelect={onCategoryChange}
            />
          ))}
        </div>

        {/* Results count */}
        {activeRegion && (
          <p className="mb-6 text-[11px] font-sans tracking-[0.1em] uppercase" style={COUNT_STYLE}>
            Showing {filtered.length} traditions from {regionLabel}
          </p>
        )}

        {/* Heritage grid — editorial masonry */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-['Playfair_Display',serif] italic text-xl" style={EMPTY_STYLE}>
              No traditions found for this combination.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {filtered.map((heritage, index) => {
              // Featured items span 2 columns on large screens
              const isFeatured = heritage.featured && activeCategory === 'all';
              return (
                <div
                  key={heritage.id}
                  className={isFeatured ? 'lg:col-span-2' : 'lg:col-span-1'}
                >
                  <HeritageCard
                    heritage={heritage}
                    featured={isFeatured}
                    onClick={onCardClick}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(HeritageFiltersGrid);
