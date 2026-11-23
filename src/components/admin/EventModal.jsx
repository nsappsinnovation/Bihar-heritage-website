import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Building,
  DollarSign,
  Users,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";
import { useLenis } from "lenis/react";
import { compressImageFile } from "../../utils/imageCompressor";

const STANDARD_CATEGORIES = [
  {
    name: "Cultural Festival",
    desc: "Large-scale cultural celebrations, folk music, dance & living traditions"
  },
  {
    name: "Art Workshop",
    desc: "Hands-on artisan workshops, traditional painting, crafts & pottery masterclasses"
  },
  {
    name: "Heritage Walk",
    desc: "Guided historical city walks, monument trails & architectural tours"
  },
  {
    name: "Seminar / Symposium",
    desc: "Academic conferences, scholarly panel discussions & heritage symposiums"
  },
  {
    name: "Archaeology Camp",
    desc: "Field camps, epigraphy workshops, excavation site visits & training"
  },
  {
    name: "Exhibition",
    desc: "Museum gallery shows, artifact expos & photography exhibitions"
  }
];

const BIHAR_DISTRICTS = [
  "Patna", "Gaya", "Nalanda", "Bhagalpur", "Muzaffarpur", "Vaishali",
  "Darbhanga", "Rohtas", "Bhojpur", "East Champaran", "West Champaran",
  "Saran", "Munger", "Banka", "Samatipur", "Begusarai", "Katihar",
  "Purnia", "Saharsa", "Madhepura", "Supaul", "Madhubani", "Sitamarhi",
  "Sheohar", "Gopalganj", "Siwan", "Buxar", "Kaimur", "Jehanabad",
  "Arwal", "Nawada", "Aurangabad", "Jamui", "Khagaria", "Lakhisarai",
  "Sheikhpura", "Kishanganj", "Araria"
];

export default function EventModal({ isOpen, onClose, initialData, onSave }) {
  const lenis = useLenis();

  const [formData, setFormData] = useState({
    title: "",
    category: "Cultural Festival",
    date: "",
    time: "10:00 AM - 05:00 PM",
    location: "",
    district: "Patna",
    venue: "",
    organizer: "Bihar Heritage Development Society (BHDS)",
    entryFee: "Free Registration",
    tagsString: "",
    image: "",
    description: "",
    highlights: "",
    status: "Published"
  });

  const [imageTab, setImageTab] = useState("upload");
  const [imagePreview, setImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  // Sync state with initialData on open
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const tagsStr = Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : initialData.tagsString || "";

        setFormData({
          title: initialData.title || "",
          category: initialData.category || "Cultural Festival",
          date: initialData.date || "",
          time: initialData.time || "10:00 AM - 05:00 PM",
          location: initialData.location || "",
          district: initialData.district || "Patna",
          venue: initialData.venue || "",
          organizer: initialData.organizer || "Bihar Heritage Development Society (BHDS)",
          entryFee: initialData.entryFee || "Free Registration",
          tagsString: tagsStr,
          image: initialData.image || "",
          description: initialData.description || "",
          highlights: initialData.highlights || "",
          status: initialData.status || "Published"
        });
        setImagePreview(initialData.image || "");
        setImageTab(
          initialData.image && initialData.image.startsWith("http") ? "url" : "upload"
        );
      } else {
        setFormData({
          title: "",
          category: "Cultural Festival",
          date: new Date().toISOString().split("T")[0],
          time: "10:00 AM - 05:00 PM",
          location: "",
          district: "Patna",
          venue: "",
          organizer: "Bihar Heritage Development Society (BHDS)",
          entryFee: "Free Registration",
          tagsString: "Heritage, Cultural, Bihar",
          image: "",
          description: "",
          highlights: "",
          status: "Published"
        });
        setImagePreview("");
        setImageTab("upload");
      }
      setErrorMsg("");
    }
  }, [isOpen, initialData]);

  // Lock scroll when open
  useEffect(() => {
    if (!isOpen) return;
    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    } else {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
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

  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileProcess = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (PNG, JPG, WebP, AVIF).");
      return;
    }
    setErrorMsg("");
    setIsCompressing(true);
    try {
      // Automatically resize and compress image to ~30KB-50KB WebP
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
      setErrorMsg("Please provide an Event Title.");
      return;
    }
    if (!formData.date.trim()) {
      setErrorMsg("Please specify the Event Date.");
      return;
    }
    if (!formData.location.trim()) {
      setErrorMsg("Please provide the Event Location / City.");
      return;
    }

    const tagsArray = formData.tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: tagsArray.length > 0 ? tagsArray : [formData.category],
      image: imagePreview || formData.image
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#2F241D]/60 backdrop-blur-sm overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 pointer-events-auto" onClick={onClose} />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="bg-white border border-[#E7DED3] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col relative z-10 overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7DED3] bg-[#FAF8F3] shrink-0">
          <div className="flex items-center gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#2F241D]">
                  {initialData ? "Edit Heritage Event" : "Create New Heritage Event"}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B85C38]/10 text-[#B85C38]">
                  {formData.category}
                </span>
              </div>
              <p className="text-[11px] text-[#6F665E] font-sans">
                Curate community celebrations, educational workshops, heritage walks, and symposiums.
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

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4" data-lenis-prevent="true">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Category Selector */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6F665E] flex items-center justify-between">
                <span>Select Event Category <span className="text-[#B85C38]">*</span></span>
                <span className="text-[10px] text-[#6F665E] font-normal lowercase">Choose event classification</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {STANDARD_CATEGORIES.map((cat) => {
                  const isSelected = formData.category === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.name })}
                      className={`p-2.5 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#FAF8F3] border-[#B85C38] text-[#B85C38] font-bold"
                          : "bg-white border-[#E7DED3] text-[#2F241D] hover:bg-[#FAF8F3]/50 hover:border-[#B85C38]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold">{cat.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#B85C38]" />}
                      </div>
                      <span className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${
                        isSelected ? "text-[#B85C38]/80 font-medium" : "text-[#6F665E]"
                      }`}>
                        {cat.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Core Information */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] border-b border-[#E7DED3] pb-2 flex items-center gap-1.5">
                Event Details & Logistics
              </h3>

              <div className="space-y-3">
                {/* Event Title */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                    Event Title <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Bihar Heritage Fest 2026, Madhubani Art Workshop..."
                    className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition"
                    required
                  />
                </div>

                {/* Date, Time, Entry Fee */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Calendar Date Picker */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#B85C38]" />
                      <span>Event Date</span>
                      <span className="text-[#B85C38]">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-medium rounded-md bg-white border border-[#E7DED3] text-[#2F241D] focus:border-[#B85C38] focus:outline-none transition cursor-pointer"
                      required
                    />
                  </div>

                  {/* Time Schedule */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#6F665E]" />
                      <span>Time Schedule</span>
                    </label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="e.g. 10:00 AM - 05:00 PM"
                      className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition"
                    />
                  </div>

                  {/* Entry Fee */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-600" />
                      <span>Entry / Fee</span>
                    </label>
                    <input
                      type="text"
                      value={formData.entryFee}
                      onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                      placeholder="e.g. Free Registration, ₹100, Free Entry"
                      className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Location, District, Venue */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* City / Location */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#B85C38]" />
                      <span>City / General Area</span>
                      <span className="text-[#B85C38]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Gandhi Maidan, Patna"
                      className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition"
                      required
                    />
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                      District
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition cursor-pointer"
                    >
                      {BIHAR_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d} District
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Specific Venue / Hall */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Building className="w-3 h-3 text-[#6F665E]" />
                      <span>Venue / Complex</span>
                    </label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g. Main Arena & Exhibition Pavilions"
                      className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Organizer & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#B85C38]" />
                      <span>Lead Organizer / Host</span>
                    </label>
                    <input
                      type="text"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      placeholder="e.g. Bihar Heritage Development Society (BHDS)"
                      className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#6F665E]" />
                      <span>Tags (Comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tagsString}
                      onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                      placeholder="e.g. Cultural, Music, Workshop, Food"
                      className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Event Banner Image (Local Upload or URL) */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B85C38]" /> Event Banner Image
                </h3>
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
                        Optimizing & compressing banner image...
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
                          Banner image attached & optimized
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
                          Drop event banner image here or click to browse
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
                      <span className="text-xs text-[#2F241D] font-medium truncate">
                        Preview URL validated
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Description & Highlights */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E]">
                  Event Description & Overview <span className="text-[#B85C38]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive overview of the event, themes, cultural significance..."
                  className="w-full p-3 rounded-md bg-white border border-[#E7DED3] text-xs text-[#2F241D] focus:border-[#B85C38] focus:outline-none transition leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E]">
                  Key Highlights & Program Details
                </label>
                <textarea
                  rows={2}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Specific sessions, master artisan demonstrations, participation certificates, guided tours..."
                  className="w-full p-3 rounded-md bg-white border border-[#E7DED3] text-xs text-[#2F241D] focus:border-[#B85C38] focus:outline-none transition leading-relaxed"
                />
              </div>

              {/* Publishing Status */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  Publishing Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-md bg-white border border-[#E7DED3] text-[#2F241D] font-medium focus:border-[#B85C38] focus:outline-none transition cursor-pointer"
                >
                  <option value="Published">Published (Live on website)</option>
                  <option value="Draft">Draft (Hidden from public)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-[#E7DED3] bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#6F665E] hover:text-[#2F241D] rounded-md border border-[#E7DED3] bg-white hover:bg-[#FAF8F3] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="event-form"
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{initialData ? "Save Changes" : "Create Event"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
