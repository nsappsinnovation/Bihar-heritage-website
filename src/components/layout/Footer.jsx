import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bgImg from "../../assets/HeroStrips/BG.webp";
import madhubaniImg from "../../assets/HeroStrips/Madhubani.webp";

gsap.registerPlugin(ScrollTrigger);

// ── Data ─────────────────────────────────────────────────────────────────────
const EXPLORE_LINKS = [
  { label: "Protected Sites", to: "/protected-sites" },
  { label: "Excavation & Exploration", to: "/excavations" },
  { label: "Living Heritage", to: "/living-heritage" },
  { label: "Gallery", to: "/GalleryPage" },
  { label: "Publications", to: "/publication" },
];
const SOCIAL = [
  {
    id: "facebook",
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },

  {
    id: "twitter",
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M4 4l16 16M4 20L20 4" />
      </svg>
    ),
  },
];

// ── Dust particles (static memoised) ────────────────────────────────────────
const rand = (a, b) => Math.random() * (b - a) + a;
const DUST = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${rand(3, 97)}%`,
  top: `${rand(5, 95)}%`,
  size: rand(1.2, 3),
  delay: rand(0, 10),
  dur: rand(8, 20),
  op: rand(0.05, 0.15),
}));

const BIRDS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  top: rand(4, 22),
  left: rand(5, 90),
  scale: rand(0.5, 1.0),
}));

// ═════════════════════════════════════════════════════════════════════════════
const Footer = () => {
  const footerRef = useRef(null);
  const headingRef = useRef(null);
  const dividerRef = useRef(null);
  const sublineRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const col4Ref = useRef(null);
  const bottomRef = useRef(null);

  // ── GSAP scroll-triggered entrance ─────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([headingRef.current, sublineRef.current], { opacity: 0, y: 40 });
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "center" });
      gsap.set([col1Ref.current, col2Ref.current, col3Ref.current, col4Ref.current], { opacity: 0, y: 30 });
      gsap.set(bottomRef.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 88%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(headingRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0)
        .to(sublineRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.25)
        .to(dividerRef.current, { scaleX: 1, duration: 1.0, ease: "power2.inOut" }, 0.4)
        .to(col1Ref.current, { opacity: 1, y: 0, duration: 0.8 }, 0.6)
        .to(col2Ref.current, { opacity: 1, y: 0, duration: 0.8 }, 0.75)
        .to(col3Ref.current, { opacity: 1, y: 0, duration: 0.8 }, 0.9)
        .to(col4Ref.current, { opacity: 1, y: 0, duration: 0.8 }, 1.05)
        .to(bottomRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.3);
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{ background: "#2C1608" }}
    >
      {/* ── Terracotta background image ──────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})`, opacity: 0.30 }}
      />

      {/* ── Madhubani art wash ───────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${madhubaniImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.09,
          mixBlendMode: "luminosity",
        }}
      />

      {/* ── Paper grain texture ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      {/* ── Vignette ──────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(15,5,2,0.6) 100%)",
        }}
      />

      {/* ── Faint Mahabodhi Temple silhouette (right side) ─────────── */}
      <div className="absolute bottom-0 right-0 w-72 h-80 pointer-events-none opacity-[0.04]">
        <svg viewBox="0 0 200 280" className="w-full h-full" fill="#D6B26D">
          {/* Simplified temple spire */}
          <rect x="85" y="20" width="30" height="180" rx="2" />
          <polygon points="85,20 100,2 115,20" />
          <rect x="75" y="120" width="50" height="8" rx="1" />
          <rect x="65" y="135" width="70" height="8" rx="1" />
          <rect x="55" y="150" width="90" height="10" rx="1" />
          <rect x="45" y="165" width="110" height="10" rx="1" />
          <rect x="35" y="180" width="130" height="10" rx="1" />
          <rect x="25" y="196" width="150" height="12" rx="1" />
          <rect x="15" y="210" width="170" height="12" rx="1" />
          <rect x="5" y="225" width="190" height="55" rx="2" />
        </svg>
      </div>

      {/* ── Bodhi Tree silhouette (left, faint) ─────────────────────── */}
      <div className="absolute bottom-0 left-0 w-48 h-56 pointer-events-none opacity-[0.05]">
        <svg viewBox="0 0 160 220" className="w-full h-full" fill="#D6B26D">
          <rect x="73" y="110" width="14" height="110" rx="4" />
          <ellipse cx="80" cy="90" rx="55" ry="70" />
          <ellipse cx="45" cy="110" rx="30" ry="40" />
          <ellipse cx="115" cy="110" rx="30" ry="40" />
        </svg>
      </div>

      {/* ── Lotus corner ornaments ────────────────────────────────────── */}
      {/* Top-left */}
      <svg viewBox="0 0 80 80" className="absolute top-4 left-4 w-10 h-10 opacity-20 pointer-events-none" fill="none">
        <g stroke="#D6B26D" strokeWidth="1">
          {[0, 45, 90, 135, 180, 225, 270, 315].map(d => (
            <ellipse key={d} cx="40" cy="40" rx="6" ry="15" transform={`rotate(${d} 40 40)`} opacity="0.7" />
          ))}
          <circle cx="40" cy="40" r="4" fill="rgba(214,178,109,0.2)" />
        </g>
      </svg>
      {/* Top-right */}
      <svg viewBox="0 0 80 80" className="absolute top-4 right-4 w-10 h-10 opacity-20 pointer-events-none" fill="none">
        <g stroke="#D6B26D" strokeWidth="1">
          {[0, 45, 90, 135, 180, 225, 270, 315].map(d => (
            <ellipse key={d} cx="40" cy="40" rx="6" ry="15" transform={`rotate(${d} 40 40)`} opacity="0.7" />
          ))}
          <circle cx="40" cy="40" r="4" fill="rgba(214,178,109,0.2)" />
        </g>
      </svg>
      {/* Bottom-left */}
      <svg viewBox="0 0 80 80" className="absolute bottom-4 left-4 w-10 h-10 opacity-20 pointer-events-none" fill="none">
        <g stroke="#D6B26D" strokeWidth="1">
          {[0, 45, 90, 135, 180, 225, 270, 315].map(d => (
            <ellipse key={d} cx="40" cy="40" rx="6" ry="15" transform={`rotate(${d} 40 40)`} opacity="0.7" />
          ))}
          <circle cx="40" cy="40" r="4" fill="rgba(214,178,109,0.2)" />
        </g>
      </svg>
      {/* Bottom-right */}
      <svg viewBox="0 0 80 80" className="absolute bottom-4 right-4 w-10 h-10 opacity-20 pointer-events-none" fill="none">
        <g stroke="#D6B26D" strokeWidth="1">
          {[0, 45, 90, 135, 180, 225, 270, 315].map(d => (
            <ellipse key={d} cx="40" cy="40" rx="6" ry="15" transform={`rotate(${d} 40 40)`} opacity="0.7" />
          ))}
          <circle cx="40" cy="40" r="4" fill="rgba(214,178,109,0.2)" />
        </g>
      </svg>

      {/* ── Antique gold outer border ─────────────────────────────────── */}
      <div
        className="absolute inset-3 pointer-events-none"
        style={{ border: "1px solid rgba(214,178,109,0.15)" }}
      />

      {/* ── Birds ────────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-32 pointer-events-none">
        {BIRDS.map(b => (
          <svg key={b.id} viewBox="0 0 40 20" className="absolute" aria-hidden
            style={{ top: `${b.top}px`, left: `${b.left}%`, width: `${20 * b.scale}px`, opacity: 0.18 }}>
            <path d="M2 10 Q10 2 20 10 Q30 2 38 10" stroke="#D6B26D" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        ))}
      </div>

      {/* ── Dust particles ────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {DUST.map(d => (
          <span key={d.id} className="absolute rounded-full" style={{
            left: d.left, top: d.top,
            width: `${d.size}px`, height: `${d.size}px`,
            background: "rgba(214,178,109,0.6)",
            opacity: d.op,
            animation: `dustFloat ${d.dur}s ${d.delay}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CONTENT
      ════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-16 pb-8">

        {/* ── TOP HEADING ──────────────────────────────────────────────── */}
        <div className="text-center mb-2">
          <h2
            ref={headingRef}
            className="font-['Cinzel','Playfair_Display',serif] font-bold tracking-[0.12em] leading-none"
            style={{
              fontSize: "clamp(1.2rem, 4.2vw, 2rem)",
              color: "#F3E8D4",
              textShadow: "0 0 50px rgba(214,178,109,0.3), 0 3px 16px rgba(0,0,0,0.7)",
              WebkitTextStroke: "0.5px rgba(214,178,109,0.6)",
            }}
          >
            BIHAR HERITAGE
          </h2>

          <p
            ref={sublineRef}
            className="mt-4 font-['Playfair_Display',serif] tracking-[0.3em] uppercase text-sm"
            style={{ color: "rgba(243,232,212,0.6)", letterSpacing: "0.28em" }}
          >
            Ancient Wisdom &nbsp;•&nbsp; Living Culture &nbsp;•&nbsp; Timeless Legacy
          </p>

          {/* Antique gold divider */}
          <div className="flex items-center justify-center mt-6 mb-12">
            <div
              ref={dividerRef}
              style={{
                width: "clamp(120px, 20vw, 280px)",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(214,178,109,0.7) 30%, rgba(214,178,109,0.7) 70%, transparent)",
              }}
            />
          </div>
        </div>

        {/* ── MAIN 4-COLUMN GRID ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* COL 1 — About */}
          <div ref={col1Ref}>
            <h3 className="footer-col-heading">About</h3>
            <div className="footer-col-rule" />
            <p className="footer-body-text mt-4 leading-relaxed">
              The Bihar Heritage Development Society preserves, promotes and celebrates Bihar's rich architectural, cultural, artistic and spiritual legacy.
            </p>
            <a href="/about" className="footer-link-arrow mt-5 inline-flex items-center gap-2 group">
              <span>Learn More</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* COL 2 — Explore */}
          <div ref={col2Ref}>
            <h3 className="footer-col-heading">Explore</h3>
            <div className="footer-col-rule" />
            <ul className="mt-4 space-y-3">
              {EXPLORE_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer-nav-link">
                    <span className="footer-nav-link-text">{label}</span>
                    <span className="footer-nav-link-underline" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — Contact */}
          <div ref={col3Ref}>
            <h3 className="footer-col-heading">Contact</h3>
            <div className="footer-col-rule" />
            <ul className="mt-4 space-y-4">
              <li className="footer-contact-item">
                <span>Patna Museum Campus, Off Buddha Marg,<br />Patna – 800 001</span>
              </li>
              <li className="footer-contact-item">
                <a href="tel:06122508445" className="hover:text-[#D6B26D] transition-colors duration-300">0612-2508445</a>
              </li>
              <li className="footer-contact-item">
                <a href="mailto:heritageofbihar@gmail.com" className="hover:text-[#D6B26D] transition-colors duration-300 break-all">heritageofbihar@gmail.com</a>
              </li>
              <li className="footer-contact-item">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=25.6137830%2C85.1337950"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link-arrow group inline-flex items-center gap-1"
                >
                  <span>Get Directions</span>
                </a>
              </li>
            </ul>
          </div>

          {/* COL 4 — Stay Connected */}
          <div ref={col4Ref}>
            <h3 className="footer-col-heading">Stay Connected</h3>
            <div className="footer-col-rule" />
            <ul className="mt-5 space-y-3">
              {SOCIAL.map(({ id, label, href, icon }) => (
                <li key={id}>
                  <a
                    href={href}
                    id={`footer-social-${id}`}
                    aria-label={label}
                    className="footer-social-btn group"
                  >
                    <span className="footer-social-icon">{icon}</span>
                    <span className="footer-social-label">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── BOTTOM BAR ──────────────────────────────────────────────── */}
        <div ref={bottomRef}>
          {/* Thin divider */}
          <div
            className="my-10"
            style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(214,178,109,0.4) 20%, rgba(214,178,109,0.4) 80%, transparent)" }}
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            {/* Left — copyright */}
            <p className="footer-small-text">
              © {new Date().getFullYear()} Bihar Heritage Development Society
            </p>

            {/* Center — dedication */}
            <p className="footer-small-text italic" style={{ color: "rgba(243,232,212,0.45)" }}>
              Made with dedication to preserving Bihar's heritage.
            </p>

            {/* Right — crafted by */}
            <div className="flex flex-col items-center md:items-end gap-0.5">
              <span
                className="text-[9px] tracking-[0.35em] uppercase font-['Poppins',sans-serif]"
                style={{ color: "rgba(243,232,212,0.45)" }}
              >
                Crafted By
              </span>
              <a
                href="https://nsappsinnovation.com"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-crafted-by"
                className="footer-crafted-link group"
              >
                Ns Apps Innovations (A Product of Startup Bihar)
                <span className="footer-crafted-underline" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
