import React, { useState, useEffect } from "react";
import BlogBG from "../../assets/BlogBG.webp";

const HeroBanner = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div 
      className="relative w-full overflow-hidden flex items-end" 
      style={{ height: "clamp(500px, 45vw, 560px)" }}
    >
      {/* Background Image with Parallax & Soft Zoom */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.15}px) scale(${1.05 + scrollY * 0.00025})`,
          transition: "transform 75ms ease-out",
        }}
      >
        <img loading="lazy" decoding="async"
          src={BlogBG}
          alt="Sher Shah Suri Tomb Sasaram"
          className="w-full h-full object-cover object-center filter brightness-[0.72]"
        />
        {/* Subtle warm sepia tint layer */}
        <div className="absolute inset-0 bg-[#5F3A24]/12 mix-blend-color-burn pointer-events-none" />
        <div className="absolute inset-0 bg-[#FAF8F3]/5 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Repeating noise overlay (5-8% opacity) */}
      <div 
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* Dark Vignette around image edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_35%,_rgba(0,0,0,0.85)_100%)] pointer-events-none opacity-85" />

      {/* Rich dark solid overlay for text readability */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* Very soft radial light behind the heading */}
      <div className="absolute left-[5%] top-[25%] w-[450px] h-[250px] bg-gradient-to-r from-[#B85C38]/12 to-transparent blur-[90px] rounded-full pointer-events-none" />

      {/* Bottom fade into page background — matches Protected Sites */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#FAF8F3] via-[#FAF8F3]/70 to-transparent pointer-events-none z-10" />

      {/* Premium curved transition overlay (soft curved fade) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20">
        <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C150,90 350,120 600,120 C850,120 1050,90 1200,0 L1200,120 L0,120 Z" fill="#FAF8F3" />
        </svg>
      </div>

      {/* Left-aligned Content Container */}
      <div className="relative z-30 w-full max-w-[1280px] mx-auto px-6 md:px-12 pb-24 flex flex-col items-start text-left space-y-4">
        
        {/* Eyebrow */}
        <span className="text-[#B85C38] text-xs font-bold uppercase tracking-[0.25em] block font-sans">
          HERITAGE JOURNAL
        </span>

        {/* Heading */}
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-serif font-bold text-white leading-[1.12] drop-shadow-md"
          style={{ maxWidth: "650px" }}
        >
          Stories Preserving Bihar's<br />Cultural Legacy
        </h1>

        {/* Supporting paragraph */}
        <p 
          className="text-white/85 text-sm md:text-base font-sans font-light leading-relaxed"
          style={{ maxWidth: "520px" }}
        >
          Discover research articles, conservation stories, restoration projects, archaeological findings, museums, crafts and cultural traditions from across Bihar.
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-3 pt-2 text-[10px] md:text-xs font-sans text-white/50 uppercase tracking-[0.2em]">
          <span>Research</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>Conservation</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>Architecture</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>Culture</span>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
