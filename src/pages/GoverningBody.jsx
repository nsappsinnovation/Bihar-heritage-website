import React from "react";
import { motion } from "framer-motion";
import { defaultGoverningBody, defaultOrganization } from "../data/defaults/cmsDefaults";

export default function GoverningBody() {
  const getRoster = () => {
    const isMemberActive = (m) => (m.status || "Active") !== "Draft" && (m.status || "Active") !== "Inactive";
    const dedicated = defaultGoverningBody;
    if (dedicated && Array.isArray(dedicated) && dedicated.length > 0) {
      const pub = dedicated.filter(isMemberActive);
      if (pub.length > 0) return pub;
    }
    const allOrg = defaultOrganization;
    const fromOrg = allOrg.filter((m) => m.category === "Governing Body" && isMemberActive(m));
    if (fromOrg && fromOrg.length > 0) return fromOrg;
    return defaultGoverningBody;
  };

  const governingBodyMembers = getRoster();


  return (
    <div className="min-h-screen bg-brand-dark text-text-primary pt-28 pb-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Fine-grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `60px 60px`,
        }}
      />

      <div className="max-w-[1360px] mx-auto relative z-10 space-y-10">
        {/* Page Header */}
        <div className="border-b border-brand-border/60 pb-6">
          <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] font-sans block mb-2">
            Governance & Structure
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary leading-tight">
            Governing Body
          </h1>
          <p className="text-text-secondary text-sm md:text-base font-sans font-light mt-2 max-w-2xl">
            Official list of members constituting the apex governing committee of the Bihar Heritage Development Society.
          </p>
        </div>

        {/* Member Directory Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="overflow-x-auto rounded-xl border border-brand-border/60 bg-brand-card/90 shadow-xl backdrop-blur-md">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-brand-border/70 bg-brand-dark/50 text-[11px] font-sans font-bold uppercase tracking-wider text-text-secondary">
                  <th className="py-4 px-5 w-16 text-center">S.No.</th>
                  <th className="py-4 px-6">Position / Designation</th>
                  <th className="py-4 px-6">Department / Ministry</th>
                  <th className="py-4 px-6 w-44 text-center">
                    Role in Authority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 font-sans text-sm">
                {governingBodyMembers.map((member, index) => {
                  const isChairman = member.role === "Chairman";
                  const isSecretary = member.role === "Member Secretary";

                  return (
                    <tr
                      key={member.id || index}
                      className={`group transition-colors duration-150 ${
                        isChairman
                          ? "bg-brand-gold/[0.04] hover:bg-brand-gold/[0.08]"
                          : isSecretary
                          ? "bg-brand-accent/[0.04] hover:bg-brand-accent/[0.08]"
                          : "hover:bg-brand-accent/[0.03]"
                      }`}
                    >
                      {/* Serial Number */}
                      <td className="py-4 px-5 text-center font-mono text-xs font-bold text-brand-accent/80 group-hover:text-brand-accent">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* Position Designation */}
                      <td className="py-4 px-6">
                        <span
                          className={`font-serif font-bold block ${
                            isChairman
                              ? "text-brand-gold text-base"
                              : isSecretary
                              ? "text-brand-accent text-base"
                              : "text-text-primary text-sm group-hover:text-brand-accent transition-colors"
                          }`}
                        >
                          {member.position || "\u2014"}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-6 text-text-secondary text-xs font-medium">
                        {member.department}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-3.5 py-1 text-[10px] font-sans font-bold tracking-wider uppercase rounded-full border transition-all select-none ${
                            isChairman
                              ? "text-brand-gold border-brand-gold/40 bg-brand-gold/10 shadow-sm shadow-brand-gold/10"
                              : isSecretary
                              ? "text-brand-accent border-brand-accent/40 bg-brand-accent/10 shadow-sm shadow-brand-accent/10"
                              : "text-text-secondary/80 border-brand-border/60 bg-brand-dark/40"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
