import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useMotionValue, useReducedMotion } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { GALLERY_PHOTOS } from "../assets/Gallery/galleryData";

const PAGE_BG = "#FAF6F0";
const ACCENT = "#C56A3D";
const EASE = [0.645, 0.045, 0.355, 1];
const GAP = 16; // px between cards
const LIST_LENGTH = 9; // cards kept in each column

/* One entry per column. dir: -1 = cards travel up, 1 = cards travel down.
   cardH varies per column for the masonry feel; shift offsets the column
   vertically so card edges never line up across columns. */
const COLUMNS = [
  { cardH: 250, dir: -1, shift: 0, delay: 0, interval: 2600 },
  { cardH: 330, dir: 1, shift: 140, delay: 700, interval: 3000 },
  { cardH: 270, dir: -1, shift: 60, delay: 1400, interval: 2800 },
  { cardH: 340, dir: 1, shift: 190, delay: 300, interval: 3200 },
  { cardH: 240, dir: -1, shift: 110, delay: 1100, interval: 2700 },
  { cardH: 310, dir: 1, shift: 30, delay: 1800, interval: 3100 },
];

// 2 columns on phones, 4 on tablets, 6 on desktop
const COLUMN_VISIBILITY = [
  "",
  "",
  "hidden sm:block",
  "hidden sm:block",
  "hidden lg:block",
  "hidden lg:block",
];

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="w-5 h-[2px] rounded-full" style={{ background: ACCENT }} />
      <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase" style={{ color: ACCENT }}>
        {children}
      </span>
    </div>
  );
}

/* A column that advances exactly one card at a time, forever. */
function Column({ cfg, photos, paused, reduced, onOpen, className }) {
  const { cardH, dir, shift, delay, interval } = cfg;
  const step = cardH + GAP;
  const n = photos.length;

  const [list, setList] = useState(() =>
    Array.from({ length: LIST_LENGTH }, (_, k) => ({ id: k, offset: k }))
  );
  const y = useMotionValue(0);

  // after the list rotates, snap back to rest before the browser paints
  useLayoutEffect(() => {
    y.set(0);
  }, [list, y]);

  useEffect(() => {
    if (reduced) return undefined;
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      await sleep(delay);
      while (alive) {
        while (paused.current && alive) await sleep(200);
        if (!alive) break;

        await animate(y, dir === -1 ? -step : step, { duration: 0.9, ease: EASE });
        if (!alive) break;

        setList((l) =>
          dir === -1 ? [...l.slice(1), l[0]] : [l[l.length - 1], ...l.slice(0, -1)]
        );
        await sleep(interval);
      }
    })();

    return () => {
      alive = false;
    };
  }, [dir, step, delay, interval, reduced, y, paused]);

  // moving-down columns keep one spare card parked above the viewport
  const top = dir === -1 ? -shift : -(step + shift);

  return (
    <div className={`relative h-full flex-1 overflow-hidden ${className}`}>
      <motion.div className="absolute left-0 right-0 flex flex-col" style={{ y, top, gap: GAP }}>
        {list.map((item) => {
          const photo = photos[((item.offset % n) + n) % n];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(photo)}
              aria-label={`Open ${photo.title}`}
              className="group relative block w-full shrink-0 overflow-hidden rounded-2xl bg-[#EFE6D6] border border-[#E8DFC8] shadow-[0_10px_30px_rgba(44,36,25,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C56A3D]"
              style={{ height: cardH }}
            >
              <img
                src={photo.image}
                alt={photo.title}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover text-transparent transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 flex flex-col justify-end gap-1.5 p-4 text-left bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="self-start rounded-full bg-[#C56A3D] px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider text-white">
                  {photo.tag}
                </span>
                <span className="font-serif text-base font-bold leading-snug text-white">{photo.title}</span>
              </span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function GalleryPage() {
  // Deal photos round-robin so every column has its own set and no photo
  // appears in more than one column
  const columnPhotos = useMemo(
    () => COLUMNS.map((_, c) => GALLERY_PHOTOS.filter((__, i) => i % COLUMNS.length === c)),
    []
  );
  const [active, setActive] = useState(null);
  const paused = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    paused.current = true;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      paused.current = false;
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <div className="min-h-screen text-[#2C2419] overflow-x-hidden" style={{ background: PAGE_BG }}>
      <section
        className="relative h-screen min-h-[680px] overflow-hidden"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = !!active)}
      >
        {/* scrolling columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="absolute inset-0 flex px-4"
          style={{ gap: GAP }}
        >
          {COLUMNS.map((cfg, i) => (
            <Column
              key={i}
              cfg={cfg}
              photos={columnPhotos[i]}
              paused={paused}
              reduced={reduced}
              onOpen={setActive}
              className={COLUMN_VISIBILITY[i]}
            />
          ))}
        </motion.div>

        {/* fades: keep the heading readable and blend into the page */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,#FAF6F0_0%,rgba(250,246,240,0.94)_34%,rgba(250,246,240,0)_64%)] lg:bg-[radial-gradient(ellipse_62%_55%_at_0%_0%,#FAF6F0_52%,rgba(250,246,240,0)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#FAF6F0] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#FAF6F0] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[520px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(197,106,61,0.08),transparent_70%)]" />

        {/* heading */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute left-0 top-0 z-20 px-8 sm:px-12 pt-36 max-w-2xl text-left"
        >
          <Eyebrow>Photo Gallery</Eyebrow>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-[#2C2419] leading-[1.08]">
            Bihar's Living Heritage, <br className="hidden sm:inline" />
            in Frames.
          </h1>
          <p className="mt-5 text-[#6B5744] text-sm font-sans font-light max-w-sm leading-relaxed">
            Monuments, sacred sites and ancient ruins from across Bihar, captured by the Bihar Heritage Development Society.
          </p>
        </motion.header>

        <p className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-[#A98E75] whitespace-nowrap">
          Hover to pause · Tap to open
        </p>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 cursor-zoom-out"
            style={{ background: "rgba(250,246,240,0.96)" }}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E8DFC8] text-[#2C2419] hover:bg-[#C56A3D] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0.97, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 8 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl w-full text-left"
            >
              <img
                src={active.image}
                alt={active.title}
                className="w-full max-h-[72vh] object-contain rounded-2xl"
              />
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-lg font-serif font-bold text-[#2C2419]">{active.title}</p>
                  {active.location && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-sans text-[#8C6D3B]">
                      <MapPin size={12} /> {active.location}
                    </p>
                  )}
        
                </div>
                {active.tag && (
                  <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase whitespace-nowrap" style={{ color: ACCENT }}>
                    {active.tag}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
