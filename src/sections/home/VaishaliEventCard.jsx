import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, ArrowRight, X, ChevronDown } from "lucide-react";
import { EVENT, EVENT_PATH } from "../../pages/VaishaliEvent/eventData";

// Event card shown in the homepage hero
const DISMISS_KEY = "bh_hero_event_dismissed";
const TOGGLE_EVENT = "bh_hero_event_toggle";

const VaishaliEventCard = ({ className = "" }) => {
  const [open, setOpen] = useState(() => sessionStorage.getItem(DISMISS_KEY) !== "1");

  useEffect(() => {
    const handleSync = () => {
      setOpen(sessionStorage.getItem(DISMISS_KEY) !== "1");
    };
    window.addEventListener(TOGGLE_EVENT, handleSync);
    return () => window.removeEventListener(TOGGLE_EVENT, handleSync);
  }, []);

  const close = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
    window.dispatchEvent(new Event(TOGGLE_EVENT));
  };

  const reopen = () => {
    sessionStorage.removeItem(DISMISS_KEY);
    setOpen(true);
    window.dispatchEvent(new Event(TOGGLE_EVENT));
  };

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.aside
          key="hero-event-card"
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96, transition: { duration: 0.25 } }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-labelledby="hero-event-title"
          className={`relative w-full max-w-[360px] rounded-2xl border border-[#C79A4A]/40 bg-[#1F0C02]/80 backdrop-blur-xl p-5 shadow-[0_16px_45px_rgba(0,0,0,0.65),0_0_24px_rgba(199,154,74,0.12)] hover:border-[#C79A4A]/70 transition-all duration-300 select-text ${className}`}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close event card"
            className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border border-[#C79A4A]/40 text-[#F4E4C1]/80 hover:bg-[#F4E4C1]/10 hover:text-[#F4E4C1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A4A]/60 cursor-pointer"
          >
            <X size={14} aria-hidden="true" />
          </button>
          <h3 id="hero-event-title" className="pr-8 font-cinzel !text-[#F4E4C1] text-base sm:text-[17px] font-semibold leading-snug tracking-wide">
            {EVENT.title}
            <span className="block text-[#E8A33D] font-medium text-sm sm:text-base mt-0.5">
              – {EVENT.subtitle}
            </span>
          </h3>
          <ul className="mt-3 space-y-1.5 text-xs text-[#F4E4C1]/85 font-sans">
            <li className="flex items-center gap-2">
              <CalendarDays size={13} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
              <span>{EVENT.dateLabel}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={13} className="shrink-0 text-[#E8A33D] mt-0.5" aria-hidden="true" />
              <span className="line-clamp-1">{EVENT.venue}, {EVENT.city}</span>
            </li>
          </ul>
          <p className="mt-2.5 text-[11.5px] leading-relaxed !text-[#F4E4C1]/70 font-sans font-light line-clamp-2 hidden sm:block">
            {EVENT.shortDescription}
          </p>
          <Link
            to={EVENT_PATH}
            className="group mt-4 inline-flex items-center gap-2 rounded-full bg-[#F4E4C1] hover:bg-[#FFF8EC] px-5 py-2.5 font-cinzel text-[0.62rem] font-bold tracking-[0.2em] uppercase text-[#1F0C02] transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-black/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#C79A4A]/50"
          >
            Explore Event
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.aside>
      ) : (
        <motion.button
          key="hero-event-arrow"
          type="button"
          onClick={reopen}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Reopen event card"
          title="Reopen event card"
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#C79A4A]/50 bg-[#1F0C02]/85 text-[#F4E4C1]/90 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_12px_rgba(199,154,74,0.15)] hover:border-[#C79A4A] hover:text-[#F4E4C1] hover:bg-[#2A1104] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A4A] cursor-pointer ${className}`}
        >
          <ChevronDown size={16} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default VaishaliEventCard;
