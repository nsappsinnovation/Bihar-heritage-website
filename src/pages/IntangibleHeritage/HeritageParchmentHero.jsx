import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import heroImg1 from '../../assets/Hero Living heritage/Image1.webp';
import heroImg2 from '../../assets/Hero Living heritage/image.webp';
import heroImg3 from '../../assets/Hero Living heritage/image2.webp';
import heroImg4 from '../../assets/Hero Living heritage/image copy.webp';

const HERO_IMAGES = [heroImg1, heroImg2, heroImg3, heroImg4];
const SLIDE_INTERVAL = 5000;

const HeritageParchmentHero = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
      aria-label="Living Heritage of Bihar Hero"
    >
      {/* ── Framer Motion crossfade slideshow ─────────────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${HERO_IMAGES[currentIdx]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
          aria-hidden="true"
        />
      </AnimatePresence>

      {/* ── Brown tint overlay ────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(62,32,12,0.60) 0%, rgba(44,20,6,0.50) 50%, rgba(30,12,4,0.72) 100%)',
          zIndex: 1,
        }}
      />

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto w-full">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className="h-px w-10 md:w-16" style={{ background: 'rgba(196,154,82,0.55)' }} />
          <span className="text-[10px] font-sans font-bold tracking-[0.32em] uppercase" style={{ color: 'rgba(244,228,193,0.8)' }}>
            Bihar Heritage Development Society
          </span>
          <span className="h-px w-10 md:w-16" style={{ background: 'rgba(196,154,82,0.55)' }} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif font-bold leading-[1.05] mb-6"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
            color: '#F9F0E0',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 32px rgba(0,0,0,0.5)',
          }}
        >
          THE LIVING<br />HERITAGE OF BIHAR
        </motion.h1>

        {/* Thin gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mx-auto mb-6"
          style={{ width: 48, height: 1.5, background: 'rgba(196,154,82,0.7)', borderRadius: 99 }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="font-serif italic leading-relaxed max-w-md mx-auto"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.35rem)',
            color: 'rgba(244,228,193,0.82)',
            fontWeight: 300,
            textShadow: '0 1px 12px rgba(0,0,0,0.4)',
          }}
        >
          Traditions, stories and artistic expressions<br />passed from one generation to the next.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#heritage-explorer"
            className="lh-cta-btn group inline-flex items-center gap-3"
          >
            <span>Explore Heritage</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <Link
            to="/"
            className="text-[11px] font-sans tracking-[0.22em] uppercase transition-opacity duration-300 hover:opacity-100"
            style={{ color: 'rgba(244,228,193,0.55)' }}
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>

      {/* ── Slide indicator dots ──────────────────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ zIndex: 10 }}>
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            aria-label={`Slide ${idx + 1}`}
            style={{
              width: idx === currentIdx ? 28 : 8,
              height: 8,
              borderRadius: 999,
              background: idx === currentIdx ? 'rgba(196,154,82,0.95)' : 'rgba(255,255,255,0.35)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.45s ease',
            }}
          />
        ))}
      </div>

      {/* ── Scroll hint ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 right-8 flex flex-col items-center gap-1.5"
        style={{ zIndex: 10 }}
      >
        <div className="w-px h-9" style={{ background: 'linear-gradient(to bottom, rgba(196,154,82,0.8), transparent)' }} />
        <span className="text-[9px] tracking-[0.3em] uppercase font-sans" style={{ color: 'rgba(244,228,193,0.7)' }}>Scroll</span>
      </motion.div>
    </section>
  );
};

export default HeritageParchmentHero;
