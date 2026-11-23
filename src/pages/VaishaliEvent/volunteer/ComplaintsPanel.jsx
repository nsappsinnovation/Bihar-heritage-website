import React, { useState } from "react";
import { CheckCircle2, MapPin, Plus, X } from "lucide-react";
import { Field, PrimaryButton, describedBy, inputClass } from "../guest/FormFields";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, PRIORITIES, TEAM_LEADS } from "./volunteerData";
import { getComplaints, submitComplaint, updateComplaint, useVolunteerStore } from "./volunteerStore";
import { formatDateTime } from "./ui";

const STATUS_CLS = {
  Submitted: "bg-gray-100 text-gray-700",
  Assigned: "bg-sky-50 text-sky-800",
  "In Progress": "bg-amber-50 text-amber-800",
  Resolved: "bg-emerald-50 text-emerald-700",
};

const EMPTY = { category: COMPLAINT_CATEGORIES[0], priority: "Medium", location: "", description: "" };

const smallInput = `${inputClass(false)} !py-2 text-sm`;
const darkBtn = "shrink-0 rounded-full bg-[#1F0C02] hover:bg-brand-accent disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 text-xs font-semibold text-[#F4E4C1] transition-colors cursor-pointer";

const ComplaintForm = ({ volunteer, onDone }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.location.trim()) errs.location = "Where is the issue?";
    if (form.description.trim().length < 10) errs.description = "Add a few more details (10+ characters).";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const rec = submitComplaint(volunteer, { ...form, location: form.location.trim(), description: form.description.trim() });
    onDone(rec.id);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl bg-white border border-brand-border p-5 sm:p-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="c-category" label="Category">
          <select id="c-category" value={form.category} onChange={set("category")} className={inputClass(false)}>
            {COMPLAINT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field id="c-priority" label="Priority">
          <select id="c-priority" value={form.priority} onChange={set("priority")} className={inputClass(false)}>
            {Object.keys(PRIORITIES).map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field id="c-location" label="Location" error={errors.location} className="sm:col-span-2">
          <input id="c-location" value={form.location} onChange={set("location")} placeholder="e.g. Main Auditorium, east entrance" className={inputClass(errors.location)} {...describedBy("c-location", errors.location)} />
        </Field>
        <Field id="c-desc" label="What happened?" error={errors.description} className="sm:col-span-2">
          <textarea id="c-desc" rows={3} value={form.description} onChange={set("description")} className={inputClass(errors.description)} {...describedBy("c-desc", errors.description)} />
        </Field>
      </div>
      <PrimaryButton type="submit">Submit</PrimaryButton>
    </form>
  );
};

/** Shows only the one action that moves the complaint to its next step. */
const NextStep = ({ c }) => {
  const [assignee, setAssignee] = useState(TEAM_LEADS[0].name);
  const [note, setNote] = useState("");

  if (c.status === "Submitted") {
    return (
      <div className="flex gap-2">
        <label htmlFor={`assign-${c.id}`} className="sr-only">Assign to</label>
        <select id={`assign-${c.id}`} value={assignee} onChange={(e) => setAssignee(e.target.value)} className={smallInput}>
          {TEAM_LEADS.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
        </select>
        <button type="button" onClick={() => updateComplaint(c.id, { assignee, status: "Assigned", note: `Assigned to ${assignee}` })} className={darkBtn}>
          Assign
        </button>
      </div>
    );
  }
  if (c.status === "Assigned") {
    return (
      <button type="button" onClick={() => updateComplaint(c.id, { status: "In Progress" })} className={darkBtn}>
        Start work
      </button>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (note.trim()) updateComplaint(c.id, { status: "Resolved", note: note.trim() });
      }}
      className="flex gap-2"
    >
      <label htmlFor={`note-${c.id}`} className="sr-only">How was it resolved?</label>
      <input id={`note-${c.id}`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="How was it resolved?" className={smallInput} />
      <button type="submit" disabled={!note.trim()} className={darkBtn}>Resolve</button>
    </form>
  );
};

const ComplaintCard = ({ c }) => {
  const step = COMPLAINT_STATUSES.indexOf(c.status);
  const resolved = c.status === "Resolved";

  return (
    <li className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-text-primary">{c.category}</p>
          <p className="mt-0.5 text-sm">{c.description}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ${STATUS_CLS[c.status]}`}>{c.status}</span>
      </div>

      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1"><MapPin size={12} aria-hidden="true" /> {c.location}</span>
        {c.assignee && <span>· {c.assignee}</span>}
        <span>· {formatDateTime(c.createdAt)}</span>
      </p>

      {/* Thin 4-step tracker */}
      <div className="mt-3 flex gap-1" role="img" aria-label={`Step ${step + 1} of 4: ${c.status}`}>
        {COMPLAINT_STATUSES.map((s, i) => (
          <span key={s} className={`h-1 flex-1 rounded-full ${i <= step ? (resolved ? "bg-emerald-600" : "bg-brand-accent") : "bg-brand-alt"}`} />
        ))}
      </div>

      <div className="mt-4">
        {resolved ? (
          <p className="flex items-start gap-2 text-sm text-emerald-800">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> {c.resolution || "Resolved"}
          </p>
        ) : (
          <NextStep c={c} />
        )}
      </div>
    </li>
  );
};

const ComplaintsPanel = ({ volunteer }) => {
  const complaints = useVolunteerStore(getComplaints);
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(null);
  const [filter, setFilter] = useState("Open");

  const open = complaints.filter((c) => c.status !== "Resolved");
  const visible = filter === "Open" ? open : complaints.filter((c) => c.status === "Resolved");

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-cinzel text-xl font-bold">Complaints</h2>
        <button
          type="button"
          onClick={() => { setShowForm(!showForm); setSent(null); }}
          aria-expanded={showForm}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1F0C02] hover:bg-brand-accent px-4 py-2 text-xs font-semibold text-[#F4E4C1] transition-colors cursor-pointer"
        >
          {showForm ? <X size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
          {showForm ? "Cancel" : "Report an issue"}
        </button>
      </div>

      {showForm && <ComplaintForm volunteer={volunteer} onDone={(id) => { setSent(id); setShowForm(false); setFilter("Open"); }} />}
      {sent && (
        <p role="status" className="flex items-center gap-2 text-sm text-emerald-800">
          <CheckCircle2 size={16} aria-hidden="true" /> Complaint submitted — it's now in the list below.
        </p>
      )}

      <div className="flex gap-1 rounded-full bg-white border border-brand-border p-1 w-fit" role="group" aria-label="Filter complaints">
        {[["Open", `Open (${open.length})`], ["Resolved", "Resolved"]].map(([k, label]) => (
          <button
            key={k}
            type="button"
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${filter === k ? "bg-[#1F0C02] text-[#F4E4C1]" : "text-text-secondary hover:text-text-primary"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">{filter === "Open" ? "No open complaints." : "Nothing resolved yet."}</p>
      ) : (
        <ul className="rounded-2xl bg-white border border-brand-border divide-y divide-brand-border">
          {visible.map((c) => <ComplaintCard key={c.id} c={c} />)}
        </ul>
      )}
    </div>
  );
};

export default ComplaintsPanel;
