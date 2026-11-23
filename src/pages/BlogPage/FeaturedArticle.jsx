import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Tag } from "lucide-react";

const FeaturedArticle = ({ article }) => {
  const navigate = useNavigate();

  if (!article) return null;

  return (
    <div
      onClick={() => navigate(`/blog/${article.slug}`)}
      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch group cursor-pointer"
    >
      {/* Left: Cinematic Image */}
      <div className="lg:col-span-7 relative overflow-hidden rounded-[20px] shadow-lg">
        <div className="relative w-full h-[360px] md:h-[500px] overflow-hidden">
          <img loading="lazy" decoding="async"
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
          {/* Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          {/* Category pill */}
          <div className="absolute top-5 left-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C56A3D] text-white text-[9px] font-sans font-bold uppercase tracking-widest shadow-md">
              <Tag size={8} />
              {article.category}
            </span>
          </div>

          {/* Bottom overlay text */}
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
            <div className="flex items-center gap-3 text-[10px] font-sans text-white/60 uppercase tracking-widest mb-3">
              <span>{article.publishedAt}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <Clock size={9} className="text-white/50" />
              <span>{article.readingTime}</span>
            </div>
            <h2 className="font-cormorant text-2xl md:text-[32px] md:leading-[1.2] font-bold text-white group-hover:text-[#F0D9C4] transition-colors duration-300 drop-shadow-sm line-clamp-2">
              {article.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Right: Editorial Text Panel */}
      <div className="lg:col-span-5 flex flex-col justify-center py-2">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-6 h-[2px] bg-[#C56A3D] rounded-full" />
          <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-[#C56A3D]">
            Featured Story
          </span>
        </div>

        {/* Title */}
        <h1 className="font-cormorant text-3xl md:text-[42px] md:leading-[1.15] font-bold text-[#2C2C2C] mb-5 group-hover:text-[#C56A3D] transition-colors duration-300">
          {article.title}
        </h1>

        {/* Description */}
        <p className="font-sans text-[#5A5A5A] text-sm md:text-[15px] font-light leading-relaxed mb-7 line-clamp-4">
          {article.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[10px] font-sans text-[#8A8A8A] uppercase tracking-widest mb-8 pb-7 border-b border-[#E8DFC8]">
          <span>{article.publishedAt}</span>
          <span className="w-1 h-1 rounded-full bg-[#C2A55D]" />
          <span>{article.readingTime}</span>
        </div>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/blog/${article.slug}`);
          }}
          className="inline-flex items-center gap-2.5 text-[10px] font-sans font-bold uppercase tracking-widest text-[#C56A3D] hover:text-[#A94E2F] transition-colors duration-200 group/btn w-fit"
        >
          <span className="border-b border-[#C56A3D]/40 group-hover/btn:border-[#A94E2F] transition-colors pb-px">
            Read Full Article
          </span>
          <ArrowRight size={11} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedArticle;
