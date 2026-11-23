import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Video as VideoIcon,
  Play,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Film,
  Landmark,
  BookOpen,
  Calendar,
  Sparkles
} from "lucide-react";
import { useLenis } from "lenis/react";
import { compressImageFile } from "../../utils/imageCompressor";

const STANDARD_VIDEO_CATEGORIES = [
  {
    name: "History & Empire",
    desc: "Imperial dynasties, Mauryan edicts, Gupta administration & heritage"
  },
  {
    name: "Academic Tradition",
    desc: "Ancient universities, Nalanda, Vikramshila & scholarly monastic legacy"
  },
  {
    name: "Special Events",
    desc: "World Heritage Day celebrations, heritage walks, and symposiums"
  },
  {
    name: "Museum & Culture",
    desc: "Exhibition walkthroughs, sculpture galleries, and cultural showcases"
  },
  {
    name: "Archaeological Excavations",
    desc: "Excavation site footage, antiquities discovery & field surveys"
  },
  {
    name: "Documentary",
    desc: "In-depth archival productions, architecture & architectural retrospectives"
  }
];

export default function VideoModal({ isOpen, onClose, initialData, onSave }) {
  const lenis = useLenis();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "History & Empire",
    youtubeUrl: "",
    youtubeId: "",
    duration: "15:00",
    region: "Bihar",
    description: "",
    thumbnail: "",
    status: "Published"
  });

  const [customThumb, setCustomThumb] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressError, setCompressError] = useState("");

  // Extract YouTube ID from full URL or raw ID
  const parseYouTubeId = (urlOrId) => {
    if (!urlOrId) return "";
    const clean = urlOrId.trim();
    if (clean.length === 11 && !clean.includes("/") && !clean.includes(".")) {
      return clean;
    }
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^#&?/]+)/);
    return match ? match[1] : clean;
  };

  // Sync state on open / initialData change
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const ytId = initialData.youtubeId || (typeof initialData.id === "string" && initialData.id.length === 11 ? initialData.id : "");
        setFormData({
          title: initialData.title || initialData.name || "",
          category: initialData.category || "History & Empire",
          youtubeUrl: initialData.youtubeUrl || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : ""),
          youtubeId: ytId,
          duration: initialData.duration || "15:00",
          region: initialData.region || "Bihar",
          description: initialData.description || "",
          thumbnail: initialData.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ""),
          status: initialData.status || "Published"
        });
        setCustomThumb(
          typeof initialData.thumbnail === "string" &&
          (initialData.thumbnail.startsWith("data:") || !initialData.thumbnail.includes("youtube.com"))
        );
      } else {
        setFormData({
          title: "",
          category: "History & Empire",
          youtubeUrl: "",
          youtubeId: "",
          duration: "14:20",
          region: "Bihar",
          description: "",
          thumbnail: "",
          status: "Published"
        });
        setCustomThumb(false);
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
    if (name === "youtubeUrl") {
      const extractedId = parseYouTubeId(value);
      setFormData((prev) => ({
        ...prev,
        youtubeUrl: value,
        youtubeId: extractedId,
        thumbnail: !customThumb && extractedId ? `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg` : prev.thumbnail
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategorySelect = (categoryName) => {
    setFormData((prev) => ({ ...prev, category: categoryName }));
  };

  const handleCustomThumbUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCompressError("Please select a valid image file.");
      return;
    }

    try {
      setIsCompressing(true);
      setCompressError("");
      const compressedDataUrl = await compressImageFile(file, 960, 540, 0.82);
      setFormData((prev) => ({ ...prev, thumbnail: compressedDataUrl }));
      setCustomThumb(true);
    } catch (err) {
      console.error("[VideoModal] Thumbnail compression error:", err);
      setCompressError("Could not optimize this image.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a Video Title.");
      return;
    }
    const ytId = formData.youtubeId || parseYouTubeId(formData.youtubeUrl);
    if (!ytId) {
      alert("Please provide a valid YouTube URL or Video ID.");
      return;
    }

    const finalThumbnail =
      formData.thumbnail || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

    onSave({
      ...formData,
      id: initialData?.id || Date.now(),
      youtubeId: ytId,
      youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1`,
      thumbnail: finalThumbnail,
      title: formData.title.trim(),
      description: formData.description.trim(),
      region: formData.region.trim() || "Bihar"
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
                    {initialData ? "Edit Video Documentary" : "Add New Heritage Video"}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B85C38]/10 text-[#B85C38]">
                    {formData.category}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-[#6F665E]">
                  Publish documentaries, archaeological field footage, and heritage walk video archives.
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
            {/* 1. Video Identity & YouTube Link */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
              {/* Title / Headline */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  Documentary / Video Title <span className="text-[#B85C38]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Ashoka and Bihar, Education in Nalanda..."
                  required
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* YouTube URL + Duration + Region */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                    <Play className="w-3 h-3 text-[#B85C38]" />
                    YouTube URL or Video ID <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=... or ID"
                    required
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs font-mono text-[#2F241D] focus:outline-none focus:border-[#B85C38] transition"
                  />
                  {formData.youtubeId && (
                    <p className="text-[10px] text-emerald-700 font-mono mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Detected YouTube ID: {formData.youtubeId}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#6F665E]" />
                    Duration (mm:ss)
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="14:20"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>
              </div>

              {/* Region & Geographic Scope + Publication Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#6F665E]" />
                    Region / Focus Location
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="e.g. Patna & Gaya, Nalanda, Bihar"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>

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
                    <option value="Published">Published (Live on Public Portal)</option>
                    <option value="Draft">Draft (Internal Only)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Category Selector Cards */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6F665E] flex items-center justify-between">
                <span>Category / Genre <span className="text-[#B85C38]">*</span></span>
                <span className="text-[10px] text-[#6F665E] font-normal lowercase">Select video genre</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {STANDARD_VIDEO_CATEGORIES.map((cat) => {
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

            {/* 3. Thumbnail Preview & Custom Upload */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#B85C38]" />
                  Video Thumbnail Preview
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#B85C38] hover:underline font-semibold cursor-pointer"
                >
                  Upload Custom Thumbnail
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCustomThumbUpload(f);
                  }}
                  className="hidden"
                />
              </div>

              {formData.thumbnail ? (
                <div className="rounded-md border border-[#E7DED3] bg-[#FAF8F3] p-2.5 flex items-center gap-3">
                  <div className="relative aspect-video w-28 rounded-md overflow-hidden bg-black shrink-0 border border-[#E7DED3]">
                    <img loading="lazy" decoding="async"
                      src={formData.thumbnail}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#2F241D]">
                      {customThumb ? "Custom Thumbnail Uploaded" : "YouTube Auto Thumbnail"}
                    </p>
                    <p className="text-[10px] text-[#6F665E] truncate">
                      {formData.thumbnail}
                    </p>
                    {customThumb && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomThumb(false);
                          setFormData((prev) => ({
                            ...prev,
                            thumbnail: prev.youtubeId ? `https://img.youtube.com/vi/${prev.youtubeId}/hqdefault.jpg` : ""
                          }));
                        }}
                        className="text-[10px] text-red-600 hover:underline mt-0.5 cursor-pointer block"
                      >
                        Reset to YouTube Default
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-md border border-dashed border-[#E7DED3] bg-[#FAF8F3] text-center text-xs text-[#6F665E]">
                  Enter a YouTube URL above to automatically generate the video thumbnail.
                </div>
              )}

              {compressError && (
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{compressError}</span>
                </div>
              )}
            </div>

            {/* 4. Description / Synopsis */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E]">
                Video Synopsis & Summary
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide documentary summary, archival credits, featured speakers, and key historical milestones covered..."
                className="w-full p-3 rounded-md bg-white border border-[#E7DED3] text-xs text-[#2F241D] focus:border-[#B85C38] focus:outline-none transition resize-y leading-relaxed"
              />
            </div>

            {/* Form Footer Buttons */}
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
                <span>{initialData ? "Update Video" : "Publish Video"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
