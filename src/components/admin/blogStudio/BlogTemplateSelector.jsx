import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Image as ImageIcon, Plus } from "lucide-react";
import { BLOG_TEMPLATES, BIHAR_PRESET_IMAGES, generateUniqueId } from "./templateData";

const BlogTemplateSelector = ({ onSelectTemplate, onSelectBlank }) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-2 sm:px-4 text-left font-sans">
      {/* ─── CLEAN MINIMAL HEADER ─── */}
      <div className="mb-8 border-b border-[#E7DED3] pb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F241D] tracking-tight">
          Select Blog Structure
        </h1>
        <p className="text-xs sm:text-sm text-[#6F665E] mt-1 font-normal">
          Choose a pre-structured editorial layout featuring Bihar heritage sites or build custom sections.
        </p>
      </div>

      {/* ─── SINGLE TEMPLATE CARD ─── */}
      <div className="max-w-xl mx-auto mb-8">
        {BLOG_TEMPLATES.slice(0, 1).map((tpl) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => onSelectTemplate(tpl)}
            className="group bg-white rounded-2xl border border-[#E7DED3] hover:border-[#B85C38] p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B85C38] bg-[#FAF8F3] px-2.5 py-1 rounded-md border border-[#E7DED3]">
                  Standard Editorial Layout
                </span>
                <span className="text-[11px] text-[#6F665E] font-medium">
                  {tpl.sections.length} Sections
                </span>
              </div>

              <h2 className="text-xl font-serif font-bold text-[#2F241D] group-hover:text-[#B85C38] transition-colors">
                Bihar Heritage Article Structure
              </h2>
              <p className="text-xs sm:text-sm text-[#6F665E] mt-1.5 leading-relaxed">
                Pre-structured editorial layout with hero banner, narrative sections, and image galleries.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E7DED3]/60 flex items-center justify-between mt-6">
              <span className="text-xs text-[#6F665E]">
                Preset Bihar Cover
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F241D] group-hover:bg-[#B85C38] text-white text-xs font-semibold transition-colors"
              >
                <span>Use Article Structure</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default BlogTemplateSelector;
