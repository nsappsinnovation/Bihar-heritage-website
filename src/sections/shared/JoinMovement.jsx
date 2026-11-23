import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MapPin, BookOpen, Check, ArrowRight } from "lucide-react";
import JoinMovementForm from "./JoinMovementForm";
import NalandaUniversity from "../../assets/UniqueBiharImg/NalandaUniversity.webp";
import KesariyaStupa from "../../assets/UniqueBiharImg/KesariyaStupa.webp";
import VikramshilaUniversity from "../../assets/UniqueBiharImg/VIKRAMSHILA_UNIVERSITY.webp";
import MahabodhiTemple from "../../assets/UniqueBiharImg/MahabodhiTemple.webp";
import MadhubaniBG from "../../assets/MadhubaniBG.webp";

const cardImages = [
  NalandaUniversity,     // Become a Volunteer
  KesariyaStupa,         // Report a Site
  VikramshilaUniversity, // Educate & Awareness (Ancient Vikramshila University of Bihar)
];

const JoinMovement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const handleActionClick = (actionType) => {
    setSelectedAction(actionType);
    setIsFormOpen(true);
  };

  const actions = [
    {
      num: "01",
      title: "Become a Volunteer",
      description: "Contribute your time to preserve Bihar's rich history and culture.",
      icon: <Users className="w-5 h-5" />,
      actionType: "volunteer",
      img: cardImages[0],
      benefits: [
        "Participate in local cleanliness & restoration drives",
        "Guide visitors and lead cultural heritage walks",
        "Receive specialized training & official certification"
      ],
      ctaText: "Volunteer Now"
    },
    {
      num: "02",
      title: "Report a Site",
      description: "Help us identify, catalog, and protect neglected heritage sites.",
      icon: <MapPin className="w-5 h-5" />,
      actionType: "report",
      img: cardImages[1],
      benefits: [
        "Submit photos and GPS locations of neglected monuments",
        "Collaborate with archaeological experts for evaluations",
        "Track restoration work progress in real-time"
      ],
      ctaText: "Submit Report"
    },
    {
      num: "03",
      title: "Educate & Awareness",
      description: "Inspire others to value and conserve our shared regional history.",
      icon: <BookOpen className="w-5 h-5" />,
      actionType: "educate",
      img: cardImages[2],
      benefits: [
        "Access curated historical teaching resources",
        "Organize local heritage seminars & school events",
        "Distribute digital awareness kits & reading material"
      ],
      ctaText: "Join Campaign"
    },
  ];

  return (
    <section
      className="relative py-12 sm:py-16 px-6 md:px-12 lg:px-20 border-t border-brand-border/60 overflow-hidden"
      style={{ backgroundColor: '#E4D6BC' }}
    >


      {/* Warm parchment backdrop overlay for high legibility */}
      <div className="absolute inset-0 bg-[#F8F5F0] opacity-55 pointer-events-none" />
      {/* Editorial Decorative Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--color-brand-accent) 1px, transparent 0), linear-gradient(to right, var(--color-brand-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-border) 1px, transparent 1px)`,
          backgroundSize: `40px 40px, 120px 120px, 120px 120px`
        }}
      />

      {/* Decorative ambient glowing backdrops for premium feel */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-gold/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header - Left-Aligned Editorial Minimalist Style */}
        <div className="w-full pb-6 border-b border-brand-border/60 mb-8 sm:mb-10 text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-accent text-xs font-bold tracking-[0.25em] uppercase mb-2.5 inline-block font-sans">
              Preservation Initiatives
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-primary mb-3 leading-tight">
              Join the Preservation Movement
            </h2>
            <p className="text-text-primary/90 text-sm md:text-base font-medium font-sans leading-relaxed">
              Become a custodian of Bihar's rich heritage. Explore our primary engagement channels to actively restore, document, and celebrate our eternal culture.
            </p>
          </div>
          <div className="hidden md:block font-serif text-brand-accent font-semibold italic text-sm max-w-xs text-right mb-1">
            &quot;To preserve heritage is to secure our wisdom for future generations.&quot;
          </div>
        </div>

        {/* Tab-Based Premium Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          {/* Left Column: Executive Minimalist Tab List (Span 4) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-border/60">
              <span className="text-[10px] font-sans font-bold text-brand-accent uppercase tracking-[0.25em]">
                Engagement Channels
              </span>
              <span className="text-[10px] font-mono text-text-muted font-semibold">
                01 — {String(actions.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-col justify-start flex-grow gap-2.5">
              {actions.map((action, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`relative w-full flex items-center justify-between px-5 py-4 rounded-xl text-left border transition-all duration-300 group cursor-pointer ${isActive
                        ? "bg-white border-brand-accent/50 shadow-sm translate-x-1"
                        : "bg-white/60 border-brand-border/40 hover:bg-white/95 hover:border-brand-border/80 backdrop-blur-xs hover:translate-x-0.5"
                      }`}
                  >
                    {/* Active Accent Pill on Left */}
                    <div
                      className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all duration-300 ${isActive
                          ? "bg-brand-accent opacity-100"
                          : "bg-transparent opacity-0 group-hover:bg-brand-accent/40 group-hover:opacity-100"
                        }`}
                    />

                    <div className="flex items-center gap-4 pl-1">
                      {/* Number Stamp */}
                      <span
                        className={`text-xs font-mono font-bold tracking-wider transition-colors duration-300 ${isActive ? "text-brand-accent" : "text-text-muted group-hover:text-brand-accent"
                          }`}
                      >
                        {action.num}
                      </span>

                      {/* Title */}
                      <span
                        className={`text-sm sm:text-base font-serif font-bold tracking-tight transition-colors duration-300 ${isActive ? "text-text-primary font-bold" : "text-text-secondary group-hover:text-text-primary"
                          }`}
                      >
                        {action.title}
                      </span>
                    </div>

                    {/* Minimalist Right Indicator Dot */}
                    <div className="flex items-center pr-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? "bg-brand-accent scale-125" : "bg-brand-border/60 group-hover:bg-brand-accent/50"
                          }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Featured Showcase Card (Span 8) */}
          <div className="lg:col-span-8 h-full">
            <div className="bg-white border border-brand-border rounded-xl p-6 sm:p-8 md:p-9 shadow-sm relative overflow-hidden text-left h-full flex flex-col justify-between">

              {/* Decorative Subtle Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-accent/5 to-transparent pointer-events-none rounded-tr-xl" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch h-full">

                {/* Details Column */}
                <div className="md:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-brand-accent text-[9px] font-bold uppercase tracking-widest font-sans px-2.5 py-0.5 bg-brand-accent/10 rounded-md">
                        Initiative {actions[activeIdx].num}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-3">
                      {actions[activeIdx].title}
                    </h3>

                    <p className="text-sm text-text-secondary leading-relaxed font-sans font-light mb-6">
                      {actions[activeIdx].description}
                    </p>

                    {/* Impact / Benefits list */}
                    <div className="flex flex-col gap-3 mb-8">
                      <span className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-[0.15em] mb-1">
                        Key Commitments
                      </span>
                       {actions[activeIdx].benefits.map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                            <Check size={11} className="text-brand-accent" />
                          </div>
                          <span className="text-xs sm:text-sm text-text-secondary font-sans font-normal">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Action Button */}
                  <button
                    onClick={() => handleActionClick(actions[activeIdx].actionType)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white font-sans font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01] w-full sm:w-fit cursor-pointer"
                  >
                    <span>{actions[activeIdx].ctaText}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Image Frame Column */}
                <div className="md:col-span-5 h-full w-full">
                  <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-full min-h-[320px] rounded-lg overflow-hidden border border-brand-border shadow-inner group/img">
                    {/* Dynamic Image Crossfade inside card */}
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeIdx}
                        src={actions[activeIdx].img}
                        alt={actions[activeIdx].title}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      <JoinMovementForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        selectedAction={selectedAction}
      />
    </section>
  );
};

export default JoinMovement;
