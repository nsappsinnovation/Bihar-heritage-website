import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Landmark,
  BookOpen,
  Sparkles,
  FileText,
  Building,
  User
} from "lucide-react";
import { useLenis } from "lenis/react";
import { compressImageFile } from "../../utils/imageCompressor";

const STANDARD_NEWS_CATEGORIES = [
  {
    name: "Exhibition",
    desc: "Museum displays, ancient artifact showcases, coin galleries & expos"
  },
  {
    name: "Cultural Festival",
    desc: "Statewide celebrations, folk arts, living cultural traditions & fairs"
  },
  {
    name: "Heritage Walk",
    desc: "Guided historical trails, monument tours & architectural exploration walks"
  },
  {
    name: "Academic Symposium",
    desc: "Scholarly research panels, epigraphy discussions & historian keynote lectures"
  },
  {
    name: "Official Bulletin",
    desc: "Department circulars, preservation schedules, quarterly agendas & gazettes"
  },
  {
    name: "Discovery",
    desc: "Unearthed antiquities, excavation site reports & archaeological breakthroughs"
  }
];

export default function NewsModal({ isOpen, onClose, initialData, onSave }) {
  const lenis = useLenis();

  const [formData, setFormData] = useState({
    title: "",
    category: "Official Bulletin",
    date: new Date().toISOString().split("T")[0],
    source: "Bihar Heritage Development Society",
    author: "BHDS Editorial Team",
    description: "",
    image: "",
    status: "Published"
  });

  const [imageTab, setImageTab] = useState("upload"); // 'upload' | 'url'
  const [imagePreview, setImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      // Normalize date to YYYY-MM-DD for native date picker
      let initialDate = initialData.date || "";
      if (initialDate && !/^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
        const parsed = new Date(initialDate);
        if (!isNaN(parsed.getTime())) {
          initialDate = parsed.toISOString().split("T")[0];
        }
      }

      setFormData({
        title: initialData.title || initialData.headline || "",
        category: initialData.category || "Official Bulletin",
        date: initialDate || new Date().toISOString().split("T")[0],
        source: initialData.source || "Bihar Heritage Development Society",
        author: initialData.author || "BHDS Editorial Team",
        description: initialData.description || initialData.content || "",
        image: initialData.image || "",
        status: initialData.status || "Published"
      });
      setImagePreview(initialData.image || "");
      setImageTab(
        initialData.image && initialData.image.startsWith("http")
          ? "url"
          : "upload"
      );
    } else {
      setFormData({
        title: "",
        category: "Official Bulletin",
        date: new Date().toISOString().split("T")[0],
        source: "Bihar Heritage Development Society",
        author: "BHDS Editorial Team",
        description: "",
        image: "",
        status: "Published"
      });
      setImagePreview("");
      setImageTab("upload");
    }
    setErrorMsg("");
  }, [initialData, isOpen]);

  // Lock background smooth scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    if (lenis) lenis.stop();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, lenis]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileProcess = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (PNG, JPG, WebP, AVIF).");
      return;
    }
    setErrorMsg("");
    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1000, 700, 0.8);
      setImagePreview(compressedDataUrl);
      setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
    } catch (err) {
      console.warn("Canvas compression fallback:", err);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        setImagePreview(base64);
        setFormData((prev) => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg("Please provide a News Headline.");
      return;
    }
    if (!formData.date.trim()) {
      setErrorMsg("Please specify the Publication Date.");
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg("Please provide the News Bulletin content / summary.");
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: imagePreview || formData.image
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#2F241D]/60 backdrop-blur-sm overflow-y-auto">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="fixed inset-0 pointer-events-auto"
        />

        {/* Modal Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          data-lenis-prevent="true"
          className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E7DED3] overflow-hidden my-auto z-10 flex flex-col max-h-[92vh] text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-[#FAF8F3] border-b border-[#E7DED3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#2F241D]">
                    {initialData ? "Edit News Bulletin" : "Publish New Bulletin"}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B85C38]/10 text-[#B85C38]">
                    {formData.category}
                  </span>
                </div>
                <p className="text-[11px] text-[#6F665E] font-sans">
                  Official press announcement for the Bihar Heritage News portal
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-[#6F665E] hover:text-[#2F241D] hover:bg-[#E7DED3]/50 transition cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-5 space-y-4 text-left custom-scrollbar"
          >
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Headline */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#6F665E] uppercase tracking-wider">
                    Headline / News Title <span className="text-[#B85C38]">*</span>
                  </label>
                  <span className="text-[10px] text-[#6F665E] font-mono">
                    {formData.title.length}/140
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={140}
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Patna Museum Special Exhibit: Mauryan & Gupta Antiquities"
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Date & Source Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#B85C38]" />
                    Publication Date <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#6F665E]" />
                    Source / Desk
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    placeholder="e.g. Directorate of Archaeology, Bihar"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>
              </div>

              {/* Author & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#B85C38]" />
                    Author / Reporter
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="e.g. BHDS Editorial Team"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                  >
                    <option value="Published">Published (Live on Public Portal)</option>
                    <option value="Draft">Draft (Internal Only)</option>
                    <option value="Archived">Archived (Hidden from Public)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Category Selector */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2.5">
              <label className="text-[11px] font-bold text-[#6F665E] uppercase tracking-wider flex items-center justify-between">
                <span>Bulletin Category <span className="text-[#B85C38]">*</span></span>
                <span className="text-[10px] text-[#6F665E] font-normal lowercase">Select classification</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STANDARD_NEWS_CATEGORIES.map((cat) => {
                  const isSelected = formData.category === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat.name })
                      }
                      className={`p-2.5 rounded-md border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FAF8F3] border-[#B85C38] text-[#B85C38] font-bold"
                          : "bg-white border-[#E7DED3] text-[#2F241D] hover:bg-[#FAF8F3]/50 hover:border-[#B85C38]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold truncate">
                          {cat.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B85C38] shrink-0" />
                        )}
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

            {/* 3. Banner Image Uploader */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                <label className="text-[11px] font-bold text-[#2F241D] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B85C38]" />
                  Feature / Header Image
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
                    Local Upload
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
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
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
                    onChange={(e) => handleFileProcess(e.target.files[0])}
                    className="hidden"
                  />
                  {isCompressing ? (
                    <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                      <div className="w-5 h-5 border-2 border-[#B85C38] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold text-[#B85C38]">
                        Optimizing & compressing image...
                      </span>
                    </div>
                  ) : imagePreview ? (
                    <div className="flex items-center gap-3 w-full">
                      <img loading="lazy" decoding="async"
                        src={imagePreview}
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
                          Drop feature image here or click to browse
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
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition"
                  />
                  {imagePreview && (
                    <div className="flex items-center gap-3 p-2.5 bg-[#FAF8F3] rounded-md border border-[#E7DED3]">
                      <img loading="lazy" decoding="async"
                        src={imagePreview}
                        alt="Preview"
                        className="w-14 h-10 object-cover rounded-md border border-[#E7DED3]"
                        onError={() => setImagePreview("")}
                      />
                      <span className="text-xs text-[#2F241D] font-medium truncate">Preview confirmed</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Description / Content Body */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2">
              <label className="text-[11px] font-bold text-[#6F665E] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#B85C38]" />
                Bulletin Content & Details <span className="text-[#B85C38]">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detailed summary or complete press announcement text..."
                className="w-full p-3 rounded-md bg-white border border-[#E7DED3] text-xs text-[#2F241D] focus:border-[#B85C38] focus:outline-none transition resize-y leading-relaxed"
              />
            </div>

            {/* Modal Footer Buttons */}
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
                <span>{initialData ? "Update Bulletin" : "Publish Bulletin"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
