import React, { forwardRef } from "react";

/**
 * HeritageStrip — traditional Indian museum picture-frame design with sharp non-rounded corners.
 */
const HeritageStrip = forwardRef(function HeritageStrip(
  { image, label, desc, theme, objPos = "center center", stripIndex },
  ref
) {
  return (
    <div
      ref={ref}
      data-strip={stripIndex}
      className="strip-panel relative h-full overflow-hidden flex-shrink-0 cursor-pointer group w-[220px] sm:w-[250px] md:w-[280px] rounded-none border-2 border-[#C2A55D]/75 hover:border-[#F5D38A]"
    >
      {/* ── Traditional Inner Hairline Frame Line ─────────────────────── */}
      <div className="absolute inset-1.5 border border-[#F5D38A]/45 pointer-events-none z-20 transition-colors duration-300 group-hover:border-[#F5D38A]/80" />

      {/* ── Traditional Ornate Gold Corner Flourishes ────────────────── */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#F5D38A] pointer-events-none z-25" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#F5D38A] pointer-events-none z-25" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#F5D38A] pointer-events-none z-25" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#F5D38A] pointer-events-none z-25" />

      {/* ── Core image ───────────────────────────────────────────────── */}
      <img loading="lazy" decoding="async"
        src={image}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover will-change-transform transition-transform duration-700 ease-out group-hover:scale-108"
        style={{ objectPosition: objPos }}
        draggable={false}
      />

      {/* ── Soft ambient overlay ─────────────────────────────────────── */}
      <div className="absolute inset-0 strip-overlay pointer-events-none transition-opacity duration-300 group-hover:opacity-95 z-10" />

      {/* ── Highlighted text overlay (Visible on Hover) ─────────────── */}
      <div className="strip-label absolute inset-x-0 bottom-0 p-3.5 flex flex-col items-center justify-end text-center opacity-0 group-hover:!opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 pointer-events-none bg-gradient-to-t from-black/95 via-black/80 to-transparent z-30">
        {/* Category Badge */}
        <span
          className="inline-block px-3 py-1 mb-1.5 text-[11px] sm:text-[12px] font-sans font-bold tracking-[0.22em] uppercase rounded-none border border-[#F5D38A]/70 bg-black/85 text-[#F5D38A] shadow-xl backdrop-blur-md"
          style={{ borderColor: theme ? `${theme}90` : undefined, color: theme ?? "#F5D38A" }}
        >
          {label}
        </span>

        {/* Short descriptive text */}
        {desc && (
          <p className="text-[12px] sm:text-[13px] font-serif leading-snug text-[#FFF8EC] drop-shadow-lg max-w-[96%] line-clamp-2">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
});

export default HeritageStrip;
