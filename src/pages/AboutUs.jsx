import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, Users, Shield, Compass, Sparkles, BookOpen,
  Landmark, Search, FileText, Share2, ClipboardCheck
} from "lucide-react";

// Local image imports
import AboutImg from "../assets/AboutImg.webp";
import NalandaImg from "../assets/UniqueBiharImg/NalandaUniversity.webp";
import RajgirImg from "../assets/UniqueBiharImg/rajgir.webp";
import BodhGayaImg from "../assets/UniqueBiharImg/BodhGaya.webp";
import KesariyaImg from "../assets/UniqueBiharImg/KesariyaStupa.webp";


const MahabodhiImg = "/images/remote/n-br-39-ashokan-pillar-vaishali-2813-29-5cbc89a0.webp";
// Custom Counter Component for Smooth Count-Up Animation
const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const parsedTarget = parseInt(target.replace(/[^0-9]/g, ""), 10);

    let start = 0;
    const startTime = performance.now();

    const updateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      const current = Math.floor(easeProgress * parsedTarget);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, target, duration]);

  return (
    <span ref={nodeRef} className="font-serif font-bold text-4xl md:text-5xl text-brand-accent">
      {count}
      {target.replace(/[0-9]/g, "")}
    </span>
  );
};

export default function AboutUs() {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EC] pb-20 relative overflow-x-clip">
      {/* Decorative fine-grid background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `60px 60px`
        }}
      />

      {/* ── 1. Hero Section (Curved Bottom) ─────────────────────────────────
           The 50% horizontal radii make the two corner arcs meet at the centre, so the
           sweep runs the full width instead of flattening out a quarter of the way in. */}
      <div 
        className="relative w-full min-h-[48vh] md:min-h-[56vh] pt-16 sm:pt-20 md:pt-22 pb-8 sm:pb-10 flex flex-col justify-center overflow-hidden"
        style={{ borderBottomLeftRadius: '50% 3vw', borderBottomRightRadius: '50% 3vw' }}
      >
        <img loading="lazy" decoding="async"
          src={AboutImg}
          alt="Bihar Heritage"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75]"
        />
        {/* Left-heavy gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 mt-6 sm:mt-8 md:mt-10 flex flex-col items-start text-left space-y-5">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.1] drop-shadow-md">
            The Custodian of<br/>Bihar's Cultural Legacy
          </h1>
          <p className="text-white/90 text-[15px] md:text-base font-sans font-light max-w-xl leading-[1.85]">
            Bihar Heritage Development Society is the nodal organization committed to conserving, documenting and promoting the state's rich cultural and archaeological heritage.
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 space-y-24 mt-20 md:mt-24">
        
        {/* ── 2. About the Society (Two-Column Layout with Bento Grid) ───────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch text-left scroll-mt-24"
        >
          {/* Left Column: Bento Grid of Heritage Sites */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col h-full min-h-[420px] lg:min-h-0"
          >
            <div 
              className="grid grid-cols-12 gap-3 sm:gap-3.5 h-full w-full flex-1"
              style={{ gridTemplateRows: 'repeat(12, minmax(0, 1fr))' }}
            >
              {/* Tile 1: Peace Pagoda, Rajgir */}
              <div className="col-span-7 row-span-7 relative rounded-xl overflow-hidden border border-brand-border/60 shadow-sm bg-brand-alt/25 group">
                <img loading="lazy" decoding="async"
                  src={RajgirImg}
                  alt="Peace Pagoda, Rajgir"
                  className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-brand-gold text-[9px] font-bold uppercase tracking-[0.18em] font-sans block">
                    Heritage Stewardship
                  </span>
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-white mt-0.5 leading-tight">
                    Restoring Landscapes
                  </h4>
                </div>
              </div>

              {/* Tile 2: Nalanda University */}
              <div className="col-span-5 row-span-7 relative rounded-xl overflow-hidden border border-brand-border/60 shadow-sm bg-brand-alt/25 group">
                <img loading="lazy" decoding="async"
                  src={NalandaImg}
                  alt="Nalanda University"
                  className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-brand-gold text-[8px] font-bold uppercase tracking-[0.15em] font-sans block">
                    Ancient Wisdom
                  </span>
                  <h4 className="text-xs font-serif font-bold text-white mt-0.5 leading-tight">
                    Nalanda Ruins
                  </h4>
                </div>
              </div>

              {/* Tile 3: Kesariya Stupa */}
              <div className="col-span-5 row-span-5 relative rounded-xl overflow-hidden border border-brand-border/60 shadow-sm bg-brand-alt/25 group">
                <img loading="lazy" decoding="async"
                  src={KesariyaImg}
                  alt="Kesariya Stupa"
                  className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-brand-gold text-[8px] font-bold uppercase tracking-[0.15em] font-sans block">
                    Archaeology
                  </span>
                  <h4 className="text-xs font-serif font-bold text-white mt-0.5 leading-tight">
                    Kesariya Stupa
                  </h4>
                </div>
              </div>

              {/* Tile 4: Bodh Gaya */}
              <div className="col-span-7 row-span-5 relative rounded-xl overflow-hidden border border-brand-border/60 shadow-sm bg-brand-alt/25 group">
                <img loading="lazy" decoding="async"
                  src={BodhGayaImg}
                  alt="Bodh Gaya"
                  className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-brand-gold text-[8px] font-bold uppercase tracking-[0.15em] font-sans block">
                    World Heritage
                  </span>
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-white mt-0.5 leading-tight">
                    Bodh Gaya
                  </h4>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Profile & Minimal Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2.5">
              <motion.span variants={itemVariants} className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase block font-sans">
                Who We Are
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
                Bihar Heritage Development Society (BHDS)
              </motion.h2>
              <motion.p variants={itemVariants} className="text-text-secondary text-[15px] md:text-base font-light leading-[1.85] font-sans">
               Bihar Heritage Development Society (BHDS), functioning under the Department of Art & Culture, Government of Bihar, is a state-supported organization dedicated to the preservation, documentation, research, conservation, and promotion of Bihar's rich archaeological and cultural heritage. Through archaeological research and exploration, scientific conservation, heritage documentation, heritage awareness, and tourism-oriented initiatives, BHDS works to safeguard and promote Bihar's historical and cultural legacy for future generations.
              </motion.p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { icon: <Building2 className="w-4 h-4" />, title: "Conserve Heritage", desc: "Protecting monuments, heritage buildings, and archaeological sites" },
                { icon: <Search className="w-4 h-4" />, title: "Discover History", desc: "Surveying, excavating, documenting, and digitally mapping Bihar's archaeological treasures." },
                { icon: <Share2 className="w-4 h-4" />, title: "Promote Culture", desc: "Advancing heritage tourism, exhibitions, awareness campaigns, and cultural preservation." },
                { icon: <BookOpen className="w-4 h-4" />, title: "Research & Education", desc: "Supporting museums, publications, archives, and academic research for future generations." },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex gap-3 p-3 bg-brand-card/20 border border-brand-border/40 rounded-lg hover:border-brand-accent/30 transition-all duration-300"
                >
                  <div className="text-brand-accent p-1.5 bg-brand-alt/25 rounded-md self-start">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-text-primary">{card.title}</h4>
                    <p className="text-[13px] font-sans font-light text-text-secondary mt-1 leading-[1.7]">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 3. Vision • Mission • Objectives (3 Cards) ─────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase font-sans block">
              Core Principles
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
              Our Vision, Mission & Goals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
            {[
              { title: "Vision", desc: "To preserve, protect, and promote Bihar's rich archaeological, historical, and cultural heritage, making it a source of pride, knowledge, and sustainable development for future generations." },
              { title: "Mission", desc: "To protect, document, and promote Bihar's archaeological and cultural heritage through scientific conservation, research, education, and public engagement." },
              { title: "Objectives", desc: "To conserve heritage sites, strengthen archaeological research, and create accessible knowledge through documentation and museums." },
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-brand-card/25 border border-brand-border/60 hover:border-brand-accent/40 rounded-xl p-5 hover:-translate-y-1 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase block">Pillar 0{index + 1}</span>
                  <h3 className="text-lg font-serif font-bold text-text-primary">{card.title}</h3>
                  <p className="text-[13px] md:text-sm font-sans text-text-secondary leading-[1.75] font-light">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 4. What We Do (6 Grid Cards with subtle hover overlay effects) ──── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <div className="text-left border-b border-brand-border/60 pb-3">
            <span className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase font-sans">
              Areas of Operation
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
              What We Do
            </h2>
            <p className="text-text-secondary text-[15px] md:text-base font-light leading-[1.85] mt-1 font-sans">
              A comprehensive overview of our field work, digital mapping, and community outreach programs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 text-left">
            {[
              { icon: <Building2 className="w-5 h-5" />, title: "Conservation Projects", desc: "Structural protection and maintenance of state monuments." },
              { icon: <Landmark className="w-5 h-5" />, title: "Monument Restoration", desc: "Scientific chemical and civil restoration of heritage assets." },
              { icon: <Search className="w-5 h-5" />, title: "Archaeological Research", desc: "Conducting field explorations and surveying historic mounds." },
              { icon: <FileText className="w-5 h-5" />, title: "Digital Documentation", desc: "Building GIS-based directories and high-resolution imaging archives." },
              { icon: <Share2 className="w-5 h-5" />, title: "Cultural Outreach", desc: "Organizing public heritage walks, exhibitions, and lectures." },
              { icon: <Compass className="w-5 h-5" />, title: "Heritage Tourism Support", desc: "Fostering tourist resources and publication of heritage guides." },
            ].map((work, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#FFFDF9]/60 hover:bg-[#FAF5EC]/90 border border-brand-border/50 hover:border-brand-accent/40 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="space-y-3 relative z-10">
                  <div className="text-brand-accent p-2 bg-brand-alt/20 rounded-lg inline-block">
                    {work.icon}
                  </div>
                  <h3 className="font-serif font-bold text-sm md:text-base text-text-primary">{work.title}</h3>
                  <p className="text-[13px] md:text-sm font-sans text-text-secondary leading-[1.75] font-light">{work.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 5. Society Impact (Counters) ───────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-brand-alt/25 border border-brand-border/60 rounded-xl p-6 text-center"
        >
          {[
            { target: "132+", label: "Protected Heritage Sites" },
            { target: "2", label: "UNESCO World Heritage Sites" },
            { target: "71+", label: "Monuments under ASI" },
            { target: "4+", label: "Other Significant Sites" },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="space-y-1">
              <div>
                <Counter target={stat.target} />
              </div>
              <p className="text-[10px] md:text-xs text-text-secondary font-sans font-light tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── 6. Organizational Structure (Modern Connected Flow) ─────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase font-sans block">
              Organizational Hierarchy
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
              Structure of BHDS
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 my-8 text-left">
            {/* Top Node */}
            <motion.div variants={itemVariants} className="bg-[#FAF5EC] border border-[#D5C3A5] px-6 py-2.5 rounded-lg shadow-sm text-center">
              <span className="text-[9px] font-sans font-bold text-brand-accent uppercase tracking-widest block mb-0.5">Patron Organization</span>
              <span className="font-serif font-bold text-text-primary text-sm">Government of Bihar</span>
            </motion.div>

            {/* Connecting Line */}
            <div className="w-[1.5px] h-6 bg-[#D5C3A5]" />

            {/* Middle Node */}
            <motion.div variants={itemVariants} className="bg-[#FFFDF9] border-2 border-brand-accent px-8 py-3.5 rounded-xl shadow-sm text-center max-w-xs md:max-w-md">
              <span className="text-[9px] font-sans font-bold text-brand-accent uppercase tracking-widest block mb-0.5">Apex Implementation Body</span>
              <span className="font-serif font-black text-brand-accent text-base">Bihar Heritage Development Society</span>
            </motion.div>

            {/* Connecting Line */}
            <div className="w-[1.5px] h-6 bg-[#D5C3A5]" />

            {/* Branch Line for Desktop Layout */}
            <div className="hidden lg:block w-[75%] h-[1.5px] bg-[#D5C3A5] relative">
              <div className="absolute left-0 top-0 w-[1.5px] h-4 bg-[#D5C3A5] -translate-x-1/2" />
              <div className="absolute left-[33%] top-0 w-[1.5px] h-4 bg-[#D5C3A5] -translate-x-1/2" />
              <div className="absolute left-[66%] top-0 w-[1.5px] h-4 bg-[#D5C3A5] -translate-x-1/2" />
              <div className="absolute right-0 top-0 w-[1.5px] h-4 bg-[#D5C3A5] translate-x-1/2" />
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-4 lg:pt-0">
              {[
                { title: "Conservation", desc: "Structural repairs, chemical conservation, and site upkeep." },
                { title: "Research & Survey", desc: "Scientific explorations, archive mapping, and cataloging relics." },
                { title: "Public Outreach", desc: "Heritage walks, school programs, exhibitions, and publications." },
                { title: "Administration", desc: "Operational supervision, treasury controls, and policy sync." },
              ].map((dept, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-[#FFFDF9] border border-[#E8DFC8] rounded-xl p-4 text-center shadow-2xs hover:border-brand-accent/50 transition-colors duration-250"
                >
                  <h4 className="font-serif font-bold text-text-primary text-sm mb-1">{dept.title}</h4>
                  <p className="text-xs font-sans text-text-secondary leading-[1.7] font-light">{dept.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 7. Our Work Process (Horizontal Timeline) ───────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-brand-accent text-xs font-bold tracking-[0.2em] uppercase font-sans block">
              Methodology
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
              Our Work Process
            </h2>
          </div>

          <div className="relative w-full overflow-x-auto no-scrollbar py-6 text-left">
            <div className="flex items-start justify-between min-w-[900px] relative px-4">
              {/* Timeline Connecting Line */}
              <div className="absolute top-[28px] left-[50px] right-[50px] h-[1.5px] bg-[#D5C3A5]/60 z-0" />

              {[
                { icon: <Search className="w-5 h-5" />, title: "1. Identify Assets", desc: "Systematically locating historic structures." },
                { icon: <FileText className="w-5 h-5" />, title: "2. Documentation", desc: "Gathering mapping coords, photos, and records." },
                { icon: <ClipboardCheck className="w-5 h-5" />, title: "3. Conservation Planning", desc: "Designing restoration blueprints." },
                { icon: <Landmark className="w-5 h-5" />, title: "4. Restoration", desc: "Executing structural conservation with traditional skills." },
                { icon: <Share2 className="w-5 h-5" />, title: "5. Public Engagement", desc: "Promoting community pride and tourist awareness." },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center w-[160px] relative z-10"
                >
                  <div className="w-14 h-14 rounded-full bg-[#FFFDF9] border-2 border-brand-accent flex items-center justify-center shadow-xs text-brand-accent hover:scale-105 transition-all duration-300">
                    {step.icon}
                  </div>
                  <h4 className="font-serif font-bold text-[13px] text-text-primary mt-3 mb-1">{step.title}</h4>
                  <p className="text-[11px] font-sans text-text-secondary leading-[1.6] px-1 font-light">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 8. Final Call to Action ─────────────────────────────────── */}
        

      </div>
    </div>
  );
}
