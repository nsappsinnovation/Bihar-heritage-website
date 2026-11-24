import React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Megaphone,
  MapPin,
  Landmark,
  BookOpen
} from "lucide-react";
import { defaultNews } from "../data/defaults/defaultNews";
import NewsBannerImg from "../assets/Banners/NewsBanner.webp";

export default function News() {
  const newsData = defaultNews;

  const iconMap = {
    Exhibition: <Landmark className="w-5 h-5 text-brand-accent" />,
    Festival: <Megaphone className="w-5 h-5 text-brand-accent" />,
    "Cultural Festival": <Megaphone className="w-5 h-5 text-brand-accent" />,
    "Heritage Walk": <MapPin className="w-5 h-5 text-brand-accent" />,
    "Panel Discussion": <BookOpen className="w-5 h-5 text-brand-accent" />,
    "Academic Symposium": <BookOpen className="w-5 h-5 text-brand-accent" />,
    Bulletin: <CalendarDays className="w-5 h-5 text-brand-accent" />,
    "Official Bulletin": <CalendarDays className="w-5 h-5 text-brand-accent" />,
    Discovery: <Landmark className="w-5 h-5 text-brand-accent" />
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return { day: "01", month: "JAN", year: "2026" };
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, "0");
        const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
        const year = String(d.getFullYear());
        return { day, month, year };
      }
    } catch (_) {}

    const dateParts = String(dateStr).split(" ");
    if (dateParts.length >= 3) {
      return {
        month: dateParts[0].toUpperCase(),
        day: dateParts[1].replace(",", ""),
        year: dateParts[2]
      };
    }
    return { day: "01", month: "JAN", year: "2026" };
  };

  const publishedNews = newsData.filter(
    (item) => (item.status || "Published") !== "Draft" && item.status !== "Archived"
  );

  return (
    <div className="min-h-screen bg-brand-dark text-text-primary pb-24 relative overflow-hidden text-left">
      {/* Decorative fine-grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `60px 60px`
        }}
      />

      {/* Premium Header Banner with Full-Width Background Image */}
      <div className="relative h-72 md:h-84 w-full overflow-hidden bg-brand-dark flex items-center mb-16 pt-16 border-b border-brand-border/60">
        {/* Full-Width Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img loading="lazy" decoding="async"
            src={NewsBannerImg}
            alt="Newspaper Press Background"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/85 via-brand-dark/45 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end h-full pb-8">
          <div className="max-w-3xl">
            <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] block mb-2 font-sans">
              Press Room
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary leading-tight">
              Latest News & Bulletins
            </h1>
            <p className="text-text-secondary text-sm md:text-base font-sans font-light mt-3 leading-relaxed">
              Stay informed with official updates, media releases, and upcoming announcements from the Bihar Heritage Development Society.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto z-10 relative px-6 md:px-12 mt-8">
        {/* Newspaper / Press Bulletin List */}
        <div className="space-y-12">
          {publishedNews.map((news, index) => {
            const { day, month, year } = parseDate(news.date);

            return (
              <motion.div
                key={news.id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start pb-10 border-b border-brand-border/40 last:border-0 group"
              >
                {/* Date Column (Editorial Style) */}
                <div className="md:col-span-2 flex md:flex-col items-baseline md:items-start gap-2">
                  <span className="text-4xl md:text-5xl font-serif font-bold text-brand-accent tracking-tight leading-none">
                    {day}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-muted leading-none">
                      {month}
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand-gold mt-1 leading-none">
                      {year}
                    </span>
                  </div>
                </div>

                {/* Content Column */}
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-brand-accent uppercase tracking-wider font-sans bg-brand-accent/5 px-2.5 py-0.5 rounded border border-brand-accent/20">
                      {news.category || "Official Bulletin"}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-text-primary leading-snug group-hover:text-brand-accent transition-colors duration-300">
                    {news.title}
                  </h3>
                  <p className="text-text-secondary text-xs md:text-sm leading-relaxed font-sans font-light text-justify">
                    {news.description}
                  </p>
                </div>

                {/* Action/Image Thumbnail Column */}
                <div className="md:col-span-2 flex md:justify-end items-center self-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-brand-dark border border-brand-border/60 flex-shrink-0 shadow-sm">
                    <img loading="lazy" decoding="async"
                      src={news.image || "/images/remote/photo-1585829365295-ab7cd400c167-12707a54.webp"}
                      alt={news.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => {
                        e.target.src = "/images/remote/photo-1585829365295-ab7cd400c167-12707a54.webp";
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
