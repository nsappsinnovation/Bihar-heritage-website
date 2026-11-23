import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Compass,
  MapPin,
  Globe,
  FileText,
  Building,
  Sparkles
} from "lucide-react";
import { useLenis } from "lenis/react";
import { compressImageFile } from "../../utils/imageCompressor";

const STANDARD_PHOTO_CATEGORIES = [
  {
    name: "UNESCO Site",
    desc: "World Heritage Sites recognized for global outstanding universal value",
    color: "from-amber-500/10 to-amber-600/5 text-amber-900 border-amber-300/80"
  },
  {
    name: "Ancient Ruins",
    desc: "Excavated viharas, brick stupas, rock-cut caves & historic foundations",
    color: "from-orange-500/10 to-orange-600/5 text-orange-900 border-orange-300/80"
  },
  {
    name: "Archaeological Site",
    desc: "Mounds, Ashokan pillars, fortification walls & protected excavation zones",
    color: "from-emerald-500/10 to-emerald-600/5 text-emerald-900 border-emerald-300/80"
  },
  {
    name: "Religious",
    desc: "Sacred pilgrimage shrines, temples, gurdwaras, stupas & river ghats",
    color: "from-purple-500/10 to-purple-600/5 text-purple-900 border-purple-300/80"
  },
  {
    name: "Monuments",
    desc: "Colonial structures, grand forts, granaries, palaces & heritage arches",
    color: "from-blue-500/10 to-blue-600/5 text-blue-900 border-blue-300/80"
  }
];

export default function PhotoModal({ isOpen, onClose, initialData, onSave }) {
  const lenis = useLenis();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "UNESCO Site",
    location: "",
    description: "",
    wikipedia: "",
    image: "",
    status: "Published"
  });

  const [imageTab, setImageTab] = useState("upload");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressError, setCompressError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Sync state on open / initialData change
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || initialData.name || "",
          category: initialData.category || "UNESCO Site",
          location: initialData.location || "",
          description: initialData.description || "",
          wikipedia: initialData.wikipedia || "",
          image: initialData.image || initialData.cover || "",
          status: initialData.status || "Published"
        });
        setImageUrlInput(
          typeof initialData.image === "string" && initialData.image.startsWith("http")
            ? initialData.image
            : ""
        );
        setImageTab(
          typeof initialData.image === "string" && initialData.image.startsWith("http")
            ? "url"
            : "upload"
        );
      } else {
        setFormData({
          title: "",
          category: "UNESCO Site",
          location: "Patna, Bihar",
          description: "",
          wikipedia: "",
          image: "",
          status: "Published"
        });
        setImageUrlInput("");
        setImageTab("upload");
      }
      setCompressError("");
    }
  }, [isOpen, initialData]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    };
  }, [isOpen, lenis]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (categoryName) => {
    setFormData((prev) => ({ ...prev, category: categoryName }));
  };

  const handleFileProcess = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCompressError("Please select a valid image file (PNG, JPG, WebP, AVIF).");
      return;
    }

    try {
      setIsCompressing(true);
      setCompressError("");
      const compressedDataUrl = await compressImageFile(file, 1200, 900, 0.82);
      setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
    } catch (err) {
      console.error("[PhotoModal] Image compression error:", err);
      setCompressError("Could not optimize this image. Please try a different file.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleApplyUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({ ...prev, image: imageUrlInput.trim() }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a Photo / Landmark Title.");
      return;
    }
    if (!formData.location.trim()) {
      alert("Please provide the monument location.");
      return;
    }

    onSave({
      ...formData,
      title: formData.title.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      wikipedia: formData.wikipedia.trim(),
      id: initialData?.id || Date.now()
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#2F241D]/60 backdrop-blur-sm overflow-y-auto"
        data-lenis-prevent="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative bg-white rounded-2xl border border-[#E7DED3] w-full max-w-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-[#FAF8F3] border-b border-[#E7DED3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#2F241D]">
                    {initialData ? "Edit Heritage Photo" : "Add New Gallery Photo"}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B85C38]/10 text-[#B85C38]">
                    {formData.category}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-[#6F665E]">
                  Curate high-resolution photography with historical notes and geographic coordinates.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-[#6F665E] hover:text-[#2F241D] hover:bg-[#E7DED3]/50 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Scroll Area */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* 1. Landmark Details */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
              {/* Title / Landmark Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  Landmark / Photo Title <span className="text-[#B85C38]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Mahabodhi Temple, Nalanda Mahavihara, Golghar..."
                  required
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Location & Wikipedia Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#B85C38]" />
                    Location / District <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Gaya, Bihar"
                    required
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#6F665E]" />
                    Wikipedia / Reference Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="wikipedia"
                    value={formData.wikipedia}
                    onChange={handleChange}
                    placeholder="https://en.wikipedia.org/wiki/..."
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>
              </div>

              {/* Publication Status */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  Publication Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition cursor-pointer"
                >
                  <option value="Published">Published (Live on Gallery)</option>
                  <option value="Draft">Draft (Internal Only)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* 2. Category Selector Cards */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6F665E] flex items-center justify-between">
                <span>Heritage Category <span className="text-[#B85C38]">*</span></span>
                <span className="text-[10px] text-[#6F665E] font-normal lowercase">Select monument classification</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {STANDARD_PHOTO_CATEGORIES.map((cat) => {
                  const isSelected = formData.category === cat.name;
                  return (
                    <button
                      type="button"
                      key={cat.name}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`p-2.5 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#FAF8F3] border-[#B85C38] text-[#B85C38] font-bold"
                          : "bg-white border-[#E7DED3] text-[#2F241D] hover:bg-[#FAF8F3]/50 hover:border-[#B85C38]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-0.5">
                        <span className="text-xs font-semibold">{cat.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#B85C38]" />}
                      </div>
                      <p className={`text-[10px] line-clamp-2 leading-tight ${
                        isSelected ? "text-[#B85C38]/80 font-medium" : "text-[#6F665E]"
                      }`}>
                        {cat.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Image Uploader */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B85C38]" />
                  Photo / Showcase Image
                </label>
                <div className="flex items-center bg-[#FAF8F3] p-0.5 rounded-md border border-[#E7DED3]">
                  <button
                    type="button"
                    onClick={() => setImageTab("upload")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      imageTab === "upload"
                        ? "bg-white text-[#B85C38] border border-[#E7DED3]"
                        : "text-[#6F665E] hover:text-[#2F241D]"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab("url")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      imageTab === "url"
                        ? "bg-white text-[#B85C38] border border-[#E7DED3]"
                        : "text-[#6F665E] hover:text-[#2F241D]"
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {imageTab === "upload" ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-md p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isDragging
                      ? "border-[#B85C38] bg-[#B85C38]/5"
                      : "border-[#E7DED3] bg-[#FAF8F3]/50 hover:bg-[#FAF8F3] hover:border-[#B85C38]/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  {isCompressing ? (
                    <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                      <div className="w-5 h-5 border-2 border-[#B85C38] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold text-[#B85C38]">
                        Optimizing & compressing image...
                      </span>
                    </div>
                  ) : formData.image ? (
                    <div className="flex items-center gap-3 w-full">
                      <img loading="lazy" decoding="async"
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-14 object-cover rounded-md border border-[#E7DED3] shrink-0"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <span className="text-xs font-bold text-[#2F241D] truncate block">
                          Image attached & optimized
                        </span>
                        <span className="text-[10px] text-[#6F665E] block">
                          Click or drag another image to replace
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#2F241D]">
                          Drop showcase image here or click to browse
                        </p>
                        <p className="text-[10px] text-[#6F665E] mt-0.5">
                          Supports PNG, JPG, WebP, AVIF up to 15MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/... or https://..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-4 py-2 rounded-md bg-[#B85C38] hover:bg-[#A0502F] text-white text-xs font-semibold transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {compressError && (
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{compressError}</span>
                </div>
              )}

              {/* Image Preview */}
              {formData.image && (
                <div className="rounded-md border border-[#E7DED3] bg-[#FAF8F3] p-2.5 flex items-center gap-3">
                  <img loading="lazy" decoding="async"
                    src={formData.image}
                    alt="Preview"
                    className="w-16 h-12 rounded-md object-cover border border-[#E7DED3] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#2F241D] truncate">Image Attached</p>
                    <p className="text-[10px] text-[#6F665E] truncate">
                      {formData.image.startsWith("data:")
                        ? "Optimized client-side canvas data URL"
                        : formData.image}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Description / Historical Notes */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E]">
                Description & Historical Significance
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide architectural background, historical dynasty, archaeological discoveries, and significance..."
                className="w-full p-3 rounded-md bg-white border border-[#E7DED3] text-xs text-[#2F241D] focus:border-[#B85C38] focus:outline-none transition resize-y leading-relaxed"
              />
            </div>

            {/* Form Footer Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-[#E7DED3] bg-white hover:bg-[#FAF8F3] text-xs font-semibold text-[#6F665E] hover:text-[#2F241D] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[#B85C38] hover:bg-[#A0502F] active:scale-[0.99] text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{initialData ? "Update Photo" : "Add to Gallery"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
