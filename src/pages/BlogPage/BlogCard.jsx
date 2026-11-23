import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

const BlogCard = ({ article }) => {
  const navigate = useNavigate();

  if (!article) return null;

  return (
    <a
      href={`/blog/${article.slug}`}
      onClick={(e) => {
        e.preventDefault();
        navigate(`/blog/${article.slug}`);
      }}
      className="flex flex-col bg-white rounded-[18px] border border-[#E8DFC8] overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer h-full"
    >
      {/* Image */}
      <div className="relative w-full h-[210px] overflow-hidden bg-[#F0EBE1]">
        <img loading="lazy" decoding="async"
          src={article.coverImage || article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        {/* Top accent on hover */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C56A3D] via-[#C2A55D] to-[#C56A3D] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Category overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[8px] font-sans font-bold uppercase tracking-widest bg-black/50 backdrop-blur-sm text-white/90">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-cormorant text-[19px] md:text-[21px] font-bold text-[#2C2C2C] leading-snug mb-3 group-hover:text-[#C56A3D] transition-colors duration-300 line-clamp-2">
          {article.title}
        </h3>

        {/* Description */}
        <p className="font-sans text-xs md:text-[13px] text-[#5A5A5A] font-light leading-relaxed line-clamp-3 mb-5 flex-grow">
          {article.description}
        </p>

        {/* Footer meta + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8DFC8]/60">
          <div className="flex items-center gap-1.5 text-[9px] font-sans text-[#8A8A8A] uppercase tracking-widest">
            <Clock size={9} />
            <span>{article.readingTime}</span>
            <span className="mx-1 w-px h-2.5 bg-[#E8DFC8]" />
            <span>{article.publishedAt}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-sans font-bold uppercase tracking-widest text-[#C56A3D] group-hover:gap-2 transition-all duration-200">
            Read
            <ArrowRight size={9} />
          </span>
        </div>
      </div>
    </a>
  );
};

export default BlogCard;
