import React from "react";
import { ANNOUNCEMENTS } from "./eventData";
import { SectionHeading } from "./Ornaments";

const LABELS = {
  update: "Official Update",
  schedule: "Schedule Change",
  notice: "Important Notice",
  reminder: "Reminder",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const Announcements = () => {
  const items = [...ANNOUNCEMENTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section aria-labelledby="announcements-title" className="py-20 md:py-28 px-6 bg-brand-alt/40">
      <div className="max-w-5xl mx-auto">
        <SectionHeading id="announcements-title" eyebrow="Stay informed" title="Announcements" />
        <ul className="grid gap-5 md:grid-cols-2">
          {items.map((a) => {
            return (
              <li key={a.id} className="rounded-2xl bg-white border border-brand-border p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-accent/70">
                    {LABELS[a.type]}
                  </span>
                  <time dateTime={a.date} className="text-xs text-text-muted">{formatDate(a.date)}</time>
                </div>
                <h3 className="text-lg">{a.title}</h3>
                <p className="mt-2 text-sm">{a.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Announcements;
