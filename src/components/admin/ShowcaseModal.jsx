import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Globe,
  Landmark,
  MapPin,
  Calendar,
  Compass,
  FileText,
  Eye,
  Video,
  Play,
  Clock,
  UserCheck
} from "lucide-react";
import { useLenis } from "lenis/react";
import { compressImageFile } from "../../utils/imageCompressor";

export default function ShowcaseModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  activeSubTab = "archives" // "archives" | "popular-sites" | "showcase-videos"
}) {
  const lenis = useLenis();
  const fileInputRef = useRef(null);

  const isArchive = activeSubTab === "archives";
  const isVideo = activeSubTab === "showcase-videos" || activeSubTab === "heritage-videos" || activeSubTab === "videos";
  const isPopularSite = !isArchive && !isVideo;

  const [formData, setFormData] = useState({
    title: "",
    category: "Sacred",
    location: "",
    year: "",
    significance: "",
    description: "",
    subtitle: "",
    link: "",
    wikipedia: "",
    image: "",
    // Video-specific fields
    duration: "03:45",
    author: "@BiharArchaeology",
    views: "HD Video",
    url: "",
    desc: "",
    status: "Published"
  });

  const [imageUploadType, setImageUploadType] = useState("file"); // "file" | "url"
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  // Lenis scroll lock
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
      setFormData({
        title: initialData.title || initialData.name || "",
        category: initialData.category || (isArchive ? "Sacred" : isVideo ? "Documentary Reel" : "Monuments"),
        location: initialData.location || "",
        year: initialData.year || "",
        significance: initialData.significance || "",
        description: initialData.description || initialData.subtitle || initialData.desc || "",
        subtitle: initialData.subtitle || initialData.description || "",
        link: initialData.link || initialData.wikipedia || "",
        wikipedia: initialData.wikipedia || initialData.link || "",
        image: initialData.image || "",
        duration: initialData.duration || "03:45",
        author: initialData.author || "@BiharArchaeology",
        views: initialData.views || "HD Video",
        url: initialData.url || "",
        desc: initialData.desc || initialData.description || "",
        status: initialData.status === "Inactive" || initialData.status === "Draft" ? "Draft" : "Published"
      });
      if (initialData.image && typeof initialData.image === "string" && initialData.image.startsWith("http")) {
        setImageUploadType("url");
      } else {
        setImageUploadType("file");
      }
    } else {
      setFormData({
        title: "",
        category: isArchive ? "Sacred" : isVideo ? "Documentary Reel" : "Monuments",
        location: "",
        year: "",
        significance: "",
        description: "",
        subtitle: "",
        link: "",
        wikipedia: "",
        image: "",
        duration: "03:45",
        author: "@BiharArchaeology",
        views: "HD Video",
        url: "",
        desc: "",
        status: "Published"
      });
      setImageUploadType("file");
    }
    setErrors({});
  }, [initialData, activeSubTab, isOpen]);

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
      errs.title = isVideo ? "Video title is required" : isArchive ? "Archive site name is required" : "Site name is required";
    }

    if (isVideo) {
      if (!formData.url.trim()) {
        errs.url = "Video source URL / file path is required";
      }
      if (!formData.desc.trim() && !formData.description.trim()) {
        errs.desc = "Video overview description is required";
      }
      if (!formData.duration.trim()) {
        errs.duration = "Duration is required (e.g. 03:45)";
      }
    } else {
      if (!formData.location.trim()) {
        errs.location = "Location is required";
      }
      if (isArchive && !formData.description.trim()) {
        errs.description = "Historical description is required";
      }
      if (isPopularSite && !formData.subtitle.trim() && !formData.description.trim()) {
        errs.subtitle = "Historical backstory description is required";
      }
      if (!formData.image) {
        errs.image = "Site image is required";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    let payload;
    if (isVideo) {
      payload = {
        title: formData.title.trim(),
        category: formData.category,
        duration: formData.duration.trim(),
        author: formData.author.trim() || "@BiharArchaeology",
        views: formData.views.trim() || "HD Video",
        url: formData.url.trim(),
        desc: (formData.desc || formData.description || "").trim(),
        status: formData.status || "Published",
      };
    } else if (isArchive) {
      payload = {
        title: formData.title.trim(),
        category: formData.category,
        location: formData.location.trim(),
        year: formData.year.trim(),
        significance: formData.significance.trim(),
        description: formData.description.trim(),
        link: formData.link.trim() || formData.wikipedia.trim(),
        image: formData.image,
        status: formData.status || "Published",
      };
    } else {
      payload = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        subtitle: (formData.subtitle || formData.description || "").trim(),
        wikipedia: formData.wikipedia.trim() || formData.link.trim(),
        image: formData.image,
        status: formData.status || "Published",
      };
    }

    onSave(payload);
  };

  const modalTitle = initialData
    ? isVideo
      ? "Edit Living Heritage Video"
      : isArchive
      ? "Edit Archive Site"
      : "Edit Popular Heritage Site"
    : isVideo
    ? "Add Living Heritage Video"
    : isArchive
    ? "Add Archive Site"
    : "Add Popular Heritage Site";

  const subTabLabel = isVideo
    ? "Living Heritage Videos"
    : isArchive
    ? "Bihar Heritage Archives"
    : "Popular Heritage Sites";

  const SubTabIcon = isVideo ? Video : isArchive ? Landmark : Globe;

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#2F241D]/60 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative bg-white rounded-2xl border border-[#E7DED3] w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#FAF8F3] px-5 py-4 border-b border-[#E7DED3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center shrink-0">
                <SubTabIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#2F241D]">
                    {modalTitle}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B85C38]/10 text-[#B85C38]">
                    {subTabLabel}
                  </span>
                </div>
                <p className="text-xs text-[#6F665E] mt-0.5">
                  {isArchive
                    ? "Manage interactive archive explorer entry displayed on the Home Page."
                    : "Manage 3D visual journey rotating card entry featured on the Home Page."}
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
            {isVideo ? (
              <>
                {/* Video Reel Identity Card */}
                <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#B85C38]" />
                      Video Reel & Channel Details
                    </h3>
                    <span className="text-[10px] text-[#6F665E]">Living Heritage Reel</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                        Video Title <span className="text-[#B85C38]">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Heritage Chronicles"
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
                        Reel Category / Format <span className="text-[#B85C38]">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                      >
                        <option value="Documentary Reel">Documentary Reel</option>
                        <option value="Short Vignette">Short Vignette</option>
                        <option value="Historical Study">Historical Study</option>
                        <option value="Vlog Series">Vlog Series</option>
                        <option value="Archaeological Spotlight">Archaeological Spotlight</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#6F665E]" />
                        Duration <span className="text-[#B85C38]">*</span>
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 03:45"
                        className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                          errors.duration ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                        }`}
                      />
                      {errors.duration && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3" /> {errors.duration}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-[#6F665E]" />
                        Creator / Channel Tag
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="e.g. @BiharArchaeology"
                        className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#6F665E]" />
                        Views / Quality Tag
                      </label>
                      <input
                        type="text"
                        name="views"
                        value={formData.views}
                        onChange={handleChange}
                        placeholder="e.g. 18.4K views or HD Video"
                        className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Video File Source & Overview Card */}
                <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-[#B85C38]" />
                      Video Source & Narrative Overview
                    </h3>
                    <span className="text-[10px] text-[#6F665E]">Source Media</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-[#6F665E]" />
                      Video File URL / Video Source <span className="text-[#B85C38]">*</span>
                    </label>
                    <input
                      type="text"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="e.g. /assets/Videos/BiharHeritage_2.mp4 or https://..."
                      className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                        errors.url ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                      }`}
                    />
                    {errors.url && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.url}
                      </p>
                    )}
                    <p className="text-[10px] text-[#6F665E] mt-1">
                      Supports direct MP4 video paths, local video asset URLs, or web streaming video URLs.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                      Reel Overview & Description <span className="text-[#B85C38]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      name="desc"
                      value={formData.desc}
                      onChange={handleChange}
                      placeholder="A cinematic aerial journey documenting the sacred monasteries, monolithic Ashokan pillars, and stupas of Bihar..."
                      className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition resize-none ${
                        errors.desc ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                      }`}
                    />
                    {errors.desc && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.desc}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Core Heritage Information Card */}
                <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-[#B85C38]" />
                      Site Identity & Geography
                    </h3>
                    <span className="text-[10px] text-[#6F665E]">General Information</span>
                  </div>

                  {/* Site Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                        {isArchive ? "Archive Site Name" : "Heritage Site Name"} <span className="text-[#B85C38]">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={isArchive ? "Enter site name (e.g. Mahabodhi Temple)" : "Enter site name (e.g. Bodh Gaya)"}
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

                    {isArchive ? (
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                          Archive Category <span className="text-[#B85C38]">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                        >
                          <option value="Sacred">Sacred</option>
                          <option value="Ruins">Ruins</option>
                          <option value="Monuments">Monuments</option>
                          <option value="Ancient">Ancient</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#6F665E]" />
                          Location (City, District) <span className="text-[#B85C38]">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Enter location (e.g. Gaya, Bihar)"
                          className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                            errors.location ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                          }`}
                        />
                        {errors.location && (
                          <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3" /> {errors.location}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {isArchive && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#6F665E]" />
                          Location <span className="text-[#B85C38]">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. Bodh Gaya, Gaya"
                          className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                            errors.location ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                          }`}
                        />
                        {errors.location && (
                          <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3" /> {errors.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#6F665E]" />
                          Historical Era / Year
                        </label>
                        <input
                          type="text"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          placeholder="e.g. 3rd Century BCE"
                          className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-[#6F665E]" />
                          Significance
                        </label>
                        <input
                          type="text"
                          name="significance"
                          value={formData.significance}
                          onChange={handleChange}
                          placeholder="e.g. UNESCO World Heritage Site"
                          className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Historical Description & External Link Card */}
                <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#B85C38]" />
                      Historical Narrative & Documentation
                    </h3>
                    <span className="text-[10px] text-[#6F665E]">Narrative Context</span>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                      {isArchive ? "Historical Summary Description" : "Historical Backstory (3D Card Back)"} <span className="text-[#B85C38]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      name={isArchive ? "description" : "subtitle"}
                      value={isArchive ? formData.description : formData.subtitle}
                      onChange={handleChange}
                      placeholder={
                        isArchive
                          ? "Enter comprehensive summary of the site, architectural significance, and historical discoveries..."
                          : "Enter the sacred history, archaeological significance, and stories revealed on card flip..."
                      }
                      className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition resize-none ${
                        (isArchive ? errors.description : errors.subtitle) ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                      }`}
                    />
                    {(isArchive ? errors.description : errors.subtitle) && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {isArchive ? errors.description : errors.subtitle}
                      </p>
                    )}
                  </div>

                  {/* External Link */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-[#6F665E]" />
                      {isArchive ? "Archive / Research Article Link" : "Wikipedia / External Reference URL"}
                    </label>
                    <input
                      type="url"
                      name={isArchive ? "link" : "wikipedia"}
                      value={isArchive ? formData.link : formData.wikipedia}
                      onChange={handleChange}
                      placeholder="https://en.wikipedia.org/wiki/..."
                      className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                    />
                  </div>
                </div>

                {/* Site Image Media Uploader */}
                <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-[#B85C38]" />
                      Site Feature Image <span className="text-[#B85C38]">*</span>
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
                          {isCompressing ? "Optimizing image..." : "Click or drag & drop photo"}
                        </p>
                        <p className="text-[10px] text-[#6F665E] mt-0.5">
                          JPG, PNG, WEBP, AVIF (Auto-compressed for web display)
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
                          alt="Site Preview"
                          className="w-14 h-12 rounded object-cover border border-[#E7DED3]"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#2F241D] block">
                            Site Image Attached
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
              </>
            )}
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
              <span>{initialData ? "Save Changes" : "Publish to Home Showcase"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
