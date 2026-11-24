import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";
import heritageVideo from "../../assets/Heritage .mp4";
import heroCoverImage from "../../assets/Banners/CoverImage.webp";

// ── The single emotional tagline ────────────────────────────────────────────
const TAGLINE = "Where India's oldest stories still live.";

// ── Framer Motion Entrance Variants ────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── Floating dust float animation ──────────────────────────────────────────
const DUST_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${10 + (i * 7.7) % 80}%`,
  top: `${15 + (i * 6.3) % 70}%`,
  size: 1.5 + (i % 3) * 0.8,
  duration: 10 + i * 1.5,
  delay: i * 0.5,
}));

// ══════════════════════════════════════════════════════════════════════════════
const Hero = () => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);

  // Attach the video only after the page has loaded, so it doesn't compete
  // with the cover image and headline for bandwidth.
  useEffect(() => {
    const attach = () => setVideoSrc(heritageVideo);
    if (document.readyState === "complete") {
      attach();
      return;
    }
    window.addEventListener("load", attach, { once: true });
    return () => window.removeEventListener("load", attach);
  }, []);

  // Smoothly fade video volume
  const fadeVolume = (targetVolume, duration = 800) => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Clear any active fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const startVolume = video.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;

    if (targetVolume > 0) {
      video.muted = false;
    }

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const nextVolume = startVolume + volumeDiff * (currentStep / steps);
      video.volume = Math.max(0, Math.min(1, nextVolume));

      if (currentStep >= steps) {
        clearInterval(fadeIntervalRef.current);
        video.volume = targetVolume;
        if (targetVolume === 0) {
          video.muted = true;
        }
      }
    }, stepTime);
  };

  // Set up IntersectionObserver to detect when Hero is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 } // Trigger when at least 5% is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  // Start the video muted as soon as it can play, and reveal it only after
  // its first frame has actually been painted (so the cover image never fades
  // out onto an empty background).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;

    let cancelled = false;
    const reveal = () => {
      if (!cancelled) setVideoReady(true);
    };

    // Fires once playback has really started; wait for a painted frame before revealing
    const onPlaying = () => {
      if ("requestVideoFrameCallback" in video) {
        video.requestVideoFrameCallback(reveal);
      } else {
        reveal();
      }
    };

    // If autoplay is blocked, the cover image simply stays
    const tryPlay = () => video.play().catch(() => {});

    video.addEventListener("playing", onPlaying);

    if (video.readyState >= 3) {
      // Already buffered (e.g. cached) — start now
      tryPlay();
      if (!video.paused) onPlaying();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      cancelled = true;
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  const isInViewRef = useRef(isInView);
  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  // Dynamically fade sound and pause/play video based on user preference and visibility
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (isInView) {
      // Play the video when in view
      video.play().catch(() => {});

      if (!isMuted) {
        fadeVolume(1, 1000); // Smoothly fade in over 1 second
      } else {
        fadeVolume(0, 1000);
      }
    } else {
      // Fade volume down first, then pause the video when it's out of view
      fadeVolume(0, 800);

      // Pause the video after the fade-out completes
      const pauseTimeout = setTimeout(() => {
        if (videoRef.current && !isInViewRef.current) {
          videoRef.current.pause();
        }
      }, 800);

      return () => clearTimeout(pauseTimeout);
    }
  }, [isInView, isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Bihar Heritage Hero"
      className="relative w-full h-screen min-h-[100svh] overflow-hidden select-none flex items-center justify-start"
      style={{ background: "#1F0C02" }}
    >
      {/* Hide any native play button / controls the browser may draw over the video */}
      <style>{`
        .hero-bg-video::-webkit-media-controls,
        .hero-bg-video::-webkit-media-controls-panel,
        .hero-bg-video::-webkit-media-controls-play-button,
        .hero-bg-video::-webkit-media-controls-start-playback-button,
        .hero-bg-video::-webkit-media-controls-overlay-play-button,
        .hero-bg-video::-webkit-media-controls-enclosure {
          display: none !important;
          -webkit-appearance: none;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* ── 1. Fullscreen Cinematic Background Video + Cover Image ────────── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{ opacity: 1, scale: 1.08 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
          {/* Video element (renders underneath the cover image) */}
          <video
            ref={videoRef}
            src={videoSrc || undefined}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            preload="metadata"
            className="hero-bg-video w-full h-full object-cover pointer-events-none"
            style={{ objectPosition: "center center" }}
          />

          {/* Cover image – stays fully visible until the video's first frame is painted */}
          <img
            src={heroCoverImage}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1000ms] ease-in-out z-10"
            style={{
              objectPosition: "center center",
              opacity: videoReady ? 0 : 1,
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </div>

      {/* ── 2. Multi-gradient Premium Overlays (Warm Heritage Browns) ──────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(31,12,2,0.85) 0%, rgba(31,12,2,0.72) 32%, rgba(31,12,2,0.4) 65%, rgba(31,12,2,0.12) 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,8,1,0.52) 0%, transparent 25%, transparent 85%, rgba(31,12,2,0.45) 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 20% 50%, rgba(199,154,74,0.06) 0%, transparent 100%)",
        }}
      />

      {/* ── 3. Atmospheric Floating Dust Particles ───────────────────────── */}
      {DUST_PARTICLES.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: "rgba(199,154,74,0.22)",
            animation: `dustFloat ${particle.duration}s ${particle.delay}s ease-in-out infinite alternate`,
            zIndex: 12,
          }}
        />
      ))}

      {/* ── 4b. Elegant Floating Headings (framing the monument) ── */}
      <motion.div
        initial={{ opacity: 0, x: -160 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 3.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hero-title-wrapper-left"
      >
        <h1 className="hero-calligraphy-text-left">Bihar</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 160 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 3.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hero-title-wrapper-right"
      >
        <h2 className="hero-calligraphy-text-right">Heritage</h2>
      </motion.div>

      {/* ── 5. Main Hero Typography & Content Overlay ─────────────────────── */}
      <div
        className="relative w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center h-full z-20"
        style={{ paddingTop: "80px" }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[650px] text-left"
        >
          <div style={{ height: "clamp(6.5rem, 13vw, 11.5rem)" }} aria-hidden="true" />
          <motion.p
            variants={slideUp}
            style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
              fontSize: "clamp(0.95rem, 1.25vw, 1.1rem)",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(199,154,74,0.85)",
              margin: "0 0 0.6em 0",
            }}
          >
            Bihar’s Beauty, Beyond Time.
          </motion.p>

          <motion.p
            variants={slideUp}
            style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
              fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)",
              fontStyle: "italic",
              fontWeight: 300,
              lineHeight: 1.6,
              color: "rgba(244,228,193,0.65)",
              maxWidth: "460px",
              margin: "0 0 2.5em 0",
            }}
          >
            {TAGLINE}
          </motion.p>

          <motion.div variants={slideUp}>
            <Link
              to="/protected-sites"
              id="hero-explore-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "1rem 2.5rem",
                background: "#F4E4C1",
                color: "#1F0C02",
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.6rem, 0.8vw, 0.72rem)",
                fontWeight: 700,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                borderRadius: "999px",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                transition: "background 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease",
                whiteSpace: "nowrap",
                boxShadow: "0 0 0 0 rgba(244,228,193,0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFF8EC";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(199,154,74,0.22), 0 0 0 1px rgba(199,154,74,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#F4E4C1";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 0 0 rgba(244,228,193,0)";
              }}
            >
              Explore Heritage
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                style={{ transition: "transform 0.35s ease" }}
                className="hero-cta-arrow-icon"
              >
                <path
                  d="M2 6H10M7 2.5L10 6L7 9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── 6. Minimal Floating Scroll Indicator (Discover Bihar) ─────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: [0.3, 0.85, 0.3], y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(244,228,193,0.55)",
          }}
        >
          Discover Bihar
        </motion.span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: "#C79A4A", fontSize: "0.9rem" }}
        >
          ↓
        </motion.div>
      </div>

      {/* ── 7. Audio Mute/Unmute Toggle Button (hidden until video is ready) ── */}
      {videoReady && (
        <div className="absolute bottom-8 right-6 md:right-16 lg:right-24 z-20">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={toggleMute}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/65 border border-white/20 hover:border-[#F4E4C1] text-[#F4E4C1] transition-all duration-300 shadow-lg cursor-pointer hover:scale-105 active:scale-95"
            aria-label={isMuted ? "Unmute heritage video audio" : "Mute heritage video audio"}
            title={isMuted ? "Play Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </motion.button>
        </div>
      )}
    </section>
  );
};

export default Hero;
