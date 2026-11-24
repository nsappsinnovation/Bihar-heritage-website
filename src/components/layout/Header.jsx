import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import bhdsLogo from "../../assets/Bihar Virasat Logo.webp";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "About Us", to: "/about" },
  {
    name: "Organization",
    subMenu: [
      { name: "Governing Body", to: "/governingbody" },
      { name: "Executive Committee", to: "/executive" },
      { name: "Key Functionaries", to: "/keyfunctionaries" },
      { name: "Archeological Team", to: "/archeologicalteam" },
    ],
  },
  { name: "Protected Sites", to: "/protected-sites" },
  {
    name: "Activities",
    subMenu: [
      { name: "Excavation & Exploration", to: "/excavations" },
      { name: "Workshop & Seminar", to: "/Activities" },
      { name: "Publications", to: "/publication" },
    ],
  },
  {
    name: "Events",
    subMenu: [
      { name: "Upcoming Events", to: "/events/upcoming" },
      { name: "Latest News", to: "/news" },
    ],
  },
  {
    name: "Gallery",
    subMenu: [
      { name: "Photos", to: "/GalleryPage" },
      { name: "Videos", to: "/VideoGalleryPage" },
    ],
  },
  { name: "Articles", to: "/blog" },
  { name: "Contact Us", to: "/contact" },
];

/* ─── Desktop dropdown ─────────────────────────────────────────────────── */
const DesktopDropdown = ({ link, isActive, isDark }) => {
  const isLinkActive = link.to ? isActive(link.to) : false;
  const isSubActive = link.subMenu?.some(s => isActive(s.to));
  const isCurrentlyActive = isLinkActive || isSubActive;

  const textCls = `whitespace-nowrap flex items-center gap-1 text-[14px] font-serif tracking-wider transition-colors duration-250 cursor-pointer
    ${isCurrentlyActive ? 'text-[#C2A55D]' : isDark ? 'text-[#2F241D]' : 'text-white'}
    hover:text-[#C2A55D]`;

  return (
    <div className="relative group">
      {link.subMenu ? (
        <>
          <div className={textCls}>
            {link.name}
            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
          </div>
          {/* underline */}
          <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#C2A55D] transition-all duration-300 group-hover:w-full ${isCurrentlyActive ? 'w-full' : 'w-0'}`} />

          {/* dropdown panel */}
          <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
            <div className={`min-w-[196px] rounded-2xl shadow-xl border overflow-hidden ${isDark ? 'bg-white border-[#E8DFC8]' : 'bg-[#1C1510]/96 backdrop-blur-md border-white/10'}`}>
              {link.subMenu.map((sub) => (
                <Link
                  key={sub.name} to={sub.to}
                  className={`block px-5 py-3 text-[12px] font-sans tracking-widest uppercase transition-colors
                    ${isActive(sub.to)
                      ? 'bg-[#C2A55D]/12 text-[#C2A55D] font-bold'
                      : isDark
                        ? 'text-[#5C4A35] hover:bg-[#FAF3E5] hover:text-[#C2A55D]'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <Link to={link.to} className={textCls}>
            {link.name}
          </Link>
          <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#C2A55D] transition-all duration-300 group-hover:w-full ${isCurrentlyActive ? 'w-full' : 'w-0'}`} />
        </>
      )}
    </div>
  );
};

/* ─── Mobile link row ──────────────────────────────────────────────────── */
const MobileLink = ({ link, isActive, isDark, onClose }) => {
  const [open, setOpen] = useState(false);
  const isLinkActive = link.to ? isActive(link.to) : false;
  const isSubActive = link.subMenu?.some(s => isActive(s.to));
  const isCurrentlyActive = isLinkActive || isSubActive;

  const baseTextCls = `text-[15px] font-serif transition-colors ${isCurrentlyActive ? 'text-[#C2A55D]' : isDark ? 'text-[#2F241D]' : 'text-white'}`;

  if (link.subMenu) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between py-3 ${baseTextCls}`}
        >
          {link.name}
          <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${open ? 'rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pl-4 pb-2 border-l-2 border-[#C2A55D]/25 ml-1 mt-1 space-y-0.5">
            {link.subMenu.map((sub) => (
              <Link
                key={sub.name} to={sub.to} onClick={onClose}
                className={`block py-2.5 text-[12px] font-sans tracking-widest uppercase transition-colors
                  ${isActive(sub.to)
                    ? 'text-[#C2A55D] font-bold'
                    : isDark ? 'text-[#7A6650]' : 'text-gray-400'
                  }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={link.to} onClick={onClose} className={`block py-3 ${baseTextCls}`}>
      {link.name}
    </Link>
  );
};

/* ═══════════════════════════════════════════════════════════════════════ */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (isHome) {
      const t = setTimeout(() => setVisible(true), 1150);
      const onScroll = () => setScrolled(window.scrollY > 30);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
    } else {
      setVisible(true);
      setScrolled(true);
    }
  }, [isHome]);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const isDark = !isHome || scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 h-[68px] md:h-[76px] transition-all duration-700
          ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        {/* Background */}
        <div className={`absolute inset-0 transition-all duration-500
          ${isDark
            ? 'bg-[#FAF3E8]/97 backdrop-blur-md shadow-sm border-b border-[#E8DFC8]'
            : 'bg-transparent'
          }
        `} />

        <div className="relative z-10 h-full max-w-[1600px] mx-auto px-5 md:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src={bhdsLogo} alt="Bihar Heritage Logo"
              className="h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className={`font-serif font-bold text-[1.15rem] md:text-xl tracking-tight transition-colors ${isDark ? 'text-[#1C1510]' : 'text-white'}`}>
              Bihar Heritage<span className="text-[#C2A55D]">.</span>
            </span>
          </Link>

          {/* Desktop Links — right aligned */}
          <div className="hidden xl:flex items-center gap-7">
            {navLinks.map((link) => (
              <DesktopDropdown key={link.name} link={link} isActive={isActive} isDark={isDark} />
            ))}
          </div>

          {/* Hamburger — mobile / tablet */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className={`xl:hidden p-2 rounded-xl transition-colors focus:outline-none
              ${isDark ? 'text-[#2F241D] hover:bg-[#EEE5D4]' : 'text-white hover:bg-white/10'}
            `}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Drawer panel */}
      <div className={`fixed top-0 right-0 h-full w-[min(80vw,340px)] z-50 xl:hidden
        flex flex-col
        ${isDark ? 'bg-[#FAF3E8]' : 'bg-[#1C1510]'}
        shadow-2xl transition-transform duration-350 ease-in-out
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Drawer header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-[#E8DFC8]' : 'border-white/10'}`}>
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
            <img src={bhdsLogo} alt="Logo" className="h-8 w-auto object-contain" />
            <span className={`font-serif font-bold text-base tracking-tight ${isDark ? 'text-[#1C1510]' : 'text-white'}`}>
              Bihar Heritage<span className="text-[#C2A55D]">.</span>
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'text-[#5C4A35] hover:bg-[#EEE5D4]' : 'text-gray-400 hover:bg-white/10'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0.5 divide-y divide-[#C2A55D]/10">
          {navLinks.map((link) => (
            <MobileLink
              key={link.name} link={link}
              isActive={isActive} isDark={isDark}
              onClose={() => setMenuOpen(false)}
            />
          ))}
        </div>

        {/* Drawer footer */}
        <div className={`px-6 py-5 border-t ${isDark ? 'border-[#E8DFC8]' : 'border-white/10'}`}>
          <p className={`text-[11px] font-sans tracking-widest uppercase ${isDark ? 'text-[#A0907A]' : 'text-gray-500'}`}>
            Bihar Heritage Development Society
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;
