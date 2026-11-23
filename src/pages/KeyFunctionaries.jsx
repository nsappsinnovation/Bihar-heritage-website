import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, MapPin, Award, UserCheck } from "lucide-react";
import { getData, STORAGE_KEYS } from "../utils/cmsStorage";
import { defaultKeyFunctionaries, defaultOrganization } from "../data/defaults/cmsDefaults";

export default function KeyFunctionaries() {
  const getRoster = () => {
    const isMemberActive = (m) => (m.status || "Active") !== "Draft" && (m.status || "Active") !== "Inactive";
    const dedicated = getData(STORAGE_KEYS.KEY_FUNCTIONARIES, defaultKeyFunctionaries);
    if (dedicated && Array.isArray(dedicated) && dedicated.length > 0) {
      const pub = dedicated.filter(isMemberActive);
      if (pub.length > 0) return pub;
    }
    const allOrg = getData(STORAGE_KEYS.ORGANIZATION, defaultOrganization);
    const fromOrg = allOrg.filter((m) => m.category === "Key Functionaries" && isMemberActive(m));
    if (fromOrg && fromOrg.length > 0) return fromOrg;
    return defaultKeyFunctionaries;
  };

  const [keyOfficials, setKeyOfficials] = useState(getRoster);

  useEffect(() => {
    const handleSync = () => {
      setKeyOfficials(getRoster());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("bh_storage_update", handleSync);
    window.addEventListener("focus", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("bh_storage_update", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-brand-dark text-text-primary pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Decorative fine-grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `60px 60px`,
        }}
      />

      <div className="max-w-[1360px] mx-auto relative z-10">

        {/* Page Header */}
        <div className="border-b border-brand-border/60 pb-6 mb-12">
          <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] font-sans block mb-2">
            Leadership & Administration
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary leading-tight">
            Key Functionaries
          </h1>
          <p className="text-text-secondary text-sm font-sans font-light max-w-2xl mt-3 leading-relaxed">
            Officials responsible for guiding the Bihar Heritage Development Society's operations and preserving Bihar’s cultural legacy.
          </p>
        </div>

        {/* Functionaries Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
        >
          {keyOfficials.map((official, index) => {
            const hasRole = official.role;

            return (
              <motion.div
                key={official.id || index}
                variants={itemVariants}
                className="bg-brand-card border border-brand-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md hover:border-brand-accent/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-center"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-accent/20 group-hover:bg-brand-accent transition-colors duration-300" />

                <div>
                  {/* Portrait Frame */}
                  <div className="w-40 h-48 mx-auto bg-brand-dark border border-brand-border/60 overflow-hidden mb-6 relative flex items-center justify-center rounded-none">
                    {official.image ? (
                      <img decoding="async"
                        src={official.image}
                        alt={official.name}
                        className="w-full h-full object-cover filter brightness-[0.92] group-hover:scale-103 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <svg
                        className="w-16 h-16 text-text-secondary/20 p-2 transition-colors duration-300 group-hover:text-brand-accent/30"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-label="No image available"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </div>

                  <div className="mb-3">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-text-primary group-hover:text-brand-accent transition-colors duration-200">
                      {official.name}
                    </h2>
                  </div>

                  <div className="space-y-2 text-sm text-text-secondary font-sans font-light">
                    <p className="font-semibold text-brand-accent">{official.position}</p>

                    {official.department && (
                      <p className="text-xs text-text-muted">{official.department}</p>
                    )}

                    {official.role && (
                      <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
                        {official.role} {official.committee && <span>({official.committee})</span>}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-border/40 flex flex-col items-center gap-3">
                  <span className="text-[9px] font-mono tracking-widest text-text-muted uppercase leading-tight">
                    {official.organization || "Bihar Heritage Development Society"}
                  </span>

                  {official.contact && (
                    <a
                      href={`tel:${official.contact.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2 text-brand-accent hover:text-brand-accent-hover transition-colors duration-200"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold whitespace-nowrap">{official.contact}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Information Section */}
        <div className="bg-brand-card border border-brand-border/60 p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/[0.02] blur-2xl pointer-events-none rounded-full" />

          <h3 className="text-2xl font-serif font-bold text-text-primary mb-8 border-b border-brand-border/40 pb-4">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-dark border border-brand-border/40 text-brand-accent">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1 font-sans">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Office Address
                </h4>
                <p className="text-sm text-text-secondary font-light leading-relaxed">
                  Bihar Heritage Development Society <br />
                  Department of Art, Culture <br />
                  Government of Bihar <br />
                  Patna, Bihar, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-dark border border-brand-border/40 text-brand-accent">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1 font-sans">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  General Enquiries
                </h4>
                <p className="text-sm text-text-secondary font-light leading-relaxed">
                  For queries, proposals, or research collaborations, please reach out to any key functionary or visit our headquarters during official working hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
