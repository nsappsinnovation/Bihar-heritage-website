import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full md:w-72 max-w-full shrink-0">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A] pointer-events-none" />
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs font-sans text-[#2C2C2C] bg-white border border-[#E8DFC8] placeholder-[#8A8A8A]/70 focus:outline-none focus:border-[#C56A3D] focus:ring-1 focus:ring-[#C56A3D]/30 transition-all duration-300 shadow-sm"
      />
    </div>
  );
};

export default SearchBar;
