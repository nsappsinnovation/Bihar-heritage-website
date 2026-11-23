import React, { useState, useRef, useEffect } from "react";
import {
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  Plus,
  X,
  Upload,
  MessageSquare,
  Columns,
  PanelLeft,
  PanelRight,
  Maximize2,
  Grid as GridIcon,
  AlignLeft,
  Check,
  Image as ImageIcon,
  Sparkles,
  Type,
  ChevronDown
} from "lucide-react";
import { generateUniqueId, BIHAR_PRESET_IMAGES } from "./templateData";

const LAYOUT_OPTIONS = [
  {
    value: "text-left-image-right",
    label: "Split: Text Left + Media Right",
    shortLabel: "Text Left, Media Right",
    icon: PanelRight,
    description: "Narrative story on left with a balanced 1–3 photo stack on the right"
  },
  {
    value: "image-left-text-right",
    label: "Split: Media Left + Text Right",
    shortLabel: "Media Left, Text Right",
    icon: PanelLeft,
    description: "Visual media on the left side with narrative prose on the right"
  },
  {
    value: "single",
    label: "Featured Photo Showcase",
    shortLabel: "Featured Photo",
    icon: Columns,
    description: "Structured narrative followed by a prominent center-aligned hero photo"
  },
  {
    value: "grid",
    label: "Multi-Photo Gallery Grid",
    shortLabel: "Gallery Grid",
    icon: GridIcon,
    description: "Narrative prose followed by a curated 2 or 3-column research photo gallery"
  },
  {
    value: "fullwidth",
    label: "Panoramic Landscape Banner",
    shortLabel: "Panoramic Banner",
    icon: Maximize2,
    description: "Edge-to-edge immersive landscape banner photo for architectural grandeur"
  },
  {
    value: "text-only",
    label: "Focused Text (No Media)",
    shortLabel: "Text Only",
    icon: AlignLeft,
    description: "Distraction-free literary text formatted for deep-dive reading"
  }
];

const TEXT_STYLE_OPTIONS = [
  { value: "default", label: "Default Text" },
  { value: "editorial-serif", label: "Editorial Serif" },
  { value: "drop-cap", label: "Drop-Cap" },
  { value: "modern-sans", label: "Modern Sans" },
  { value: "academic-italic", label: "Literary Italic" }
];

const CALLOUT_TYPES = [
  { value: "info", label: "Historical Context Note", desc: "Cream card with terracotta accent bar" },
  { value: "fact", label: "Heritage Fact", desc: "Terracotta highlight card" },
  { value: "alert", label: "Visitor Advisory", desc: "Travel and preservation advisory card" },
  { value: "accent-border", label: "Accent Border", desc: "Terracotta vertical accent line card" }
];

const SAMPLE_IMAGES = BIHAR_PRESET_IMAGES.map((img) => img.url);

const BlogSectionEditor = ({
  section,
  index,
  totalSections,
  onChangeSection,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete
}) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
    };
    if (isTypeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTypeDropdownOpen]);

  const handleFieldChange = (key, value) => {
    onChangeSection(section.id, {
      ...section,
      [key]: value
    });
  };

  const handleAddImage = () => {
    const newImages = [
      ...(section.images || []),
      {
        id: generateUniqueId("img"),
        url: SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
        caption: `Image caption`
      }
    ];

    onChangeSection(section.id, {
      ...section,
      images: newImages
    });
  };

  const handleImageChange = (imageId, key, value) => {
    const updatedImages = (section.images || []).map((img) => {
      if (img.id === imageId) {
        return { ...img, [key]: value };
      }
      return img;
    });

    onChangeSection(section.id, {
      ...section,
      images: updatedImages
    });
  };

  const handleFileUpload = (imageId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      handleImageChange(imageId, "url", uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (imageId) => {
    const updatedImages = (section.images || []).filter((img) => img.id !== imageId);
    onChangeSection(section.id, {
      ...section,
      images: updatedImages
    });
  };

  const isCalloutEnabled = Boolean(section.calloutEnabled);
  const currentLayout = section.layoutType || "text-left-image-right";

  return (
    <div
      id={`editor-sec-${section.id}`}
      data-editor-section-id={section.id}
      className="bg-white rounded-2xl border border-[#E7DED3] shadow-2xs overflow-hidden mb-6 font-sans text-left transition-all hover:border-[#B85C38]/40"
    >
      {/* ─── SECTION HEADER BAR ─── */}
      <div className="bg-[#FAF8F3] px-4 sm:px-5 py-3 border-b border-[#E7DED3] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-6 h-6 rounded-lg bg-[#2F241D] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
            {index + 1}
          </span>
          <span className="text-xs sm:text-sm font-serif font-bold text-[#2F241D] truncate">
            {section.title || `Section ${index + 1}`}
          </span>
          <span className="font-mono text-[10px] font-bold text-[#6F665E] bg-white px-2 py-0.5 rounded-md border border-[#E7DED3] shrink-0">
            #{section.id}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
            title="Move Section Up"
            className="p-1.5 rounded-lg border border-[#E7DED3] bg-white text-[#6F665E] hover:text-[#2F241D] hover:bg-[#FAF8F3] disabled:opacity-30 transition cursor-pointer"
          >
            <MoveUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === totalSections - 1}
            onClick={() => onMoveDown(index)}
            title="Move Section Down"
            className="p-1.5 rounded-lg border border-[#E7DED3] bg-white text-[#6F665E] hover:text-[#2F241D] hover:bg-[#FAF8F3] disabled:opacity-30 transition cursor-pointer"
          >
            <MoveDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(index)}
            title="Duplicate Section"
            className="p-1.5 rounded-lg border border-[#E7DED3] bg-white text-[#6F665E] hover:text-[#2F241D] hover:bg-[#FAF8F3] transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(section.id)}
            title="Delete Section"
            className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 transition cursor-pointer ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── SECTION FORM CONTENT ─── */}
      <div className="p-4 sm:p-6 space-y-6">

        {/* 1. TITLE & SUBTITLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2F241D]">
              Section Title <span className="text-[#B85C38]">*</span>
            </label>
            <input
              type="text"
              value={section.title || ""}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="e.g. Historical Background & Origins..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DED3] text-xs font-serif font-bold text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2F241D]">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={section.subtitle || ""}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              placeholder="e.g. Overview and key highlights..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DED3] text-xs text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
            />
          </div>
        </div>

        {/* 2. SECTION LAYOUT & MEDIA POSITION (PROFESSIONAL VISUAL SELECTOR) */}
        <div className="space-y-3 bg-[#FAF8F3]/80 p-4 sm:p-5 rounded-2xl border border-[#E7DED3]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2F241D]">
                Section Layout
              </label>
              <p className="text-[11px] text-[#6F665E] mt-0.5">
                Select layout style for this section
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#B85C38] bg-white px-2.5 py-1 rounded-lg border border-[#E7DED3] shadow-2xs self-start sm:self-auto">
              <span>{LAYOUT_OPTIONS.find(o => o.value === currentLayout)?.shortLabel}</span>
            </span>
          </div>

          {/* Interactive Layout Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {LAYOUT_OPTIONS.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = currentLayout === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFieldChange("layoutType", opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group ${isSelected
                    ? "bg-white border-[#B85C38] ring-2 ring-[#B85C38]/20 shadow-xs"
                    : "bg-white/80 border-[#E7DED3] hover:border-[#B85C38]/40 hover:bg-white text-[#6F665E]"
                    }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg transition-colors ${isSelected
                      ? "bg-[#B85C38] text-white"
                      : "bg-[#FAF8F3] text-[#6F665E] group-hover:text-[#B85C38] group-hover:bg-[#B85C38]/10"
                      }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#B85C38] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${isSelected ? "text-[#2F241D]" : "text-[#5C5046]"
                      }`}>
                      {opt.shortLabel}
                    </h4>
                    <p className="text-[10px] text-[#6F665E] leading-snug mt-1 line-clamp-2">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. PARAGRAPH CONTENT WITH CUSTOM POPOVER TEXT STYLE DROPDOWN */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2F241D]">
              Paragraph Text
            </label>

            {/* Right side Custom Professional Popover Dropdown */}
            <div className="relative self-end sm:self-auto" ref={typeDropdownRef}>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-[#6F665E] uppercase tracking-wider hidden sm:inline">
                  Text Style:
                </span>
                <button
                  type="button"
                  onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 bg-[#FAF8F3] hover:bg-white border border-[#E7DED3] hover:border-[#B85C38]/50 rounded-lg px-2.5 py-1 text-[11px] font-bold text-[#2F241D] transition-all cursor-pointer shadow-2xs"
                >
                  <Type className="w-3 h-3 text-[#B85C38] shrink-0" />
                  <span>
                    {TEXT_STYLE_OPTIONS.find((o) => o.value === (section.textStyle || "default"))?.label || "Default Text"}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-[#6F665E] transition-transform duration-200 ${isTypeDropdownOpen ? "rotate-180 text-[#B85C38]" : ""}`} />
                </button>
              </div>

              {/* Custom Small & Compact Popover Menu */}
              {isTypeDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 sm:w-44 bg-white rounded-xl border border-[#E7DED3] shadow-md py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-100">
                  {TEXT_STYLE_OPTIONS.map((styleOpt) => {
                    const isSelected = (section.textStyle || "default") === styleOpt.value;
                    return (
                      <button
                        key={styleOpt.value}
                        type="button"
                        onClick={() => {
                          handleFieldChange("textStyle", styleOpt.value);
                          setIsTypeDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs font-semibold transition-colors flex items-center justify-between gap-2 cursor-pointer ${isSelected
                          ? "bg-[#FAF8F3] text-[#B85C38] font-bold"
                          : "hover:bg-[#FAF8F3] text-[#2F241D]"
                          }`}
                      >
                        <span className="truncate">{styleOpt.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#B85C38] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <textarea
            rows={4}
            value={section.content || ""}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleFieldChange("content", e.target.value)}
            placeholder="Write section paragraph text here..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DED3] text-xs text-[#2F241D] leading-relaxed focus:outline-none focus:border-[#B85C38] focus:ring-2 focus:ring-[#B85C38]/15"
          />
        </div>

        {/* 4. EDITORIAL MESSAGE BOX / CALLOUT FEATURE */}
        <div className="bg-[#FAF8F3]/90 rounded-2xl border border-[#E7DED3] p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <span className="text-xs font-bold text-[#2F241D] block">Editorial Message Box</span>
                <span className="text-[10px] text-[#6F665E]">Add a highlighted note</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFieldChange("calloutEnabled", !isCalloutEnabled)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${isCalloutEnabled
                ? "bg-[#B85C38] text-white border-[#B85C38]"
                : "bg-white text-[#6F665E] border-[#E7DED3] hover:border-[#B85C38]"
                }`}
            >
              {isCalloutEnabled ? "Message Box Active" : "+ Add Message Box"}
            </button>
          </div>

          {isCalloutEnabled && (
            <div className="pt-2 border-t border-[#E7DED3] space-y-3 bg-white p-3.5 rounded-xl border border-[#E7DED3]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F665E]">
                    Message Box Header Title
                  </label>
                  <input
                    type="text"
                    value={section.calloutTitle || ""}
                    onChange={(e) => handleFieldChange("calloutTitle", e.target.value)}
                    placeholder="e.g. Heritage Fact / Did You Know?"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E7DED3] text-xs font-bold text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F665E]">
                    Message Box Style Type
                  </label>
                  <select
                    value={section.calloutType || "info"}
                    onChange={(e) => handleFieldChange("calloutType", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E7DED3] text-xs font-semibold text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
                  >
                    {CALLOUT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F665E]">
                  Message Box Content Text
                </label>
                <textarea
                  rows={2}
                  value={section.calloutText || ""}
                  onChange={(e) => handleFieldChange("calloutText", e.target.value)}
                  placeholder="Enter message text to display inside the callout box..."
                  className="w-full px-3 py-2 rounded-lg border border-[#E7DED3] text-xs text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 5. DYNAMIC SECTION IMAGES CARD */}
        {section.layoutType !== "text-only" && (
          <div className="bg-[#FAF8F3]/90 rounded-2xl border border-[#E7DED3] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F241D]">
                Section Media ({section.images?.length || 0} Images Uploaded)
              </span>

              <button
                type="button"
                onClick={handleAddImage}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#B85C38] text-white text-[11px] font-bold hover:bg-[#A0502F] transition cursor-pointer shadow-2xs"
              >
                <Plus className="w-3 h-3" />
                <span>Add Image</span>
              </button>
            </div>

            {(!section.images || section.images.length === 0) ? (
              <div className="py-6 text-center border border-dashed border-[#E7DED3] rounded-xl bg-white space-y-2">
                <p className="text-xs text-[#6F665E]">No images attached to this section yet.</p>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-1 text-xs font-bold text-[#B85C38] bg-[#B85C38]/10 hover:bg-[#B85C38]/20 rounded-lg transition cursor-pointer"
                >
                  Add First Section Photo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {section.images.map((img, iIdx) => (
                  <div
                    key={img.id || iIdx}
                    className="p-3 bg-white rounded-xl border border-[#E7DED3] shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#6F665E] bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#E7DED3]">
                        Media Item #{iIdx + 1}
                      </span>

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E7DED3] bg-[#FAF8F3] text-[10px] font-bold text-[#2F241D] hover:bg-stone-200 transition cursor-pointer">
                          <Upload className="w-3 h-3 text-[#B85C38]" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(img.id, e)}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          title="Remove Image"
                          className="p-1 rounded text-stone-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                      <div className="sm:col-span-3 h-16 rounded-lg overflow-hidden border border-[#E7DED3] bg-stone-100 shrink-0">
                        <img loading="lazy" decoding="async"
                          src={img.url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop";
                          }}
                        />
                      </div>

                      <div className="sm:col-span-9 space-y-1.5">
                        <input
                          type="text"
                          value={img.url}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => handleImageChange(img.id, "url", e.target.value)}
                          placeholder="Image URL or upload local file..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7DED3] text-[11px] font-mono text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
                        />

                        <input
                          type="text"
                          value={img.caption || ""}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => handleImageChange(img.id, "caption", e.target.value)}
                          placeholder="Photo caption (e.g., Mahabodhi Spire at Dusk)..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7DED3] text-[11px] text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogSectionEditor;
