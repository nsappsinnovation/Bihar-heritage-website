import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Share2, ArrowLeft } from "lucide-react";
import { blogData } from "./mockData";
import BlogArticlePreview from "../../components/blog/BlogArticlePreview";

/* Subtle line-art motifs, <10% opacity, never on top of text */
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

const HeroBlock = ({ block, plate }) => (
  <Reveal className="mb-20">
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group shadow-sm">
      <img loading="lazy" decoding="async"
        src={block.image}
        alt={block.title}
        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-102"
      />
    </div>
    <div className="mt-8 flex items-start gap-6 text-left">
      <span className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-[#B66A3C] font-sans font-semibold pt-2 shrink-0">
        Plate {plate}
      </span>
      <div>
        <h2 className="font-serif text-[#2B2521] text-2xl md:text-[2.4rem] font-semibold leading-tight mb-3">
          {block.title}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-sans uppercase tracking-wider text-[#6E665F] mb-6">
          <span>{block.meta?.category}</span>
          <span className="w-1 h-1 rounded-full bg-[#E6D8C6]" />
          <span>{block.meta?.date}</span>
          <span className="w-1 h-1 rounded-full bg-[#E6D8C6]" />
          <span>{block.meta?.readingTime}</span>
        </div>
        <p className="font-sans text-[17px] md:text-[18px] leading-[1.85] text-[#2B2521]/85 font-light text-justify hyphens-auto">
          {block.description}
        </p>
      </div>
    </div>
  </Reveal>
);

const SplitBlock = ({ block, reverse, plate, motif }) => (
  <Reveal className="mb-20 relative">
    <div
      className={`flex flex-col md:flex-row gap-10 md:gap-14 items-start text-left ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="w-full md:w-[45%] shrink-0">
        <div className="rounded-2xl overflow-hidden h-[280px] md:h-[420px] group shadow-sm">
          <img loading="lazy" decoding="async"
            src={block.image}
            alt={block.title}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-102"
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
        <h3 className="font-serif text-[#2B2521] text-xl md:text-[1.9rem] font-semibold leading-tight mt-2 mb-5">
          {block.title}
        </h3>
        {block.paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-sans text-[16px] md:text-[16.5px] leading-[1.85] text-[#2B2521]/85 font-light mb-5 last:mb-0 text-justify hyphens-auto"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  </Reveal>
);

const QuoteBlock = ({ block }) => (
  <Reveal className="mb-20">
    <div className="bg-[#F3ECE1]/50 rounded-2xl px-6 md:px-16 py-12 md:py-14 text-center relative overflow-hidden">
      <Motif
        type="lotus"
        className="absolute -bottom-8 -right-8 w-40 h-40 opacity-[0.04] pointer-events-none"
      />
      <div className="w-8 h-px bg-[#B66A3C]/40 mx-auto mb-6" />
      <span className="font-serif text-[#B66A3C]/30 text-5xl leading-none block mb-2">
        “
      </span>
      <p className="font-serif italic text-[#2B2521] text-xl md:text-[1.75rem] leading-[1.5] max-w-[720px] mx-auto -mt-4">
        {block.text}
      </p>
      {block.author && (
        <span className="block mt-6 font-sans text-[10px] uppercase tracking-[0.2em] text-[#6E665F]">
          — {block.author}
        </span>
      )}
      <div className="w-8 h-px bg-[#B66A3C]/40 mx-auto mt-6" />
    </div>
  </Reveal>
);

const TextOnlyBlock = ({ block, plate }) => (
  <Reveal className="mb-20">
    <div className="max-w-[850px] mx-auto text-left">
      {block.heading && (
        <div className="flex items-baseline gap-4 mb-5">
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#B66A3C] font-sans font-semibold shrink-0">
            {plate}
          </span>
          <h3 className="font-serif text-[#2B2521] text-xl md:text-[1.8rem] font-semibold">
            {block.heading}
          </h3>
        </div>
      )}
      {block.paragraphs?.map((p, i) => (
        <p
          key={i}
          className="font-sans text-[16px] md:text-[16.5px] leading-[1.85] text-[#2B2521]/85 font-light mb-5 text-justify hyphens-auto"
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
        <ul className="space-y-2.5 mb-5 pl-5 list-disc marker:text-[#B66A3C]">
          {block.list.items.map((item, i) => (
            <li
              key={i}
              className="font-sans text-[15.5px] leading-relaxed text-[#2B2521]/80 font-light"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
      {block.list && block.list.type === "ol" && (
        <ol className="space-y-2.5 mb-5 pl-5 list-decimal marker:text-[#B66A3C] marker:font-semibold">
          {block.list.items.map((item, i) => (
            <li
              key={i}
              className="font-sans text-[15.5px] leading-relaxed text-[#2B2521]/80 font-light"
            >
              {item}
            </li>
          ))}
        </ol>
      )}
    </div>
  </Reveal>
);

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

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [scrollYProgress, setScrollYProgress] = useState(0);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Find the target article in the bundled blog data
  const article = useMemo(
    () => [blogData.featuredStory, ...blogData.articles].find((a) => a.slug === slug),
    [slug]
  );

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      setScrollYProgress(window.scrollY / totalHeight);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const readingTime = useMemo(
    () => article?.readingTime || `${estimateReadingTime(article?.blocks)} min read`,
    [article]
  );

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-24 text-center px-6">
        <h2 className="font-cormorant text-3xl font-bold text-[#2F241D] mb-4">Article Not Found</h2>
        <p className="text-[#6F665E] mb-6">The article you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/blog")}
          className="px-6 py-2.5 rounded-full bg-[#B85C38] text-white hover:bg-[#B85C38]/90 transition-colors text-sm font-semibold tracking-wide uppercase cursor-pointer"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#2F241D] pb-32 pt-28 md:pt-36 relative overflow-hidden font-inter">
      {/* Scroll Progress Bar */}
      <div 
        style={{ transform: `scaleX(${scrollYProgress})`, transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#B85C38] z-50 transition-transform duration-75"
      />

      {/* Subtle background lines */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #B85C38 1px, transparent 1px), linear-gradient(to bottom, #B85C38 1px, transparent 1px)`,
          backgroundSize: `100px 100px`,
        }}
      />

      <div className="max-w-[calc((100%+1000px)/2)] mx-auto px-1.5 md:px-2.5 relative z-30">
        
        {/* Navigation & Controls Top Bar */}
        <div className="flex items-center justify-between border-b border-[#E7DED3] pb-6 mb-12">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-xs md:text-sm font-sans font-semibold uppercase tracking-wider text-[#2B2521] hover:text-[#B85C38] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </button>

          <div className="flex items-center gap-5 text-[#6E665F]">
            <button
              className="flex items-center gap-1.5 text-xs md:text-sm font-sans font-semibold uppercase tracking-wider hover:text-[#B85C38] transition-colors cursor-pointer"
              aria-label="Share article"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Article link copied to clipboard!");
                }
              }}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Content Column */}
        {article.sections && article.sections.length > 0 ? (
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E7DED3] shadow-sm">
            <BlogArticlePreview blogData={article} device="desktop" />
          </div>
        ) : (
          <div className="relative">
            {/* faint manuscript-texture wash across whole reading column */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, #2B2521 0px, transparent 1px, transparent 3px)",
              }}
            />

            <div className="mb-10 text-center">
              <span className="px-3.5 py-1 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase bg-[#B85C38]/10 text-[#B85C38]">
                {article.category}
              </span>
              <div className="mt-4 text-xs font-sans uppercase tracking-[0.2em] text-[#6E665F]">
                {article.publishedAt} · {readingTime}
              </div>
            </div>

            {renderBlocks(article.blocks || article.content)}
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetailPage;
