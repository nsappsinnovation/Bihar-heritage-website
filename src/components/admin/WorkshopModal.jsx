import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  BookOpen,
  Presentation,
  Users,
  Eye,
  FileText,
  Building2,
  ExternalLink,
  Layers,
  GraduationCap,
  ShieldCheck,
  Compass
} from "lucide-react";
import { compressImageFile } from "../../utils/imageCompressor";

// List of all 38 districts in Bihar
const BIHAR_DISTRICTS = [
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur",
  "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj",
  "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj",
  "Lakhisarai", "Madhepura", "Madhubani", "Munger",
  "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa",
  "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul",
  "Vaishali", "West Champaran"
].sort();

const CATEGORY_OPTIONS = [
  { id: "Workshop", label: "Workshop", icon: Layers, desc: "Practical hands-on training & methodology" },
  { id: "Seminar", label: "Seminar", icon: Presentation, desc: "Academic symposium & panel discussions" },
  { id: "National Seminar", label: "National Seminar", icon: GraduationCap, desc: "All-India research conference" },
  { id: "Celebration", label: "Celebration", icon: Sparkles, desc: "Commemoration of heritage milestones" },
  { id: "Inauguration", label: "Inauguration", icon: Award, desc: "Official launch & project unveiling" },
  { id: "Exhibition", label: "Exhibition", icon: ImageIcon, desc: "Photo, painting & artifact showcase" },
  { id: "Cultural Program", label: "Cultural Program", icon: Users, desc: "Dance, music & folk performance" },
  { id: "Lecture", label: "Lecture", icon: BookOpen, desc: "Academic talks by eminent scholars" },
  { id: "Conservation", label: "Conservation", icon: ShieldCheck, desc: "Site restoration & brick treatment" },
  { id: "Heritage Walk", label: "Heritage Walk", icon: Compass, desc: "Guided architectural & field tour" },
  { id: "Expert Inspection", label: "Expert Inspection", icon: Building2, desc: "Structural technical assessment" },
  { id: "Documentation", label: "Documentation", icon: FileText, desc: "Site mapping & digital archiving" },
  { id: "Awareness Session", label: "Awareness Session", icon: Users, desc: "Public & student youth outreach" },
  { id: "Training", label: "Training", icon: Award, desc: "Technical skill certification course" }
];

export default function WorkshopModal({
  isOpen,
  initialData = null,
  onClose,
  onSave
}) {
  const isEdit = Boolean(initialData && (initialData.id || initialData.title));

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: "",
    category: "Workshop",
    location: "",
    district: "Patna",
    details: "",
    status: "Published",
    image: ""
  });

  const [imageTab, setImageTab] = useState("upload");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Sync state when opened or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let inferredDist = initialData.district || "";
        if (!inferredDist && initialData.location) {
          const matched = BIHAR_DISTRICTS.find((d) =>
            initialData.location.toLowerCase().includes(d.toLowerCase())
          );
          if (matched) inferredDist = matched;
        }

        setFormData({
          id: initialData.id,
          title: initialData.title || initialData.name || "",
          subtitle: initialData.subtitle || "",
          date: initialData.date || "",
          category: initialData.category || "Workshop",
          location: initialData.location || "",
          district: inferredDist || "Patna",
          details: initialData.details || initialData.description || "",
          status: initialData.status || "Published",
          image: initialData.image || initialData.link || ""
        });
        setImageUrlInput(
          typeof initialData.image === "string" && initialData.image.startsWith("http")
            ? initialData.image
            : typeof initialData.link === "string" && initialData.link.startsWith("http")
              ? initialData.link
              : ""
        );
      } else {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        const formattedToday = `${dd}-${mm}-${yyyy}`;

        setFormData({
          title: "",
          subtitle: "",
          date: formattedToday,
          category: "Workshop",
          location: "Bihar Museum, Patna",
          district: "Patna",
          details: "",
          status: "Published",
          image: ""
        });
        setImageUrlInput("");
      }
      setImageTab("upload");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Convert DD-MM-YYYY to YYYY-MM-DD for native HTML date input
  const getIsoDateValue = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split("-");
      return `${y}-${m}-${d}`;
    }
    return "";
  };

  const handleNativeDateChange = (e) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val) {
      const [y, m, d] = val.split("-");
      setFormData((prev) => ({
        ...prev,
        date: `${d}-${m}-${y}`
      }));
    }
  };

  // Drag & drop file upload handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }
    try {
      const compressedData = await compressImageFile(file, 1000, 700, 0.8);
      setFormData((prev) => ({
        ...prev,
        image: compressedData,
        link: compressedData
      }));
    } catch (err) {
      console.warn("Compression fallback in WorkshopModal:", err);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target.result;
        setFormData((prev) => ({
          ...prev,
          image: base64,
          link: base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlApply = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        image: imageUrlInput.trim(),
        link: imageUrlInput.trim()
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
      link: ""
    }));
    setImageUrlInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter the Activity / Event Title.");
      return;
    }
    if (!formData.location.trim()) {
      alert("Please enter the venue / location.");
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      link: formData.image || formData.link || "",
      image: formData.image || formData.link || ""
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2F241D]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="bg-white w-full max-w-4xl rounded-2xl border border-[#E7DED3] overflow-hidden flex flex-col max-h-[92vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#FAF8F3] px-5 py-4 border-b border-[#E7DED3] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#2F241D]">
                  {isEdit ? "Edit Activity / Workshop" : "Create New Activity / Workshop"}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#B85C38]/10 text-[#B85C38]">
                  {formData.category}
                </span>
              </div>
              <p className="text-[11px] text-[#6F665E] font-sans">
                Manage official seminars, training sessions, exhibitions, and field visits.
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. Category Selection Grid */}
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] flex items-center justify-between">
              <span>Select Activity Category <span className="text-[#B85C38]">*</span></span>
              <span className="text-[10px] text-[#6F665E] font-normal lowercase">Choose event classification</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, category: cat.id }))}
                    className={`flex items-center gap-2 p-2.5 rounded-md border text-left transition-all cursor-pointer ${isSelected
                      ? "bg-[#FAF8F3] border-[#B85C38] text-[#B85C38] font-bold"
                      : "bg-white border-[#E7DED3] text-[#2F241D] hover:bg-[#FAF8F3]/50 hover:border-[#B85C38]/40"
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#B85C38]" : "text-[#6F665E]"}`} />
                    <div className="min-w-0">
                      <p className="text-xs truncate font-semibold">{cat.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Core Metadata & Details */}
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] border-b border-[#E7DED3] pb-2 flex items-center gap-1.5">
              Program Information & Venue
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Event Title */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Activity / Event Title <span className="text-[#B85C38]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., World Heritage Day Celebration or Ancient Rock Art Exhibition"
                  required
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Subtitle / Tagline */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Subtitle / Summary Tagline
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g., Special ceremony organized on World Heritage Day 2025."
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Date Input with Native Calendar Picker */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#B85C38]" /> Event Date <span className="text-[#B85C38]">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={getIsoDateValue(formData.date)}
                  onChange={handleNativeDateChange}
                  required
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                />
              </div>

              {/* District Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#B85C38]" /> Bihar District <span className="text-[#B85C38]">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                >
                  {BIHAR_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} District
                    </option>
                  ))}
                </select>
              </div>

              {/* Location / Venue */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Venue / Specific Location <span className="text-[#B85C38]">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Bihar Museum Amphitheatre, Patna"
                  required
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Publishing Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Media Upload Section */}
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#B85C38]" /> Event Media & Cover Photograph
              </h3>
              <div className="flex items-center gap-1 bg-[#FAF8F3] p-0.5 rounded-md border border-[#E7DED3]">
                <button
                  type="button"
                  onClick={() => setImageTab("upload")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${imageTab === "upload"
                    ? "bg-white text-[#B85C38] border border-[#E7DED3]"
                    : "text-[#6F665E] hover:text-[#2F241D]"
                    }`}
                >
                  Local Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab("url")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${imageTab === "url"
                    ? "bg-white text-[#B85C38] border border-[#E7DED3]"
                    : "text-[#6F665E] hover:text-[#2F241D]"
                    }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {/* Upload or URL Tab */}
            {imageTab === "upload" ? (
              <div>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-md p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${dragActive
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
                  <div className="w-10 h-10 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2F241D]">
                      Click to upload image or drag and drop file here
                    </p>
                    <p className="text-[10px] text-[#6F665E] mt-0.5">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6F665E]" />
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://firebasestorage..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageUrlApply}
                  className="px-3.5 py-2 bg-[#B85C38] hover:bg-[#A0502F] text-white rounded-md text-xs font-semibold transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Image Preview Thumbnail */}
            {formData.image && (
              <div className="flex items-center gap-3 bg-[#FAF8F3] p-2.5 rounded-md border border-[#E7DED3]">
                <div className="w-16 h-14 rounded-md overflow-hidden bg-black/10 shrink-0 relative">
                  <img loading="lazy" decoding="async"
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#2F241D] truncate">
                    {formData.image.startsWith("data:") ? "Local File Selected (Base64)" : formData.image}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Image attached successfully
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 4. Detailed Event Findings & Documentation Report */}
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                Comprehensive Event Documentation & Report
              </h3>
              <span className="text-[10px] text-[#6F665E]">Rich paragraphs & bullet support</span>
            </div>

            <textarea
              name="details"
              rows={5}
              value={formData.details}
              onChange={handleChange}
              placeholder={`Provide the detailed event report, key speakers, topics discussed, and conservation takeaways.

Example formatting:
On World Heritage Day, BHDS organized a commemorative ceremony...

Key Highlights:
- Conservation methods for ancient brick ruins
- Youth participation and digitization roadmap
- Panel discussions with leading archaeologists`}
              className="w-full p-3.5 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-sans leading-relaxed focus:outline-none focus:border-[#B85C38] transition resize-y font-normal"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E7DED3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-[#E7DED3] bg-white hover:bg-[#FAF8F3] text-[#6F665E] hover:text-[#2F241D] text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#B85C38] hover:bg-[#A0502F] active:scale-[0.99] text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isEdit ? "Update Activity" : "Publish Activity"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
