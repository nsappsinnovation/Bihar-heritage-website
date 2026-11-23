import React, { useState } from "react";
import { CheckCheck } from "lucide-react";
import { NOTICE_TYPES } from "./volunteerData";
import { getNotices, markNoticesRead, useVolunteerStore } from "./volunteerStore";
import { Chip, ghostButton } from "./ui";

const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const NoticesPanel = ({ volunteer }) => {
  const notices = useVolunteerStore(() => getNotices(volunteer.volunteerId));
  const [type, setType] = useState("all");

  const visible = notices.filter((n) => type === "all" || n.type === type);
  const unread = notices.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-cinzel text-xl font-bold">Announcements & Notifications</h2>
          <p className="text-sm text-text-muted">{unread.length} unread · volunteer notices and official event updates</p>
        </div>
        <button type="button" disabled={!unread.length} onClick={() => markNoticesRead(volunteer.volunteerId, unread.map((n) => n.id))} className={ghostButton}>
          <CheckCheck size={14} aria-hidden="true" /> Mark all read
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Filter announcements">
        {[["all", "All"], ...Object.entries(NOTICE_TYPES).map(([k, v]) => [k, v.label])].map(([k, label]) => (
          <button
            key={k}
            type="button"
            aria-pressed={type === k}
            onClick={() => setType(k)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              type === k ? "bg-[#1F0C02] border-[#1F0C02] text-[#F4E4C1]" : "bg-white border-brand-border text-text-primary hover:border-brand-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {visible.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => !n.read && markNoticesRead(volunteer.volunteerId, [n.id])}
              className={`w-full text-left rounded-2xl border p-5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/20 ${
                n.read ? "bg-white border-brand-border" : "bg-[#FFF8EC] border-[#E8A33D]/50"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="flex items-center gap-2">
                  {!n.read && <span className="h-2 w-2 rounded-full bg-brand-accent" aria-label="Unread" />}
                  <Chip cls={NOTICE_TYPES[n.type].cls}>{NOTICE_TYPES[n.type].label}</Chip>
                </span>
                <time dateTime={n.date} className="text-xs text-text-muted">{formatDate(n.date)}</time>
              </div>
              <h3 className="text-base font-semibold">{n.title}</h3>
              <p className="mt-1 text-sm">{n.text}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticesPanel;
