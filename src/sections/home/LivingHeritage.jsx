import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import heritageData from "../../data/biharHeritage.json";
import { heritageImageMap } from "../../pages/IntangibleHeritage/heritageImages";

/* ────────────────────────────────────────────────────────────────────────────
 * Static data — computed ONCE at module load (the JSON and image map never
 * change at runtime), so nothing is re-derived on re-render.
 * ──────────────────────────────────────────────────────────────────────────── */

const CATEGORY_LABELS = {
  "art-craft": "Art & Craft",
  "festivals-rituals": "Festivals & Rituals",
  "music": "Music",
  "dance-theatre": "Dance & Theatre",
  "oral-traditions": "Oral Traditions",
  "food-customs": "Food & Customs",
};

const resolvedItems = heritageData.heritages.map((item) => ({
  ...item,
  image: heritageImageMap[item.imageKey] || null,
  categoryLabel: CATEGORY_LABELS[item.category] || item.category,
}));

const findItem = (id, fallbackIndex) =>
  resolvedItems.find((item) => item.id === id) || resolvedItems[fallbackIndex];

// Featured items for the 4-card masonry
const chhathItem = findItem("chhath-puja", 0);
const madhubaniItem = findItem("madhubani-painting", 1);
const danceItem = findItem("jat-jatin", 3);
const sikkiItem = findItem("sikki-craft", 2);

const chhathBlurb = chhathItem?.shortDescription
  ? chhathItem.shortDescription.split(".")[0] + "."
  : "";

// Marquee: only items with images, duplicated once for a seamless loop
const marqueeItemsWithImages = resolvedItems.filter((item) => item.image);
const marqueeItems = [...marqueeItemsWithImages, ...marqueeItemsWithImages];
const MARQUEE_HALF = marqueeItemsWithImages.length;

/* ────────────────────────────────────────────────────────────────────────────
 * Shared bits
 * ──────────────────────────────────────────────────────────────────────────── */

const CARD_BASE =
  "relative group overflow-hidden rounded-[24px] border border-[#E8DFC8]/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_45px_rgba(184,77,50,0.18)] transition-all duration-400 cursor-pointer bg-[#2C2419]";

const IMG_CLASS =
  "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105";

// Makes div[role=button] operable with the keyboard (Enter / Space)
const onKeyActivate = (handler) => (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handler();
  }
};

/* ────────────────────────────────────────────────────────────────────────────
 * Featured cards — variants differ only by config, markup is shared.
 * Class strings are written out in full so Tailwind can detect them.
 * ──────────────────────────────────────────────────────────────────────────── */

const FeaturedCard = memo(function FeaturedCard({
  item,
  onClick,
  layoutClass,
  variant,
}) {
  const isLarge = variant === "chhath" || variant === "madhubani";

  const gradient = isLarge
    ? "bg-gradient-to-t from-[#140E0A]/90 via-[#140E0A]/35 to-transparent"
    : "bg-gradient-to-t from-[#140E0A]/90 via-[#140E0A]/30 to-transparent";

  return (
    <div
      onClick={onClick}
      onKeyDown={onKeyActivate(onClick)}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${item.title}`}
      className={`${layoutClass} ${CARD_BASE}`}
    >
      {item.image && (
        <img loading="lazy" decoding="async" src={item.image} alt={item.title} className={IMG_CLASS} />
      )}
      <div className={`absolute inset-0 ${gradient}`} />

      <div
        className={`absolute bottom-0 left-0 right-0 ${
          isLarge ? "p-4 md:p-5" : "p-3.5 md:p-4"
        }`}
      >
        <h4
          className={
            isLarge
              ? "text-white font-serif text-lg md:text-xl font-bold leading-tight mb-1 group-hover:text-[#F4E4C1] transition-colors"
              : "text-white font-serif text-sm md:text-base font-bold leading-tight group-hover:text-[#F4E4C1] transition-colors truncate"
          }
        >
          {item.title}
        </h4>

        {variant === "chhath" && (
          <p className="text-white/75 font-sans text-[11px] leading-relaxed line-clamp-2 hidden md:block font-light">
            {chhathBlurb}
          </p>
        )}
        {variant === "madhubani" && (
          <p className="text-white/75 font-sans text-[11px] leading-relaxed line-clamp-1 hidden md:block font-light">
            {item.shortDescription}
          </p>
        )}
      </div>
    </div>
  );
});

/* ────────────────────────────────────────────────────────────────────────────
 * Marquee card — memoized so the 2× list isn't re-rendered with the parent.
 * The duplicated half is hidden from assistive tech and the tab order.
 * ──────────────────────────────────────────────────────────────────────────── */

const MarqueeCard = memo(function MarqueeCard({ item, onClick, isClone }) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onKeyActivate(onClick)}
      role="button"
      tabIndex={isClone ? -1 : 0}
      aria-hidden={isClone || undefined}
      className="group relative flex-shrink-0 w-60 h-36 rounded-2xl overflow-hidden shadow-sm border border-[#E0D3BE] bg-[#2C2419] cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:border-[#B84D32]"
    >
      <img
        src={item.image}
        alt={isClone ? "" : item.title}
        width={240}
        height={144}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div className="absolute bottom-3 left-3.5 right-3.5 text-left">
        <h5 className="text-white text-[13px] font-serif font-bold tracking-wide leading-tight group-hover:text-[#F4E4C1] transition-colors truncate">
          {item.title}
        </h5>
      </div>
    </div>
  );
});

/* ────────────────────────────────────────────────────────────────────────────
 * Section
 * ──────────────────────────────────────────────────────────────────────────── */

const LivingHeritage = () => {
  const navigate = useNavigate();

  // Stable reference so memoized children don't re-render
  const goToHeritage = useCallback(() => navigate("/living-heritage"), [navigate]);

  return (
    <section className="living-heritage-section mb-12 md:mb-8 relative w-full overflow-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#C79A4A]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B84D32]/8 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-6 lg:pt-20 lg:pb-6">
        {/* ── Two-Column Header & Masonry ─────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-6">
          {/* LEFT COLUMN (38%) */}
          <div className="w-full lg:w-[38%] flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#C79A4A]" />
              <span className="text-[#C79A4A] text-[11px] font-sans font-bold tracking-[0.3em] uppercase">
                Living Traditions
              </span>
            </div>

            <h2 className="font-serif font-black text-[#2C2C19] text-4xl md:text-5xl lg:text-[3.3rem] leading-[1.08] mb-5 tracking-tight">
              Living Heritage<br />of Bihar
            </h2>

            <p className="text-[#5C4A3A] text-[15px] md:text-base font-sans font-normal leading-[1.8] mb-6 max-w-[420px]">
              Beyond stone monuments and ancient ruins, Bihar’s living civilization thrives in its sacred river rituals, GI-tagged folk arts, matrilineal grass weaving, and timeless oral theatricals passed down across millennia.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={goToHeritage}
                className="group inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white px-6 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (62%) — Staggered Masonry Interactive Cards */}
          <div className="w-full lg:w-[62%]">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 auto-rows-[145px] md:auto-rows-[135px]">
              <FeaturedCard
                item={chhathItem}
                variant="chhath"
                onClick={goToHeritage}
                layoutClass="col-span-1 md:col-span-2 row-span-2 md:row-span-3"
              />
              <FeaturedCard
                item={madhubaniItem}
                variant="madhubani"
                onClick={goToHeritage}
                layoutClass="col-span-1 md:col-span-4 row-span-1 md:row-span-2"
              />
              <FeaturedCard
                item={danceItem}
                variant="dance"
                onClick={goToHeritage}
                layoutClass="col-span-1 md:col-span-2 row-span-1"
              />
              <FeaturedCard
                item={sikkiItem}
                variant="sikki"
                onClick={goToHeritage}
                layoutClass="col-span-1 md:col-span-2 row-span-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Continuous Strip (name only) ── */}
      <div className="border-t border-[#D5C3A5]/50 pt-2 pb-4 overflow-hidden">
        <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden">
          <div className="flex gap-4 animate-marquee w-max hover:[animation-play-state:paused] py-2">
            {marqueeItems.map((item, i) => (
              <MarqueeCard
                key={`${item.id}-${i}`}
                item={item}
                onClick={goToHeritage}
                isClone={i >= MARQUEE_HALF}
              />
            ))}
          </div>

          {/* Edge fade gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FFFBF5] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#FFFBF5] to-transparent z-10" />
        </div>
      </div>
    </section>
  );
};

export default memo(LivingHeritage);
