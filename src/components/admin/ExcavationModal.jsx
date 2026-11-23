import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  Compass,
  Landmark,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Building2,
  ExternalLink,
  Sparkles,
  Info
} from "lucide-react";

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

const TYPE_OPTIONS = [
  {
    id: "excavation",
    label: "Excavation Site",
    badge: "Active / Documented Dig",
    icon: Landmark,
    description: "Stratigraphic archaeological digs, ancient stupas, monasteries & historic monuments."
  },
  {
    id: "exploration",
    label: "Exploration Activity",
    badge: "Field Survey & Research",
    icon: Compass,
    description: "GIS mapping, subterranean tunnel studies, 3D modeling & riverine surveys."
  }
];

export const LEAD_AGENCY_OPTIONS = [
  "Archaeological Survey of India (ASI)",
  "Archaeological Survey of India (ASI Patna Circle)",
  "Bihar Heritage Development Society (BHDS)",
  "Directorate of Archaeology & Museums, Govt. of Bihar",
  "Bihar Heritage Development Society (BHDS) & ASI",
  "BHDS & Visva-Bharati University",
  "Patna University (Dept. of AIH & Archaeology)",
  "K.P. Jayaswal Research Institute (KPJRI), Patna",
  "Nalanda University",
  "Ministry of Culture & ASI",
  "Directorate of Archaeology & ASI",
  "BHDS & Historical Survey Team",
  "ASI Digital Documentation Wing",
  "ASI Maritime & Riverine Wing",
  "ASI & GIS Survey Unit",
  "Other / Custom Research Institution"
];

export default function ExcavationModal({
  isOpen,
  initialData = null,
  onClose,
  onSave
}) {
  const isEdit = Boolean(initialData && (initialData.id || initialData.title));

  const [formData, setFormData] = useState({
    title: "",
    type: "excavation",
    district: "Patna",
    location: "",
    period: "",
    lead_agency: "Bihar Heritage Development Society (BHDS)",
    map_url: "",
    description: "",
    details: "",
    status: "Published",
    image: ""
  });

  const [agencySelection, setAgencySelection] = useState("Bihar Heritage Development Society (BHDS)");
  const [customAgency, setCustomAgency] = useState("");
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

        const agencyVal = initialData.lead_agency || "Bihar Heritage Development Society (BHDS)";
        if (LEAD_AGENCY_OPTIONS.includes(agencyVal)) {
          setAgencySelection(agencyVal);
          setCustomAgency("");
        } else if (agencyVal) {
          setAgencySelection("Other / Custom Research Institution");
          setCustomAgency(agencyVal);
        } else {
          setAgencySelection("Bihar Heritage Development Society (BHDS)");
          setCustomAgency("");
        }

        setFormData({
          id: initialData.id,
          title: initialData.title || initialData.name || "",
          type: initialData.type || "excavation",
          district: inferredDist || "Patna",
          location: initialData.location || "",
          period: initialData.period || initialData.excavation || "",
          lead_agency: agencyVal,
          map_url: initialData.map_url || "",
          description: initialData.description || "",
          details: initialData.details || "",
          status: initialData.status || "Published",
          image: initialData.image || ""
        });
        setImageUrlInput(typeof initialData.image === "string" && initialData.image.startsWith("http") ? initialData.image : "");
      } else {
        setAgencySelection("Bihar Heritage Development Society (BHDS)");
        setCustomAgency("");
        setFormData({
          title: "",
          type: "excavation",
          district: "Patna",
          location: "",
          period: "",
          lead_agency: "Bihar Heritage Development Society (BHDS)",
          map_url: "",
          description: "",
          details: "",
          status: "Published",
          image: ""
        });
        setImageUrlInput("");
      }
      setImageTab("upload");
    }
  }, [isOpen, initialData]);

  // Lock background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "location" && value) {
        const matched = BIHAR_DISTRICTS.find((d) =>
          value.toLowerCase().includes(d.toLowerCase())
        );
        if (matched && (!prev.district || prev.district === "Patna")) {
          next.district = matched;
        }
      }
      return next;
    });
  };

  // Drag and drop handlers
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

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({ ...prev, image: imageUrlInput.trim() }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImageUrlInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter the project / site title.");
      return;
    }
    if (!formData.location.trim()) {
      alert("Please enter the site location.");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please provide a short summary description.");
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      type: formData.type || "excavation",
      district: formData.district || "Patna",
      location: formData.location.trim(),
      period: formData.period?.trim() || "Active Research / Historical Site",
      lead_agency: formData.lead_agency?.trim() || "Bihar Heritage Development Society (BHDS)",
      map_url: formData.map_url?.trim() || "",
      description: formData.description.trim(),
      details: formData.details?.trim() || formData.description.trim(),
      status: formData.status || "Published",
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#2F241D]/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-white rounded-2xl border border-[#E7DED3] overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="px-5 py-4 bg-[#FAF8F3] border-b border-[#E7DED3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center font-bold shrink-0">
                {formData.type === "exploration" ? (
                  <Compass className="w-4 h-4" />
                ) : (
                  <Landmark className="w-4 h-4" />
                )}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#2F241D] leading-snug">
                  {isEdit ? "Edit Archaeological Project" : "Add New Excavation & Exploration"}
                </h2>
                <p className="text-[11px] text-[#6F665E] font-sans">
                  {isEdit
                    ? "Update excavation findings, historical notes, and site survey records."
                    : "Add an archaeological dig, exploration site, or survey record to Bihar archives."}
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

          {/* Form Scroll Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
            {/* 1. Project Type Selector */}
            <div>
              <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-2">
                Archaeological Category <span className="text-[#B85C38]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.type === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type: opt.id }))}
                      className={`relative flex items-start gap-3 p-3 rounded-md border text-left transition-all cursor-pointer ${isSelected
                        ? "bg-[#FAF8F3] border-[#B85C38]"
                        : "bg-white border-[#E7DED3] hover:border-[#B85C38]/40 hover:bg-[#FAF8F3]/50"
                        }`}
                    >
                      <div
                        className={`p-2 rounded-md shrink-0 transition-colors ${isSelected
                          ? "bg-[#B85C38] text-white"
                          : "bg-[#FAF8F3] text-[#6F665E] border border-[#E7DED3]"
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-xs font-bold text-[#2F241D]">{opt.label}</span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#B85C38] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#6F665E] leading-relaxed line-clamp-2">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Basic Information Grid */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5 border-b border-[#E7DED3] pb-2">
                <Info className="w-3.5 h-3.5 text-[#B85C38]" /> Basic Site Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                    Site / Project Title <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Bhadariya Excavation, Nalanda University, Rohtasgarh Tunnel Study"
                    required
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                    District <span className="text-[#B85C38]">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                  >
                    {BIHAR_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                    Address <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Amarpur, Banka District, Bihar"
                    required
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>

                {/* Period / Excavation Era */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                    Excavation Era / Period
                  </label>
                  <input
                    type="text"
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    placeholder="e.g., 6th Century BCE (Buddha Era) or 1915 - 1937"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>

                {/* Lead Agency */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#B85C38]" /> Lead Agency
                    </span>
                    <span className="text-[10px] text-[#6F665E] font-normal lowercase">(select or custom)</span>
                  </label>
                  <select
                    value={agencySelection}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAgencySelection(val);
                      if (val === "Other / Custom Research Institution") {
                        setFormData((prev) => ({ ...prev, lead_agency: customAgency }));
                      } else {
                        setFormData((prev) => ({ ...prev, lead_agency: val }));
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                  >
                    {LEAD_AGENCY_OPTIONS.map((agency) => (
                      <option key={agency} value={agency}>
                        {agency}
                      </option>
                    ))}
                  </select>

                  {agencySelection === "Other / Custom Research Institution" && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2"
                    >
                      <input
                        type="text"
                        value={customAgency}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomAgency(val);
                          setFormData((prev) => ({ ...prev, lead_agency: val }));
                        }}
                        placeholder="Type custom institution / university / research team..."
                        className="w-full px-3.5 py-2 rounded-md border border-[#B85C38] bg-white text-xs text-[#2F241D] font-medium focus:outline-none transition"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </div>

                {/* Google Maps Link (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#B85C38]" /> Google Maps URL{" "}
                    <span className="text-[#6F665E] font-normal text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    type="url"
                    name="map_url"
                    value={formData.map_url}
                    onChange={handleChange}
                    placeholder="https://maps.app.goo.gl/..."
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
                  <ImageIcon className="w-3.5 h-3.5 text-[#B85C38]" /> Site Media & Visual Assets
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
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /assets/..."
                    className="flex-1 px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3.5 py-2 bg-[#B85C38] text-white text-xs font-semibold rounded-md hover:bg-[#A0502F] transition cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
              )}

              {/* Live Image Preview */}
              {formData.image && (
                <div className="relative rounded-md overflow-hidden border border-[#E7DED3] bg-black group max-h-48">
                  <img loading="lazy" decoding="async"
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-40 object-cover group-hover:opacity-90 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2.5 text-white text-[11px] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Image attached successfully
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 hover:bg-rose-600 text-white transition cursor-pointer"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Descriptions & Detailed Findings Section */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5 border-b border-[#E7DED3] pb-2">
                <FileText className="w-3.5 h-3.5 text-[#B85C38]" /> Archaeological Findings & Documentation
              </h3>

              {/* Short Summary Description */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Short Summary / Card Description <span className="text-[#B85C38]">*</span>
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Concise 1-2 sentence overview of the excavation or survey highlights..."
                  required
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition leading-relaxed resize-y"
                />
              </div>

              {/* Detailed Findings & Reports */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Detailed Archaeological Report</span>
                  <span className="text-[#6F665E] font-normal text-[10px] lowercase">
                    (supports subheaders & bullet points)
                  </span>
                </label>
                <textarea
                  name="details"
                  rows={5}
                  value={formData.details}
                  onChange={handleChange}
                  placeholder={`Write the comprehensive excavation report, structural findings, historical significance, and research methodology here...\n\nKey Excavation Discoveries:\n- Uncovered ancient structures and terracotta artifacts.\n- Continuous occupational sequence.\n\nHistorical Context:\nDetailed historical analysis...`}
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-mono leading-relaxed focus:outline-none focus:border-[#B85C38] transition resize-y"
                />
              </div>
            </div>

            {/* Footer Form Controls */}
            <div className="pt-3 border-t border-[#E7DED3] flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md text-xs font-semibold border border-[#E7DED3] text-[#6F665E] hover:bg-[#FAF8F3] hover:text-[#2F241D] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEdit ? "Update Project" : "Publish Site"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
