import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getData, STORAGE_KEYS } from "../../utils/cmsStorage";
import {
  defaultKeyFunctionaries,
  defaultGoverningBody,
  defaultOrganization,
} from "../../data/defaults/cmsDefaults";

const getLeadershipMembers = () => {
  const isMemberActive = (m) => (m.status || "Active") !== "Draft" && (m.status || "Active") !== "Inactive";
  const dedicated = getData(STORAGE_KEYS?.KEY_FUNCTIONARIES || "bh_key_functionaries", defaultKeyFunctionaries);
  let rawList = [];
  if (dedicated && Array.isArray(dedicated) && dedicated.length > 0) {
    const pub = dedicated.filter(isMemberActive);
    rawList = pub.length > 0 ? pub : defaultKeyFunctionaries;
  } else {
    rawList = defaultKeyFunctionaries;
  }

  return rawList.map((m, index) => ({
    id: m.id || `member-${index}`,
    src: m.image || m.src || "",
    name: m.name || m.position || "Distinguished Official",
    roleTag: m.role || m.roleTag || (index === 0 ? "Chairman" : index === 1 ? "Member Secretary" : "Executive Director"),
    designation: m.position || m.designation || m.role || "Executive Leader",
    additional: m.department || m.additional || m.organization || "",
  }));
};

const getGoverningCouncilCount = () => {
  const isMemberActive = (m) => (m.status || "Active") !== "Draft" && (m.status || "Active") !== "Inactive";
  const dedicatedGb = getData(STORAGE_KEYS?.GOVERNING_BODY || "bh_governing_body", defaultGoverningBody);
  if (dedicatedGb && Array.isArray(dedicatedGb) && dedicatedGb.length > 0) {
    const pub = dedicatedGb.filter(isMemberActive);
    if (pub.length > 0) return pub.length;
  }
  return defaultGoverningBody.length || 13;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const GoverningComponents = () => {
  const [members, setMembers] = useState(getLeadershipMembers);
  const [councilCount, setCouncilCount] = useState(getGoverningCouncilCount);

  useEffect(() => {
    const handleSync = () => {
      setMembers(getLeadershipMembers());
      setCouncilCount(getGoverningCouncilCount());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("bh_storage_update", handleSync);
    window.addEventListener("bh_cms_update", handleSync);
    window.addEventListener("focus", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("bh_storage_update", handleSync);
      window.removeEventListener("bh_cms_update", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  return (
    <section
      className="bg-brand-dark py-12 sm:py-16 px-6 sm:px-12 border-t border-brand-border relative overflow-hidden"
      id="GoverningBody"
    >
      {/* Ambient background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,106,61,0.03),transparent_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `64px 64px`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-primary tracking-tight mb-3">
            Governing Body
          </h2>

          <p className="text-text-secondary text-sm sm:text-base font-sans font-light leading-relaxed">
            Distinguished apex leadership directing the preservation, conservation, and promotion of Bihar's rich historic and archaeological heritage.
          </p>
        </motion.div>

        {/* Leadership Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {members.map((member, index) => (
            <motion.div
              key={member.id || index}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="bg-white border border-brand-border/70 hover:border-brand-accent/40 rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-500 group relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(197,106,61,0.08)]"
            >
              {/* Role Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-[10px] font-sans font-bold tracking-widest uppercase rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent">
                  {member.roleTag}
                </span>
              </div>

              {/* Portrait Frame with double border ring effect */}
              <div className="relative mb-5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 border-2 border-brand-border/60 group-hover:border-brand-accent/40 transition-all duration-500 shadow-inner">
                  <div className="w-full h-full rounded-full overflow-hidden bg-brand-dark/50 relative flex items-center justify-center">
                    {member.src ? (
                      <img decoding="async"
                        src={member.src}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                    ) : (
                      // Custom minimal executive avatar fallback
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-alt/30 to-brand-border/40 text-brand-accent/70 p-4">
                        <svg
                          className="w-12 h-12 text-brand-accent/60 transition-transform duration-500 group-hover:scale-110"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Member Name */}
              <h3 className="text-lg sm:text-xl font-serif font-bold text-text-primary mb-1.5 group-hover:text-brand-accent transition-colors duration-300 leading-snug">
                {member.name}
              </h3>

              {/* Primary Designation */}
              <p className="text-[11px] font-sans font-semibold tracking-wider text-brand-accent uppercase mb-2">
                {member.designation}
              </p>

              {/* Additional Context */}
              {member.additional && (
                <p className="text-xs text-text-secondary font-sans font-light leading-relaxed max-w-[240px]">
                  {member.additional}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* View Full Council Link / Action */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            to="/governingbody"
            className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-white border border-brand-border/80 hover:border-brand-accent/50 rounded-full text-xs font-sans font-bold tracking-wider text-text-primary hover:text-brand-accent uppercase shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <span>View Full Governing Council ({councilCount} Members)</span>
            <ArrowUpRight className="w-4 h-4 text-brand-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default GoverningComponents;