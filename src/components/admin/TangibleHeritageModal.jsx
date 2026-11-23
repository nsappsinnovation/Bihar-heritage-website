import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Trash2,
  AlertCircle,
  MapPin,
  Calendar,
  Compass,
  FileText,
  Tag,
  Clock,
  Scroll,
  Landmark,
  BookOpen,
  Image as ImageIcon
} from "lucide-react";
import { useLenis } from "lenis/react";
import { compressImageFile } from "../../utils/imageCompressor";
import { heritageImageMap } from "../../pages/IntangibleHeritage/heritageImages";

const CATEGORY_OPTIONS = [
  { value: "art-craft", label: "Art & Craft" },
  { value: "festivals-rituals", label: "Festivals & Rituals" },
  { value: "music", label: "Music" },
  { value: "dance-theatre", label: "Dance & Theatre" },
  { value: "oral-traditions", label: "Oral Traditions" },
  { value: "food-customs", label: "Food & Customs" },
];

const REGION_OPTIONS = [
  "Mithilanchal",
  "Anga",
  "Magadha",
  "Bhojpur",
  "Champaran",
  "Vajji",
  "Gaya",
  "Statewide",
];

export default function TangibleHeritageModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) {
  const lenis = useLenis();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "art-craft",
    region: "Mithilanchal",
    shortDescription: "",
    description: "",
    origin: "",
    themes: "",
    tags: "",
    image: "",
    imageKey: "",
    status: "Published",
  });

  const [imageUploadType, setImageUploadType] = useState("file"); // "file" | "url"
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  // Scroll lock using Lenis
  useEffect(() => {
    if (!isOpen) return;
    if (lenis && typeof lenis.stop === "function") lenis.stop();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (lenis && typeof lenis.start === "function") lenis.start();
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, lenis]);

  // Sync form state on open / initialData change
  useEffect(() => {
    if (initialData) {
      const themesStr = Array.isArray(initialData.themes)
        ? initialData.themes.join(", ")
        : initialData.themes || "";
      const tagsStr = Array.isArray(initialData.tags)
        ? initialData.tags.join(", ")
        : initialData.tags || "";

      let resolvedImg = initialData.image || "";
      if (!resolvedImg && initialData.imageKey && heritageImageMap[initialData.imageKey]) {
        resolvedImg = heritageImageMap[initialData.imageKey];
      }

      setFormData({
        title: initialData.title || "",
        category: initialData.category || "art-craft",
        region: initialData.region || "Mithilanchal",
        shortDescription: initialData.shortDescription || "",
        description: initialData.description || "",
        origin: initialData.origin || "",
        themes: themesStr,
        tags: tagsStr,
        image: resolvedImg,
        imageKey: initialData.imageKey || "",
        status: initialData.status === "Inactive" || initialData.status === "Draft" ? "Draft" : "Published",
      });

      if (resolvedImg && typeof resolvedImg === "string" && resolvedImg.startsWith("http")) {
        setImageUploadType("url");
      } else {
        setImageUploadType("file");
      }
    } else {
      setFormData({
        title: "",
        category: "art-craft",
        region: "Mithilanchal",
        shortDescription: "",
        description: "",
        origin: "",
        themes: "",
        tags: "",
        image: "",
        imageKey: "",
        status: "Published",
      });
      setImageUploadType("file");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImageFile(file, 900, 0.75);
      setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
      if (errors.image) setErrors((prev) => ({ ...prev, image: null }));
    } catch (err) {
      console.error("Image compression error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = "Heritage title is required";
    }
    if (!formData.shortDescription.trim()) {
      errs.shortDescription = "Short teaser description is required";
    }
    if (!formData.description.trim()) {
      errs.description = "Detailed historical & cultural narrative is required";
    }
    if (!formData.image) {
      errs.image = "Feature image is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    const themesArr = formData.themes
      ? formData.themes.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const tagsArr = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const regionLower = (formData.region || "").toLowerCase();

    const payload = {
      id: initialData?.id || `heritage-${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category,
      region: formData.region,
      regions: [regionLower],
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      origin: formData.origin.trim() || "Ancient Bihar tradition passed orally and visually across generations.",
      themes: themesArr,
      tags: tagsArr,
      image: formData.image,
      imageKey: formData.imageKey || null,
      status: formData.status || "Published",
      featured: initialData?.featured ?? true,
    };

    onSave(payload);
  };

  const modalTitle = initialData ? "Edit Tangible & Living Heritage" : "Add Tangible & Living Heritage";

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#2F241D]/60 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <Motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative bg-white rounded-2xl border border-[#E7DED3] w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-[#FAF8F3] px-5 py-4 border-b border-[#E7DED3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center shrink-0">
                <Scroll className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#2F241D]">
                    {modalTitle}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B85C38]/10 text-[#B85C38]">
                    Living Heritage CMS
                  </span>
                </div>
                <p className="text-xs text-[#6F665E] mt-0.5">
                  Manage heritage entries featured on the /living-heritage explorer grid.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[#E7DED3]/60 text-[#6F665E] hover:text-[#2F241D] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            className="p-5 overflow-y-auto space-y-4 flex-grow custom-scrollbar"
          >
            {/* Identity & Classification */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-[#B85C38]" />
                  Heritage Identity & Cultural Category
                </h3>
                <span className="text-[10px] text-[#6F665E]">Core Attributes</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                    Heritage Title / Name <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Madhubani / Mithila Painting"
                    className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                      errors.title ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                    Category <span className="text-[#B85C38]">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#6F665E]" />
                    Cultural Region <span className="text-[#B85C38]">*</span>
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                  >
                    {REGION_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Narrative Overview */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#B85C38]" />
                  Descriptions & Historical Origin
                </h3>
                <span className="text-[10px] text-[#6F665E]">Narrative Context</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  Short Teaser Description (Card Grid) <span className="text-[#B85C38]">*</span>
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Ancient wall and canvas paintings from the Mithila region..."
                  className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                    errors.shortDescription ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                  }`}
                />
                {errors.shortDescription && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.shortDescription}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  Detailed Historical & Cultural Description <span className="text-[#B85C38]">*</span>
                </label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Madhubani painting, also known as Mithila art, is one of India's most distinctive folk traditions..."
                  className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition resize-none ${
                    errors.description ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#6F665E]" />
                  Historical Origin / Era
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="e.g. Ancient presence since Ramayana period in Mithila; documented in 1930s."
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>
            </div>

            {/* Themes & Tags */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#B85C38]" />
                  Themes & Search Tags
                </h3>
                <span className="text-[10px] text-[#6F665E]">Indexing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                    Key Themes (comma separated)
                  </label>
                  <input
                    type="text"
                    name="themes"
                    value={formData.themes}
                    onChange={handleChange}
                    placeholder="Mythology, Nature, Devotion"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="GI Tag, Mithila, Wall painting"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>
              </div>
            </div>

            {/* Image Media Uploader */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B85C38]" />
                  Feature Image Media <span className="text-[#B85C38]">*</span>
                </h3>
                <div className="flex items-center gap-1 bg-[#FAF8F3] p-0.5 rounded-md border border-[#E7DED3]">
                  <button
                    type="button"
                    onClick={() => setImageUploadType("file")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                      imageUploadType === "file"
                        ? "bg-[#B85C38] text-white shadow-xs"
                        : "text-[#6F665E] hover:text-[#2F241D]"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadType("url")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                      imageUploadType === "url"
                        ? "bg-[#B85C38] text-white shadow-xs"
                        : "text-[#6F665E] hover:text-[#2F241D]"
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {imageUploadType === "file" ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? "border-[#B85C38] bg-[#FAF8F3]"
                      : errors.image
                      ? "border-red-400 bg-red-50/10"
                      : "border-[#E7DED3] hover:border-[#B85C38]/50 hover:bg-[#FAF8F3]/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F3] border border-[#E7DED3] flex items-center justify-center text-[#B85C38]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2F241D]">
                      {isCompressing ? "Compressing image..." : "Click or drag & drop photo"}
                    </p>
                    <p className="text-[10px] text-[#6F665E] mt-0.5">
                      JPG, PNG, WEBP, AVIF (Auto-optimized for high quality web display)
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Enter image URL (https://...)"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>
              )}

              {/* Image Preview Chip */}
              {formData.image && (
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E7DED3] bg-[#FAF8F3]">
                  <div className="flex items-center gap-3">
                    <img loading="lazy" decoding="async"
                      src={formData.image}
                      alt="Heritage Preview"
                      className="w-14 h-12 rounded object-cover border border-[#E7DED3]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#2F241D] block">
                        Feature Image Attached
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready for display
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2 py-1 text-[10px] font-bold text-[#B85C38] hover:underline"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {errors.image && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.image}
                </p>
              )}
            </div>
          </form>

          {/* Footer Actions */}
          <div className="bg-[#FAF8F3] px-5 py-3.5 border-t border-[#E7DED3] flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-[#E7DED3] bg-white hover:bg-[#FAF8F3] text-xs font-semibold text-[#6F665E] hover:text-[#2F241D] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md bg-[#B85C38] hover:bg-[#A0502F] active:scale-[0.99] text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{initialData ? "Save Changes" : "Publish to Living Heritage"}</span>
            </button>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
