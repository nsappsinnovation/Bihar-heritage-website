import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Share2, Bookmark, ArrowLeft } from "lucide-react";
import BlogArticlePreview from "../../components/admin/blogStudio/BlogArticlePreview";

/* ────────────────────────────────────────────────────────────
   DESIGN TOKENS
   bg        #FAF7F2   primary text  #2B2521
   secondary #6E665F   accent        #B66A3C
   border    #E6D8C6
   Headings  → font-serif  (map to Playfair Display / Fraunces in tailwind.config)
   Body      → font-sans   (Poppins)
   ──────────────────────────────────────────────────────────── */

/* ── Subtle line-art motifs, <10% opacity, never on top of text ── */
const Motif = ({ type, className = "" }) => {
  const paths = {
    lotus: (
      <path d="M50 90 C30 70 20 50 30 25 C38 40 45 55 50 65 C55 55 62 40 70 25 C80 50 70 70 50 90 Z M50 65 C42 45 35 30 20 20 M50 65 C58 45 65 30 80 20" />
    ),
    temple: (
      <path d="M50 10 L58 30 L42 30 Z M35 30 H65 V38 H35 Z M30 38 H70 V85 H30 Z M40 50 H60 M40 62 H60 M40 74 H60 M25 85 H75" />
    ),
    manuscript: (
      <path d="M20 20 H80 V78 C80 82 76 85 72 85 H20 Z M20 20 C20 24 24 27 28 27 H80 M30 40 H68 M30 50 H68 M30 60 H55" />
    ),
  };
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="#2B2521"
      strokeWidth="0.6"
      className={className}
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
};

/* ── Reading-time estimate from block copy, falls back to article.readingTime ── */
const estimateReadingTime = (blocks = []) => {
  const words = blocks.reduce((count, b) => {
    if (b.description) count += b.description.split(" ").length;
    if (b.paragraphs) count += b.paragraphs.join(" ").split(" ").length;
    if (b.text) count += b.text.split(" ").length;
    if (b.list?.items) count += b.list.items.join(" ").split(" ").length;
    return count;
  }, 0);
  return Math.max(1, Math.round(words / 200));
};

/* ── Fade-in-on-scroll wrapper ── */
const Reveal = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─────────────────────────── BLOCK 1: Hero ─────────────────────────── */
const HeroBlock = ({ block, plate }) => (
  <Reveal className="mb-24">
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group">
      <img loading="lazy" decoding="async"
        src={block.image}
        alt={block.title}
        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
    </div>
    <div className="mt-8 flex items-start gap-6">
      <span className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-[#B66A3C] font-sans font-semibold pt-2 shrink-0">
        Plate {plate}
      </span>
      <div>
        <h2 className="font-serif text-[#2B2521] text-3xl md:text-[2.4rem] font-semibold leading-tight mb-3">
          {block.title}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-sans uppercase tracking-wider text-[#6E665F] mb-6">
          <span>{block.meta?.category}</span>
          <span className="w-1 h-1 rounded-full bg-[#E6D8C6]" />
          <span>{block.meta?.date}</span>
          <span className="w-1 h-1 rounded-full bg-[#E6D8C6]" />
          <span>{block.meta?.readingTime}</span>
        </div>
        <p className="font-sans text-[18px] leading-[1.9] text-[#2B2521]/85 font-light max-w-[900px]">
          {block.description}
        </p>
      </div>
    </div>
  </Reveal>
);

/* ─────────────────── BLOCK 2 / 3: Image + Text (mirrored) ─────────────────── */
const SplitBlock = ({ block, reverse, plate, motif }) => (
  <Reveal className="mb-24 relative">
    <div
      className={`flex flex-col md:flex-row gap-10 md:gap-14 items-center ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="w-full md:w-[45%] shrink-0">
        <div className="rounded-2xl overflow-hidden h-[280px] md:h-[420px] group">
          <img loading="lazy" decoding="async"
            src={block.image}
            alt={block.title}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
        </div>
      </div>
      <div className="w-full md:w-[55%] relative">
        <Motif
          type={motif}
          className={`hidden lg:block absolute w-24 h-24 opacity-[0.06] pointer-events-none ${
            reverse ? "-left-10 -top-6" : "-right-10 -top-6"
          }`}
        />
        <span className="text-[11px] tracking-[0.2em] uppercase text-[#B66A3C] font-sans font-semibold">
          Fig. {plate}
        </span>
        <h3 className="font-serif text-[#2B2521] text-2xl md:text-[1.9rem] font-semibold leading-tight mt-2 mb-5">
          {block.title}
        </h3>
        {block.paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-sans text-[16.5px] leading-[1.9] text-[#2B2521]/85 font-light mb-5 last:mb-0"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  </Reveal>
);

/* ─────────────────────────── BLOCK 4: Quote ─────────────────────────── */
const QuoteBlock = ({ block }) => (
  <Reveal className="mb-24">
    <div className="bg-[#F3ECE1]/70 rounded-2xl px-8 md:px-16 py-14 md:py-16 text-center relative overflow-hidden">
      <Motif
        type="lotus"
        className="absolute -bottom-8 -right-8 w-40 h-40 opacity-[0.05] pointer-events-none"
      />
      <div className="w-8 h-px bg-[#B66A3C]/50 mx-auto mb-8" />
      <span className="font-serif text-[#B66A3C]/40 text-6xl leading-none block mb-2">
        “
      </span>
      <p className="font-serif italic text-[#2B2521] text-2xl md:text-[1.85rem] leading-[1.55] max-w-[720px] mx-auto -mt-6">
        {block.text}
      </p>
      {block.author && (
        <span className="block mt-8 font-sans text-[11px] uppercase tracking-[0.2em] text-[#6E665F]">
          — {block.author}
        </span>
      )}
      <div className="w-8 h-px bg-[#B66A3C]/50 mx-auto mt-8" />
    </div>
  </Reveal>
);

/* ─────────────────────────── BLOCK 5: Text Only ─────────────────────────── */
const TextOnlyBlock = ({ block, plate }) => (
  <Reveal className="mb-24">
    <div className="max-w-[900px] mx-auto">
      {block.heading && (
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#B66A3C] font-sans font-semibold shrink-0">
            {plate}
          </span>
          <h3 className="font-serif text-[#2B2521] text-2xl md:text-[1.9rem] font-semibold">
            {block.heading}
          </h3>
        </div>
      )}
      {block.paragraphs?.map((p, i) => (
        <p
          key={i}
          className="font-sans text-[17px] leading-[1.9] text-[#2B2521]/85 font-light mb-6"
        >
          {p.split(/(\*\*.*?\*\*)/g).map((chunk, j) =>
            chunk.startsWith("**") ? (
              <strong
                key={j}
                className="text-[#B66A3C] font-medium not-italic"
              >
                {chunk.slice(2, -2)}
              </strong>
            ) : (
              chunk
            )
          )}
        </p>
      ))}
      {block.list && block.list.type === "ul" && (
        <ul className="space-y-3 mb-6 pl-5 list-disc marker:text-[#B66A3C]">
          {block.list.items.map((item, i) => (
            <li
              key={i}
              className="font-sans text-[16px] leading-relaxed text-[#2B2521]/80 font-light"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
      {block.list && block.list.type === "ol" && (
        <ol className="space-y-3 mb-6 pl-5 list-decimal marker:text-[#B66A3C] marker:font-semibold">
          {block.list.items.map((item, i) => (
            <li
              key={i}
              className="font-sans text-[16px] leading-relaxed text-[#2B2521]/80 font-light"
            >
              {item}
            </li>
          ))}
        </ol>
      )}
    </div>
  </Reveal>
);

/* ─────────────────────────── BLOCK RENDERER ─────────────────────────── */
const renderBlocks = (blocks = []) => {
  let plateIndex = 0;
  const motifs = ["lotus", "temple", "manuscript"];

  return blocks.map((block, i) => {
    switch (block.type) {
      case "hero":
        plateIndex += 1;
        return <HeroBlock key={i} block={block} plate={plateIndex} />;
      case "imageLeft":
        plateIndex += 1;
        return (
          <SplitBlock
            key={i}
            block={block}
            reverse={false}
            plate={plateIndex}
            motif={motifs[plateIndex % motifs.length]}
          />
        );
      case "imageRight":
        plateIndex += 1;
        return (
          <SplitBlock
            key={i}
            block={block}
            reverse={true}
            plate={plateIndex}
            motif={motifs[plateIndex % motifs.length]}
          />
        );
      case "quote":
        return <QuoteBlock key={i} block={block} />;
      case "text":
        plateIndex += 1;
        return (
          <TextOnlyBlock
            key={i}
            block={block}
            plate={String(plateIndex).padStart(2, "0")}
          />
        );
      default:
        return null;
    }
  });
};

/* ─────────────────────────── MODAL ─────────────────────────── */
const ArticleModal = ({ isOpen, article, onClose }) => {
  const scrollRef = useRef(null);
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const progressSpring = useSpring(0, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollYProgress(max > 0 ? el.scrollTop / max : 0);
  };

  const readingTime = useMemo(
    () => article?.readingTime || `${estimateReadingTime(article?.blocks)} min read`,
    [article]
  );

  if (!isOpen || !article) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* True fullscreen panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#FAF8F3] w-full max-w-[1100px] h-[92vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col border border-[#E7DED3] z-10"
        >
          {/* Reading progress bar */}
          <motion.div
            style={{ scaleX: progressSpring, transformOrigin: "0% 50%" }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-[#B66A3C] z-40"
          />

          {/* Sticky header */}
          <div className="shrink-0 bg-[#FAF8F3] border-b border-[#E7DED3] px-6 md:px-10 h-16 flex items-center justify-between z-30">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-sans font-medium text-[#2B2521] hover:text-[#B66A3C] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>

            <h2 className="font-serif text-[#2B2521] text-sm md:text-base font-medium truncate max-w-[40%] text-center">
              {article.title}
            </h2>

            <div className="flex items-center gap-5 text-[#6E665F]">
              <button
                className="flex items-center gap-1.5 text-sm font-sans hover:text-[#B66A3C] transition-colors cursor-pointer"
                aria-label="Share article"
                title="Share article"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: article.title, url: window.location.href }).catch(() => {});
                  } else {
                    alert("Article link copied to clipboard!");
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden md:inline">Share</span>
              </button>
              <button
                className="flex items-center gap-1.5 text-sm font-sans hover:text-[#B66A3C] transition-colors cursor-pointer"
                aria-label="Bookmark article"
                title="Bookmark article"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden md:inline">Bookmark</span>
              </button>
            </div>
          </div>

          {/* Scrollable article body */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-grow overflow-y-auto scroll-smooth no-scrollbar relative"
          >
            {article.sections && article.sections.length > 0 ? (
              <div className="p-3 sm:p-8">
                <BlogArticlePreview blogData={article} device="desktop" />
              </div>
            ) : (
              <>
                {/* faint manuscript-texture wash across whole reading column */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.025]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, #2B2521 0px, transparent 1px, transparent 3px)",
                  }}
                />

                <div className="relative max-w-[1000px] mx-auto px-6 md:px-10 pt-14 pb-28">
                  {/* Eyebrow meta above hero, if not already in hero block */}
                  <div className="mb-10 text-center">
                    <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#6E665F]">
                      {article.category} · {article.publishedAt} · {readingTime}
                    </span>
                  </div>

                  {renderBlocks(article.blocks || article.content)}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ArticleModal;