import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Link as LinkIcon,
  Phone,
  Mail,
  CheckCircle2,
  Trash2,
  AlertCircle,
  ShieldCheck,
  Award,
  Users,
  Compass,
  User,
  Building2,
  BadgeCheck,
  Eye,
  UserCheck,
  UserX
} from "lucide-react";
import { useLenis } from "lenis/react";
import { compressImageFile } from "../../utils/imageCompressor";

export default function OrganizationModal({
  isOpen,
  onClose,
  initialData = null,
  defaultCategory = "Governing Body",
  onSave,
}) {
  const lenis = useLenis();
  const fileInputRef = useRef(null);
  const [imageMode, setImageMode] = useState("upload"); // 'upload' | 'url'
  const [dragActive, setDragActive] = useState(false);

  const activeWing = initialData?.category || defaultCategory || "Governing Body";

  const isGoverningBody = activeWing === "Governing Body";
  const isExecutive = activeWing === "Executive Committee";
  const isKeyFunctionaries = activeWing === "Key Functionaries";
  const isArcheologicalTeam = activeWing === "Archaeological Team";

  const [formData, setFormData] = useState({
    position: "",
    name: "",
    category: activeWing,
    role: isGoverningBody || isExecutive ? "Member" : "",
    department: "",
    organization: "Bihar Heritage Development Society",
    contact: "",
    email: "",
    image: "",
    sl_no: 1,
    status: "Published",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentWing = initialData?.category || defaultCategory || "Governing Body";

    if (initialData) {
      setFormData({
        position: initialData.position || "",
        name: initialData.name || "",
        category: currentWing,
        role: initialData.role || (currentWing === "Governing Body" || currentWing === "Executive Committee" ? "Member" : ""),
        department: initialData.department || "",
        organization: initialData.organization || "Bihar Heritage Development Society",
        contact: initialData.contact || "",
        email: initialData.email || "",
        image: initialData.image || "",
        sl_no: initialData.sl_no ?? 1,
        status: initialData.status || "Published",
      });
      setImageMode(initialData.image && typeof initialData.image === "string" && initialData.image.startsWith("http") ? "url" : "upload");
    } else {
      setFormData({
        position: "",
        name: "",
        category: currentWing,
        role: currentWing === "Governing Body" || currentWing === "Executive Committee" ? "Member" : "",
        department: "",
        organization: "Bihar Heritage Development Society",
        contact: "",
        email: "",
        image: "",
        sl_no: 1,
        status: "Published",
      });
      setImageMode("upload");
    }
    setErrors({});
  }, [initialData, isOpen, defaultCategory]);

  // Lock background scroll smoothly with lenis support
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file (PNG, JPG, WEBP)" }));
      return;
    }
    try {
      const compressed = await compressImageFile(file, 800, 800, 0.8);
      setFormData((prev) => ({ ...prev, image: compressed }));
      setErrors((prev) => ({ ...prev, image: null }));
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setErrors((prev) => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (isGoverningBody || isExecutive) {
      if (!formData.position.trim()) {
        newErrors.position = "Position or designation title is required";
      }
      if (!formData.department.trim()) {
        newErrors.department = "Department / Ministry is required";
      }
      if (!formData.role) {
        newErrors.role = "Please select a Role in Authority";
      }
    } else if (isKeyFunctionaries) {
      if (!formData.name.trim()) {
        newErrors.name = "Official's full name is required";
      }
      if (!formData.position.trim()) {
        newErrors.position = "Position or title is required";
      }
    } else if (isArcheologicalTeam) {
      if (!formData.name.trim()) {
        newErrors.name = "Team member name is required";
      }
      if (!formData.position.trim()) {
        newErrors.position = "Designation or role is required";
      }
    } else {
      if (!formData.position.trim() && !formData.name.trim()) {
        newErrors.position = "Title or name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      category: activeWing,
      name: formData.name.trim() || formData.position.trim(),
      position: formData.position.trim() || formData.name.trim(),
      role: formData.role ? formData.role.trim() : (isGoverningBody || isExecutive ? "Member" : ""),
      department: formData.department.trim(),
      organization: formData.organization.trim(),
      contact: formData.contact.trim(),
      email: formData.email.trim(),
      sl_no: Number(formData.sl_no) || 1,
      status: formData.status || "Published",
      id: initialData?.id || `org-${Date.now()}`
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  const WingIcon = isGoverningBody
    ? ShieldCheck
    : isExecutive
    ? Award
    : isKeyFunctionaries
    ? Users
    : Compass;

  const modalTitle = initialData
    ? `Edit ${isGoverningBody ? "Governing Body Member" : isExecutive ? "Executive Committee Member" : isKeyFunctionaries ? "Key Functionary" : "Team Member"}`
    : `Add ${isGoverningBody ? "Governing Body Member" : isExecutive ? "Executive Committee Member" : isKeyFunctionaries ? "Key Functionary" : "Archaeological Team Member"}`;

  const modalSubtitle = isGoverningBody
    ? "Apex Governing Committee directory registration and administrative hierarchy"
    : isExecutive
    ? "Executive Committee & Secretariat administrative directory management"
    : isKeyFunctionaries
    ? "Leadership & Key Functionaries directory with contact details and official portraits"
    : "Archaeological research team, field survey personnel, and draughtsmen";

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
          className="relative bg-white rounded-2xl border border-[#E7DED3] w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#FAF8F3] px-5 py-4 border-b border-[#E7DED3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center shrink-0">
                <WingIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#2F241D]">
                    {modalTitle}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B85C38]/10 text-[#B85C38]">
                    {activeWing}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-[#6F665E]">
                  {modalSubtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-[#6F665E] hover:text-[#2F241D] hover:bg-[#E7DED3]/50 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body Scroll Area */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* ============================================================ */}
            {/* 1. GOVERNING BODY & EXECUTIVE COMMITTEE FORM                 */}
            {/* ============================================================ */}
            {(isGoverningBody || isExecutive) && (
              <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#B85C38]" />
                    Official Designation & Authority Details
                  </h3>
                  <span className="text-[10px] text-[#6F665E]">Directory Information</span>
                </div>

                {/* Position / Designation */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                    Position / Designation <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Enter position or designation"
                    className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                      errors.position ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                    }`}
                  />
                  {errors.position && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.position}
                    </p>
                  )}
                </div>

                {/* Official Individual Name (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#6F665E]" />
                    Official Name <span className="text-[#8C827A] font-normal normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter official's name"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>

                {/* Department / Ministry */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                    Department / Ministry <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department name"
                    className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                      errors.department ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                    }`}
                  />
                  {errors.department && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.department}
                    </p>
                  )}
                </div>

                {/* Role in Authority */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-[#B85C38]" />
                    Role in Authority <span className="text-[#B85C38]">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                  >
                    <option value="Member">Member</option>
                    <option value="Chairman">Chairman</option>
                    <option value="Member Secretary">Member Secretary</option>
                  </select>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 2. KEY FUNCTIONARIES FORM                                    */}
            {/* ============================================================ */}
            {isKeyFunctionaries && (
              <>
                {/* Core Functionary Information */}
                <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#B85C38]" />
                      Leadership Profile Information
                    </h3>
                    <span className="text-[10px] text-[#6F665E]">Official Profile</span>
                  </div>

                  {/* Official Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                      Official's Full Name <span className="text-[#B85C38]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                        errors.name ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Position & Role Tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                        Position / Title <span className="text-[#B85C38]">*</span>
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        placeholder="Enter position title"
                        className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                          errors.position ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                        }`}
                      />
                      {errors.position && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3" /> {errors.position}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                        Role / Tag <span className="text-[#8C827A] font-normal normal-case">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="Enter role tag"
                        className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                      />
                    </div>
                  </div>

                  {/* Department / Office */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                      Department / Office
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Enter department or office"
                      className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                    />
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#B85C38]" />
                      Official Communications
                    </h3>
                    <span className="text-[10px] text-[#6F665E]">Contact Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#6F665E]" />
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#6F665E]" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Portrait Photo Media */}
                <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#B85C38]" />
                      Official Portrait Photo
                    </h3>
                    <div className="flex items-center gap-1 bg-[#FAF8F3] p-0.5 rounded-md border border-[#E7DED3]">
                      <button
                        type="button"
                        onClick={() => setImageMode("upload")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          imageMode === "upload"
                            ? "bg-white text-[#B85C38] shadow-xs"
                            : "text-[#6F665E] hover:text-[#2F241D]"
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode("url")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          imageMode === "url"
                            ? "bg-white text-[#B85C38] shadow-xs"
                            : "text-[#6F665E] hover:text-[#2F241D]"
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {formData.image ? (
                    <div className="flex items-center gap-4 p-3 rounded-md border border-[#E7DED3] bg-[#FAF8F3]">
                      <img loading="lazy" decoding="async"
                        src={formData.image}
                        alt="Preview"
                        className="w-14 h-16 object-cover rounded-md border border-[#E7DED3] bg-white shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-[#2F241D] block truncate">
                          Portrait Attached
                        </span>
                        <span className="text-[11px] text-[#6F665E] block">
                          Ready for official display
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-md border border-[#E7DED3] bg-white text-xs font-semibold text-[#2F241D] hover:border-[#B85C38] hover:text-[#B85C38] transition cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                          className="p-1.5 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : imageMode === "upload" ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files?.[0]) {
                          handleFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-5 rounded-md border-2 border-dashed text-center transition cursor-pointer ${
                        dragActive
                          ? "border-[#B85C38] bg-[#B85C38]/5"
                          : "border-[#E7DED3] bg-[#FAF8F3]/50 hover:bg-[#FAF8F3] hover:border-[#B85C38]/60"
                      }`}
                    >
                      <Upload className="w-5 h-5 text-[#6F665E] mx-auto mb-1.5" />
                      <span className="text-xs font-semibold text-[#2F241D] block">
                        Upload portrait image
                      </span>
                      <span className="text-[10px] text-[#6F665E] block mt-0.5">
                        PNG, JPG, WebP up to 5MB (auto-compressed)
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full pl-9 pr-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                      />
                      <LinkIcon className="w-3.5 h-3.5 text-[#6F665E] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </>
            )}

            {/* ============================================================ */}
            {/* 3. ARCHAEOLOGICAL TEAM FORM                                 */}
            {/* ============================================================ */}
            {isArcheologicalTeam && (
              <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#B85C38]" />
                    Archaeological Research Personnel
                  </h3>
                  <span className="text-[10px] text-[#6F665E]">Field Team Directory</span>
                </div>

                {/* Member Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                    Member Full Name <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter member name"
                    className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                      errors.name ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Designation / Role */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                    Designation / Role <span className="text-[#B85C38]">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Enter designation"
                    className={`w-full px-3.5 py-2 rounded-md border bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition ${
                      errors.position ? "border-red-400 bg-red-50/20" : "border-[#E7DED3]"
                    }`}
                  />
                  {errors.position && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.position}
                    </p>
                  )}
                </div>

                {/* Department / Division */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F665E] mb-1">
                    Department / Division
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter division or department"
                    className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                  />
                </div>
              </div>
            )}

            {/* Membership Standing & Tenure Status */}
            <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#B85C38]" />
                  Membership Standing & Tenure
                </h3>
                <span className="text-[10px] text-[#6F665E]">Portal Directory Status</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: "Active" }))}
                  className={`p-2.5 rounded-md border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    formData.status === "Active" || formData.status === "Published"
                      ? "border-emerald-600/70 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500/20"
                      : "border-[#E7DED3] bg-white text-[#6F665E] hover:border-[#B85C38]/40 hover:bg-[#FAF8F3]"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    formData.status === "Active" || formData.status === "Published" ? "bg-emerald-600" : "bg-neutral-300"
                  }`} />
                  <div>
                    <span className="text-xs font-bold block leading-tight">Active Member</span>
                    <span className="text-[10px] text-[#6F665E] block mt-0.5">Currently serving & visible on portal</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: "Inactive" }))}
                  className={`p-2.5 rounded-md border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    formData.status === "Inactive" || formData.status === "Draft"
                      ? "border-amber-600/70 bg-amber-50/50 text-amber-950 ring-1 ring-amber-500/20"
                      : "border-[#E7DED3] bg-white text-[#6F665E] hover:border-[#B85C38]/40 hover:bg-[#FAF8F3]"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    formData.status === "Inactive" || formData.status === "Draft" ? "bg-amber-600" : "bg-neutral-300"
                  }`} />
                  <div>
                    <span className="text-xs font-bold block leading-tight">Past / Inactive</span>
                    <span className="text-[10px] text-[#6F665E] block mt-0.5">Tenure ended / unlisted from portal</span>
                  </div>
                </button>
              </div>
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
              <span>{initialData ? "Save Changes" : "Publish Member"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
