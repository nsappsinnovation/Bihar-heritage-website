import React, { useState, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  BookOpen,
  CheckCircle2,
  Clock,
  Globe,
  Filter,
  Landmark,
  Shield,
  Award,
  MapPin,
  Compass,
  Calendar,
  CalendarDays,
  Presentation,
  GraduationCap,
  Users,
  ShieldCheck,
  Layers,
  Palette,
  Megaphone,
  ExternalLink,
  Image as ImageIcon,
  Video as VideoIcon
} from "lucide-react";
import { MODULE_REGISTRY } from "./moduleConfig";
import AdminLayout from "./AdminLayout";
import AdminTable from "../../components/admin/AdminTable";
import AdminDrawer from "../../components/admin/AdminDrawer";
import FormField from "../../components/admin/FormField";
import ImageUploader from "../../components/admin/ImageUploader";
import RichTextEditor from "../../components/admin/RichTextEditor";
import AdminSearchBar from "../../components/admin/AdminSearchBar";
import { getData, STORAGE_KEYS, addItem, updateItem, deleteItem } from "../../utils/cmsStorage";
import BlogStudioModal from "../../components/admin/blogStudio/BlogStudioModal";
import ProtectedSiteModal from "../../components/admin/ProtectedSiteModal";
import ExcavationModal from "../../components/admin/ExcavationModal";
import WorkshopModal from "../../components/admin/WorkshopModal";
import PublicationModal from "../../components/admin/PublicationModal";
import EventModal from "../../components/admin/EventModal";
import NewsModal from "../../components/admin/NewsModal";
import PhotoModal from "../../components/admin/PhotoModal";
import VideoModal from "../../components/admin/VideoModal";
import OrganizationModal from "../../components/admin/OrganizationModal";
import ShowcaseModal from "../../components/admin/ShowcaseModal";
import TangibleHeritageModal from "../../components/admin/TangibleHeritageModal";
import AdminCategoryDropdown from "../../components/admin/AdminCategoryDropdown";

const AdminModulePage = () => {
  const { moduleKey } = useParams();
  const rawConfig = MODULE_REGISTRY[moduleKey];

  if (!rawConfig) {
    return <Navigate to="/admin" replace />;
  }

  const isBlogModule = moduleKey === "blogs";
  const isGoverningBodyModule = moduleKey === "governingbody" || moduleKey === "governing-body";
  const isExecutiveModule = moduleKey === "executive" || moduleKey === "executive-committee";
  const isKeyFunctionariesModule = moduleKey === "keyfunctionaries" || moduleKey === "key-functionaries";
  const isArcheologicalTeamModule = moduleKey === "archeologicalteam" || moduleKey === "archeological-team";
  const isOrganizationModule =
    moduleKey === "organization" ||
    isGoverningBodyModule ||
    isExecutiveModule ||
    isKeyFunctionariesModule ||
    isArcheologicalTeamModule;

  const isArchivesModule = moduleKey === "archives" || moduleKey === "heritage-archives";
  const isPopularSitesModule = moduleKey === "popular-sites" || moduleKey === "popularsites";
  const isHeritageVideosModule = moduleKey === "showcase-videos" || moduleKey === "heritage-videos" || moduleKey === "living-videos";
  const isShowcaseModule =
    moduleKey === "showcase" ||
    moduleKey === "heritage-showcase" ||
    moduleKey === "home-showcase" ||
    isArchivesModule ||
    isPopularSitesModule ||
    isHeritageVideosModule;

  // Active sub-wing tab when on Organization page
  const [orgTab, setOrgTab] = useState(() => {
    if (isExecutiveModule) return "executive";
    if (isKeyFunctionariesModule) return "keyfunctionaries";
    if (isArcheologicalTeamModule) return "archeologicalteam";
    return "governingbody";
  });

  // Active sub-showcase tab when on Showcase page
  const [showcaseTab, setShowcaseTab] = useState(() => {
    if (isPopularSitesModule) return "popular-sites";
    if (isHeritageVideosModule) return "showcase-videos";
    return "archives";
  });

  useEffect(() => {
    if (isExecutiveModule) setOrgTab("executive");
    else if (isKeyFunctionariesModule) setOrgTab("keyfunctionaries");
    else if (isArcheologicalTeamModule) setOrgTab("archeologicalteam");
    else if (isGoverningBodyModule) setOrgTab("governingbody");
  }, [moduleKey]);

  useEffect(() => {
    if (isPopularSitesModule) setShowcaseTab("popular-sites");
    else if (isHeritageVideosModule) setShowcaseTab("showcase-videos");
    else if (isArchivesModule) setShowcaseTab("archives");
  }, [moduleKey]);

  // Dynamically resolve the active config
  const config = isOrganizationModule
    ? MODULE_REGISTRY[orgTab] || MODULE_REGISTRY["governingbody"]
    : isShowcaseModule
    ? MODULE_REGISTRY[showcaseTab] || MODULE_REGISTRY["archives"]
    : rawConfig;

  const isTangibleHeritageModule = moduleKey === "tangible-heritage" || moduleKey === "tangibleheritage" || moduleKey === "living-heritage";
  const isProtectedSitesModule = moduleKey === "protected-sites";
  const isExcavationModule = moduleKey === "excavation" || moduleKey === "excavations";
  const isWorkshopsModule = moduleKey === "workshops" || moduleKey === "activities";
  const isPublicationModule = moduleKey === "publications" || moduleKey === "publication";
  const isEventsModule = moduleKey === "events" || moduleKey === "event";
  const isNewsModule = moduleKey === "news";
  const isPhotosModule = moduleKey === "photos" || moduleKey === "photo";
  const isVideosModule = moduleKey === "videos" || moduleKey === "video";

  // State hooks
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBlogStudioOpen, setIsBlogStudioOpen] = useState(false);
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const [isShowcaseModalOpen, setIsShowcaseModalOpen] = useState(false);
  const [isTangibleModalOpen, setIsTangibleModalOpen] = useState(false);
  const [isProtectedSiteModalOpen, setIsProtectedSiteModalOpen] = useState(false);
  const [isExcavationModalOpen, setIsExcavationModalOpen] = useState(false);
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [isPublicationModalOpen, setIsPublicationModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formState, setFormState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = isTangibleHeritageModule || isShowcaseModule || isOrganizationModule || isProtectedSitesModule || isExcavationModule || isWorkshopsModule || isPublicationModule || isEventsModule || isNewsModule || isPhotosModule || isVideosModule ? 10 : isBlogModule ? 6 : 8;

  useEffect(() => {
    const onStoreChange = () => setData(getData(config.storageKey, config.defaultData));

    window.addEventListener("bh_cms_update", onStoreChange);
    return () => {
      window.removeEventListener("bh_cms_update", onStoreChange);
    };
  }, [config.storageKey, config.defaultData]);

  // Initialize and load data on moduleKey / orgTab / showcaseTab change
  useEffect(() => {
    const loadedData = getData(config.storageKey, config.defaultData);
    setData(loadedData);
    setSearchQuery("");
    setSelectedCategory("All");
    setCurrentPage(1);
    setIsDrawerOpen(false);
    setIsOrganizationModalOpen(false);
    setIsShowcaseModalOpen(false);
    setIsTangibleModalOpen(false);
    setIsProtectedSiteModalOpen(false);
    setIsExcavationModalOpen(false);
    setIsWorkshopModalOpen(false);
    setIsPublicationModalOpen(false);
    setIsEventModalOpen(false);
    setIsNewsModalOpen(false);
    setIsPhotoModalOpen(false);
    setIsVideoModalOpen(false);
    setIsBlogStudioOpen(false);
    setEditingItem(null);
  }, [moduleKey, orgTab, showcaseTab, config.storageKey]);

  // Sync formState if editing an item
  useEffect(() => {
    if (editingItem) {
      setFormState({ ...editingItem });
    } else {
      const defaultState = {};
      config.fields.forEach((f) => {
        if (f.name === "managed_by") {
          defaultState[f.name] = "state";
        } else if (f.name === "status") {
          defaultState[f.name] = "Published";
        } else {
          defaultState[f.name] = f.type === "checkbox" ? false : "";
        }
      });
      setFormState(defaultState);
    }
  }, [editingItem, config]);

  // Search & Category filter
  const filteredData = data.filter((row) => {
    if (isTangibleHeritageModule && selectedCategory !== "All") {
      if (row.category !== selectedCategory) return false;
    }
    if (isShowcaseModule && showcaseTab === "archives" && selectedCategory !== "All") {
      if (row.category !== selectedCategory) return false;
    }
    if (isShowcaseModule && showcaseTab === "showcase-videos" && selectedCategory !== "All") {
      if (row.category !== selectedCategory) return false;
    }
    if (isOrganizationModule && (orgTab === "governingbody" || orgTab === "executive") && selectedCategory !== "All") {
      if (row.role !== selectedCategory) return false;
    }
    if (isBlogModule && selectedCategory !== "All" && row.category !== selectedCategory) {
      return false;
    }
    if (isProtectedSitesModule && selectedCategory !== "All") {
      const mb = (row.managed_by || "state").toLowerCase();
      if (selectedCategory === "State Protected" && mb !== "state") return false;
      if (selectedCategory === "ASI Centrally Protected" && mb !== "central") return false;
      if (selectedCategory === "UNESCO Sites" && mb !== "unesco") return false;
      if (selectedCategory === "Other / Cultural" && mb !== "other") return false;
    }
    if (isExcavationModule && selectedCategory !== "All") {
      const t = (row.type || "excavation").toLowerCase();
      if (selectedCategory === "Excavation Sites" && t !== "excavation") return false;
      if (selectedCategory === "Exploration Activities" && t !== "exploration") return false;
    }
    if (isWorkshopsModule && selectedCategory !== "All") {
      if (row.category !== selectedCategory) return false;
    }
    if (isPublicationModule && selectedCategory !== "All") {
      if (row.category !== selectedCategory) return false;
    }
    if (isEventsModule && selectedCategory !== "All") {
      if (row.category !== selectedCategory) return false;
    }
    if (isNewsModule && selectedCategory !== "All") {
      if (row.category !== selectedCategory) return false;
    }
    if (isPhotosModule && selectedCategory !== "All") {
      if (row.category !== selectedCategory) return false;
    }
    if (isVideosModule && selectedCategory !== "All") {
      if (row.category !== selectedCategory) return false;
    }
    if (!searchQuery) return true;
    return Object.values(row).some((val) => {
      if (typeof val === "string" || typeof val === "number") {
        return String(val).toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Form Field Change Handler
  const handleFieldChange = (name, value) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create or Update Save Handler
  const handleSave = () => {
    // Basic validation
    const missingFields = config.fields
      .filter((f) => f.required && !formState[f.name])
      .map((f) => f.label);

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(", ")}`);
      return;
    }

    const payload = {
      ...formState,
      managed_by: formState.managed_by || (isProtectedSitesModule ? "state" : undefined),
      category:
        formState.category ||
        (formState.managed_by === "unesco"
          ? "UNESCO Site"
          : formState.managed_by === "central"
            ? "ASI Protected"
            : formState.managed_by === "other"
              ? "Heritage Site"
              : isProtectedSitesModule
                ? "State Protected"
                : undefined),
      subtitle: formState.subtitle || formState.description || "",
      description: formState.description || formState.subtitle || "",
      district:
        formState.district ||
        formState.location?.split(",").slice(-2, -1)[0]?.trim() ||
        (isProtectedSitesModule ? "Patna" : undefined),
      status: formState.status || "Published",
    };

    let updatedData;
    if (editingItem) {
      // Edit mode
      updatedData = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
    } else {
      // Create mode
      const result = addItem(config.storageKey, payload, config.defaultData);
      updatedData = result.data;
    }

    setData(updatedData);
    setIsDrawerOpen(false);
    setEditingItem(null);
    alert("Record saved successfully.");
  };

  // Blog Studio Save Handler
  const handleBlogSave = (blogItem) => {
    let updatedData;
    if (editingItem) {
      updatedData = updateItem(config.storageKey, editingItem.id, blogItem, config.defaultData);
    } else {
      const result = addItem(config.storageKey, blogItem, config.defaultData);
      updatedData = result.data;
    }
    setData(updatedData);
    setIsBlogStudioOpen(false);
    setEditingItem(null);
    alert("Blog saved successfully.");
  };

  // Delete Item Handler
  const handleDelete = (item) => {
    const id = item?.id !== undefined ? item.id : item;
    const title = item?.title || item?.name || `Record #${id}`;
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      const updatedData = deleteItem(config.storageKey, id, config.defaultData);
      setData(updatedData);
      if ((currentPage - 1) * pageSize >= updatedData.length && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      alert("Record deleted successfully.");
    }
  };

  // Helper lists for categories
  const categoriesList = ["All", "Architecture", "Archaeology", "Culture", "Conservation", "Festivals", "Heritage Walks"];
  const blogCategories = categoriesList.map((cat) => ({
    label: cat === "All" ? "All Categories" : cat,
    value: cat,
    count: cat === "All" ? data.length : data.filter((d) => d.category === cat).length
  }));
  const governingBodyRoles = [
    { label: "All Roles", value: "All", count: data.length },
    { label: "Chairman", value: "Chairman", count: data.filter((d) => d.role === "Chairman").length },
    { label: "Member Secretary", value: "Member Secretary", count: data.filter((d) => d.role === "Member Secretary").length },
    { label: "Members", value: "Member", count: data.filter((d) => d.role === "Member").length },
  ];
  const executiveRoles = [
    { label: "All Roles", value: "All", count: data.length },
    { label: "Chairman", value: "Chairman", count: data.filter((d) => d.role === "Chairman").length },
    { label: "Member Secretary", value: "Member Secretary", count: data.filter((d) => d.role === "Member Secretary").length },
    { label: "Members", value: "Member", count: data.filter((d) => d.role === "Member").length },
  ];
  const orgCounts = {
    governingbody: getData(
      MODULE_REGISTRY["governingbody"]?.storageKey || STORAGE_KEYS?.GOVERNING_BODY || "bh_governing_body",
      MODULE_REGISTRY["governingbody"]?.defaultData || []
    ).length,
    executive: getData(
      MODULE_REGISTRY["executive"]?.storageKey || STORAGE_KEYS?.EXECUTIVE_COMMITTEE || "bh_executive_committee",
      MODULE_REGISTRY["executive"]?.defaultData || []
    ).length,
    keyfunctionaries: getData(
      MODULE_REGISTRY["keyfunctionaries"]?.storageKey || STORAGE_KEYS?.KEY_FUNCTIONARIES || "bh_key_functionaries",
      MODULE_REGISTRY["keyfunctionaries"]?.defaultData || []
    ).length,
    archeologicalteam: getData(
      MODULE_REGISTRY["archeologicalteam"]?.storageKey || STORAGE_KEYS?.ARCHAEOLOGICAL_TEAM || "bh_archeological_team",
      MODULE_REGISTRY["archeologicalteam"]?.defaultData || []
    ).length,
  };

  const orgTabs = [
    {
      key: "governingbody",
      label: "Governing Body",
      icon: ShieldCheck,
      count: orgCounts.governingbody,
      publicPath: "/governingbody",
    },
    {
      key: "executive",
      label: "Executive Committee",
      icon: Award,
      count: orgCounts.executive,
      publicPath: "/executive",
    },
    {
      key: "keyfunctionaries",
      label: "Key Functionaries",
      icon: Users,
      count: orgCounts.keyfunctionaries,
      publicPath: "/keyfunctionaries",
    },
    {
      key: "archeologicalteam",
      label: "Archaeological Team",
      icon: Compass,
      count: orgCounts.archeologicalteam,
      publicPath: "/archeologicalteam",
    },
  ];

  const showcaseCounts = {
    archives: getData(
      MODULE_REGISTRY["archives"]?.storageKey || STORAGE_KEYS.HERITAGE_ARCHIVES,
      MODULE_REGISTRY["archives"]?.defaultData || []
    ).length,
    "popular-sites": getData(
      MODULE_REGISTRY["popular-sites"]?.storageKey || STORAGE_KEYS.POPULAR_SITES,
      MODULE_REGISTRY["popular-sites"]?.defaultData || []
    ).length,
    "showcase-videos": getData(
      MODULE_REGISTRY["showcase-videos"]?.storageKey || STORAGE_KEYS.HERITAGE_VIDEOS,
      MODULE_REGISTRY["showcase-videos"]?.defaultData || []
    ).length,
  };

  const showcaseTabs = [
    {
      key: "archives",
      label: "Bihar Heritage Archives",
      subLabel: "Interactive Explorer",
      icon: Landmark,
      count: showcaseCounts.archives,
      publicPath: "/#ExploreHeritageSites",
    },
    {
      key: "popular-sites",
      label: "Popular Heritage Sites",
      subLabel: "3D Visual Journey",
      icon: Globe,
      count: showcaseCounts["popular-sites"],
      publicPath: "/#Gallery",
    },
    {
      key: "showcase-videos",
      label: "Living Heritage Videos",
      subLabel: "Reels & Documentaries",
      icon: VideoIcon,
      count: showcaseCounts["showcase-videos"],
      publicPath: "/#Gallery",
    },
  ];

  const tangibleHeritageCategories = [
    { label: "All Categories", value: "All", count: data.length },
    { label: "Art & Craft", value: "art-craft", count: data.filter((d) => d.category === "art-craft").length },
    { label: "Festivals & Rituals", value: "festivals-rituals", count: data.filter((d) => d.category === "festivals-rituals").length },
    { label: "Music", value: "music", count: data.filter((d) => d.category === "music").length },
    { label: "Dance & Theatre", value: "dance-theatre", count: data.filter((d) => d.category === "dance-theatre").length },
    { label: "Oral Traditions", value: "oral-traditions", count: data.filter((d) => d.category === "oral-traditions").length },
    { label: "Food & Customs", value: "food-customs", count: data.filter((d) => d.category === "food-customs").length },
  ];

  const archiveCategories = [
    { label: "All Categories", value: "All", count: data.length },
    { label: "Sacred", value: "Sacred", count: data.filter((d) => d.category === "Sacred").length },
    { label: "Ruins", value: "Ruins", count: data.filter((d) => d.category === "Ruins").length },
    { label: "Monuments", value: "Monuments", count: data.filter((d) => d.category === "Monuments").length },
    { label: "Ancient", value: "Ancient", count: data.filter((d) => d.category === "Ancient").length },
  ];

  const videoShowcaseCategories = [
    { label: "All Formats", value: "All", count: data.length },
    { label: "Documentary Reel", value: "Documentary Reel", count: data.filter((d) => d.category === "Documentary Reel").length },
    { label: "Short Vignette", value: "Short Vignette", count: data.filter((d) => d.category === "Short Vignette").length },
    { label: "Historical Study", value: "Historical Study", count: data.filter((d) => d.category === "Historical Study").length },
    { label: "Vlog Series", value: "Vlog Series", count: data.filter((d) => d.category === "Vlog Series").length },
    { label: "Archaeological Spotlight", value: "Archaeological Spotlight", count: data.filter((d) => d.category === "Archaeological Spotlight").length },
  ];
  const protectedSitesCategories = [
    { label: "All Authorities", value: "All", count: data.length },
    { label: "State Protected", value: "State Protected", count: data.filter((d) => (d.managed_by || "state").toLowerCase() === "state").length },
    { label: "ASI Centrally Protected", value: "ASI Centrally Protected", count: data.filter((d) => (d.managed_by || "").toLowerCase() === "central").length },
    { label: "UNESCO Sites", value: "UNESCO Sites", count: data.filter((d) => (d.managed_by || "").toLowerCase() === "unesco").length },
    { label: "Other / Cultural", value: "Other / Cultural", count: data.filter((d) => (d.managed_by || "").toLowerCase() === "other").length },
  ];
  const excavationCategories = [
    { label: "All Projects", value: "All", count: data.length },
    { label: "Excavation Sites", value: "Excavation Sites", count: data.filter((d) => (d.type || "excavation").toLowerCase() === "excavation").length },
    { label: "Exploration Activities", value: "Exploration Activities", count: data.filter((d) => (d.type || "").toLowerCase() === "exploration").length },
  ];
  const allWorkshopCategoryNames = [
    "Workshop",
    "Seminar",
    "National Seminar",
    "Celebration",
    "Inauguration",
    "Exhibition",
    "Cultural Program",
    "Lecture",
    "Conservation",
    "Heritage Walk",
    "Expert Inspection",
    "Documentation",
    "Awareness Session",
    "Training"
  ];
  const uniqueWorkshopCats = Array.from(
    new Set([
      ...allWorkshopCategoryNames,
      ...data.map((d) => d.category).filter(Boolean)
    ])
  );
  const workshopsCategories = [
    { label: "All Categories", value: "All", count: data.length },
    ...uniqueWorkshopCats.map((cat) => ({
      label: cat,
      value: cat,
      count: data.filter((d) => d.category === cat).length
    }))
  ];

  const publicationCategories = [
    { label: "All Categories", value: "All", count: data.length },
    { label: "Archaeological Atlas", value: "Archaeological Atlas", count: data.filter((d) => d.category === "Archaeological Atlas").length },
    { label: "Folk Literature", value: "Folk Literature", count: data.filter((d) => d.category === "Folk Literature").length },
    { label: "Linguistic Heritage", value: "Linguistic Heritage", count: data.filter((d) => d.category === "Linguistic Heritage").length },
    { label: "Excavation Report", value: "Excavation Report", count: data.filter((d) => d.category === "Excavation Report").length },
    { label: "Academic Monograph", value: "Academic Monograph", count: data.filter((d) => d.category === "Academic Monograph").length },
    { label: "Research Journal", value: "Research Journal", count: data.filter((d) => d.category === "Research Journal").length },
    { label: "Heritage Booklet", value: "Heritage Booklet", count: data.filter((d) => d.category === "Heritage Booklet").length },
  ];

  const standardEventCats = [
    "Cultural Festival",
    "Art Workshop",
    "Heritage Walk",
    "Seminar / Symposium",
    "Archaeology Camp",
    "Exhibition"
  ];
  const uniqueEventCats = Array.from(
    new Set([
      ...standardEventCats.filter((cat) => data.some((d) => d.category === cat)),
      ...data.map((d) => d.category).filter(Boolean)
    ])
  );
  const eventsCategories = [
    { label: "All Categories", value: "All", count: data.length },
    ...uniqueEventCats.map((cat) => ({
      label: cat,
      value: cat,
      count: data.filter((d) => d.category === cat).length
    }))
  ];

  const standardNewsCats = [
    "Exhibition",
    "Cultural Festival",
    "Heritage Walk",
    "Academic Symposium",
    "Official Bulletin",
    "Discovery"
  ];
  const uniqueNewsCats = Array.from(
    new Set([
      ...standardNewsCats.filter((cat) => data.some((d) => d.category === cat)),
      ...data.map((d) => d.category).filter(Boolean)
    ])
  );
  const newsCategories = [
    { label: "All Categories", value: "All", count: data.length },
    ...uniqueNewsCats.map((cat) => ({
      label: cat,
      value: cat,
      count: data.filter((d) => d.category === cat).length
    }))
  ];

  const standardPhotoCats = [
    "UNESCO Site",
    "Ancient Ruins",
    "Archaeological Site",
    "Religious",
    "Monuments"
  ];
  const uniquePhotoCats = Array.from(
    new Set([
      ...standardPhotoCats.filter((cat) => data.some((d) => d.category === cat)),
      ...data.map((d) => d.category).filter(Boolean)
    ])
  );
  const photosCategories = [
    { label: "All Categories", value: "All", count: data.length },
    ...uniquePhotoCats.map((cat) => ({
      label: cat,
      value: cat,
      count: data.filter((d) => d.category === cat).length
    }))
  ];

  const standardVideoCats = [
    "History & Empire",
    "Academic Tradition",
    "Special Events",
    "Museum & Culture",
    "Archaeological Excavations",
    "Documentary"
  ];
  const uniqueVideoCats = Array.from(
    new Set([
      ...standardVideoCats.filter((cat) => data.some((d) => d.category === cat)),
      ...data.map((d) => d.category).filter(Boolean)
    ])
  );
  const videosCategories = [
    { label: "All Categories", value: "All", count: data.length },
    ...uniqueVideoCats.map((cat) => ({
      label: cat,
      value: cat,
      count: data.filter((d) => d.category === cat).length
    }))
  ];

  return (
    <AdminLayout title={config.name}>
      {isBlogModule && isBlogStudioOpen ? (
        /* Render Blog Studio view replacing the table list view */
        <div className="blog-studio-root w-full">
          <BlogStudioModal
            isOpen={isBlogStudioOpen}
            initialData={editingItem}
            onClose={() => {
              setIsBlogStudioOpen(false);
              setEditingItem(null);
            }}
            onSave={handleBlogSave}
          />
        </div>
      ) : (
        /* Normal Table List View */
        <>
          {/* Description / Header Panel */}
          {isBlogModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left space-y-4">
              {/* Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      Blog & Article Studio Management
                    </h1>
                  </div>
                  <p className="text-xs text-[#6F665E] leading-relaxed">
                    Manage research stories, heritage articles, and editorial publications for Bihar Heritage Journal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsBlogStudioOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Article</span>
                </button>
              </div>

              {/* Stat Counters Row */}
              <div className="pt-3.5 border-t border-[#E7DED3]/70">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  <div className="flex items-center justify-between bg-[#FAF8F3] px-3.5 py-2.5 rounded-md border border-[#E7DED3]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#6F665E]">
                      <div className="p-1.5 rounded-md bg-[#B85C38]/10 text-[#B85C38] shrink-0">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <span>Total Articles</span>
                    </div>
                    <span className="text-base font-bold font-mono text-[#2F241D]">{data.length}</span>
                  </div>

                  <div className="flex items-center justify-between bg-emerald-50/60 px-3.5 py-2.5 rounded-md border border-emerald-200/70">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                      <div className="p-1 rounded-md bg-emerald-100/80 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Published</span>
                    </div>
                    <span className="text-base font-bold font-mono text-emerald-900">{data.filter(d => (d.status || "Published") === "Published").length}</span>
                  </div>

                  <div className="flex items-center justify-between bg-amber-50/60 px-3.5 py-2.5 rounded-md border border-amber-200/70">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                      <div className="p-1 rounded-md bg-amber-100/80 text-amber-700">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span>Drafts</span>
                    </div>
                    <span className="text-base font-bold font-mono text-amber-900">{data.filter(d => d.status === "Draft").length}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : isShowcaseModule ? (
            <div className="space-y-3">
              {/* Home Showcase Top Navigation Tab Bar */}
              <div className="bg-white rounded-lg border border-[#E7DED3] p-1.5 flex flex-wrap items-center gap-1.5 shadow-xs">
                {showcaseTabs.map((tab) => {
                  const isActive = showcaseTab === tab.key;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setShowcaseTab(tab.key);
                        setSelectedCategory("All");
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-[#B85C38] text-white shadow-xs"
                          : "text-[#6F665E] hover:bg-[#FAF8F3] hover:text-[#2F241D]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#B85C38]"}`} />
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#FAF8F3] text-[#6F665E] border border-[#E7DED3]"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Showcase Tab Header & Controls */}
              <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                        {showcaseTab === "archives"
                          ? "Bihar Heritage Archives Management"
                          : showcaseTab === "showcase-videos"
                          ? "Living Heritage Video Series Management"
                          : "Popular Heritage Sites Management"}
                      </h1>
                    </div>
                    <p className="text-xs text-[#6F665E] leading-relaxed">
                      {showcaseTab === "archives"
                        ? "Manage interactive archive explorer sites, historical era classifications, and significance data displayed on the Home Page."
                        : showcaseTab === "showcase-videos"
                        ? "Manage high-definition documentary reels, living heritage video stories, and cinematic vlogs featured on the Home Page."
                        : "Manage 3D visual journey rotating flip-cards, historical backstories, and location landmarks featured on the Home Page."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setIsShowcaseModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showcaseTab === "archives" ? "Add Archive Site" : showcaseTab === "showcase-videos" ? "Add Video Reel" : "Add Popular Site"}</span>
                    </button>
                  </div>
                </div>

                {/* Stat Counters Row */}
                <div className="pt-3.5 border-t border-[#E7DED3]/70">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                    <div className="flex items-center justify-between bg-[#FAF8F3] px-3.5 py-2.5 rounded-md border border-[#E7DED3]">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6F665E]">
                        <div className="p-1.5 rounded-md bg-[#B85C38]/10 text-[#B85C38] shrink-0">
                          {showcaseTab === "archives" ? (
                            <Landmark className="w-3.5 h-3.5" />
                          ) : showcaseTab === "showcase-videos" ? (
                            <VideoIcon className="w-3.5 h-3.5" />
                          ) : (
                            <Globe className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span>Total {showcaseTab === "archives" ? "Archives" : showcaseTab === "showcase-videos" ? "Video Reels" : "Popular Sites"}</span>
                      </div>
                      <span className="text-base font-bold font-mono text-[#2F241D]">{data.length}</span>
                    </div>

                    <div className="flex items-center justify-between bg-emerald-50/60 px-3.5 py-2.5 rounded-md border border-emerald-200/70">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                        <div className="p-1 rounded-md bg-emerald-100/80 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span>Active in Showcase</span>
                      </div>
                      <span className="text-base font-bold font-mono text-emerald-900">
                        {data.filter((d) => (d.status || "Active") !== "Inactive" && (d.status || "Active") !== "Draft").length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-neutral-100/60 px-3.5 py-2.5 rounded-md border border-neutral-200/70">
                      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
                        <div className="p-1 rounded-md bg-neutral-200 text-neutral-600">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <span>Inactive / Hidden</span>
                      </div>
                      <span className="text-base font-bold font-mono text-neutral-800">
                        {data.filter((d) => d.status === "Inactive" || d.status === "Draft").length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : isOrganizationModule ? (
            <div className="space-y-3">
              {/* Organization Top Navigation Tab Bar */}
              <div className="bg-white rounded-lg border border-[#E7DED3] p-1.5 flex flex-wrap items-center gap-1.5 shadow-xs">
                {orgTabs.map((tab) => {
                  const isActive = orgTab === tab.key;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setOrgTab(tab.key);
                        setSelectedCategory("All");
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-[#B85C38] text-white shadow-xs"
                          : "text-[#6F665E] hover:bg-[#FAF8F3] hover:text-[#2F241D]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#B85C38]"}`} />
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#FAF8F3] text-[#6F665E] border border-[#E7DED3]"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Wing Header & Controls */}
              <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                        {orgTab === "governingbody"
                          ? "Governing Body Management"
                          : orgTab === "executive"
                          ? "Executive Committee Management"
                          : orgTab === "keyfunctionaries"
                          ? "Key Functionaries Management"
                          : "Archaeological Team Management"}
                      </h1>
                    </div>
                    <p className="text-xs text-[#6F665E] leading-relaxed">
                      {orgTab === "governingbody"
                        ? "Official list of members constituting the apex governing committee of Bihar Heritage Development Society."
                        : orgTab === "executive"
                        ? "Members of the Executive Committee responsible for operational oversight and society administration."
                        : orgTab === "keyfunctionaries"
                        ? "Leadership officials responsible for guiding the operations and institutional direction of Bihar Heritage Development Society."
                        : "Dedicated archaeological research assistants, draughtsmen, and field exploration team members."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
                    {/* Direct link to public page */}
                    <a
                      href={
                        orgTab === "governingbody"
                          ? "/governingbody"
                          : orgTab === "executive"
                          ? "/executive"
                          : orgTab === "keyfunctionaries"
                          ? "/keyfunctionaries"
                          : "/archeologicalteam"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-[#FAF8F3] text-[#6F665E] border border-[#E7DED3] hover:bg-[#F5F0E6] hover:text-[#2F241D] transition-all cursor-pointer"
                      title="Open corresponding public page in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#B85C38]" />
                      <span>View Public Page</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setIsOrganizationModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {orgTab === "governingbody" || orgTab === "executive"
                          ? "Add Member"
                          : orgTab === "keyfunctionaries"
                          ? "Add Functionary"
                          : "Add Team Member"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Stat Counters Row */}
                <div className="pt-3.5 border-t border-[#E7DED3]/70">
                  {orgTab === "governingbody" || orgTab === "executive" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory("All");
                          setCurrentPage(1);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${
                          selectedCategory === "All"
                            ? "bg-[#FAF8F3] border-[#B85C38]"
                            : "bg-[#FAF8F3] border-[#E7DED3] hover:border-[#B85C38]/40 hover:bg-[#F5F0E6]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6F665E]">
                          <Users className="w-3.5 h-3.5 text-[#B85C38]" />
                          <span>Total Members</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-[#2F241D]">{data.length}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(selectedCategory === "Chairman" ? "All" : "Chairman");
                          setCurrentPage(1);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${
                          selectedCategory === "Chairman"
                            ? "bg-amber-100/90 border-amber-500"
                            : "bg-amber-50/70 border-amber-200 hover:bg-amber-100/70 hover:border-amber-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Chairman</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-amber-900">
                          {data.filter((d) => d.role === "Chairman").length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(selectedCategory === "Member Secretary" ? "All" : "Member Secretary");
                          setCurrentPage(1);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${
                          selectedCategory === "Member Secretary"
                            ? "bg-blue-100/90 border-blue-500"
                            : "bg-blue-50/70 border-blue-200 hover:bg-blue-100/70 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                          <Award className="w-3.5 h-3.5 text-blue-600" />
                          <span>Member Secretary</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-blue-900">
                          {data.filter((d) => d.role === "Member Secretary").length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(selectedCategory === "Member" ? "All" : "Member");
                          setCurrentPage(1);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${
                          selectedCategory === "Member"
                            ? "bg-emerald-100/90 border-emerald-500"
                            : "bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70 hover:border-emerald-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Members</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-emerald-900">
                          {data.filter((d) => d.role === "Member").length}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="flex items-center justify-between px-3.5 py-2 rounded-md border border-[#E7DED3] bg-[#FAF8F3]">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6F665E]">
                          {orgTab === "keyfunctionaries" ? (
                            <Users className="w-3.5 h-3.5 text-[#B85C38]" />
                          ) : (
                            <Compass className="w-3.5 h-3.5 text-[#B85C38]" />
                          )}
                          <span>Total {orgTab === "keyfunctionaries" ? "Officials" : "Members"}</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-[#2F241D]">{data.length}</span>
                      </div>

                      <div className="flex items-center justify-between px-3.5 py-2 rounded-md border border-emerald-200 bg-emerald-50/70">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Published</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-emerald-900">
                          {data.filter((d) => (d.status || "Published") === "Published").length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : isTangibleHeritageModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left space-y-4">
              {/* Tangible Heritage Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      Tangible & Living Heritage Archive
                    </h1>
                  </div>
                  <p className="text-xs text-[#6F665E] leading-relaxed">
                    Comprehensive management of Bihar's Living Heritage Archive items (Art & Craft, Festivals & Rituals, Music, Dance & Theatre, Oral Traditions, Food & Customs) featured on the /living-heritage page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsTangibleModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Heritage</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="pt-3.5 border-t border-[#E7DED3]/70">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {tangibleHeritageCategories.map((cat) => {
                    const isSel = selectedCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.value);
                          setCurrentPage(1);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${
                          isSel
                            ? "bg-[#FAF8F3] border-[#B85C38] text-[#B85C38] shadow-xs font-bold"
                            : "bg-[#FAF8F3]/60 border-[#E7DED3] text-[#6F665E] hover:border-[#B85C38]/40 hover:bg-[#FAF8F3]"
                        }`}
                      >
                        <span className="text-[11px] font-semibold truncate">{cat.label}</span>
                        <span className="text-xs font-bold font-mono ml-1">{cat.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : isProtectedSitesModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left space-y-4">
              {/* Protected Sites Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      Protected Monuments & Heritage Sites
                    </h1>
                  </div>

                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsProtectedSiteModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Site</span>
                </button>
              </div>

              {/* Stat Counters Row - Interactive filter cards */}
              <div className="pt-3.5 border-t border-[#E7DED3]/70">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {/* Total Sites */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All");
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${selectedCategory === "All"
                      ? "bg-[#FAF8F3] border-[#B85C38]"
                      : "bg-[#FAF8F3] border-[#E7DED3] hover:border-[#B85C38]/40 hover:bg-[#F5F0E6]"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6F665E]">
                      <Landmark className="w-3.5 h-3.5 text-[#B85C38]" />
                      <span>Total Sites</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-[#2F241D]">{data.length}</span>
                  </button>

                  {/* State Protected */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(selectedCategory === "State Protected" ? "All" : "State Protected");
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${selectedCategory === "State Protected"
                      ? "bg-emerald-100/90 border-emerald-500"
                      : "bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70 hover:border-emerald-300"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <span>State Protected</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-emerald-900">
                      {data.filter((d) => (d.managed_by || "state").toLowerCase() === "state").length}
                    </span>
                  </button>

                  {/* ASI Central */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(selectedCategory === "ASI Centrally Protected" ? "All" : "ASI Centrally Protected");
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${selectedCategory === "ASI Centrally Protected"
                      ? "bg-amber-100/90 border-amber-500"
                      : "bg-amber-50/70 border-amber-200 hover:bg-amber-100/70 hover:border-amber-300"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                      <Landmark className="w-3.5 h-3.5 text-amber-600" />
                      <span>ASI Central</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-amber-900">
                      {data.filter((d) => (d.managed_by || "").toLowerCase() === "central").length}
                    </span>
                  </button>

                  {/* UNESCO */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(selectedCategory === "UNESCO Sites" ? "All" : "UNESCO Sites");
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${selectedCategory === "UNESCO Sites"
                      ? "bg-cyan-100/90 border-cyan-500"
                      : "bg-cyan-50/70 border-cyan-200 hover:bg-cyan-100/70 hover:border-cyan-300"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-800">
                      <Award className="w-3.5 h-3.5 text-cyan-600" />
                      <span>UNESCO</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-cyan-900">
                      {data.filter((d) => (d.managed_by || "").toLowerCase() === "unesco").length}
                    </span>
                  </button>

                  {/* Others */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(selectedCategory === "Other / Cultural" ? "All" : "Other / Cultural");
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer col-span-2 sm:col-span-1 ${selectedCategory === "Other / Cultural"
                      ? "bg-purple-100/90 border-purple-500"
                      : "bg-purple-50/70 border-purple-200 hover:bg-purple-100/70 hover:border-purple-300"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-800">
                      <Globe className="w-3.5 h-3.5 text-purple-600" />
                      <span>Others</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-purple-900">
                      {data.filter((d) => (d.managed_by || "").toLowerCase() === "other").length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : isExcavationModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left space-y-4">
              {/* Excavation Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      Archaeological Excavations & Field Explorations
                    </h1>
                  </div>
                  <p className="text-xs text-[#6F665E] leading-relaxed">
                    Comprehensive directory of active digs, ancient stupas, historical trenches, and research findings across Bihar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsExcavationModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Stat Counters Row - Interactive filter cards */}
              <div className="pt-3.5 border-t border-[#E7DED3]/70">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Total Projects */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All");
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${selectedCategory === "All"
                      ? "bg-[#FAF8F3] border-[#B85C38]"
                      : "bg-[#FAF8F3] border-[#E7DED3] hover:border-[#B85C38]/40 hover:bg-[#F5F0E6]"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6F665E]">
                      <Compass className="w-3.5 h-3.5 text-[#B85C38]" />
                      <span>Total Projects</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-[#2F241D]">{data.length}</span>
                  </button>

                  {/* Excavation Sites */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(selectedCategory === "Excavation Sites" ? "All" : "Excavation Sites");
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${selectedCategory === "Excavation Sites"
                      ? "bg-amber-100/90 border-amber-500"
                      : "bg-amber-50/70 border-amber-200 hover:bg-amber-100/70 hover:border-amber-300"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                      <Landmark className="w-3.5 h-3.5 text-amber-600" />
                      <span>Excavation Sites</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-amber-900">
                      {data.filter((d) => (d.type || "excavation").toLowerCase() === "excavation").length}
                    </span>
                  </button>

                  {/* Explorations */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(selectedCategory === "Exploration Activities" ? "All" : "Exploration Activities");
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-md border text-left transition-all duration-150 cursor-pointer ${selectedCategory === "Exploration Activities"
                      ? "bg-cyan-100/90 border-cyan-500"
                      : "bg-cyan-50/70 border-cyan-200 hover:bg-cyan-100/70 hover:border-cyan-300"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-800">
                      <Compass className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Explorations</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-cyan-900">
                      {data.filter((d) => (d.type || "").toLowerCase() === "exploration").length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : isWorkshopsModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left">
              {/* Workshops Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      Workshops, Seminars & Heritage Activities
                    </h1>
                  </div>
                  <p className="text-xs text-[#6F665E] leading-relaxed">
                    Comprehensive management of archaeological workshops, public exhibitions, training sessions, academic lectures, and national seminars.
                  </p>

                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsWorkshopModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Activity</span>
                </button>
              </div>
            </div>
          ) : isPublicationModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left space-y-4">
              {/* Publication Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      Archival Publications & Research Journals
                    </h1>
                  </div>
                  <p className="text-xs text-[#6F665E] leading-relaxed">
                    Comprehensive management of research journals, excavation monographs, historical atlases, and folklore literature compilations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsPublicationModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Publication</span>
                </button>
              </div>
            </div>
          ) : isEventsModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left space-y-4">
              {/* Events Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      Upcoming Heritage Events & Cultural Calendar
                    </h1>
                  </div>
                  <p className="text-xs text-[#6F665E] leading-relaxed">
                    Comprehensive management of community cultural festivals, hands-on masterclasses, guided heritage walks, and symposiums.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsEventModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Event</span>
                </button>
              </div>
            </div>
          ) : isNewsModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left">
              {/* News Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      News & Press Room Management
                    </h1>
                  </div>
                  <p className="text-xs text-[#6F665E] leading-relaxed">
                    Publish official announcements, museum exhibit releases, press bulletins, and archaeological milestones.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsNewsModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Bulletin</span>
                </button>
              </div>
            </div>
          ) : isPhotosModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left">
              {/* Photos Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      Heritage Photo Gallery Management
                    </h1>
                  </div>
                  <p className="text-xs text-[#6F665E] leading-relaxed">
                    Curate and manage high-resolution photographic records, monument showcases, and historical site galleries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsPhotoModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Photo</span>
                </button>
              </div>
            </div>
          ) : isVideosModule ? (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-5 sm:p-6 text-left">
              {/* Videos Header Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
                      Documentary & Video Vault Management
                    </h1>
                  </div>
                  <p className="text-xs text-[#6F665E] leading-relaxed">
                    Curate video documentaries, historical features, archival excavations, and official media broadcasts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsVideoModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all shrink-0 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Video</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E7DED3] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
              <div>
                <p className="text-xs text-[#6F665E] leading-relaxed">
                  {config.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsDrawerOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] transition shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>
          )}

          {/* Search Bar & Right-aligned Category Dropdown Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <AdminSearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder={`Search ${config.name.toLowerCase()} by title, district, location…`}
            />

            {/* Right Side: Showing indicator & Category Dropdown */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 self-end sm:self-auto">
              <div className="text-xs font-sans text-[#6F665E] hidden sm:block">
                Showing <span className="font-semibold text-[#2F241D]">{filteredData.length}</span> {filteredData.length === 1 ? "entry" : "entries"}
              </div>

              {isShowcaseModule && showcaseTab === "archives" && (
                <AdminCategoryDropdown
                  label="Category"
                  options={archiveCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isShowcaseModule && showcaseTab === "showcase-videos" && (
                <AdminCategoryDropdown
                  label="Format"
                  options={videoShowcaseCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isOrganizationModule && (orgTab === "governingbody" || isGoverningBodyModule) && (
                <AdminCategoryDropdown
                  label="Role"
                  options={governingBodyRoles}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isOrganizationModule && (orgTab === "executive" || isExecutiveModule) && (
                <AdminCategoryDropdown
                  label="Role"
                  options={executiveRoles}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isBlogModule && (
                <AdminCategoryDropdown
                  label="Category"
                  options={blogCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isProtectedSitesModule && (
                <AdminCategoryDropdown
                  label="Authority"
                  options={protectedSitesCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isExcavationModule && (
                <AdminCategoryDropdown
                  label="Category"
                  options={excavationCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isWorkshopsModule && (
                <AdminCategoryDropdown
                  label="Category"
                  options={workshopsCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isPublicationModule && (
                <AdminCategoryDropdown
                  label="Category"
                  options={publicationCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isEventsModule && (
                <AdminCategoryDropdown
                  label="Category"
                  options={eventsCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isNewsModule && (
                <AdminCategoryDropdown
                  label="Category"
                  options={newsCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isPhotosModule && (
                <AdminCategoryDropdown
                  label="Category"
                  options={photosCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}

              {isVideosModule && (
                <AdminCategoryDropdown
                  label="Category"
                  options={videosCategories}
                  selected={selectedCategory}
                  onSelect={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  totalCount={data.length}
                />
              )}
            </div>
          </div>

          {/* Main Data Table */}
          <div className="w-full">
            <AdminTable
              columns={config.columns}
              data={paginatedData}
              showImage={true}
              onEdit={(row) => {
                setEditingItem(row);
                if (isBlogModule) {
                  setIsBlogStudioOpen(true);
                } else if (isOrganizationModule) {
                  setIsOrganizationModalOpen(true);
                } else if (isShowcaseModule) {
                  setIsShowcaseModalOpen(true);
                } else if (isTangibleHeritageModule) {
                  setIsTangibleModalOpen(true);
                } else if (isProtectedSitesModule) {
                  setIsProtectedSiteModalOpen(true);
                } else if (isExcavationModule) {
                  setIsExcavationModalOpen(true);
                } else if (isWorkshopsModule) {
                  setIsWorkshopModalOpen(true);
                } else if (isPublicationModule) {
                  setIsPublicationModalOpen(true);
                } else if (isEventsModule) {
                  setIsEventModalOpen(true);
                } else if (isNewsModule) {
                  setIsNewsModalOpen(true);
                } else if (isPhotosModule) {
                  setIsPhotoModalOpen(true);
                } else if (isVideosModule) {
                  setIsVideoModalOpen(true);
                } else {
                  setIsDrawerOpen(true);
                }
              }}
              onDelete={handleDelete}
            />
          </div>

          {/* Bottom Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6F665E] hover:text-[#2F241D] disabled:opacity-40 disabled:cursor-not-allowed border border-[#E7DED3] bg-white rounded-md transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-md text-xs font-semibold font-sans transition-colors cursor-pointer ${currentPage === p
                      ? "bg-[#B85C38] text-white"
                      : "text-[#6F665E] hover:bg-[#FAF8F3] hover:text-[#2F241D]"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6F665E] hover:text-[#2F241D] disabled:opacity-40 disabled:cursor-not-allowed border border-[#E7DED3] bg-white rounded-md transition cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Dedicated Large Modal for Tangible & Living Heritage */}
          {isTangibleHeritageModule && (
            <TangibleHeritageModal
              isOpen={isTangibleModalOpen}
              onClose={() => {
                setIsTangibleModalOpen(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsTangibleModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for Protected Sites */}
          {isProtectedSitesModule && (
            <ProtectedSiteModal
              isOpen={isProtectedSiteModalOpen}
              onClose={() => {
                setIsProtectedSiteModalOpen(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              onSave={(payload) => {
                if (editingItem) {
                  updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  addItem(config.storageKey, payload, config.defaultData);
                }
                setData(getData(config.storageKey, config.defaultData));
                setIsProtectedSiteModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for Excavation & Exploration */}
          {isExcavationModule && (
            <ExcavationModal
              isOpen={isExcavationModalOpen}
              onClose={() => {
                setIsExcavationModalOpen(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsExcavationModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for Workshops, Seminars & Activities */}
          {isWorkshopsModule && (
            <WorkshopModal
              isOpen={isWorkshopModalOpen}
              onClose={() => {
                setIsWorkshopModalOpen(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsWorkshopModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for Publications */}
          {isPublicationModule && (
            <PublicationModal
              isOpen={isPublicationModalOpen}
              onClose={() => {
                setIsPublicationModalOpen(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsPublicationModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for Events */}
          {isEventsModule && (
            <EventModal
              isOpen={isEventModalOpen}
              onClose={() => {
                setIsEventModalOpen(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsEventModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for News */}
          {isNewsModule && (
            <NewsModal
              isOpen={isNewsModalOpen}
              onClose={() => {
                setIsNewsModalOpen(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsNewsModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for Photos */}
          {isPhotosModule && (
            <PhotoModal
              isOpen={isPhotoModalOpen}
              onClose={() => {
                setIsPhotoModalOpen(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsPhotoModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for Videos */}
          {isVideosModule && (
            <VideoModal
              isOpen={isVideoModalOpen}
              onClose={() => {
                setIsVideoModalOpen(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsVideoModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for Organization */}
          {isOrganizationModule && (
            <OrganizationModal
              isOpen={isOrganizationModalOpen}
              onClose={() => {
                setIsOrganizationModalOpen(false);
                setEditingItem(null);
              }}
              defaultCategory={
                orgTab === "governingbody"
                  ? "Governing Body"
                  : orgTab === "executive"
                  ? "Executive Committee"
                  : orgTab === "keyfunctionaries"
                  ? "Key Functionaries"
                  : "Archaeological Team"
              }
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsOrganizationModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Dedicated Large Modal for Home Showcase (Bihar Heritage Archives & Popular Heritage Sites) */}
          {isShowcaseModule && (
            <ShowcaseModal
              isOpen={isShowcaseModalOpen}
              onClose={() => {
                setIsShowcaseModalOpen(false);
                setEditingItem(null);
              }}
              activeSubTab={showcaseTab}
              initialData={editingItem}
              onSave={(payload) => {
                let updated;
                if (editingItem) {
                  updated = updateItem(config.storageKey, editingItem.id, payload, config.defaultData);
                } else {
                  const res = addItem(config.storageKey, payload, config.defaultData);
                  updated = res.data;
                }
                setData(updated);
                setIsShowcaseModalOpen(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* Sliding Edit / Create Drawer for standard CMS modules */}
          {!isBlogModule && !isOrganizationModule && !isShowcaseModule && !isProtectedSitesModule && !isExcavationModule && !isWorkshopsModule && !isPublicationModule && !isEventsModule && !isNewsModule && !isPhotosModule && !isVideosModule && (
            <AdminDrawer
              isOpen={isDrawerOpen}
              onClose={() => {
                setIsDrawerOpen(false);
                setEditingItem(null);
              }}
              title={editingItem ? `Edit ${config.name}` : `Create New ${config.name}`}
              onSave={handleSave}
            >
              <div className="space-y-4 text-left">
                {config.fields.map((field) => {
                  if (field.type === "image") {
                    return (
                      <ImageUploader
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        value={formState[field.name]}
                        onChange={handleFieldChange}
                      />
                    );
                  }
                  if (field.type === "richtext") {
                    return (
                      <RichTextEditor
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        value={formState[field.name]}
                        onChange={handleFieldChange}
                      />
                    );
                  }
                  return (
                    <FormField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      value={formState[field.name]}
                      onChange={handleFieldChange}
                      options={field.options}
                      required={field.required}
                    />
                  );
                })}
              </div>
            </AdminDrawer>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminModulePage;
