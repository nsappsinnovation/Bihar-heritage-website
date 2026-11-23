import React from "react";

/**
 * Simple rich text editor placeholder.
 * Uses a textarea with basic formatting hints.
 * In production, replace with TipTap, Slate, or similar.
 */
const RichTextEditor = ({ label = "Content", value, onChange, name }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold font-sans text-[#6F665E] uppercase tracking-wider">
        {label}
      </label>
      <div className="rounded-2xl border border-[#E7DED3] overflow-hidden bg-white">
        {/* Toolbar hint */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-[#E7DED3]/60 bg-[#FAF8F3]">
          <button type="button" className="px-2 py-1 text-xs font-bold text-[#6F665E] hover:text-[#B85C38] rounded transition cursor-pointer">B</button>
          <button type="button" className="px-2 py-1 text-xs italic text-[#6F665E] hover:text-[#B85C38] rounded transition cursor-pointer">I</button>
          <button type="button" className="px-2 py-1 text-xs underline text-[#6F665E] hover:text-[#B85C38] rounded transition cursor-pointer">U</button>
          <div className="w-px h-4 bg-[#E7DED3] mx-1" />
          <span className="text-[10px] text-[#6F665E]/60 font-sans">Plain text mode</span>
        </div>
        <textarea
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          rows={8}
          placeholder="Write your content here…"
          className="w-full px-4 py-3 text-sm font-sans text-[#2F241D] leading-relaxed focus:outline-none resize-y min-h-[160px] placeholder:text-[#6F665E]/50"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
