import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
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
  ShieldCheck,
  Award,
  Layers,
  Scroll,
  LogOut,
  User,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import bhdsLogo from "../../assets/bihar_heritage_logo.webp";
import { logout } from "../../services/auth";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Protected Sites", path: "/admin/protected-sites", icon: Landmark },
  { name: "Excavation & Exploration", path: "/admin/excavation", icon: Compass },
  { name: "Tangible Heritage", path: "/admin/tangible-heritage", icon: Scroll },
  { name: "Workshops & Seminars", path: "/admin/workshops", icon: BookOpen },
  { name: "Publications", path: "/admin/publications", icon: FileText },
  { name: "Organization", path: "/admin/organization", icon: Users },
  { name: "Heritage Showcase", path: "/admin/showcase", icon: Layers },
  { name: "Upcoming Events", path: "/admin/events", icon: Calendar },
  { name: "Latest News", path: "/admin/news", icon: Megaphone },
  { name: "Photos", path: "/admin/photos", icon: Image },
  { name: "Videos", path: "/admin/videos", icon: Video },
  { name: "Blogs", path: "/admin/blogs", icon: PenTool },
];

const AdminLayout = ({ children, title = "CMS Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Persist desktop sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("bh_admin_sidebar_collapsed") === "true";
  });

  // Mobile sidebar open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("bh_admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-[#FAF8F3] text-[#2F241D] font-inter overflow-hidden relative">

      {/* ─── MOBILE BACKDROP OVERLAY ─── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ─── SIDEBAR (Desktop Collapsible & Mobile Slide-Over) ─── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#1E1916] text-white flex flex-col shrink-0 border-r border-[#E7DED3]/10 transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Sidebar Brand Logo */}
        <div className="h-[72px] px-4 flex items-center justify-between border-b border-[#FAF8F3]/10 bg-[#14110F] shrink-0">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <img loading="lazy" decoding="async" src={bhdsLogo} alt="Logo" className="h-9 w-auto shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col text-left transition-opacity duration-200">
                <span className="font-serif font-bold text-sm tracking-tight text-white whitespace-nowrap">
                  Bihar Heritage
                </span>
                <span className="text-[9px] font-sans tracking-[0.2em] text-[#B85C38] uppercase font-bold whitespace-nowrap">
                  Control Panel
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-grow pt-2.5 pb-4 px-3 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/admin/organization" &&
                (location.pathname.startsWith("/admin/governingbody") ||
                  location.pathname.startsWith("/admin/executive") ||
                  location.pathname.startsWith("/admin/keyfunctionaries") ||
                  location.pathname.startsWith("/admin/archeologicalteam"))) ||
              (item.path === "/admin/showcase" &&
                (location.pathname.startsWith("/admin/showcase") ||
                  location.pathname.startsWith("/admin/heritage-showcase") ||
                  location.pathname.startsWith("/admin/home-showcase") ||
                  location.pathname.startsWith("/admin/archives") ||
                  location.pathname.startsWith("/admin/popular-sites") ||
                  location.pathname.startsWith("/admin/showcase-videos") ||
                  location.pathname.startsWith("/admin/heritage-videos") ||
                  location.pathname.startsWith("/admin/living-videos")));
            const showLabel = !isCollapsed || isMobileOpen;

            return (
              <Link
                key={item.name}
                to={item.path}
                title={isCollapsed && !isMobileOpen ? item.name : undefined}
                onClick={() => setIsMobileOpen(false)}
                className={`group relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-150 ${
                  isCollapsed && !isMobileOpen ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-[#B85C38] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {showLabel && <span className="truncate">{item.name}</span>}

                {/* Floating Tooltip when Collapsed */}
                {isCollapsed && !isMobileOpen && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#2F241D] text-white text-[11px] font-medium tracking-normal normal-case rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-[#E7DED3]/20">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#FAF8F3]/10 bg-[#14110F] shrink-0">
          <button
            onClick={handleLogout}
            title={isCollapsed && !isMobileOpen ? "Logout" : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer ${
              isCollapsed && !isMobileOpen ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ─── WORKSPACE (Right Pane) ─── */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* TOP BAR */}
        <header className="h-[72px] bg-white border-b border-[#E7DED3] px-4 sm:px-6 md:px-8 flex items-center justify-between shrink-0">

          {/* Left: Hamburger Button & Page Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Hamburger Button for Desktop & Mobile */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileOpen(!isMobileOpen);
                } else {
                  toggleSidebar();
                }
              }}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="p-2 sm:p-2.5 rounded-xl border border-[#E7DED3] bg-[#FAF8F3] hover:bg-[#E7DED3]/50 text-[#2F241D] transition cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
            >
              <Menu className="w-5 h-5 text-[#B85C38]" />
            </button>

            {/* Desktop Collapse Arrow Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="hidden lg:flex p-2.5 rounded-xl border border-[#E7DED3] bg-white hover:bg-[#FAF8F3] text-[#6F665E] hover:text-[#2F241D] transition cursor-pointer items-center justify-center shrink-0 shadow-2xs"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-[#B85C38]" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-[#B85C38]" />
              )}
            </button>

            {/* Section Page Title */}
            <div className="flex flex-col">
              <h2 className="font-serif text-lg md:text-2xl font-bold text-[#2F241D] tracking-tight">
                {title}
              </h2>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* Search Input Indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs font-sans text-[#6F665E]/70 bg-[#FAF8F3] px-3.5 py-2 rounded-xl border border-[#E7DED3]">
              <Search className="w-3.5 h-3.5 text-[#B85C38]" />
              <span>Admin System Active</span>
            </div>

            {/* Profile Card */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF8F3] border border-[#E7DED3] flex items-center justify-center text-[#B85C38] shadow-2xs">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#2F241D]">Super Admin</span>
                <span className="text-[10px] text-[#6F665E] font-medium font-sans">bhds.gov.in</span>
              </div>
            </div>

          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-grow overflow-y-auto px-3 sm:px-5 md:px-6 py-4 sm:py-6">
          <div className="w-full max-w-[1700px] mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
