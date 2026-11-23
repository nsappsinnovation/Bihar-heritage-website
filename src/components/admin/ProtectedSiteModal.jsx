import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { safeHref } from "../../utils/safeUrl";
import {
  X,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Shield,
  Landmark,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  Building2,
  CheckCircle2,
  Trash2,
  AlertCircle,
  ExternalLink,
  Navigation
} from "lucide-react";

// Official 38 Districts of Bihar
const BIHAR_DISTRICTS = [
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar",
  "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur",
  "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger",
  "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa",
  "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul",
  "Vaishali", "West Champaran"
].sort();

const AUTHORITY_OPTIONS = [
  {
    id: "state",
    label: "State Protected",
    badge: "State Monument",
    icon: Shield,
    category: "State Protected",
  },
  {
    id: "central",
    label: "ASI Centrally Protected",
    badge: "ASI Protected",
    icon: Landmark,
    category: "ASI Protected",
  },
  {
    id: "unesco",
    label: "UNESCO World Heritage",
    badge: "UNESCO Site",
    icon: Award,
    category: "UNESCO Site",
  },
  {
    id: "other",
    label: "Other Heritage Site",
    badge: "Other Heritage Site",
    icon: Sparkles,
    category: "Other Heritage Site",
  }
];

export default function ProtectedSiteModal({
  isOpen,
  onClose,
  initialData = null,
  onSave
}) {
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const [imageMode, setImageMode] = useState("upload"); // 'upload' | 'url'
  const [dateMode, setDateMode] = useState("text"); // 'text' | 'date'
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    managed_by: "state",
    category: "State Protected",
    district: "Patna",
    location: "",
    sub_circle: "",
    protected_since: "",
    map_url: "",
    image: "",
    description: "",
    status: "Published"
  });

  const [errors, setErrors] = useState({});

  // Sync form when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        managed_by: initialData.managed_by || "state",
        category: initialData.category || "State Protected",
        district: initialData.district || "Patna",
        location: initialData.location || "",
        sub_circle: initialData.sub_circle || "",
        protected_since: initialData.protected_since || "",
        map_url: initialData.map_url || initialData.mapUrl || initialData.google_maps_url || "",
        image: initialData.image || initialData.coverImage || "",
        description: initialData.description || initialData.subtitle || "",
        status: initialData.status || "Published"
      });
      if (initialData.image && initialData.image.startsWith("http")) {
        setImageMode("url");
      } else {
        setImageMode("upload");
      }
    } else {
      setFormData({
        name: "",
        managed_by: "state",
        category: "State Protected",
        district: "Patna",
        location: "",
        sub_circle: "",
        protected_since: "",
        map_url: "",
        image: "",
        description: "",
        status: "Published"
      });
      setImageMode("upload");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handle authority selection
  const handleAuthorityChange = (authId) => {
    const selected = AUTHORITY_OPTIONS.find((a) => a.id === authId);
    setFormData((prev) => ({
      ...prev,
      managed_by: authId,
      category: selected ? selected.category : "State Protected"
    }));
  };

  // Open native calendar picker safely
  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === "function") {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  // Format YYYY-MM-DD to DD-MM-YYYY
  const handleDateChange = (e) => {
    const val = e.target.value;
    if (!val) return;
    const parts = val.split("-");
    if (parts.length === 3) {
      const formatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
      setFormData((prev) => ({ ...prev, protected_since: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, protected_since: val }));
    }
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setErrors((prev) => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
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
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setErrors((prev) => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Monument name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim()) newErrors.description = "Historical description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      map_url: formData.map_url.trim(),
      subtitle: formData.description,
      district: formData.district || "Patna"
    };

    onSave(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#2F241D]/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-3xl bg-white rounded-2xl border border-[#E7DED3] overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#E7DED3] bg-[#FAF8F3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center font-serif font-bold shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#2F241D] leading-snug">
                  {initialData ? "Edit Protected Site" : "Add New Protected Site"}
                </h2>
                <p className="text-[11px] text-[#6F665E] font-sans">
                  Official Bihar Heritage directory registration and metadata
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#6F665E] hover:text-[#2F241D] hover:bg-[#E7DED3]/50 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Form Body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-5 space-y-5 flex-1 text-left">
            {/* 1. Authority Governance Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-2">
                Authority & Protection Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AUTHORITY_OPTIONS.map((auth) => {
                  const Icon = auth.icon;
                  const isSelected = formData.managed_by === auth.id;
                  return (
                    <button
                      type="button"
                      key={auth.id}
                      onClick={() => handleAuthorityChange(auth.id)}
                      className={`p-2.5 rounded-md border text-left transition-all flex flex-col justify-between cursor-pointer ${isSelected
                        ? "border-[#B85C38] bg-[#B85C38]/5"
                        : "border-[#E7DED3] bg-white hover:border-[#B85C38]/40 hover:bg-[#FAF8F3]"
                        }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div
                          className={`p-1 rounded-md ${isSelected
                            ? "bg-[#B85C38] text-white"
                            : "bg-[#FAF8F3] text-[#6F665E]"
                            }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B85C38]" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2F241D] leading-tight">
                          {auth.label}
                        </div>
                        <div className="text-[10px] text-[#6F665E] mt-0.5 font-medium">
                          {auth.badge}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Monument Core Info & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  Monument / Site Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  placeholder="e.g. Golghar, Rohtasgarh Fort, or Nalanda Mahavihara"
                  className={`w-full px-3.5 py-2 rounded-md border bg-white text-[#2F241D] text-xs focus:outline-none focus:border-[#B85C38] transition ${errors.name ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                    }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-[#2F241D] text-xs focus:outline-none focus:border-[#B85C38] cursor-pointer appearance-none"
                  >
                    {BIHAR_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-3.5 h-3.5 text-[#6F665E] absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Specific Location / Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    if (errors.location) setErrors({ ...errors, location: null });
                  }}
                  placeholder="e.g. Patna, Bihar or Sasaram, Rohtas, Bihar"
                  className={`w-full px-3.5 py-2 rounded-md border bg-white text-[#2F241D] text-xs focus:outline-none focus:border-[#B85C38] transition ${errors.location ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                    }`}
                />
                {errors.location && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.location}
                  </p>
                )}
              </div>

              {/* Notification Date with Interactive Working Calendar Picker */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center justify-between">
                  <span>Notification Date / Era</span>
                  <button
                    type="button"
                    onClick={handleOpenCalendar}
                    className="text-[10px] font-semibold text-[#B85C38] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Calendar</span>
                  </button>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.protected_since}
                    onChange={(e) => setFormData({ ...formData, protected_since: e.target.value })}
                    placeholder="e.g. 08-12-1976 or Pala Period"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-[#2F241D] text-xs focus:outline-none focus:border-[#B85C38] pr-9"
                  />
                  <button
                    type="button"
                    onClick={handleOpenCalendar}
                    className="absolute right-1.5 p-1 rounded-md text-[#6F665E] hover:text-[#B85C38] hover:bg-[#FAF8F3] transition cursor-pointer"
                    title="Choose Date from Calendar"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={dateInputRef}
                    type="date"
                    onChange={handleDateChange}
                    className="sr-only absolute"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                  Publishing Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-[#2F241D] text-xs focus:outline-none focus:border-[#B85C38] cursor-pointer"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Google Maps Location URL */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center justify-between">
                  <span>Google Maps Location Link</span>
                  <span className="text-[10px] text-[#6F665E] font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.map_url}
                    onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-[#2F241D] text-xs focus:outline-none focus:border-[#B85C38] pr-14"
                  />
                  {formData.map_url ? (
                    <a
                      href={safeHref(formData.map_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2 top-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md text-[10px] font-bold flex items-center gap-1 transition"
                      title="Test Google Map link"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test</span>
                    </a>
                  ) : (
                    <Navigation className="w-3.5 h-3.5 text-[#6F665E] absolute right-3 top-2.5 pointer-events-none" />
                  )}
                </div>
              </div>
            </div>

            {/* 4. Image Upload & Preview Section */}
            <div className="space-y-2.5 pt-1 border-t border-[#E7DED3]/70">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E]">
                  Monument Image & Visual Media
                </label>
                <div className="inline-flex rounded-md bg-[#FAF8F3] p-0.5 border border-[#E7DED3]">
                  <button
                    type="button"
                    onClick={() => setImageMode("upload")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${imageMode === "upload"
                      ? "bg-white text-[#B85C38] border border-[#E7DED3]"
                      : "text-[#6F665E] hover:text-[#2F241D]"
                      }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${imageMode === "url"
                      ? "bg-white text-[#B85C38] border border-[#E7DED3]"
                      : "text-[#6F665E] hover:text-[#2F241D]"
                      }`}
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>Image URL</span>
                  </button>
                </div>
              </div>

              {imageMode === "upload" ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-md p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${dragActive
                    ? "border-[#B85C38] bg-[#B85C38]/5"
                    : "border-[#E7DED3] bg-[#FAF8F3]/50 hover:bg-[#FAF8F3] hover:border-[#B85C38]/50"
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2F241D]">
                      Click to choose image or drag and drop file here
                    </p>
                    <p className="text-[10px] text-[#6F665E] mt-0.5">
                      PNG, JPG, JPEG, WEBP or AVIF (Up to 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-example.jpg"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-[#2F241D] text-xs focus:outline-none focus:border-[#B85C38]"
                  />
                </div>
              )}

              {/* Image Preview Banner */}
              {formData.image && (
                <div className="relative rounded-md overflow-hidden border border-[#E7DED3] bg-neutral-900 group h-32 flex items-center justify-center">
                  <img loading="lazy" decoding="async"
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover opacity-90 transition-transform duration-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2.5 text-white text-[11px] font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>Image Preview Selected</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, image: "" });
                    }}
                    className="absolute top-2 right-2 p-1 rounded-md bg-black/60 hover:bg-red-600 text-white transition cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 5. Description / History */}
            <div className="pt-1 border-t border-[#E7DED3]/70">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                Historical Significance & Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: null });
                }}
                placeholder="Provide details on architectural style, historical origins, builder/ruler, and cultural importance..."
                className={`w-full px-3.5 py-2.5 rounded-md border bg-white text-[#2F241D] text-xs focus:outline-none transition resize-y ${errors.description ? "border-red-400 bg-red-50/20" : "border-[#E7DED3] focus:border-[#B85C38]"
                  }`}
              />
              {errors.description && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>
          </form>

          {/* Modal Footer */}
          <div className="px-5 py-3.5 border-t border-[#E7DED3] bg-[#FAF8F3] flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-[#E7DED3] text-xs font-semibold text-[#6F665E] hover:text-[#2F241D] hover:bg-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#B85C38] text-white text-xs font-semibold hover:bg-[#A0502F] active:scale-[0.99] transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{initialData ? "Save Changes" : "Add Site"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
