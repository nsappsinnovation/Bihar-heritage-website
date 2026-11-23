import React from "react";
import { Link } from "react-router-dom";
import {
  Landmark,
  Compass,
  BookOpen,
  FileText,
  Calendar,
  Megaphone,
  Image,
  Video,
  PenTool,
  Users,
  Award,
  ArrowRight,
  ExternalLink,
  Plus,
  CheckCircle2,
  Database,
  ShieldCheck,
  Activity,
  Layers,
  Scroll
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { getData, STORAGE_KEYS } from "../../utils/cmsStorage";
import { MODULE_REGISTRY } from "./moduleConfig";

export default function AdminDashboard() {
  // Read current counts from storage
  const getCount = (key, defaultData) => {
    return getData(key, defaultData).length;
  };

  const modules = [
    {
      name: "Protected Sites",
      key: "protected-sites",
      icon: Landmark,
      description: "State, ASI Central & UNESCO Monuments",
      count: getCount(STORAGE_KEYS.PROTECTED_SITES, MODULE_REGISTRY["protected-sites"]?.defaultData),
    },
    {
      name: "Excavation & Exploration",
      key: "excavation",
      icon: Compass,
      description: "Field digs, stupas & historical trenches",
      count: getCount(STORAGE_KEYS.EXCAVATION, MODULE_REGISTRY["excavation"]?.defaultData),
    },
    {
      name: "Tangible Heritage",
      key: "tangible-heritage",
      icon: Scroll,
      description: "Art & Craft, Festivals & Rituals, Music, Dance & Theatre, Oral Traditions & Customs",
      count: getCount(STORAGE_KEYS.TANGIBLE_HERITAGE, MODULE_REGISTRY["tangible-heritage"]?.defaultData),
    },
    {
      name: "Workshops & Seminars",
      key: "workshops",
      icon: BookOpen,
      description: "Academic sessions, seminars & training",
      count: getCount(STORAGE_KEYS.WORKSHOPS, MODULE_REGISTRY["workshops"]?.defaultData),
    },
    {
      name: "Publications",
      key: "publications",
      icon: FileText,
      description: "Reports, atlases, journals & literature",
      count: getCount(STORAGE_KEYS.PUBLICATIONS, MODULE_REGISTRY["publications"]?.defaultData),
    },
    {
      name: "Organization",
      key: "organization",
      icon: Users,
      description: "Governing Body, Executive Committee, Functionaries & Team",
      count:
        getCount(STORAGE_KEYS.GOVERNING_BODY, MODULE_REGISTRY["governingbody"]?.defaultData) +
        getCount(STORAGE_KEYS.EXECUTIVE_COMMITTEE, MODULE_REGISTRY["executive"]?.defaultData) +
        getCount(STORAGE_KEYS.KEY_FUNCTIONARIES, MODULE_REGISTRY["keyfunctionaries"]?.defaultData) +
        getCount(STORAGE_KEYS.ARCHAEOLOGICAL_TEAM, MODULE_REGISTRY["archeologicalteam"]?.defaultData),
    },
    {
      name: "Heritage Showcase",
      key: "showcase",
      icon: Layers,
      description: "Archives Explorer, Popular Sites & Living Heritage Video Reels",
      count:
        getCount(STORAGE_KEYS.HERITAGE_ARCHIVES, MODULE_REGISTRY["archives"]?.defaultData) +
        getCount(STORAGE_KEYS.POPULAR_SITES, MODULE_REGISTRY["popular-sites"]?.defaultData) +
        getCount(STORAGE_KEYS.HERITAGE_VIDEOS, MODULE_REGISTRY["showcase-videos"]?.defaultData),
    },
    {
      name: "Upcoming Events",
      key: "events",
      icon: Calendar,
      description: "Heritage walks, festivals & exhibitions",
      count: getCount(STORAGE_KEYS.EVENTS, MODULE_REGISTRY["events"]?.defaultData),
    },
    {
      name: "Latest News",
      key: "news",
      icon: Megaphone,
      description: "Press releases, updates & announcements",
      count: getCount(STORAGE_KEYS.NEWS, MODULE_REGISTRY["news"]?.defaultData),
    },
    {
      name: "Photo Gallery",
      key: "photos",
      icon: Image,
      description: "Curated heritage images & collections",
      count: getCount(STORAGE_KEYS.PHOTOS, MODULE_REGISTRY["photos"]?.defaultData),
    },
    {
      name: "Video Gallery",
      key: "videos",
      icon: Video,
      description: "Documentaries, reels & video archives",
      count: getCount(STORAGE_KEYS.VIDEOS, MODULE_REGISTRY["videos"]?.defaultData),
    },
    {
      name: "Blog Articles",
      key: "blogs",
      icon: PenTool,
      description: "Editorial stories, articles & essays",
      count: getCount(STORAGE_KEYS.BLOGS, MODULE_REGISTRY["blogs"]?.defaultData),
    },
  ];

  const totalRecords = modules.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <AdminLayout title="CMS Dashboard Overview">
      <div className="space-y-5 text-left">

        {/* ─── HEADER / WELCOME SECTION (Clean Minimal Flat) ─── */}
        <div className="bg-white rounded-lg p-6 sm:p-7 border border-[#E7DED3] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#B85C38] uppercase tracking-wider">
              <span>Control Center</span>
              <span className="text-[#E7DED3]">•</span>
              <span>Bihar Heritage Development Society</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#2F241D] tracking-tight">
              Content Management System
            </h1>
            <p className="text-xs text-[#6F665E] leading-relaxed">
              Centralized administrative dashboard for monuments, excavation archives, research journals, and publications.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/admin/protected-sites"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#B85C38] text-white hover:bg-[#A0502F] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Monument</span>
            </Link>
            <Link
              to="/admin/blogs"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#2F241D] text-white hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Article</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-[#E7DED3] text-[#6F665E] hover:text-[#2F241D] hover:bg-[#FAF8F3] transition-all cursor-pointer"
              title="Open Public Website"
            >
              <span>View Portal</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* ─── SUMMARY KPI BAR (Clean Flat Grid) ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#6F665E] uppercase tracking-wider">Total Records</span>
              <div className="text-xl font-bold font-mono text-[#2F241D]">{totalRecords}</div>
            </div>
            <div className="p-2 rounded-md bg-[#FAF8F3] border border-[#E7DED3] text-[#B85C38]">
              <Database className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#6F665E] uppercase tracking-wider">Active Modules</span>
              <div className="text-xl font-bold font-mono text-[#2F241D]">{modules.length}</div>
            </div>
            <div className="p-2 rounded-md bg-[#FAF8F3] border border-[#E7DED3] text-[#B85C38]">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#6F665E] uppercase tracking-wider">System Status</span>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Operational</span>
              </div>
            </div>
            <div className="p-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#E7DED3] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#6F665E] uppercase tracking-wider">Role</span>
              <div className="text-xs font-bold text-[#2F241D] mt-1">Super Admin</div>
            </div>
            <div className="p-2 rounded-md bg-[#FAF8F3] border border-[#E7DED3] text-[#6F665E]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ─── MODULES DIRECTORY GRID (Minimal Flat Cards) ─── */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6F665E]">
              Directory Modules
            </h2>
            <span className="text-[11px] text-[#6F665E]">
              Click any module to manage and edit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.key}
                  to={`/admin/${mod.key}`}
                  className="group bg-white p-4 sm:p-4.5 rounded-lg border border-[#E7DED3] hover:border-[#B85C38] hover:bg-[#FAF8F3]/40 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#2F241D] group-hover:text-[#B85C38] transition-colors truncate">
                        {mod.name}
                      </h3>
                      <p className="text-xs text-[#6F665E] font-normal leading-relaxed line-clamp-1">
                        {mod.description}
                      </p>
                    </div>
                    <div className="p-2 rounded-md bg-[#FAF8F3] border border-[#E7DED3] text-[#6F665E] group-hover:text-[#B85C38] group-hover:border-[#B85C38]/40 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#E7DED3]/60">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold font-mono text-[#2F241D]">
                        {mod.count}
                      </span>
                      <span className="text-[11px] font-medium text-[#6F665E]">
                        records
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#6F665E] group-hover:text-[#B85C38] transition-colors">
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── SYSTEM SPECIFICATIONS (Clean Minimal Strip) ─── */}
        <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#E7DED3]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6F665E] mb-3 pb-2 border-b border-[#E7DED3]/60">
            System & Storage Specifications
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F665E] block mb-0.5">
                Storage Architecture
              </span>
              <span className="font-semibold text-[#2F241D]">
                Client LocalStorage Database (Modular abstraction)
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F665E] block mb-0.5">
                Synchronization
              </span>
              <span className="font-semibold text-emerald-700">
                Realtime Multi-tab & Focus Reactive Listeners
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F665E] block mb-0.5">
                Deployment Mode
              </span>
              <span className="font-semibold text-[#2F241D]">
                Independent Standalone CMS Environment
              </span>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
