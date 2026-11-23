import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {/* Previous */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-full border border-[#E8DFC8] flex items-center justify-center text-[#5A5A5A] hover:text-[#C56A3D] hover:border-[#C56A3D]/50 bg-white transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Numeric pages */}
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-full font-sans text-[11px] font-bold flex items-center justify-center transition-all duration-300 border cursor-pointer shadow-sm ${
              isActive
                ? "bg-[#C56A3D] text-white border-[#C56A3D] shadow-md shadow-[#C56A3D]/20"
                : "bg-white text-[#5A5A5A] border-[#E8DFC8] hover:text-[#C56A3D] hover:border-[#C56A3D]/50"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-full border border-[#E8DFC8] flex items-center justify-center text-[#5A5A5A] hover:text-[#C56A3D] hover:border-[#C56A3D]/50 bg-white transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        aria-label="Next page"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Pagination;
