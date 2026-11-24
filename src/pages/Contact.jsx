import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle, Clock, Globe } from "lucide-react";

const HQ_QUERY = "25.6137830,85.1337950";

export default function Contact() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#33251D] pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#E4D6BC]/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-[#C56A3D]/5 blur-[120px] pointer-events-none" />

      {/* Decorative subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#8B5E3C 1px, transparent 0)",
          backgroundSize: "28px 28px"
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1140px] mx-auto relative z-10"
      >
        {/* Editorial Page Header */}
        <motion.div variants={itemVariants} className="border-b border-[#E8DFC8]/80 pb-8 mb-16 text-left">
          <span className="text-[#C56A3D] text-[10px] font-sans font-bold uppercase tracking-[0.3em] block mb-3">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2419] leading-tight tracking-tight">
            Connect With Us
          </h1>
          <p className="text-[#6B5744] text-xs sm:text-sm font-sans font-light max-w-2xl mt-4 leading-relaxed">
            Have questions about Bihar's cultural preservation initiatives, archaeological research, or need coordinates for a specific protected site? Reach out to the Bihar Heritage Development Society.
          </p>
        </motion.div>

        {/* 2-Column Side-by-Side Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          
          {/* Headquarters details */}
          <motion.div
            variants={itemVariants}
            className="bg-white/85 border border-[#E8DFC8] p-6 sm:p-8 rounded-2xl shadow-[0_10px_30px_rgba(44,36,25,0.03)] space-y-6 flex flex-col justify-between text-left"
          >
            <h3 className="text-xl font-serif font-bold text-[#2C2419] flex items-center gap-2.5">
              <span className="h-4.5 w-[2.5px] bg-[#C56A3D] rounded-full inline-block" />
              HQ Office
            </h3>

            <div className="space-y-6 flex-grow flex flex-col justify-center">
              {/* Address */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center flex-shrink-0 text-[#C56A3D] border border-[#E8DFC8]/60 group-hover:bg-[#C56A3D] group-hover:text-white transition-all duration-300">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#A98E75]">Office Address</h4>
                  <p className="text-xs text-[#5C4A3A] font-sans font-medium mt-1 leading-relaxed">
                    Bihar Heritage Development Society <br />
                    Department of Art & Culture <br />
                    Government of Bihar <br />
                    North of Patna Museum, Off Buddha Marg, Patna – 800001
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center flex-shrink-0 text-[#C56A3D] border border-[#E8DFC8]/60 group-hover:bg-[#C56A3D] group-hover:text-white transition-all duration-300">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#A98E75]">Phone Contacts</h4>
                  <p className="text-xs text-[#5C4A3A] font-sans font-medium mt-1 leading-relaxed">
                    +91-9955058450 <br />
                    0612-2508445
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center flex-shrink-0 text-[#C56A3D] border border-[#E8DFC8]/60 group-hover:bg-[#C56A3D] group-hover:text-white transition-all duration-300">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#A98E75]">Email Enquiries</h4>
                  <a
                    href="mailto:heritageofbihar@gmail.com"
                    className="text-xs text-[#C56A3D] font-sans font-bold hover:underline block mt-1 transition-colors duration-200"
                  >
                    heritageofbihar@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium Maps Frame */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-[0_10px_30px_rgba(44,36,25,0.03)] min-h-[350px] bg-white relative group flex-grow h-full"
          >
            <iframe
              className="absolute inset-0 w-full h-full grayscale-[20%] contrast-[105%] group-hover:grayscale-[0%] transition-all duration-500"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(HQ_QUERY)}&z=16&output=embed`}
              allowFullScreen=""
              loading="lazy"
              title="Bihar Heritage Development Society Location"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-[#E8DFC8] px-3 py-1 rounded-xl shadow-md text-[9px] font-sans font-bold uppercase tracking-wider text-[#2C2419] pointer-events-none flex items-center gap-1">
              <Globe size={11} className="text-[#C56A3D]" />
              HQ Map View
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HQ_QUERY)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Bihar Heritage Development Society in Google Maps"
              className="absolute inset-0 z-10 cursor-pointer"
            >
              <span className="absolute bottom-3 right-3 bg-[#C56A3D] text-white px-3.5 py-1.5 rounded-xl shadow-md text-[10px] font-sans font-bold uppercase tracking-wider group-hover:bg-[#A9562E] transition-colors">
                Open in Google Maps ↗
              </span>
            </a>
          </motion.div>

          
          
        </div>
      </motion.div>
    </div>
  );
}
