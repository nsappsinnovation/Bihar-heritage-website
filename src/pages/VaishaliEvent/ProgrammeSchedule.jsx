import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { SCHEDULE } from "./eventData";
import { SectionHeading } from "./Ornaments";

const ProgrammeSchedule = () => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);

  // Arrow / Home / End keyboard navigation per WAI-ARIA tabs pattern
  const onKeyDown = (e) => {
    const last = SCHEDULE.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const day = SCHEDULE[active];

  return (
    <section id="programme" aria-labelledby="programme-title" className="py-20 md:py-28 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionHeading id="programme-title" eyebrow="Three days in Vaishali" title="Programme Schedule" />

        <div
          role="tablist"
          aria-label="Conference days"
          onKeyDown={onKeyDown}
          className="grid grid-cols-3 gap-2 sm:gap-4 mb-10"
        >
          {SCHEDULE.map((d, i) => {
            const selected = i === active;
            return (
              <button
                key={d.id}
                ref={(el) => (tabRefs.current[i] = el)}
                id={`tab-${d.id}`}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${d.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={`rounded-2xl border px-2 py-3 sm:py-4 text-center transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#C56A3D]/30 ${
                  selected
                    ? "bg-[#1F0C02] border-[#1F0C02] text-[#F4E4C1] shadow-lg"
                    : "bg-white border-brand-border text-text-primary hover:border-brand-accent"
                }`}
              >
                <span className="block font-cinzel text-sm sm:text-lg font-bold">{d.tab}</span>
                <span className={`block text-[0.65rem] sm:text-xs mt-1 ${selected ? "text-[#C79A4A]" : "text-text-muted"}`}>
                  {d.date.replace(" 2026", "")}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={day.id}
            id={`panel-${day.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${day.id}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="focus:outline-none"
          >
            <p className="text-center mb-8 text-sm">
              <span className="font-semibold text-text-primary">{day.weekday}, {day.date}</span>
              <span className="mx-2 text-brand-gold">•</span>
              <span className="italic">{day.theme}</span>
            </p>
            <ol className="relative border-l-2 border-brand-gold/40 ml-3 sm:ml-6 space-y-5">
              {day.sessions.map((s) => (
                <li key={s.time + s.title} className="relative pl-6 sm:pl-8">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[9px] top-6 h-4 w-4 rounded-full bg-brand-accent ring-4 ring-brand-dark"
                  />
                  <div className="rounded-2xl bg-white border border-brand-border p-5 hover:border-brand-accent hover:shadow-md transition-all">
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-brand-accent">
                      <Clock size={14} aria-hidden="true" /> {s.time} IST
                    </p>
                    <h3 className="mt-1 text-lg md:text-xl">{s.title}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-text-muted">
                      <MapPin size={14} aria-hidden="true" /> {s.location}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProgrammeSchedule;
