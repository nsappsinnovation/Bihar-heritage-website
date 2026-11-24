import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, CheckCircle2 } from "lucide-react";
import { defaultArcheologicalTeam, defaultOrganization } from "../data/defaults/cmsDefaults";

export default function ArcheologicalTeam() {
  const getRoster = () => {
    const isMemberActive = (m) => (m.status || "Active") !== "Draft" && (m.status || "Active") !== "Inactive";
    const dedicated = defaultArcheologicalTeam;
    if (dedicated && Array.isArray(dedicated) && dedicated.length > 0) {
      const pub = dedicated.filter(isMemberActive);
      if (pub.length > 0) return pub;
    }
    const allOrg = defaultOrganization;
    const fromOrg = allOrg.filter((m) => m.category === "Archaeological Team" && isMemberActive(m));
    if (fromOrg && fromOrg.length > 0) return fromOrg;
    return defaultArcheologicalTeam;
  };

  const teamMembers = getRoster();


  const responsibilities = [
    "Conducting systematic archaeological surveys across potential heritage sites",
    "Performing scientific excavations at identified historical landmarks",
    "Documenting artifacts, structures, and findings with detailed illustrations and measurements",
    "Analyzing archaeological data to reconstruct historical narratives and timelines",
    "Collaborating with conservation specialists to preserve discovered artifacts",
    "Contributing to scholarly publications, research papers, and educational resources",
    "Participating in public outreach programs to promote awareness of Bihar's archaeological legacy",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
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
            Research & Field Division
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary leading-tight">
            Archaeological Team
          </h1>
          <p className="text-text-secondary text-sm font-sans font-light max-w-2xl mt-3 leading-relaxed">
            Our dedicated archaeological team conducts field surveys, excavations, and academic research to preserve and document Bihar’s rich cultural heritage.
          </p>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Team Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 space-y-6"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id || index}
                variants={itemVariants}
                className="bg-brand-card border border-brand-border/60 p-8 shadow-sm hover:shadow-md hover:border-brand-accent/40 transition-all duration-300 flex items-start gap-4 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-accent/20 group-hover:bg-brand-accent transition-colors duration-300" />

                <div className="p-3.5 bg-brand-dark border border-brand-border/40 text-brand-accent shrink-0">
                  <Compass className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-sans text-text-secondary/40 font-bold uppercase tracking-wider block">
                    Team Member
                  </span>
                  <h2 className="text-xl font-serif font-bold text-text-primary group-hover:text-brand-accent transition-colors duration-200">
                    {member.name || member.position}
                  </h2>
                  <p className="text-xs font-sans font-medium text-brand-gold uppercase tracking-wider">
                    {member.position}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column: Division Responsibilities */}
          <div className="lg:col-span-7">
            <div className="bg-brand-card border border-brand-border/60 p-8 shadow-sm relative overflow-hidden">
              <h3 className="text-2xl font-serif font-bold text-text-primary mb-6 border-b border-brand-border/40 pb-4">
                Division Responsibilities
              </h3>

              <p className="text-sm text-text-secondary font-sans font-light leading-relaxed mb-6">
                The Archaeological division at Bihar Heritage Development Society is tasked with uncovering, documenting, and protecting the rich history of Bihar through:
              </p>

              <div className="space-y-4">
                {responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-text-secondary">
                    <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <p className="text-sm font-sans font-light leading-relaxed">{resp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
