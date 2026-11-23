import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Eye,
  Edit3,
  Save,
  Plus,
  ArrowLeft,
  Layers,
  Columns,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Sparkles,
  CheckCircle2,
  Check,
  FileText,
  User,
  Calendar,
  Tag,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  RefreshCw,
  LayoutTemplate,
  Maximize2,
  AlignCenter,
  PanelLeft,
  PanelRight,
  ArrowUpSquare,
  ArrowDownSquare,
  Type,
  Quote,
  Grid,
  AlignLeft
} from "lucide-react";
import BlogTemplateSelector from "./BlogTemplateSelector";
import BlogSectionEditor from "./BlogSectionEditor";
import BlogArticlePreview from "./BlogArticlePreview";
import { generateUniqueId, BIHAR_PRESET_IMAGES } from "./templateData";

const CATEGORY_OPTIONS = [
  "Architecture",
  "Archaeology",
  "Culture",
  "Conservation",
  "Museums",
  "Festivals",
  "Heritage Walks"
];

const HEADER_LAYOUT_OPTIONS = [
  { value: "standard", label: "Classic Banner", icon: LayoutTemplate, description: "Full cover image banner with title overlay" },
  { value: "split", label: "Split Magazine", icon: Columns, description: "Side-by-side narrative & cover card" },
  { value: "overlay", label: "Cinematic Hero", icon: Maximize2, description: "Immersive dark overlay with large typography" },
  { value: "minimal", label: "Centered Editorial", icon: AlignCenter, description: "Literary centered layout with divider" }
];

const LEAD_STYLE_OPTIONS = [
  { value: "border-left", label: "Accent Border", icon: PanelLeft, description: "Terracotta vertical line" },
  { value: "card", label: "Editorial Card", icon: LayoutTemplate, description: "Soft container box" },
  { value: "quote", label: "Pull Quote", icon: Quote, description: "Large quotation style" },
  { value: "archival-inset", label: "Archival Inset", icon: Tag, description: "Top terracotta accent & overview pill" },
  { value: "editorial-deck", label: "Editorial Deck", icon: Type, description: "Serif lead with ornate separator bar" },
  { value: "dropcap", label: "Classic Drop-Cap", icon: FileText, description: "Traditional illuminated drop-cap" }
];

const BlogStudioModal = ({ isOpen, initialData, onClose, onSave }) => {
  // studio step: always directly "studio"
  const [step, setStep] = useState("studio");

  // viewMode: "split" | "editor" | "preview"
  const [viewMode, setViewMode] = useState("split");

  // preview device simulator: "desktop" | "tablet" | "mobile"
  const [previewDevice, setPreviewDevice] = useState("desktop");

  // Scroll synchronization toggle
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState(true);

  // Scroll container refs & state tracking
  const editorContainerRef = useRef(null);
  const previewContainerRef = useRef(null);
  const activeSectionIdRef = useRef(null);
  const isSyncingRef = useRef(null);
  const rafIdRef = useRef(null);

  // Blog meta and section state
  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    category: "Architecture",
    author: "BHDS Editorial",
    publishedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readingTime: "5 min read",
    headerLayout: "standard", // "standard" | "split" | "overlay" | "minimal"
    leadStyle: "border-left", // "border-left" | "card" | "quote" | "highlight" | "bold-lead"
    description: "",
    coverImage: BIHAR_PRESET_IMAGES[0]?.url || "",
    featured: false,
    status: "Published",
    templateId: "custom",
    sections: []
  });

  // Sync state when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setBlogData({
          ...initialData,
          headerLayout: initialData.headerLayout || "standard",
          leadStyle: initialData.leadStyle || "border-left",
          coverImage: initialData.coverImage || BIHAR_PRESET_IMAGES[0]?.url || "",
          sections: initialData.sections && initialData.sections.length > 0
            ? initialData.sections
            : []
        });
        setStep("studio");
      } else {
        // New Blog default clean single structure
        setBlogData({
          title: "",
          slug: "",
          category: "Architecture",
          author: "BHDS Editorial",
          publishedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          readingTime: "5 min read",
          headerLayout: "standard",
          leadStyle: "border-left",
          description: "",
          coverImage: BIHAR_PRESET_IMAGES[0]?.url || "",
          featured: false,
          status: "Published",
          templateId: "custom",
          sections: [
            {
              id: "sec-1",
              title: "Introduction & Overview",
              subtitle: "Brief introduction to your article",
              layoutType: "single",
              content: "",
              images: [
                {
                  id: "img-1",
                  url: BIHAR_PRESET_IMAGES[0]?.url || "",
                  caption: "Featured Bihar heritage site photo"
                }
              ]
            }
          ]
        });
        setStep("studio");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // ─── EXACT HEADING-ALIGNED SCROLL SYNC HANDLERS ───
  const syncScrollToActiveSection = () => {
    if (!isScrollSyncEnabled || !editorContainerRef.current || !previewContainerRef.current) return;
    if (isSyncingRef.current === "preview") return;

    const editor = editorContainerRef.current;
    const preview = previewContainerRef.current;
    const editorRect = editor.getBoundingClientRect();

    // 1. Check Article Details Meta Card
    const metaCard = editor.querySelector("#editor-meta-card");

    if (metaCard) {
      const metaRect = metaCard.getBoundingClientRect();

      // Rule: While Article Details card is being scrolled/visible in editor,
      // pin Live Preview at top: 0 (Header, Banner, Title, Lead Summary)
      if (metaRect.bottom > editorRect.top + 60) {
        if (activeSectionIdRef.current !== "meta") {
          activeSectionIdRef.current = "meta";
          preview.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
    }

    // 2. Only when Article Details card has scrolled off top, track Section cards:
    const sectionElems = editor.querySelectorAll("[data-editor-section-id]");
    let closestSectionId = null;
    const viewportFocusPoint = editorRect.top + 160;

    sectionElems.forEach((elem) => {
      const rect = elem.getBoundingClientRect();
      if (rect.top <= viewportFocusPoint && rect.bottom >= editorRect.top) {
        closestSectionId = elem.getAttribute("data-editor-section-id");
      }
    });

    // 3. Align section HEADING prominently near top of Live Preview viewport (-75px offset)
    if (closestSectionId && closestSectionId !== activeSectionIdRef.current) {
      activeSectionIdRef.current = closestSectionId;
      const targetPreviewSec = preview.querySelector(`#preview-sec-${closestSectionId}`);
      if (targetPreviewSec) {
        const previewRect = preview.getBoundingClientRect();
        const secRect = targetPreviewSec.getBoundingClientRect();
        const exactTargetScrollTop = preview.scrollTop + (secRect.top - previewRect.top) - 75;
        preview.scrollTo({ top: Math.max(0, exactTargetScrollTop), behavior: "smooth" });
      }
    }
  };

  const handleEditorScroll = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(syncScrollToActiveSection);
  };

  const handlePreviewScroll = () => {
    isSyncingRef.current = "preview";
    setTimeout(() => {
      isSyncingRef.current = null;
    }, 150);
  };

  // Handle template selection
  const handleSelectTemplate = (template) => {
    const clonedSections = (template.sections || []).map((sec, idx) => ({
      ...sec,
      id: `sec-${idx + 1}`,
      images: (sec.images || []).map((img, imgIdx) => ({
        ...img,
        id: `img-${imgIdx + 1}`
      }))
    }));

    setBlogData((prev) => ({
      ...prev,
      templateId: template.id,
      title: template.title || "",
      description: template.description || "",
      coverImage: template.coverImage || "",
      slug: generateSlug(template.title || ""),
      sections: clonedSections
    }));

    setStep("studio");
  };

  // Helper to generate slug from title
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setBlogData((prev) => ({
      ...prev,
      title: val,
      slug: generateSlug(val)
    }));
  };

  // Cover image local file upload handler
  const handleCoverFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setBlogData((prev) => ({ ...prev, coverImage: uploadEvent.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Section Handlers
  const handleChangeSection = (sectionId, updatedSection) => {
    setBlogData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => (sec.id === sectionId ? updatedSection : sec))
    }));
  };

  const handleAddSection = (layoutType = "image-left", headingLevel = "h2") => {
    const newIdx = blogData.sections.length + 1;
    const newSec = {
      id: generateUniqueId("sec"),
      title: "",
      subtitle: "",
      headingLevel: headingLevel,
      layoutType: layoutType,
      content: "",
      images: layoutType !== "text-only" ? [
        {
          id: generateUniqueId("img"),
          url: "",
          caption: ""
        }
      ] : []
    };

    setBlogData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec]
    }));
  };

  const handleMoveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...blogData.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    setBlogData((prev) => ({ ...prev, sections: newSections }));
  };

  const handleMoveSectionDown = (index) => {
    if (index === blogData.sections.length - 1) return;
    const newSections = [...blogData.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    setBlogData((prev) => ({ ...prev, sections: newSections }));
  };

  const handleDuplicateSection = (index) => {
    const target = blogData.sections[index];
    const duplicated = {
      ...target,
      id: generateUniqueId("sec"),
      title: `${target.title} (Copy)`,
      images: (target.images || []).map((img) => ({
        ...img,
        id: generateUniqueId("img")
      }))
    };
    const newSections = [...blogData.sections];
    newSections.splice(index + 1, 0, duplicated);
    setBlogData((prev) => ({ ...prev, sections: newSections }));
  };

  const handleDeleteSection = (sectionId) => {
    setBlogData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId)
    }));
  };

  // Save handler
  const handleSaveArticle = () => {
    if (!blogData.title.trim()) {
      alert("Please enter an article title.");
      return;
    }
    onSave(blogData);
  };

  // ─── SPACIOUS, UN-CROWDED & ELEGANT ARTICLE DETAILS CARD ───
  const renderEditorForm = () => (
    <div className="space-y-6">
      {/* ARTICLE DETAILS CARD */}
      <div id="editor-meta-card" className="bg-white rounded-2xl border border-[#E7DED3] p-5 sm:p-6 shadow-2xs space-y-6 text-left">

        {/* Card Title Bar */}
        <div className="border-b border-[#E7DED3] pb-3">
          <h3 className="text-base font-serif font-bold text-[#2F241D]">Article Details</h3>
          <p className="text-[11px] text-[#6F665E] font-sans mt-0.5">Primary metadata & cover media</p>
        </div>

        {/* 1. ARTICLE TITLE */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2F241D]">
              Article Title <span className="text-[#B85C38]">*</span>
            </label>
            <span className="text-[10px] font-sans text-[#6F665E]">
              {blogData.title.length} chars
            </span>
          </div>

          <input
            type="text"
            value={blogData.title}
            onFocus={(e) => e.target.select()}
            onChange={handleTitleChange}
            placeholder="e.g. Exploring the Ancient Ruins of Nalanda Monastery..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#E7DED3] bg-white text-sm font-serif font-bold text-[#2F241D] focus:outline-none focus:border-[#B85C38] focus:ring-2 focus:ring-[#B85C38]/15 transition placeholder:text-stone-400 font-normal"
          />

          {/* URL Slug Input */}
          <div className="flex items-center gap-2 pt-1 text-xs text-[#6F665E]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F665E] shrink-0">Slug:</span>
            <input
              type="text"
              value={blogData.slug}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setBlogData((p) => ({ ...p, slug: e.target.value }))}
              placeholder="article-slug"
              className="flex-1 px-2.5 py-1 rounded-lg border border-[#E7DED3] bg-[#FAF8F3] text-[11px] font-mono text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
            />
          </div>
        </div>

        {/* 2. ARTICLE HERO DISPLAY LAYOUT SELECTOR (MATCHING SECTION LAYOUT CARD DESIGN) */}
        <div className="space-y-3 bg-[#FAF8F3]/80 p-4 sm:p-5 rounded-2xl border border-[#E7DED3]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2F241D]">
                Article Hero Display Layout
              </label>
              <p className="text-[11px] text-[#6F665E] mt-0.5">
                Choose the header and cover presentation
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#B85C38] bg-white px-2.5 py-1 rounded-lg border border-[#E7DED3] shadow-2xs self-start sm:self-auto">
              <span>{HEADER_LAYOUT_OPTIONS.find(o => o.value === (blogData.headerLayout || "standard"))?.label}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {HEADER_LAYOUT_OPTIONS.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = (blogData.headerLayout || "standard") === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setBlogData((p) => ({ ...p, headerLayout: opt.value }))}
                  className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group ${isSelected
                    ? "bg-white border-[#B85C38] ring-2 ring-[#B85C38]/20 shadow-xs"
                    : "bg-white/80 border-[#E7DED3] hover:border-[#B85C38]/40 hover:bg-white text-[#6F665E]"
                    }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg transition-colors ${isSelected
                      ? "bg-[#B85C38] text-white"
                      : "bg-[#FAF8F3] text-[#6F665E] group-hover:text-[#B85C38] group-hover:bg-[#B85C38]/10"
                      }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#B85C38] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${isSelected ? "text-[#2F241D]" : "text-[#5C5046]"
                      }`}>
                      {opt.label}
                    </h4>
                    <p className="text-[10px] text-[#6F665E] leading-snug mt-1 line-clamp-2">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. METADATA & PUBLISHING (2 COLUMNS FOR BREATHING ROOM) */}
        <div className="bg-[#FAF8F3]/80 p-4 rounded-xl border border-[#E7DED3] space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Category */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F665E]">
                Category
              </label>
              <select
                value={blogData.category}
                onChange={(e) => setBlogData((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E7DED3] bg-white text-xs font-semibold text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F665E]">
                Publish Status
              </label>
              <select
                value={blogData.status}
                onChange={(e) => setBlogData((p) => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E7DED3] bg-white text-xs font-bold text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 border-t border-[#E7DED3]/60">
            {/* Author */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F665E]">
                Author Name
              </label>
              <input
                type="text"
                value={blogData.author}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setBlogData((p) => ({ ...p, author: e.target.value }))}
                placeholder="Author name"
                className="w-full px-3 py-2 rounded-lg border border-[#E7DED3] bg-white text-xs text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
              />
            </div>

            {/* Publish Date */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F665E]">
                Publish Date
              </label>
              <input
                type="text"
                value={blogData.publishedAt}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setBlogData((p) => ({ ...p, publishedAt: e.target.value }))}
                placeholder="e.g. Aug 6, 2026"
                className="w-full px-3 py-2 rounded-lg border border-[#E7DED3] bg-white text-xs text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
              />
            </div>
          </div>
        </div>

        {/* 4. COVER BANNER IMAGE (FULL WIDTH SPACIOUS CARD) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2F241D]">
              Cover Banner Image
            </label>

            <label className="px-3 py-1 rounded-lg bg-[#B85C38] text-white text-[11px] font-bold hover:bg-[#A0502F] transition cursor-pointer shadow-2xs">
              <span>Upload Local File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={blogData.coverImage}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setBlogData((p) => ({ ...p, coverImage: e.target.value }))}
              placeholder="Paste Image URL or upload local file..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DED3] bg-white text-xs font-mono text-[#2F241D] focus:outline-none focus:border-[#B85C38]"
            />
          </div>

          {blogData.coverImage && (
            <div className="relative rounded-xl overflow-hidden border border-[#E7DED3] h-36 sm:h-40 bg-stone-100 group shadow-2xs">
              <img loading="lazy" decoding="async"
                src={blogData.coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = BIHAR_PRESET_IMAGES[0]?.url || "";
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <label className="px-3.5 py-1.5 bg-white text-[#2F241D] rounded-lg text-xs font-bold shadow-md cursor-pointer hover:bg-stone-100">
                  <span>Replace Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 5. OPENING LEAD / SUMMARY (WITH 5 CUSTOM DISPLAY STYLES) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2F241D]">
              Opening Lead / Summary
            </label>
          </div>
          <textarea
            rows={3}
            value={blogData.description}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setBlogData((p) => ({ ...p, description: e.target.value }))}
            placeholder="Write a clear 1-2 sentence lead summary to introduce the theme of this article..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DED3] bg-white text-xs text-[#2F241D] leading-relaxed focus:outline-none focus:border-[#B85C38] focus:ring-2 focus:ring-[#B85C38]/15"
          />

          {/* Lead Summary Display Style (6 Options in 3 columns per row) */}
          <div className="space-y-2 pt-1 border-t border-[#E7DED3]/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F241D]">
                Lead Display Style (6 Options)
              </span>
              <span className="text-[10px] font-mono font-bold text-[#B85C38] bg-[#B85C38]/10 px-2 py-0.5 rounded-md border border-[#B85C38]/20">
                Active: {LEAD_STYLE_OPTIONS.find(o => o.value === (blogData.leadStyle || "border-left"))?.label || "Accent Border"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {LEAD_STYLE_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = (blogData.leadStyle || "border-left") === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBlogData((p) => ({ ...p, leadStyle: opt.value }))}
                    className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group ${isSelected
                      ? "bg-white border-[#B85C38] ring-2 ring-[#B85C38]/20 shadow-xs"
                      : "bg-white/80 border-[#E7DED3] hover:border-[#B85C38]/40 hover:bg-white text-[#6F665E]"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg transition-colors ${isSelected
                        ? "bg-[#B85C38] text-white"
                        : "bg-[#FAF8F3] text-[#6F665E] group-hover:text-[#B85C38] group-hover:bg-[#B85C38]/10"
                        }`}>
                        {IconComp && <IconComp className="w-4 h-4" />}
                      </div>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#B85C38] text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold leading-tight ${isSelected ? "text-[#2F241D]" : "text-[#5C5046]"
                        }`}>
                        {opt.label}
                      </h4>
                      <p className="text-[10px] text-[#6F665E] leading-snug mt-1 line-clamp-2">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* SECTIONS BUILDER HEADER */}
      <div className="flex items-center justify-between pt-2 text-left">
        <h3 className="text-base font-serif font-bold text-[#2F241D]">
          Article Sections ({blogData.sections.length})
        </h3>
      </div>



      {/* BLANK CANVAS EMPTY STATE */}
      {blogData.sections.length === 0 && (
        <div className="py-12 border-2 border-dashed border-[#E7DED3] rounded-2xl bg-white text-center space-y-3">
          <h4 className="text-base font-serif font-bold text-[#2F241D]">
            Blank Newspaper Canvas
          </h4>
          <p className="text-xs text-[#6F665E] max-w-md mx-auto">
            Click any article block button above (+ Image Left, + Image Right, + Heading, + Full Banner) to add columns to your article.
          </p>
        </div>
      )}

      {/* SECTION EDITORS LIST */}
      <div className="space-y-5">
        {blogData.sections.map((section, idx) => (
          <BlogSectionEditor
            key={section.id}
            section={section}
            index={idx}
            totalSections={blogData.sections.length}
            onChangeSection={handleChangeSection}
            onMoveUp={handleMoveSectionUp}
            onMoveDown={handleMoveSectionDown}
            onDuplicate={handleDuplicateSection}
            onDelete={handleDeleteSection}
          />
        ))}
      </div>

      {/* Bottom Add Section Button */}
      <div className="pt-2 pb-8 text-center">
        <button
          type="button"
          onClick={() => handleAddSection("image-left", "h2")}
          className="w-full py-3.5 border border-dashed border-[#E7DED3] hover:border-[#B85C38] rounded-2xl bg-white text-[#2F241D] hover:text-[#B85C38] text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4 text-[#B85C38]" />
          <span>Add New Article Section</span>
        </button>
      </div>
    </div>
  );

  // ─── LIVE PREVIEW PANE RENDERER ───
  const renderLivePreviewPane = () => (
    <div className="flex flex-col space-y-4">
      {/* Live Preview Pane Header Toolbar */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#E7DED3] shadow-xs flex items-center justify-between gap-3 shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-[#B85C38]" />
          <span className="text-xs font-serif font-bold text-[#2F241D]">
            Live UI Preview
          </span>
        </div>

        {/* Device Viewport Frame Switcher */}
        <div className="bg-[#FAF8F3] p-1 rounded-md border border-[#E7DED3] flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPreviewDevice("desktop")}
            title="Desktop View (Full)"
            className={`p-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${previewDevice === "desktop"
              ? "bg-white text-[#B85C38] shadow-2xs border border-[#E7DED3]"
              : "text-[#6F665E] hover:text-[#2F241D]"
              }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice("tablet")}
            title="Tablet View (768px)"
            className={`p-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${previewDevice === "tablet"
              ? "bg-white text-[#B85C38] shadow-2xs border border-[#E7DED3]"
              : "text-[#6F665E] hover:text-[#2F241D]"
              }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice("mobile")}
            title="Mobile View (390px)"
            className={`p-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${previewDevice === "mobile"
              ? "bg-white text-[#B85C38] shadow-2xs border border-[#E7DED3]"
              : "text-[#6F665E] hover:text-[#2F241D]"
              }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Mobile</span>
          </button>
        </div>
      </div>

      {/* Rendered Live Article Component */}
      <div className="py-1">
        <BlogArticlePreview blogData={blogData} device={previewDevice} />
      </div>
    </div>
  );

  return (
    <div className="blog-studio-root w-full bg-[#FAF8F3] min-h-[calc(100vh-120px)] flex flex-col rounded-2xl border border-[#E7DED3] overflow-hidden my-1 text-left font-sans shadow-xl">

      {/* ─── STUDIO TOOLBAR ─── */}
      <div className="bg-white px-4 sm:px-6 py-3 border-b border-[#E7DED3] flex flex-wrap items-center justify-between gap-4 shrink-0">

        {/* Left: Back to Blogs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E7DED3] bg-white text-[#2F241D] hover:bg-[#FAF8F3] text-xs font-medium transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#B85C38]" />
            <span>Back to Blogs</span>
          </button>

          <div className="h-4 w-px bg-[#E7DED3] hidden sm:block" />

          <h2 className="text-sm font-serif font-bold text-[#2F241D]">
            Blog Article Studio
          </h2>
        </div>

        {/* Center: Dual / Split View Mode Switcher + Scroll Sync Toggle */}
        {step !== "select-template" && (
          <div className="flex items-center gap-2">
            <div className="bg-[#FAF8F3] p-1 rounded-xl border border-[#E7DED3] flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${viewMode === "split"
                  ? "bg-white text-[#B85C38] shadow-2xs border border-[#E7DED3]"
                  : "text-[#6F665E] hover:text-[#2F241D]"
                  }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("editor")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${viewMode === "editor"
                  ? "bg-white text-[#B85C38] shadow-2xs border border-[#E7DED3]"
                  : "text-[#6F665E] hover:text-[#2F241D]"
                  }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor Only</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${viewMode === "preview"
                  ? "bg-white text-[#B85C38] shadow-2xs border border-[#E7DED3]"
                  : "text-[#6F665E] hover:text-[#2F241D]"
                  }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Only</span>
              </button>
            </div>

            {/* Scroll Sync Lock Button */}
            {viewMode === "split" && (
              <button
                type="button"
                onClick={() => setIsScrollSyncEnabled(!isScrollSyncEnabled)}
                title={isScrollSyncEnabled ? "Scroll Sync Enabled (Click to Lock)" : "Scroll Sync Disabled (Click to Enable)"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${isScrollSyncEnabled
                  ? "bg-[#B85C38]/10 border-[#B85C38] text-[#B85C38]"
                  : "bg-white border-[#E7DED3] text-[#6F665E] hover:text-[#2F241D]"
                  }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScrollSyncEnabled ? "animate-spin-slow text-[#B85C38]" : ""}`} />
                <span className="hidden sm:inline">Scroll Sync</span>
              </button>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          {step !== "select-template" && (
            <button
              type="button"
              onClick={handleSaveArticle}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#B85C38] hover:bg-[#A0502F] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Publish</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 p-4 sm:p-6 overflow-hidden">

        {/* STEP 1: TEMPLATE SELECTOR */}
        {step === "select-template" && (
          <div className="h-[calc(100vh-170px)] overflow-y-auto">
            <BlogTemplateSelector
              onSelectTemplate={handleSelectTemplate}
              onSelectBlank={handleSelectTemplate}
            />
          </div>
        )}

        {/* STEP 2: STUDIO MAIN (SPLIT / EDITOR / PREVIEW) */}
        {step !== "select-template" && (
          <>
            {/* MODE 1: SPLIT VIEW (DUAL PANE REAL-TIME & SYNCHRONIZED SCROLL) */}
            {viewMode === "split" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] overflow-hidden">
                {/* Left Column: Form Editor (Scrollable + Synced) */}
                <div
                  ref={editorContainerRef}
                  onScroll={handleEditorScroll}
                  className="lg:col-span-6 xl:col-span-5 h-full overflow-y-auto pr-1 sm:pr-2"
                >
                  {renderEditorForm()}
                </div>

                {/* Right Column: Live UI Preview Pane (Scrollable + Synced) */}
                <div
                  ref={previewContainerRef}
                  onScroll={handlePreviewScroll}
                  className="lg:col-span-6 xl:col-span-7 h-full overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#E7DED3] pt-6 lg:pt-0 pl-0 lg:pl-6"
                >
                  {renderLivePreviewPane()}
                </div>
              </div>
            )}

            {/* MODE 2: EDITOR ONLY */}
            {viewMode === "editor" && (
              <div className="w-full max-w-4xl mx-auto h-[calc(100vh-180px)] overflow-y-auto pr-1">
                {renderEditorForm()}
              </div>
            )}

            {/* MODE 3: PREVIEW ONLY */}
            {viewMode === "preview" && (
              <div className="w-full h-[calc(100vh-180px)] overflow-y-auto">
                {renderLivePreviewPane()}
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
};

export default BlogStudioModal;
