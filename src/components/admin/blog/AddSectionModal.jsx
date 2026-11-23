import React, { useState } from "react";
import { X, Image, AlignLeft, Quote, Type, LayoutTemplate } from "lucide-react";

/**
 * Modal to choose a section layout type when adding a new section.
 * Shows radio options with visual layout previews.
 */

const SECTION_TYPES = [
  {
    id: "imageTop",
    label: "Image Top",
    icon: Image,
    description: "Full-width image above text content",
    preview: (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="h-8 bg-[#E7DED3] rounded" />
        <div className="h-2 bg-[#E7DED3]/60 rounded w-3/4" />
        <div className="h-2 bg-[#E7DED3]/40 rounded w-full" />
        <div className="h-2 bg-[#E7DED3]/40 rounded w-5/6" />
      </div>
    ),
  },
  {
    id: "imageLeft",
    label: "Image Left",
    icon: LayoutTemplate,
    description: "Image on the left, text on the right",
    preview: (
      <div className="flex gap-2 w-full">
        <div className="w-1/2 h-14 bg-[#E7DED3] rounded shrink-0" />
        <div className="flex flex-col gap-1 w-1/2">
          <div className="h-2 bg-[#E7DED3]/60 rounded w-full" />
          <div className="h-2 bg-[#E7DED3]/40 rounded w-3/4" />
          <div className="h-2 bg-[#E7DED3]/40 rounded w-full" />
        </div>
      </div>
    ),
  },
  {
    id: "imageRight",
    label: "Image Right",
    icon: LayoutTemplate,
    description: "Text on the left, image on the right",
    preview: (
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-1 w-1/2">
          <div className="h-2 bg-[#E7DED3]/60 rounded w-full" />
          <div className="h-2 bg-[#E7DED3]/40 rounded w-3/4" />
          <div className="h-2 bg-[#E7DED3]/40 rounded w-full" />
        </div>
        <div className="w-1/2 h-14 bg-[#E7DED3] rounded shrink-0" />
      </div>
    ),
  },
  {
    id: "quote",
    label: "Quote",
    icon: Quote,
    description: "Styled blockquote with optional author",
    preview: (
      <div className="flex flex-col items-center gap-1.5 w-full py-1">
        <span className="text-[#B85C38]/40 text-lg font-serif leading-none">"</span>
        <div className="h-2 bg-[#E7DED3]/60 rounded w-3/4" />
        <div className="h-2 bg-[#E7DED3]/40 rounded w-1/2" />
        <div className="h-1.5 bg-[#E7DED3]/30 rounded w-1/3 mt-1" />
      </div>
    ),
  },
  {
    id: "text",
    label: "Text",
    icon: Type,
    description: "Plain text content with optional heading",
    preview: (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="h-2.5 bg-[#E7DED3]/60 rounded w-1/2" />
        <div className="h-2 bg-[#E7DED3]/40 rounded w-full" />
        <div className="h-2 bg-[#E7DED3]/40 rounded w-5/6" />
        <div className="h-2 bg-[#E7DED3]/40 rounded w-full" />
      </div>
    ),
  },
];

const AddSectionModal = ({ isOpen, onClose, onCreate }) => {
  const [selectedType, setSelectedType] = useState("imageTop");

  if (!isOpen) return null;

  const handleCreate = () => {
    const sectionId = `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const baseSection = { id: sectionId, type: selectedType };

    let newSection;
    if (selectedType === "quote") {
      newSection = { ...baseSection, quote: "", author: "" };
    } else {
      newSection = { ...baseSection, heading: "", image: "", body: "" };
      if (selectedType === "text") {
        delete newSection.image;
      }
    }

    onCreate(newSection);
    setSelectedType("imageTop");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#E7DED3] shadow-2xl w-full max-w-[540px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E7DED3] bg-[#FAF8F3]">
            <h3 className="font-cormorant text-xl font-bold text-[#2F241D]">
              Choose Section Layout
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#6F665E] hover:text-[#B85C38] hover:bg-[#B85C38]/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Layout Options */}
          <div className="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto">
            {SECTION_TYPES.map((stype) => {
              const Icon = stype.icon;
              const isSelected = selectedType === stype.id;
              return (
                <button
                  key={stype.id}
                  type="button"
                  onClick={() => setSelectedType(stype.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? "border-[#B85C38] bg-[#B85C38]/5"
                      : "border-[#E7DED3] bg-white hover:border-[#B85C38]/30 hover:bg-[#FAF8F3]"
                  }`}
                >
                  {/* Radio dot */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "border-[#B85C38]" : "border-[#E7DED3]"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#B85C38]" />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[#B85C38] text-white"
                        : "bg-[#FAF8F3] text-[#6F665E]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Text */}
                  <div className="flex-grow min-w-0">
                    <span className="block text-sm font-semibold text-[#2F241D] font-sans">
                      {stype.label}
                    </span>
                    <span className="block text-[11px] text-[#6F665E] font-sans mt-0.5">
                      {stype.description}
                    </span>
                  </div>

                  {/* Layout Preview */}
                  <div className="w-24 shrink-0 hidden sm:block">{stype.preview}</div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E7DED3] bg-[#FAF8F3]">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold font-sans text-[#6F665E] hover:text-[#2F241D] border border-[#E7DED3] hover:border-[#2F241D]/20 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold font-sans text-white bg-[#B85C38] hover:bg-[#A0502F] transition shadow-sm cursor-pointer"
            >
              Create Section
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSectionModal;
