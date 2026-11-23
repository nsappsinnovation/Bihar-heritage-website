import React, { useState, useEffect, useRef } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

/**
 * Clean, professional, minimal category/filter dropdown component for Bihar Heritage Admin.
 */
export default function AdminCategoryDropdown({
  label = "Category",
  icon: Icon = Filter,
  options = [],
  selected = "All",
  onSelect,
  totalCount
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selected) || options[0] || {
    label: `All ${label === "Authority" ? "Authorities" : "Categories"}`,
    count: totalCount
  };
  const displayCount = selectedOption?.count ?? totalCount ?? 0;

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E7DED3] hover:border-[#B85C38] rounded-md text-xs font-semibold text-[#2F241D] transition-colors cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <Icon className="w-3.5 h-3.5 text-[#B85C38] shrink-0" />
        <span className="text-[11px] font-bold text-[#6F665E] uppercase tracking-wider">
          {label}:
        </span>
        <span className="font-bold text-[#2F241D]">
          {selectedOption.label}
        </span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#FAF8F3] border border-[#E7DED3] text-[#6F665E]">
          {displayCount}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#6F665E] transition-transform duration-150 ${
            isOpen ? "rotate-180 text-[#B85C38]" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-lg border border-[#E7DED3] py-1 z-40 max-h-72 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6F665E] border-b border-[#E7DED3]/60 mb-1 flex items-center justify-between sticky top-0 bg-white z-10">
            <span>Select {label}</span>
            <span className="font-mono text-[#B85C38] font-bold">
              {totalCount ?? options[0]?.count ?? 0} total
            </span>
          </div>
          <div className="space-y-0.5 px-1">
            {options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSelect(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#FAF8F3] text-[#B85C38] font-bold"
                      : "text-[#2F241D] hover:bg-[#FAF8F3]/80 hover:text-[#B85C38]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-[#B85C38] shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  <span
                    className={`ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      isSelected
                        ? "bg-white border-[#B85C38]/40 text-[#B85C38] font-bold"
                        : "bg-[#FAF8F3] border-[#E7DED3] text-[#6F665E]"
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
