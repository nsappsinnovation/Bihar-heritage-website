import React from "react";

// Eight-spoked Dharmachakra
export const DharmaWheel = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
    <circle cx="50" cy="50" r="44" strokeWidth="3" />
    <circle cx="50" cy="50" r="36" strokeWidth="1.2" />
    <circle cx="50" cy="50" r="8" strokeWidth="3" />
    {Array.from({ length: 8 }, (_, i) => (
      <line key={i} x1="50" y1="42" x2="50" y2="14" strokeWidth="2.5" transform={`rotate(${i * 45} 50 50)`} />
    ))}
    {Array.from({ length: 8 }, (_, i) => (
      <circle key={`k${i}`} cx="50" cy="4" r="2.6" fill="currentColor" transform={`rotate(${i * 45 + 22.5} 50 50)`} />
    ))}
  </svg>
);

// Section heading with lotus divider, used across the event page
export const SectionHeading = ({ id, eyebrow, title, light = false }) => (
  <div className="text-center mb-12">
    <p className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#C56A3D] mb-3">{eyebrow}</p>
    <h2 id={id} className={`font-cinzel text-3xl md:text-4xl ${light ? "!text-[#F4E4C1]" : ""}`}>
      {title}
    </h2>
    <div className="mt-5 flex items-center justify-center gap-3 text-[#C2A55D]" aria-hidden="true">
      <span className="h-px w-16 bg-current opacity-60" />
      <svg width="28" height="16" viewBox="0 0 28 16" fill="currentColor">
        <path d="M14 0c2.5 3 2.5 9 0 13-2.5-4-2.5-10 0-13zM14 13C11 9 6 7 1 8c3 4 8 6 13 5zm0 0c3-4 8-6 13-5-3 4-8 6-13 5z" />
      </svg>
      <span className="h-px w-16 bg-current opacity-60" />
    </div>
  </div>
);
