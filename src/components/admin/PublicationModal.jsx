import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  BookOpen,
  Globe,
  Calendar,
  Layers,
  Sparkles,
  Bookmark,
  ExternalLink,
  Trash2
} from "lucide-react";
import { compressImageFile } from "../../utils/imageCompressor";

const PUBLICATION_CATEGORIES = [
  { id: "Archaeological Atlas", label: "Archaeological Atlas", desc: "Cartographic & monument atlases" },
  { id: "Folk Literature", label: "Folk Literature", desc: "Regional oral tales & folklore" },
  { id: "Linguistic Heritage", label: "Linguistic Heritage", desc: "Scripts, dialects & epigraphy" },
  { id: "Excavation Report", label: "Excavation Report", desc: "Dig findings & monastery reports" },
  { id: "Academic Monograph", label: "Academic Monograph", desc: "Scholarly research publications" },
  { id: "Research Journal", label: "Research Journal", desc: "Periodicals & historical bulletins" },
  { id: "Heritage Booklet", label: "Heritage Booklet", desc: "Guidebooks & exhibition summaries" },
];

export default function PublicationModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "Archaeological Atlas",
    author: "Bihar Heritage Development Society",
    year: new Date().getFullYear().toString(),
    language: "Bilingual (Hindi / English)",
    pages: "150 Pages",
    description: "",
    cover: "",
    pdfUrl: "",
    status: "Published",
  });

  const [coverTab, setCoverTab] = useState("upload"); // 'upload' | 'url'
  const [pdfTab, setPdfTab] = useState("upload"); // 'upload' | 'url'
  const [coverDragActive, setCoverDragActive] = useState(false);
  const [pdfDragActive, setPdfDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coverFileInputRef = useRef(null);
  const pdfFileInputRef = useRef(null);

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        category: initialData.category || "Archaeological Atlas",
        author: initialData.author || "Bihar Heritage Development Society",
        year: initialData.year || new Date().getFullYear().toString(),
        language: initialData.language || "Bilingual (Hindi / English)",
        pages: initialData.pages || "150 Pages",
        description: initialData.description || initialData.details || "",
        cover: initialData.cover || initialData.image || "",
        pdfUrl: initialData.pdfUrl || initialData.pdf || "",
        status: initialData.status || "Published",
      });

      setCoverTab(
        initialData.cover && typeof initialData.cover === "string" && initialData.cover.startsWith("http")
          ? "url"
          : "upload"
      );
      setPdfTab(
        initialData.pdfUrl && typeof initialData.pdfUrl === "string" && initialData.pdfUrl.startsWith("http")
          ? "url"
          : "upload"
      );
    } else {
      setFormData({
        title: "",
        subtitle: "",
        category: "Archaeological Atlas",
        author: "Bihar Heritage Development Society",
        year: new Date().getFullYear().toString(),
        language: "Bilingual (Hindi / English)",
        pages: "150 Pages",
        description: "",
        cover: "",
        pdfUrl: "",
        status: "Published",
      });
      setCoverTab("upload");
      setPdfTab("upload");
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

  // Image Upload Handlers
  const handleCoverFileProcess = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, cover: "Please select an image file (PNG, JPG, WEBP)" }));
      return;
    }

    try {
      const compressedData = await compressImageFile(file, 800, 1100, 0.8);
      setFormData((prev) => ({ ...prev, cover: compressedData }));
      setErrors((prev) => ({ ...prev, cover: null }));
    } catch (err) {
      console.warn("Cover compression fallback:", err);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, cover: reader.result }));
        setErrors((prev) => ({ ...prev, cover: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setCoverDragActive(true);
    } else if (e.type === "dragleave") {
      setCoverDragActive(false);
    }
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCoverDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCoverFileProcess(e.dataTransfer.files[0]);
    }
  };

  // PDF Upload Handlers
  const handlePdfFileProcess = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrors((prev) => ({ ...prev, pdfUrl: "Please select a valid PDF file (.pdf)" }));
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, pdfUrl: "PDF file size must be less than 25MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, pdfUrl: reader.result }));
      setErrors((prev) => ({ ...prev, pdfUrl: null }));
    };
    reader.readAsDataURL(file);
  };

  const handlePdfDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setPdfDragActive(true);
    } else if (e.type === "dragleave") {
      setPdfDragActive(false);
    }
  };

  const handlePdfDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPdfDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfFileProcess(e.dataTransfer.files[0]);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = "Publication title is required";
    }
    if (!formData.description.trim()) {
      errs.description = "Please provide an overview or summary for this publication";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
      updatedAt: new Date().toISOString(),
    };

    try {
      onSave(payload);
      onClose();
    } catch (err) {
      console.error("Failed to save publication:", err);
      setErrors({ form: "Failed to save publication record. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-[#2F241D]/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-4xl bg-white border border-[#E7DED3] rounded-2xl overflow-hidden flex flex-col max-h-[92vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#FAF8F3] px-5 py-4 border-b border-[#E7DED3] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#2F241D]">
                  {initialData ? "Edit Publication Record" : "Add New Archival Publication"}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B85C38]/10 text-[#B85C38]">
                  {formData.category}
                </span>
              </div>
              <p className="text-[11px] text-[#6F665E] font-sans">
                Manage archival reports, research atlases, journals, and folk literature booklets.
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

        {/* Modal Scrollable Body */}
        <form id="publication-modal-form" onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-md text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* 1. Category Selector */}
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                Publication Classification & Type
              </h3>
              <span className="text-[10px] text-[#6F665E]">Select the primary category</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PUBLICATION_CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, category: cat.id }))}
                    className={`flex flex-col p-2.5 rounded-md border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FAF8F3] border-[#B85C38] text-[#B85C38] font-bold"
                        : "bg-white border-[#E7DED3] text-[#2F241D] hover:bg-[#FAF8F3]/50 hover:border-[#B85C38]/40"
                    }`}
                  >
                    <span className="text-xs font-semibold leading-tight">{cat.label}</span>
                    <span
                      className={`text-[10px] mt-0.5 line-clamp-1 ${
                        isSelected ? "text-[#B85C38]/80 font-medium" : "text-[#6F665E]"
                      }`}
                    >
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Core Book Metadata */}
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] border-b border-[#E7DED3] pb-2 flex items-center gap-1.5">
              Document Information & Authorship
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Publication Title <span className="text-[#B85C38]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Archaeological Atlas of Bihar"
                  className={`w-full px-3.5 py-2 rounded-md border text-xs text-[#2F241D] font-medium focus:outline-none transition ${
                    errors.title ? "border-red-400 bg-red-50/50" : "border-[#E7DED3] bg-white focus:border-[#B85C38]"
                  }`}
                />
                {errors.title && <p className="text-[10px] text-red-600 mt-1">{errors.title}</p>}
              </div>

              {/* Subtitle / Edition */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Subtitle / Edition Tagline
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g., A comprehensive geographical and historical cartography of Bihar"
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Author / Editorial */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Author / Editorial Body
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="e.g., Bihar Heritage Development Society"
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Language(s)
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g., Bilingual (Hindi / English), Maithili, Bhojpuri"
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Publication Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2024"
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Pages / Volumes */}
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Volume / Page Count
                </label>
                <input
                  type="text"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  placeholder="e.g., 184 Pages"
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>

              {/* Publishing Status */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Publishing Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition cursor-pointer"
                >
                  <option value="Published">Published (Live on Public Portal)</option>
                  <option value="Draft">Draft (Hidden from Public)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Cover Image Section */}
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#B85C38]" /> Book Cover Presentation
              </h3>
              <div className="flex items-center gap-1 bg-[#FAF8F3] p-0.5 rounded-md border border-[#E7DED3]">
                <button
                  type="button"
                  onClick={() => setCoverTab("upload")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    coverTab === "upload" ? "bg-white text-[#B85C38] border border-[#E7DED3]" : "text-[#6F665E] hover:text-[#2F241D]"
                  }`}
                >
                  Local Upload
                </button>
                <button
                  type="button"
                  onClick={() => setCoverTab("url")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    coverTab === "url" ? "bg-white text-[#B85C38] border border-[#E7DED3]" : "text-[#6F665E] hover:text-[#2F241D]"
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {coverTab === "upload" ? (
              <div>
                <div
                  onDragEnter={handleCoverDrag}
                  onDragLeave={handleCoverDrag}
                  onDragOver={handleCoverDrag}
                  onDrop={handleCoverDrop}
                  onClick={() => coverFileInputRef.current?.click()}
                  className={`border border-dashed rounded-md p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                    coverDragActive
                      ? "border-[#B85C38] bg-[#B85C38]/5"
                      : "border-[#E7DED3] bg-[#FAF8F3]/50 hover:bg-[#FAF8F3] hover:border-[#B85C38]/50"
                  }`}
                >
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCoverFileProcess(e.target.files?.[0])}
                  />
                  <div className="w-10 h-10 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2F241D]">
                      Click to browse or drag & drop cover image
                    </p>
                    <p className="text-[10px] text-[#6F665E] mt-0.5">
                      Supports JPG, PNG, WEBP (Max 8MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Direct Cover Image URL
                </label>
                <input
                  type="text"
                  name="cover"
                  value={formData.cover}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>
            )}

            {/* Cover Preview */}
            {formData.cover && (
              <div className="flex items-center gap-3 p-2.5 bg-[#FAF8F3] rounded-md border border-[#E7DED3]">
                <img loading="lazy" decoding="async"
                  src={formData.cover}
                  alt="Cover Preview"
                  className="w-14 h-18 object-cover rounded-md border border-[#E7DED3]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=300";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#2F241D] truncate">Cover Preview Loaded</p>
                  <p className="text-[10px] text-[#6F665E] truncate">{formData.title || "Ready for display"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, cover: "" }))}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {errors.cover && <p className="text-[10px] text-red-600">{errors.cover}</p>}
          </div>

          {/* 4. PDF Document Section */}
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#B85C38]" /> PDF Document & Flipbook Source
              </h3>
              <div className="flex items-center gap-1 bg-[#FAF8F3] p-0.5 rounded-md border border-[#E7DED3]">
                <button
                  type="button"
                  onClick={() => setPdfTab("upload")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    pdfTab === "upload" ? "bg-white text-[#B85C38] border border-[#E7DED3]" : "text-[#6F665E] hover:text-[#2F241D]"
                  }`}
                >
                  Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPdfTab("url")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    pdfTab === "url" ? "bg-white text-[#B85C38] border border-[#E7DED3]" : "text-[#6F665E] hover:text-[#2F241D]"
                  }`}
                >
                  PDF Web Link
                </button>
              </div>
            </div>

            {pdfTab === "upload" ? (
              <div>
                <div
                  onDragEnter={handlePdfDrag}
                  onDragLeave={handlePdfDrag}
                  onDragOver={handlePdfDrag}
                  onDrop={handlePdfDrop}
                  onClick={() => pdfFileInputRef.current?.click()}
                  className={`border border-dashed rounded-md p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                    pdfDragActive
                      ? "border-[#B85C38] bg-[#B85C38]/5"
                      : "border-[#E7DED3] bg-[#FAF8F3]/50 hover:bg-[#FAF8F3] hover:border-[#B85C38]/50"
                  }`}
                >
                  <input
                    ref={pdfFileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handlePdfFileProcess(e.target.files?.[0])}
                  />
                  <div className="w-10 h-10 rounded-md bg-[#B85C38]/10 text-[#B85C38] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2F241D]">
                      Click to attach PDF or drag & drop document
                    </p>
                    <p className="text-[10px] text-[#6F665E] mt-0.5">
                      Supports Adobe PDF (.pdf) format (Max 25MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider mb-1">
                  Direct PDF Document URL
                </label>
                <input
                  type="text"
                  name="pdfUrl"
                  value={formData.pdfUrl}
                  onChange={handleChange}
                  placeholder="https://... /document.pdf"
                  className="w-full px-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs text-[#2F241D] font-medium focus:outline-none focus:border-[#B85C38] transition"
                />
              </div>
            )}

            {/* PDF Indicator */}
            {formData.pdfUrl && (
              <div className="flex items-center gap-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">PDF Document Linked & Interactive Flipbook Ready</p>
                  <p className="text-[10px] text-emerald-700/80 truncate">
                    {typeof formData.pdfUrl === "string" && formData.pdfUrl.startsWith("data:")
                      ? "Embedded Local PDF Attachment"
                      : formData.pdfUrl}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, pdfUrl: "" }))}
                  className="p-1 text-emerald-700 hover:bg-emerald-100 rounded-md transition cursor-pointer"
                  title="Remove PDF"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {errors.pdfUrl && <p className="text-[10px] text-red-600">{errors.pdfUrl}</p>}
          </div>

          {/* 5. Comprehensive Synopsis / Details */}
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#E7DED3] pb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D] flex items-center gap-1.5">
                Synopsis & Book Description <span className="text-[#B85C38]">*</span>
              </h3>
              <span className="text-[10px] text-[#6F665E]">Summary shown on cards & reader</span>
            </div>

            <div>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a comprehensive description of the publication, chapters, archaeological significance, or oral narratives..."
                className={`w-full p-3.5 rounded-md border text-xs text-[#2F241D] leading-relaxed focus:outline-none transition ${
                  errors.description ? "border-red-400 bg-red-50/50" : "border-[#E7DED3] bg-white focus:border-[#B85C38]"
                }`}
              />
              {errors.description && <p className="text-[10px] text-red-600 mt-1">{errors.description}</p>}
            </div>
          </div>
        </form>

        {/* Footer Action Buttons */}
        <div className="bg-white px-5 py-3 border-t border-[#E7DED3] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-[#E7DED3] text-[#6F665E] hover:text-[#2F241D] hover:bg-[#FAF8F3] text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="publication-modal-form"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#B85C38] hover:bg-[#A0502F] text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Record...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{initialData ? "Update Publication" : "Publish Record"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
