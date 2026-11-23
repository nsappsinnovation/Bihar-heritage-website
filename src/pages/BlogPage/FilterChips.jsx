import React from "react";

const FilterChips = ({ activeCategory, onSelectCategory }) => {
  const categories = [
    "All",
    "Architecture",
    "Archaeology",
    "Culture",
    "Conservation",
    "Museums",
    "Festivals",
    "Heritage Walks",
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 py-1 max-w-full">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-1.5 rounded-full text-[9px] font-sans font-bold tracking-[0.18em] uppercase transition-all duration-300 whitespace-nowrap cursor-pointer border ${
              isActive
                ? "bg-[#C56A3D] text-white border-[#C56A3D] shadow-md shadow-[#C56A3D]/20"
                : "bg-white/80 text-[#5A5A5A] border-[#E8DFC8] hover:text-[#C56A3D] hover:border-[#C56A3D]/40 hover:bg-white"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
