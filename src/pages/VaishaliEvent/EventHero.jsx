import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

import slide1 from "../../assets/VaishaliEvent/VaishaliEvent1.webp";
import slide2 from "../../assets/VaishaliEvent/VaishaliEvent4.webp";
import slide3 from "../../assets/VaishaliEvent/VaishaliEvent3.webp";
import slide4 from "../../assets/VaishaliEvent/VaishaliEvent2.webp";

import Countdown from "./Countdown";
import { EVENT, REGISTRATION_URL } from "./eventData";

const SLIDE_DURATION = 6500; // ms per slide

const SLIDES = [
  {
    id: "stupa-dusk",
    src: slide1,
    alt: "Buddha Samyak Darshan Smriti Stupa at Vaishali illuminated at dusk",
    position: "center",
  },
  {
    id: "mandala-aerial",
    src: slide2,
    alt: "Aerial view showing the full mandala layout of Buddha Samyak Darshan complex",
    position: "center",
  },
  {
    id: "stupa-monument",
    src: slide3,
    alt: "Carved stone toranas and architectural stupa monument at Vaishali",
    position: "center",
  },
  {
    id: "torana-flags",
    src: slide4,
    alt: "Grand entrance gateway torana adorned with Buddhist prayer flags",
    position: "center 30%",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const EventHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Seamless auto-play background slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const activeSlideData = SLIDES[currentSlide];

  return (
    <section
      aria-labelledby="event-title"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#120601] text-[#F4E4C1]"
    >
      {/* ── Background Slideshow with Smooth Crossfade & Subtle Ken Burns ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        <AnimatePresence initial={false}>
          <Motion.div
            key={activeSlideData.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={activeSlideData.src}
              alt={activeSlideData.alt}
              fetchPriority={currentSlide === 0 ? "high" : "auto"}
              style={{ objectPosition: activeSlideData.position }}
              className="w-full h-full object-cover filter brightness-[0.82] contrast-[1.06] saturate-[1.1]"
            />
          </Motion.div>
        </AnimatePresence>

        {/* ── Subtle Cinematic Vignette ──────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#120601]/92 via-[#120601]/70 to-[#120601]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#0D0401]/85 via-transparent to-[#120601]/95 pointer-events-none"
        />
      </div>

      {/* ── Pure Minimal Hero Content ─────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 sm:pt-32 md:pt-36 pb-20">
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-left"
        >
          {/* Subtle Live Eyebrow */}
          <Motion.div variants={slideUp} className="flex items-center gap-2.5 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8A33D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8A33D]" />
            </span>
            <p className="font-cinzel text-xs font-semibold tracking-[0.28em] uppercase text-[#E8A33D]">
              Bihar Heritage Presents
            </p>
            <span className="text-[#C79A4A]/40 text-xs hidden sm:inline" aria-hidden="true">
              •
            </span>
            <span className="font-cinzel text-xs tracking-[0.2em] uppercase text-[#F4E4C1]/75 hidden sm:inline">
              International Conclave
            </span>
          </Motion.div>

          {/* Grand Conference Title */}
          <Motion.h1
            id="event-title"
            variants={slideUp}
            className="font-cinzel text-3xl sm:text-5xl lg:text-[3.9rem] font-light text-[#F7F2E7] leading-[1.12] tracking-tight drop-shadow-md"
          >
            International Buddhist
            <span className="block mt-1 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4DC] via-[#E8A33D] to-[#D4AF37]">
              Conference 2026
            </span>
          </Motion.h1>

          {/* Theme Quote */}
          <Motion.div variants={slideUp} className="mt-4 flex items-center gap-3">
            <span className="h-px w-6 sm:w-10 bg-[#E8A33D]/60 shrink-0" aria-hidden="true" />
            <p
              className="italic text-base sm:text-xl text-[#F4E4C1]/90 font-serif leading-relaxed"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              “{EVENT.theme}”
            </p>
          </Motion.div>

          {/* Clean Unboxed Metadata Row */}
          <Motion.div
            variants={slideUp}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#F4E4C1]/85"
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} className="text-[#E8A33D]" aria-hidden="true" />
              <span className="font-medium tracking-wide">{EVENT.dateLabel}</span>
            </span>
            <span className="text-[#C79A4A]/40 hidden sm:inline" aria-hidden="true">
              •
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} className="text-[#E8A33D]" aria-hidden="true" />
              <span className="tracking-wide">
                {EVENT.venue}, {EVENT.city}
              </span>
            </span>
          </Motion.div>

          {/* Minimalist Typographic Countdown */}
          <Motion.div variants={slideUp} className="mt-8">
            <p className="font-cinzel text-[0.62rem] tracking-[0.25em] uppercase font-semibold text-[#C79A4A]/90 mb-2.5">
              Conclave Commences In
            </p>
            <Countdown target={EVENT.start} variant="minimal" />
          </Motion.div>

          {/* Event Action CTAs */}
          <Motion.div variants={slideUp} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={REGISTRATION_URL}
              id="event-hero-register-btn"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#E8A33D] via-[#F3B755] to-[#D4AF37] px-7 py-3 font-cinzel text-xs font-bold tracking-[0.2em] uppercase text-[#190902] shadow-[0_4px_20px_rgba(232,163,61,0.32)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(232,163,61,0.55)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E8A33D]/50"
            >
              <span>Register</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>

            <a
              href="#programme"
              className="inline-flex items-center rounded-full border border-[#F4E4C1]/40 hover:border-[#E8A33D] hover:bg-[#E8A33D]/10 px-6 py-3 font-cinzel text-xs font-semibold tracking-[0.2em] uppercase text-[#F4E4C1] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F4E4C1]/40"
            >
              View Programme
            </a>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
};

export default EventHero;
