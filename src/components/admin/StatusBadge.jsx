import React from "react";

const statusColors = {
  Published: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  Active: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  "Active Member": {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  Draft: {
    bg: "bg-amber-50 text-amber-700 border-amber-200/80",
    dot: "bg-amber-500",
  },
  Inactive: {
    bg: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dot: "bg-neutral-400",
  },
  "Past / Inactive": {
    bg: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dot: "bg-neutral-400",
  },
  Archived: {
    bg: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dot: "bg-neutral-400",
  },
};

const StatusBadge = ({ status = "Draft" }) => {
  const style = statusColors[status] || statusColors.Draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${style.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
