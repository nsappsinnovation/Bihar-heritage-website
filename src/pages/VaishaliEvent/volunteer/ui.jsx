import React from "react";

export const Chip = ({ cls, children }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold ${cls}`}>{children}</span>
);

export const ProgressBar = ({ value, label }) => (
  <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} className="h-2.5 w-full overflow-hidden rounded-full bg-brand-alt">
    <div className="h-full rounded-full bg-gradient-to-r from-[#E8A33D] to-[#C56A3D] transition-all duration-500" style={{ width: `${value}%` }} />
  </div>
);

export const ghostButton =
  "inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white hover:border-brand-accent px-4 py-2 text-xs font-semibold text-text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/20";

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
