import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, Compass, Sparkles } from "lucide-react";

// Local image imports for guaranteed rendering
import BodhGayaImg from "../../assets/UniqueBiharImg/BodhGaya.webp";
import NalandaImg from "../../assets/UniqueBiharImg/NalandaUniversity.webp";
import RohtasImg from "../../assets/UniqueBiharImg/RohtasFort.webp";
import VikramshilaImg from "../../assets/UniqueBiharImg/VIKRAMSHILA_UNIVERSITY.webp";
import JalMandirImg from "../../assets/GalleryImg/JalMandir.webp";
import KesariyaImg from "../../assets/UniqueBiharImg/KesariyaStupa.webp";
import PatnaSahibImg from "../../assets/UniqueBiharImg/PatnaSahib.webp";

// 6 Popular Heritage sites for the auto-slideshow
const slideshowSites = [
  {
    src: BodhGayaImg,
    title: "Mahabodhi Temple",
    location: "Bodh Gaya, Gaya",
    coords: "24.6961° N, 84.9913° E",
    tag: "Sacred Ground"
  },
  {
    src: NalandaImg,
    title: "Nalanda Mahavihara",
    location: "Nalanda, Bihar",
    coords: "25.1378° N, 85.4439° E",
    tag: "Seat of Wisdom"
  },
  {
    src: RohtasImg,
    title: "Rohtasgarh Fort",
    location: "Rohtas Hills",
    coords: "24.6300° N, 83.9100° E",
    tag: "Hilltop Citadel"
  },
  {
    src: JalMandirImg,
    title: "Jal Mandir",
    location: "Pawapuri, Nalanda",
    coords: "25.0784° N, 85.5539° E",
    tag: "Lotus Lake Sanctuary"
  },
  {
    src: KesariyaImg,
    title: "Kesariya Stupa",
    location: "East Champaran",
    coords: "26.3986° N, 84.8698° E",
    tag: "Ancient Monument"
  },
  {
    src: PatnaSahibImg,
    title: "Patna Sahib",
    location: "Patna City",
    coords: "25.6111° N, 85.2283° E",
    tag: "Holy Takht"
  }
];

// Cinematic center-to-front zoom-in transition variants
const slideVariants = {
  enter: {
    scale: 0.8,
    opacity: 0,
  },
  center: {
    scale: 1,
    opacity: 1,
    transition: {
      scale: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.9, ease: "easeInOut" },
    },
  },
  exit: {
    scale: 1.25,
    opacity: 0,
    transition: {
      scale: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.7, ease: "easeInOut" },
    },
  },
};

const AboutBiharHeritage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef(null);

  // Typewriter effect state triggered on scroll
  const fullText = "A Land that Shaped the Human Spirit";
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  // Trigger typing animation when text rolls into view
  const startTypingAnimation = () => {
    if (hasTyped || isTyping) return;
    setIsTyping(true);
    setHasTyped(true);
    let currentIdx = 0;
    setTypedText("");

    const interval = setInterval(() => {
      currentIdx++;
      setTypedText(fullText.slice(0, currentIdx));
      if (currentIdx >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 45); // 45ms per character for professional pace
  };

  // Auto-slideshow effect: changes slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideshowSites.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Scroll-driven animation controls
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Left column text parallax
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Right column image scroll-driven parallax, scaling, and rotation
  const imageTranslateY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.01, 0.99]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-4, 0, 3]);

  // Framer Motion staggered children variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const currentSlide = slideshowSites[activeSlide];

  return (
    <section 
      ref={containerRef}
      className="relative py-28 px-6 md:px-12 lg:px-20 bg-brand-dark border-t border-brand-border overflow-hidden"
    >
      {/* Decorative Warm Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(var(--color-brand-accent) 1px, transparent 0), linear-gradient(to right, var(--color-brand-border) 1px, transparent 1px)`,
          backgroundSize: `30px 30px, 90px 90px`
        }} 
      />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Short Storytelling Text */}
        <motion.div 
          style={{ y: textY }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:col-span-6 flex flex-col text-left justify-center"
        >
          {/* Heart Beat Indicator */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4 text-brand-accent">
            <Heart size={14} className="fill-brand-accent animate-pulse" />
            <span className="text-xs font-sans font-bold uppercase tracking-[0.25em]">
              The Story of Us
            </span>
          </motion.div>

          {/* Title with Typing Animation triggered on scroll viewport entry */}
          <motion.h2 
            variants={itemVariants}
            onViewportEnter={startTypingAnimation}
            viewport={{ once: true, margin: "-100px" }}
            className="relative text-4xl md:text-5xl font-serif font-bold text-text-primary leading-tight tracking-tight mb-6 select-none"
          >
            {/* Invisible placeholder to maintain layout flow and prevent layout shift */}
            <span className="invisible block">{fullText}</span>
            {/* Animated absolute typed layer */}
            <span className="absolute top-0 left-0">
              {typedText}
              {isTyping && <span className="inline-block animate-pulse text-brand-accent ml-0.5 font-sans">|</span>}
            </span>
          </motion.h2>

          {/* Simple and emotional storytelling text */}
          <motion.div variants={itemVariants} className="space-y-5 text-text-secondary text-sm md:text-base font-sans font-light leading-relaxed">
            <p>
              Bihar is where the spiritual search of humanity found its home. Under the Bodhi tree, Siddhartha found enlightenment. Along the paths of Vaishali, Mahavira taught the beauty of living gently. From the ancient classrooms of Nalanda, wisdom flowed out to light up the world.
            </p>
            <p>
              Here, history is not locked in text books—it lives in every sacred stone, every red brick, and the brushstrokes of Madhubani art. It is the story of searchers, teachers, and a culture of warmth.
            </p>
          </motion.div>

          {/* Visual indicator of what site is actively featured */}
          <motion.div 
            variants={itemVariants}
            className="mt-6 p-4 rounded-2xl bg-white/40 border border-brand-border/60 backdrop-blur-sm max-w-sm flex items-center gap-3.5"
          >
            <Compass size={18} className="text-brand-accent animate-spin-slow flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-text-muted font-sans font-semibold">
                Now Showing
              </span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={currentSlide.title}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-serif font-bold text-text-primary mt-0.5"
                >
                  {currentSlide.title} ({currentSlide.location})
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Dynamic Auto Slideshow Panel with Scroll Animation */}
        <div 
          className="lg:col-span-6 relative w-full flex flex-col items-center justify-center"
        >
          {/* Main Slideshow Frame with Interactive Scroll Parallax, Scale, and Tilt */}
          <motion.div 
            style={{ 
              y: imageTranslateY, 
              scale: imageScale, 
              rotate: imageRotate 
            }}
            transition={{ ease: "easeOut" }}
            className="relative w-full aspect-[16/11] md:aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl border border-brand-border/60 bg-brand-alt/20 z-10"
          >
            
            <AnimatePresence>
              <motion.img 
                key={activeSlide}
                src={currentSlide.src} 
                alt={currentSlide.title} 
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88]"
              />
            </AnimatePresence>

            {/* Gradient shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

            {/* Interactive tag badge on image */}
            <div className="absolute top-4 left-4 z-20 bg-brand-accent/90 backdrop-blur-sm rounded px-3 py-1 flex items-center gap-1.5 shadow-sm">
              <Sparkles size={11} className="text-white" />
              <AnimatePresence mode="wait">
                <motion.span 
                  key={currentSlide.tag}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[9px] font-sans font-bold tracking-widest text-white uppercase"
                >
                  {currentSlide.tag}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Dynamic GPS coordinate stamp overlay */}
            <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-2 flex flex-col text-right">
              <span className="text-[8px] font-sans font-bold text-brand-gold uppercase tracking-widest">
                GPS Position
              </span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={currentSlide.coords}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="text-[10px] font-mono font-medium text-white/95 mt-0.5"
                >
                  {currentSlide.coords}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Slide Progress Dot Indicators */}
            <div className="absolute bottom-4 left-4 z-20 flex gap-1.5 items-center">
              {slideshowSites.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? "w-4 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

          </motion.div>

          {/* Editorial Frame Border Shadow */}
          <motion.div 
            style={{ 
              y: imageTranslateY, 
              scale: imageScale, 
              rotate: imageRotate 
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[102%] h-[102%] border border-brand-border/40 rounded-[2.7rem] pointer-events-none -z-10" 
          />
        </div>

      </div>
    </section>
  );
};

export default AboutBiharHeritage;
