import React, { useState } from "react";
import { Check, Clock, MapPin } from "lucide-react";
import { PRIORITY_ORDER, TASK_STATUSES } from "./volunteerData";
import { getTasks, setTaskProgress, useVolunteerStore } from "./volunteerStore";
import { ProgressBar, formatDateTime } from "./ui";

const PRIORITY_DOT = { High: "bg-red-500", Medium: "bg-amber-500", Low: "bg-emerald-500" };

// One tap moves a task forward: To Do → In Progress → Done
const NEXT = {
  "To Do": { label: "Start", progress: 50 },
  "In Progress": { label: "Finish", progress: 100 },
};

const TasksPanel = ({ volunteer }) => {
  const tasks = useVolunteerStore(() => getTasks(volunteer.volunteerId));
  const [filter, setFilter] = useState("All");

  const done = tasks.filter((t) => t.status === "Done").length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const visible = tasks
    .filter((t) => filter === "All" || t.status === filter)
    .sort((a, b) => (a.status === "Done") - (b.status === "Done") || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.due.localeCompare(b.due));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="font-cinzel text-xl font-bold">My Tasks</h2>
          <span className="text-sm text-text-muted">{done} of {tasks.length} done</span>
        </div>
        <ProgressBar value={percent} label="Tasks completed" />
      </div>

      <div className="flex gap-1 rounded-full bg-white border border-brand-border p-1 w-fit max-w-full overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Filter tasks">
        {["All", ...TASK_STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              filter === s ? "bg-[#1F0C02] text-[#F4E4C1]" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">Nothing here.</p>
      ) : (
        <ul className="rounded-2xl bg-white border border-brand-border divide-y divide-brand-border">
          {visible.map((t) => {
            const isDone = t.status === "Done";
            const next = NEXT[t.status];
            return (
              <li key={t.id} className="flex items-start gap-4 p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => setTaskProgress(t.id, isDone ? 0 : 100)}
                  aria-label={isDone ? `Mark "${t.title}" as not done` : `Mark "${t.title}" as done`}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors cursor-pointer ${
                    isDone ? "bg-brand-accent border-brand-accent text-white" : "border-brand-border hover:border-brand-accent"
                  }`}
                >
                  {isDone && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                </button>

                <div className="min-w-0 flex-1">
                  <p className={`font-medium leading-snug ${isDone ? "text-text-muted line-through" : "text-text-primary"}`}>{t.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[t.priority]}`} aria-hidden="true" />
                      {t.priority}
                    </span>
                    <span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden="true" /> {formatDateTime(t.due)}</span>
                    <span className="inline-flex items-center gap-1"><MapPin size={12} aria-hidden="true" /> {t.location}</span>
                  </p>
                </div>

                {next ? (
                  <button
                    type="button"
                    onClick={() => setTaskProgress(t.id, next.progress)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      t.status === "In Progress" ? "bg-[#1F0C02] text-[#F4E4C1] hover:bg-brand-accent" : "border border-brand-border text-text-primary hover:border-brand-accent"
                    }`}
                  >
                    {next.label}
                  </button>
                ) : (
                  <span className="shrink-0 text-xs font-semibold text-emerald-700">Done</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TasksPanel;
