import React from "react";
import { Calendar, User, Clock, Tag, Award, Hash, MessageSquare, AlertCircle, Quote, PanelLeft } from "lucide-react";
import { BIHAR_PRESET_IMAGES } from "./templateData";

const BlogArticlePreview = ({ blogData, device = "desktop" }) => {
  const {
    title = "Untitled Article Title",
    category = "Heritage",
    author = "BHDS Editorial",
    publishedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readingTime = "5 min read",
    headerLayout = "standard", // "standard" | "split" | "overlay" | "minimal"
    leadStyle = "border-left",
    coverImage,
    description = "",
    sections = []
  } = blogData || {};

  const getDeviceClass = () => {
    switch (device) {
      case "mobile":
        return "max-w-[390px] border-4 border-stone-800 rounded-lg p-2 bg-stone-900 shadow-2xl";
      case "tablet":
        return "max-w-[768px] border-4 border-stone-800 rounded-lg p-2 bg-stone-900 shadow-xl";
      case "desktop":
      default:
        return "max-w-4xl";
    }
  };

  // ─── RENDER 6 LEAD SUMMARY DISPLAY STYLES ───
  const renderLeadSummaryStyle = (descText, styleOption = "border-left", isDark = false) => {
    if (!descText) return null;

    switch (styleOption) {
      case "card":
        return (
          <div className={`p-5 sm:p-6 rounded-2xl border text-left transition-all ${isDark
            ? "bg-black/75 backdrop-blur-md border-white/30 text-white shadow-lg ring-1 ring-white/10"
            : "bg-white border-[#E7DED3] text-[#2F241D] shadow-2xs"
            }`}>
            <p className={`font-serif text-base sm:text-[17px] leading-[1.85] tracking-[0.01em] ${isDark ? "text-white font-medium drop-shadow-xs" : "text-[#2F241D]"}`}>
              {descText}
            </p>
          </div>
        );

      case "quote":
        return (
          <div className={`my-3 p-5 sm:p-6 rounded-2xl border text-left relative overflow-hidden transition-all ${isDark
            ? "bg-black/75 backdrop-blur-md border-amber-500/40 text-amber-50 shadow-xl ring-1 ring-amber-400/20"
            : "bg-[#FAF8F3] border-[#E7DED3] text-[#2F241D]"
            }`}>
            <div className="flex items-start gap-3.5">
              <span className={`text-4xl sm:text-5xl font-serif font-bold leading-none shrink-0 select-none ${isDark ? "text-amber-400 drop-shadow-xs" : "text-[#B85C38]"
                }`}>
                “
              </span>
              <p className={`font-serif text-base sm:text-lg italic leading-[1.85] tracking-[0.01em] flex-1 pt-1 ${isDark ? "text-amber-100 font-medium drop-shadow-xs" : "text-[#2F241D]"
                }`}>
                {descText}
              </p>
              <span className={`text-4xl sm:text-5xl font-serif font-bold leading-none shrink-0 self-end select-none ${isDark ? "text-amber-400 drop-shadow-xs" : "text-[#B85C38]"
                }`}>
                ”
              </span>
            </div>
          </div>
        );

      case "archival-inset":
      case "highlight":
        return (
          <div className={`p-5 sm:p-6 rounded-2xl border-t-[3.5px] border-t-[#B85C38] border text-left shadow-2xs transition-all ${isDark
            ? "bg-stone-900/90 border-stone-700 text-stone-100"
            : "bg-[#FAF8F3] border-[#E7DED3] text-[#2F241D]"
            }`}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#B85C38]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#B85C38]">
                Executive Overview
              </span>
            </div>
            <p className={`font-serif text-base sm:text-[17px] leading-[1.85] tracking-[0.01em] ${isDark ? "text-stone-200" : "text-[#3D332A]"}`}>
              {descText}
            </p>
          </div>
        );

      case "editorial-deck":
      case "bold-lead":
        return (
          <div className="space-y-3 text-left py-1">
            <p className={`font-serif text-lg sm:text-xl md:text-[22px] font-medium leading-[1.75] tracking-tight ${isDark ? "text-stone-100 drop-shadow-sm" : "text-[#2F241D]"}`}>
              {descText}
            </p>
            <div className="h-[2px] w-16 bg-gradient-to-r from-[#B85C38] via-[#D98A5F] to-transparent rounded-full" />
          </div>
        );

      case "dropcap":
        return (
          <p className={`font-serif text-base sm:text-[17px] leading-[1.85] tracking-[0.01em] text-left whitespace-pre-line first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:leading-none ${isDark ? "text-white first-letter:text-amber-400" : "text-[#2F241D] first-letter:text-[#B85C38]"}`}>
            {descText}
          </p>
        );

      case "border-left":
      default:
        return (
          <div className={`p-4 sm:p-5 rounded-r-xl border-l-4 text-left transition-all ${isDark
            ? "bg-black/70 backdrop-blur-md border-amber-500 shadow-md ring-1 ring-white/10"
            : "bg-[#FAF8F3]/90 border-[#B85C38]"
            }`}>
            <p className={`font-serif text-base sm:text-[17px] leading-[1.85] tracking-[0.01em] italic ${isDark ? "text-stone-100 font-medium drop-shadow-xs" : "text-[#2F241D]"}`}>
              {descText}
            </p>
          </div>
        );
    }
  };

  // ─── RENDER DYNAMIC ARTICLE HERO LAYOUT ───
  const renderHeaderLayout = () => {
    switch (headerLayout) {
      case "split":
        return (
          <div className="p-6 sm:p-10 border-b border-[#E7DED3]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#B85C38] text-white text-xs font-bold uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF8F3] border border-[#E7DED3] text-[#6F665E] text-xs font-medium">
                    {readingTime}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#2F241D] leading-tight">
                  {title}
                </h1>
                <div className="flex items-center gap-4 text-xs text-[#6F665E] pt-1">
                  <span className="flex items-center gap-1.5 font-bold text-[#2F241D]">
                    <User className="w-4 h-4 text-[#B85C38]" />
                    {author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#B85C38]" />
                    {publishedAt}
                  </span>
                </div>
                {description && (
                  <div className="pt-2">
                    {renderLeadSummaryStyle(description, leadStyle, false)}
                  </div>
                )}
              </div>
              <div className="lg:col-span-5 h-[280px] sm:h-[340px] rounded-2xl overflow-hidden border border-[#E7DED3] bg-stone-100 shadow-md">
                <img loading="lazy" decoding="async"
                  src={coverImage || BIHAR_PRESET_IMAGES[0]?.url || ""}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = BIHAR_PRESET_IMAGES[0]?.url || "";
                  }}
                />
              </div>
            </div>
          </div>
        );

      case "overlay":
        return (
          <div className="relative w-full min-h-[420px] sm:min-h-[500px] bg-[#2F241D] overflow-hidden flex flex-col justify-end">
            <img loading="lazy" decoding="async"
              src={coverImage || BIHAR_PRESET_IMAGES[0]?.url || ""}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = BIHAR_PRESET_IMAGES[0]?.url || "";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />
            <div className="relative z-1 p-6 sm:p-10 text-white text-left max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#B85C38] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  {category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                  {readingTime}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight text-white drop-shadow-md">
                {title}
              </h1>
              <div className="flex items-center gap-6 text-xs sm:text-sm text-stone-300 font-sans pb-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#B85C38]" />
                  {author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#B85C38]" />
                  {publishedAt}
                </span>
              </div>
              {description && (
                <div className="pt-2">
                  {renderLeadSummaryStyle(description, leadStyle, true)}
                </div>
              )}
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className="p-8 sm:p-12 text-center space-y-6 border-b border-[#E7DED3]">
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FAF8F3] border border-[#E7DED3] text-[#B85C38] text-xs font-bold uppercase tracking-wider">
                {category}
              </span>
              <span className="text-xs text-[#6F665E]">• {readingTime}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2F241D] leading-tight max-w-3xl mx-auto">
              {title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-xs text-[#6F665E] font-medium border-t border-b border-[#E7DED3] py-3 max-w-md mx-auto">
              <span className="flex items-center gap-1.5 font-bold text-[#2F241D]">
                <User className="w-4 h-4 text-[#B85C38]" />
                {author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#B85C38]" />
                {publishedAt}
              </span>
            </div>
            {description && (
              <div className="max-w-2xl mx-auto pt-2">
                {renderLeadSummaryStyle(description, leadStyle, false)}
              </div>
            )}
            {coverImage && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-[#E7DED3] h-[320px] sm:h-[400px] shadow-sm">
                <img loading="lazy" decoding="async"
                  src={coverImage}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = BIHAR_PRESET_IMAGES[0]?.url || "";
                  }}
                />
              </div>
            )}
          </div>
        );

      case "standard":
      default:
        return (
          <>
            <div className="relative w-full h-[320px] sm:h-[420px] bg-[#2F241D] overflow-hidden">
              {coverImage ? (
                <img loading="lazy" decoding="async"
                  src={coverImage}
                  alt={title}
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = BIHAR_PRESET_IMAGES[0]?.url || "";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2F241D] to-[#B85C38] text-white p-6 text-center">
                  <Sparkles className="w-12 h-12 mb-3 text-amber-300 opacity-80" />
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-200">Bihar Heritage Journal</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white text-left">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#B85C38] text-white text-xs font-bold uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                    {readingTime}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-serif font-bold leading-tight mb-3 text-white drop-shadow-sm">
                  {title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-amber-100/90 font-sans">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#B85C38]" />
                    {author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#B85C38]" />
                    {publishedAt}
                  </span>
                </div>
              </div>
            </div>

            {description && (
              <div className="p-6 sm:p-10 pb-0 text-left">
                {renderLeadSummaryStyle(description, leadStyle, false)}
              </div>
            )}
          </>
        );
    }
  };
  // ─── RENDER NARRATIVE PARAGRAPH BY TYPOGRAPHY STYLE ───
  const renderNarrativeText = (sec) => {
    if (!sec.content) return null;
    const style = sec.textStyle || "default";

    switch (style) {
      case "drop-cap":
        return (
          <p className="font-serif text-base sm:text-[17px] text-[#3D332A] leading-relaxed font-normal whitespace-pre-line first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#B85C38] first-letter:font-serif first-letter:leading-none">
            {sec.content}
          </p>
        );
      case "modern-sans":
        return (
          <p className="font-sans text-sm sm:text-base text-[#2F241D]/90 leading-[1.8] font-normal whitespace-pre-line">
            {sec.content}
          </p>
        );
      case "academic-italic":
        return (
          <p className="font-serif text-base sm:text-[17px] text-[#2F241D] leading-relaxed italic whitespace-pre-line border-l-2 border-[#B85C38]/40 pl-3.5">
            {sec.content}
          </p>
        );
      case "editorial-serif":
        return (
          <p className="font-serif text-base sm:text-[17px] text-[#3D332A] leading-relaxed font-normal whitespace-pre-line">
            {sec.content}
          </p>
        );
      case "default":
      default:
        return (
          <p className="font-sans text-base sm:text-[16px] text-[#2F241D]/90 leading-relaxed font-normal whitespace-pre-line">
            {sec.content}
          </p>
        );
    }
  };

  // ─── RENDER EDITORIAL MESSAGE BOX / CALLOUT CARD ───
  const renderCalloutBox = (sec) => {
    if (!sec.calloutEnabled || !sec.calloutText) return null;

    const title = sec.calloutTitle || "Editorial Note";
    const type = sec.calloutType || "info";

    switch (type) {
      case "fact":
        return (
          <div className="my-6 p-5 sm:p-6 rounded-xl bg-[#B85C38]/[0.07] border border-[#B85C38]/25 text-[#2F241D] shadow-2xs relative overflow-hidden text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <Tag className="w-3.5 h-3.5 text-[#B85C38]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B85C38]">
                {title || "Heritage Fact"}
              </h4>
            </div>
            <p className="font-sans text-sm sm:text-[15px] font-medium leading-relaxed text-[#2F241D]">
              {sec.calloutText}
            </p>
          </div>
        );

      case "alert":
        return (
          <div className="my-6 p-5 sm:p-6 rounded-xl bg-amber-500/[0.07] border border-amber-400/35 text-[#2F241D] shadow-2xs relative overflow-hidden text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {title || "Preservation & Visitor Advisory"}
              </h4>
            </div>
            <p className="font-sans text-sm sm:text-[15px] font-normal leading-relaxed text-[#2F241D]">
              {sec.calloutText}
            </p>
          </div>
        );

      case "accent-border":
      case "quote":
        return (
          <div className="my-6 p-5 sm:p-6 rounded-r-xl bg-[#FAF8F3] border-l-4 border-l-[#B85C38] border border-[#E7DED3] text-[#2F241D] shadow-2xs relative text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <PanelLeft className="w-4 h-4 text-[#B85C38]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B85C38]">
                {title || "Accent Note"}
              </h4>
            </div>
            <p className="font-serif italic text-base sm:text-[17px] leading-[1.8] text-[#2F241D] pl-1">
              {sec.calloutText}
            </p>
          </div>
        );

      case "info":
      default:
        return (
          <div className="my-6 p-5 sm:p-6 rounded-xl bg-[#FAF8F3] border-l-[3.5px] border-l-[#B85C38] border border-[#E7DED3] text-[#2F241D] shadow-2xs relative text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#B85C38]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F241D]">
                {title || "Editorial Note"}
              </h4>
            </div>
            <p className="font-sans text-sm sm:text-[15px] font-normal leading-relaxed text-[#4A3E36]">
              {sec.calloutText}
            </p>
          </div>
        );
    }
  };

  // Helper to render media images stack (1, 2, 3, 4, 5+ images)
  const renderMediaStack = (images) => {
    if (!images || images.length === 0) return null;

    // ─── 1 IMAGE: Full-height prominent photo ───
    if (images.length === 1) {
      return (
        <div className="space-y-2 w-full">
          <div className="rounded-2xl overflow-hidden border border-[#E7DED3] shadow-md h-[340px] sm:h-[420px] lg:h-[460px] w-full bg-stone-100">
            <img loading="lazy" decoding="async"
              src={images[0]?.url}
              alt={images[0]?.caption || "Section Media"}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
              }}
            />
          </div>
          {images[0]?.caption && (
            <p className="text-xs text-center font-mono text-[#6F665E] italic">
              — {images[0].caption}
            </p>
          )}
        </div>
      );
    }

    // ─── 2 IMAGES: Clean 2-photo grid ───
    if (images.length === 2) {
      return (
        <div className="space-y-3 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 w-full">
            {images.map((img, iIdx) => (
              <div key={img.id || iIdx} className="space-y-1">
                <div className="rounded-2xl overflow-hidden border border-[#E7DED3] shadow-xs h-[200px] sm:h-[230px] w-full bg-stone-100">
                  <img loading="lazy" decoding="async"
                    src={img.url}
                    alt={img.caption || `Media ${iIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                    }}
                  />
                </div>
                {img.caption && (
                  <p className="text-[10px] font-mono text-center text-[#6F665E] truncate">
                    — {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ─── 3 IMAGES: 1 Hero Top + 2 Bottom Photos ───
    if (images.length === 3) {
      return (
        <div className="space-y-3 w-full">
          <div className="space-y-1">
            <div className="rounded-2xl overflow-hidden border border-[#E7DED3] shadow-xs h-[220px] sm:h-[250px] w-full bg-stone-100">
              <img loading="lazy" decoding="async"
                src={images[0]?.url}
                alt={images[0]?.caption || "Main Media"}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                }}
              />
            </div>
            {images[0]?.caption && (
              <p className="text-[10px] font-mono text-center text-[#6F665E] truncate">
                — {images[0].caption}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {images.slice(1, 3).map((img, iIdx) => (
              <div key={img.id || iIdx} className="space-y-1">
                <div className="rounded-xl overflow-hidden border border-[#E7DED3] shadow-2xs h-[125px] sm:h-[145px] w-full bg-stone-100">
                  <img loading="lazy" decoding="async"
                    src={img.url}
                    alt={img.caption || `Media ${iIdx + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                    }}
                  />
                </div>
                {img.caption && (
                  <p className="text-[9px] font-mono text-center text-[#6F665E] truncate">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ─── 4 IMAGES: Balanced 2x2 Photo Mosaic Grid ───
    if (images.length === 4) {
      return (
        <div className="space-y-2 w-full">
          <div className="grid grid-cols-2 gap-2.5 w-full">
            {images.map((img, iIdx) => (
              <div key={img.id || iIdx} className="space-y-1">
                <div className="rounded-xl overflow-hidden border border-[#E7DED3] shadow-2xs h-[140px] sm:h-[165px] w-full bg-stone-100">
                  <img loading="lazy" decoding="async"
                    src={img.url}
                    alt={img.caption || `Media ${iIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                    }}
                  />
                </div>
                {img.caption && (
                  <p className="text-[9px] font-mono text-center text-[#6F665E] truncate px-1">
                    — {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ─── 5+ IMAGES: 1 Hero Top + Multi-Photo Gallery Sub-Grid ───
    return (
      <div className="space-y-3 w-full">
        {/* Top Hero Photo */}
        <div className="space-y-1">
          <div className="rounded-2xl overflow-hidden border border-[#E7DED3] shadow-xs h-[200px] sm:h-[240px] w-full bg-stone-100">
            <img loading="lazy" decoding="async"
              src={images[0]?.url}
              alt={images[0]?.caption || "Lead Media"}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
              }}
            />
          </div>
          {images[0]?.caption && (
            <p className="text-[10px] font-mono text-center text-[#6F665E] truncate">
              — {images[0].caption}
            </p>
          )}
        </div>

        {/* Multi-Photo Grid for All Remaining Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.slice(1).map((img, iIdx) => (
            <div key={img.id || iIdx} className="space-y-1">
              <div className="rounded-lg overflow-hidden border border-[#E7DED3] shadow-2xs h-[100px] sm:h-[115px] w-full bg-stone-100">
                <img loading="lazy" decoding="async"
                  src={img.url}
                  alt={img.caption || `Media ${iIdx + 2}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                  }}
                />
              </div>
              {img.caption && (
                <p className="text-[9px] font-mono text-center text-[#6F665E] truncate">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`mx-auto transition-all duration-300 ${getDeviceClass()}`}>
      <div id="preview-header-meta" className="w-full bg-white rounded-lg border border-[#E7DED3] shadow-md overflow-hidden text-left font-sans">

        {/* Render Selected Article Hero Layout */}
        {renderHeaderLayout()}

        {/* Article Sections Render */}
        <div className="p-6 sm:p-10 space-y-12">
          {sections.map((sec, idx) => {
            const images = sec.images || [];
            const layout = sec.layoutType || "text-left-image-right";

            // 1. SIDE BY SIDE LAYOUTS (Text Left + Media Right OR Media Left + Text Right)
            if (layout === "text-left-image-right" || layout === "image-left-text-right" || layout === "dual") {
              const isImageLeft = layout === "image-left-text-right";
              return (
                <section
                  id={`preview-sec-${sec.id}`}
                  key={sec.id || idx}
                  className="border-b border-[#E7DED3]/60 pb-12 last:border-none last:pb-0 text-left space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Media Column */}
                    <div className={`${isImageLeft ? "lg:col-span-5 order-2 lg:order-1" : "lg:col-span-5 order-2"}`}>
                      {renderMediaStack(images)}
                    </div>

                    {/* Text Narrative Column */}
                    <div className={`space-y-4 ${isImageLeft ? "lg:col-span-7 order-1 lg:order-2" : "lg:col-span-7 order-1"}`}>
                      <div className="space-y-2">
                        {sec.subtitle && (
                          <div className="inline-flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B85C38]" />
                            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#B85C38]">
                              {sec.subtitle}
                            </span>
                          </div>
                        )}
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F241D] leading-tight tracking-tight">
                          {sec.title || `Section ${idx + 1}`}
                        </h2>
                        <div className="h-[2px] w-12 bg-gradient-to-r from-[#B85C38] to-[#D98A5F]/40 rounded-full my-1.5" />
                      </div>

                      {sec.content && (
                        <div className="pt-1">
                          {renderNarrativeText(sec)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Render Editorial Message Box AFTER media and content */}
                  {renderCalloutBox(sec)}
                </section>
              );
            }

            // 2. STANDARD FULL-WIDTH & OTHER LAYOUTS
            return (
              <section
                id={`preview-sec-${sec.id}`}
                key={sec.id || idx}
                className="space-y-5 border-b border-[#E7DED3]/60 pb-10 last:border-none last:pb-0 scroll-mt-6 text-left"
              >
                {/* Section Header */}
                <div className="space-y-1">
                  {sec.subtitle && (
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#B85C38] block">
                      {sec.subtitle}
                    </span>
                  )}
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2F241D]">
                    {sec.title || `Section ${idx + 1}`}
                  </h2>
                </div>

                {/* Narrative Paragraph Content */}
                {sec.layoutType !== "quote" && sec.content && (
                  <div className="pt-1">
                    {renderNarrativeText(sec)}
                  </div>
                )}

                {/* Layout Type: Featured Photo Showcase (Supports 1, 2, or multiple photos) */}
                {sec.layoutType === "single" && images.length > 0 && (
                  <div className="pt-2">
                    {images.length === 1 ? (
                      /* 1 Single Featured Photo */
                      <div className="space-y-2">
                        <div className="rounded-2xl overflow-hidden border border-[#E7DED3] shadow-xs bg-stone-100 h-[300px] sm:h-[420px] w-full">
                          <img loading="lazy" decoding="async"
                            src={images[0]?.url}
                            alt={images[0]?.caption || "Featured Image"}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                            }}
                          />
                        </div>
                        {images[0]?.caption && (
                          <p className="text-xs text-center font-mono text-[#6F665E] italic">
                            — {images[0].caption}
                          </p>
                        )}
                      </div>
                    ) : (
                      /* 2 or More Featured Photos in Responsive Showcase Grid */
                      <div className="space-y-4">
                        <div className={`grid gap-4 ${images.length === 2
                          ? "grid-cols-1 sm:grid-cols-2"
                          : images.length === 4
                            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                          }`}>
                          {images.map((img, iIdx) => (
                            <div key={img.id || iIdx} className="space-y-1.5">
                              <div className="rounded-2xl overflow-hidden border border-[#E7DED3] shadow-xs bg-stone-100 h-[220px] sm:h-[260px] w-full">
                                <img loading="lazy" decoding="async"
                                  src={img.url}
                                  alt={img.caption || `Featured Photo ${iIdx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                                  }}
                                />
                              </div>
                              {img.caption && (
                                <p className="text-[11px] text-center font-mono text-[#6F665E] italic truncate px-2">
                                  — {img.caption}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Layout Type: Gallery Grid (Supports 1, 2, 3, 4+ Columns dynamically) */}
                {sec.layoutType === "grid" && images.length > 0 && (
                  <div className={`grid gap-3.5 pt-2 ${images.length === 1
                    ? "grid-cols-1"
                    : images.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : images.length === 4
                        ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    }`}>
                    {images.map((img, iIdx) => (
                      <div key={img.id || iIdx} className="space-y-1">
                        <div className="rounded-xl overflow-hidden border border-[#E7DED3] h-44 sm:h-52 shadow-2xs bg-stone-100">
                          <img loading="lazy" decoding="async"
                            src={img.url}
                            alt={img.caption || `Grid Image ${iIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                            }}
                          />
                        </div>
                        {img.caption && (
                          <p className="text-[10px] font-mono text-center text-[#6F665E] truncate px-1">
                            — {img.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Layout Type: Panoramic Fullwidth Banner (Sharp/Minimal rounded corners, Cinematic Presentations) */}
                {sec.layoutType === "fullwidth" && images.length > 0 && (
                  <div className="pt-3 -mx-6 sm:-mx-10 space-y-3">
                    {images.length === 1 ? (
                      /* ─── 1. SINGLE IMMERSIVE WIDESCREEN BANNER ─── */
                      <div className="space-y-2">
                        <div className="relative w-full h-[340px] sm:h-[460px] lg:h-[500px] overflow-hidden rounded-[3px] border-y sm:border border-[#E7DED3] bg-stone-900 shadow-sm group">
                          <img loading="lazy" decoding="async"
                            src={images[0]?.url}
                            alt={images[0]?.caption || "Panoramic Landscape Banner"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
                          {images[0]?.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-serif font-medium tracking-wide drop-shadow-md text-amber-50">
                                {images[0].caption}
                              </span>
                              <span className="text-[10px] font-mono uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-[2px] border border-white/20 text-white/90">
                                Panoramic View
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : images.length === 2 ? (
                      /* ─── 2. DUAL PANORAMIC DIPTYCH (Sharp Minimal Edges & Split Ratio) ─── */
                      <div className="space-y-2 px-1 sm:px-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                          {images.map((img, iIdx) => (
                            <div key={img.id || iIdx} className="relative group rounded-[3px] overflow-hidden border border-[#E7DED3] bg-stone-900 shadow-2xs h-[250px] sm:h-[320px]">
                              <img loading="lazy" decoding="async"
                                src={img.url}
                                alt={img.caption || `Panoramic View ${iIdx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white flex items-end justify-between gap-2">
                                <span className="text-xs font-serif text-amber-50 drop-shadow-xs truncate">
                                  {img.caption || `Perspective ${iIdx === 0 ? "I" : "II"}`}
                                </span>
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-1.5 py-0.5 rounded-[2px] shrink-0 border border-white/20">
                                  {iIdx === 0 ? "View A" : "View B"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-center font-mono text-[#6F665E] italic pt-1">
                          — Dual Panoramic Survey: {images.map((m, idx) => m.caption || `Perspective ${idx + 1}`).join(" • ")}
                        </p>
                      </div>
                    ) : images.length === 3 ? (
                      /* ─── 3. TRIPTYCH MULTI-PANORAMIC ROW ─── */
                      <div className="space-y-2.5 px-1 sm:px-0">
                        {/* Top Primary Hero Panoramic */}
                        <div className="relative w-full h-[260px] sm:h-[360px] overflow-hidden rounded-[3px] border border-[#E7DED3] bg-stone-900 shadow-2xs group">
                          <img loading="lazy" decoding="async"
                            src={images[0]?.url}
                            alt={images[0]?.caption || "Primary Panoramic"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop";
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white flex justify-between items-center">
                            <span className="text-xs font-serif text-amber-100">{images[0]?.caption || "Primary Panoramic Vista"}</span>
                            <span className="text-[9px] font-mono uppercase bg-black/40 px-2 py-0.5 rounded-[2px] border border-white/20">Lead Vista</span>
                          </div>
                        </div>

                        {/* Bottom Secondary Panoramic Strips */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                          {images.slice(1, 3).map((img, iIdx) => (
                            <div key={img.id || iIdx} className="relative h-[180px] sm:h-[220px] rounded-[3px] overflow-hidden border border-[#E7DED3] bg-stone-900 group">
                              <img loading="lazy" decoding="async"
                                src={img.url}
                                alt={img.caption || `Sub Panoramic ${iIdx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop";
                                }}
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent text-white text-[11px] font-serif truncate">
                                {img.caption || `Detail ${iIdx + 1}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : images.length === 4 ? (
                      /* ─── 4. QUAD PANORAMIC 2x2 CINEMATIC MOSAIC ─── */
                      <div className="space-y-2 px-1 sm:px-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                          {images.map((img, iIdx) => (
                            <div key={img.id || iIdx} className="relative group rounded-[3px] overflow-hidden border border-[#E7DED3] bg-stone-900 shadow-2xs h-[200px] sm:h-[250px]">
                              <img loading="lazy" decoding="async"
                                src={img.url}
                                alt={img.caption || `Panoramic Perspective ${iIdx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute bottom-0 left-0 right-0 p-3 text-white flex items-end justify-between gap-2">
                                <span className="text-xs font-serif text-amber-50 drop-shadow-xs truncate">
                                  {img.caption || `Perspective ${iIdx + 1}`}
                                </span>
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-1.5 py-0.5 rounded-[2px] shrink-0 border border-white/20">
                                  Vista {iIdx + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* ─── 5+ MULTI-PANORAMIC CURATED GALLERY ─── */
                      <div className="space-y-2.5 px-1 sm:px-0">
                        {/* Top Grand Panoramic Banner */}
                        <div className="relative w-full h-[280px] sm:h-[380px] overflow-hidden rounded-[3px] border border-[#E7DED3] bg-stone-900 shadow-2xs group">
                          <img loading="lazy" decoding="async"
                            src={images[0]?.url}
                            alt={images[0]?.caption || "Primary Panoramic Vista"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop";
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-black/75 to-transparent text-white flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-serif text-amber-50">{images[0]?.caption || "Lead Panoramic Vista"}</span>
                            <span className="text-[10px] font-mono uppercase bg-black/40 px-2 py-0.5 rounded-[2px] border border-white/20">Primary Vista</span>
                          </div>
                        </div>

                        {/* Multi-Column Sub-Panoramics for All Remaining Photos */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5">
                          {images.slice(1).map((img, iIdx) => (
                            <div key={img.id || iIdx} className="relative h-[140px] sm:h-[170px] rounded-[3px] overflow-hidden border border-[#E7DED3] bg-stone-900 group">
                              <img loading="lazy" decoding="async"
                                src={img.url}
                                alt={img.caption || `Sub Panoramic ${iIdx + 2}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop";
                                }}
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] font-serif truncate">
                                {img.caption || `Perspective ${iIdx + 2}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Render Editorial Message Box ALWAYS AFTER the images/content */}
                {renderCalloutBox(sec)}

                {/* Layout Type: Highlight Quote Box */}
                {sec.layoutType === "quote" && (
                  <div className="my-6 space-y-4">
                    <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F3] border-l-4 border-[#B85C38] shadow-2xs">
                      <span className="text-3xl font-serif text-[#B85C38] leading-none block mb-2">“</span>
                      <p className="font-serif text-lg sm:text-2xl text-[#2F241D] italic leading-relaxed">
                        {sec.content}
                      </p>
                    </div>

                    {images.length > 0 && (
                      <div className="rounded-2xl overflow-hidden border border-[#E7DED3] shadow-xs">
                        <img loading="lazy" decoding="async"
                          src={images[0]?.url}
                          alt={images[0]?.caption || "Quote media photo"}
                          className="w-full h-[260px] sm:h-[340px] object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                          }}
                        />
                        {images[0]?.caption && (
                          <div className="p-3 bg-[#FAF8F3] border-t border-[#E7DED3] text-xs font-mono text-center text-[#6F665E] italic">
                            — {images[0].caption}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </section>
            );
          })}
        </div>

        {/* Article Footer End Note */}
        <div className="bg-[#FAF8F3] border-t border-[#E7DED3] p-6 text-center text-xs font-serif text-[#6F665E]">
          <span>Published by <strong className="text-[#2F241D]">{author}</strong> for Bihar Heritage Journal</span>
        </div>

      </div>
    </div>
  );
};

export default BlogArticlePreview;
