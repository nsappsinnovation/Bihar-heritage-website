import React, { useState } from "react";
import { CheckCircle2, HandHelping, MessageSquareWarning, PackageSearch, Phone, Star, ThumbsUp } from "lucide-react";
import { EMERGENCY_CONTACTS, SCHEDULE } from "../eventData";
import { Field, PrimaryButton, describedBy, inputClass } from "./FormFields";
import { getTickets, submitTicket } from "./guestStore";

const TYPES = [
  { id: "assistance", label: "Assistance", Icon: HandHelping, intro: "Need a wheelchair, an interpreter, directions or other help on site? Volunteers will come to you." },
  { id: "lost-found", label: "Lost & Found", Icon: PackageSearch, intro: "Report an item you lost, or hand in something you found. Items are kept at the Helpdesk, Main Entrance Pavilion." },
  { id: "complaint", label: "Complaint", Icon: MessageSquareWarning, intro: "Tell us what went wrong so the organising team can act on it quickly." },
  { id: "feedback", label: "Feedback", Icon: ThumbsUp, intro: "Help us improve — rate the conference or a session you attended." },
];

const LOCATIONS = [...new Set(SCHEDULE.flatMap((d) => d.sessions.map((s) => s.location)))];
const SESSIONS = SCHEDULE.flatMap((d) => d.sessions.map((s) => `${d.tab}: ${s.title}`));

const EMPTY = { kind: "", subtype: "", location: "", item: "", details: "", rating: 0, session: "" };

const requiredFor = (type, f) => {
  const e = {};
  if (type === "assistance") {
    if (!f.subtype) e.subtype = "Choose the kind of help you need.";
    if (!f.location) e.location = "Tell us where you are.";
  }
  if (type === "lost-found") {
    if (!f.kind) e.kind = "Choose lost or found.";
    if (f.item.trim().length < 2) e.item = "Describe the item.";
  }
  if (type === "complaint") {
    if (!f.subtype) e.subtype = "Choose a category.";
    if (f.details.trim().length < 10) e.details = "Please describe the issue (at least 10 characters).";
  }
  if (type === "feedback" && !f.rating) e.rating = "Choose a rating from 1 to 5.";
  return e;
};

const STATUS_STYLE = { Received: "bg-[#FBF1E7] text-brand-accent" };

const HelpCentre = ({ guest }) => {
  const [type, setType] = useState("assistance");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState(() => getTickets(guest.registrationId));

  const current = TYPES.find((t) => t.id === type);
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const pick = (id) => {
    setType(id);
    setForm(EMPTY);
    setErrors({});
    setDone(null);
    setError("");
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const found = requiredFor(type, form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      ev.currentTarget.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    try {
      const ticket = submitTicket(guest.registrationId, { type, label: current.label, ...form });
      setTickets(getTickets(guest.registrationId));
      setDone(ticket);
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    }
  };

  const control = (name, extra = {}) => ({
    id: `help-${name}`,
    name,
    value: form[name],
    onChange: (e) => set(name, e.target.value),
    className: inputClass(errors[name]),
    ...describedBy(`help-${name}`, errors[name], extra.hint),
  });

  const select = (name, label, options, required = true) => (
    <Field id={`help-${name}`} label={label} required={required} optional={!required} error={errors[name]}>
      <select {...control(name)}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </Field>
  );

  return (
    <div className="space-y-10">
      {/* Emergency contacts */}
      <section aria-labelledby="emergency-title">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <h3 id="emergency-title" className="font-cinzel text-xl font-bold">Emergency contacts</h3>
          <p className="text-xs text-text-muted">Tap to call · the red SOS button stays on screen at all times</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EMERGENCY_CONTACTS.map((c) => (
            <li key={c.id}>
              <a
                href={`tel:${c.number.replace(/[^\d+]/g, "")}`}
                className="flex h-full items-center justify-between gap-4 rounded-2xl border border-brand-border bg-white p-4 hover:border-red-400 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
              >
                <span>
                  <span className="block font-semibold text-text-primary text-sm">{c.label}</span>
                  {c.note && <span className="block text-xs text-text-muted mt-0.5">{c.note}</span>}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-2 text-sm font-bold text-white">
                  <Phone size={13} aria-hidden="true" /> {c.number}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Request forms */}
      <section aria-labelledby="requests-title" className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">
        <div className="rounded-3xl bg-white border border-brand-border p-5 sm:p-8">
          <h3 id="requests-title" className="font-cinzel text-xl font-bold">How can we help?</h3>
          <div role="group" aria-label="Request type" className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TYPES.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={type === id}
                onClick={() => pick(id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/20 ${
                  type === id ? "bg-[#1F0C02] border-[#1F0C02] text-[#F4E4C1]" : "border-brand-border hover:border-brand-accent text-text-primary"
                }`}
              >
                <Icon size={22} aria-hidden="true" className={type === id ? "text-[#E8A33D]" : "text-brand-accent"} />
                {label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm">{current.intro}</p>

          {done ? (
            <div role="status" className="mt-6 rounded-2xl bg-[#EEF7EE] border border-green-200 p-5">
              <p className="flex items-center gap-2 font-semibold text-green-800">
                <CheckCircle2 size={20} aria-hidden="true" /> Request received — reference {done.id}
              </p>
              <p className="mt-1 text-sm text-green-900/80">
                {type === "assistance"
                  ? "A volunteer has been notified. For anything urgent, call the Event Helpdesk."
                  : "The organising team will follow up using your registered email or mobile number."}
              </p>
              <button type="button" onClick={() => setDone(null)} className="mt-3 text-sm font-semibold text-brand-accent hover:underline cursor-pointer">
                Submit another {current.label.toLowerCase()} request
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
              {type === "assistance" && (
                <>
                  {select("subtype", "Type of assistance", ["Wheelchair / mobility", "Medical (non-emergency)", "Interpreter", "Directions", "Transport / shuttle", "Other"])}
                  {select("location", "Where are you now?", [...LOCATIONS, "Parking", "Shuttle Bus Bay", "Other"])}
                </>
              )}

              {type === "lost-found" && (
                <>
                  <div className="sm:col-span-2">
                    <p className="mb-2 text-sm font-semibold text-text-primary">I want to report an item I… <span className="text-brand-accent" aria-hidden="true">*</span></p>
                    <div role="radiogroup" aria-label="Lost or found" className="grid grid-cols-2 gap-2 max-w-sm">
                      {["Lost", "Found"].map((k) => (
                        <label key={k} className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold cursor-pointer has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-accent/20 ${form.kind === k ? "bg-[#1F0C02] border-[#1F0C02] text-[#F4E4C1]" : errors.kind ? "border-red-400" : "border-brand-border hover:border-brand-accent"}`}>
                          <input type="radio" name="kind" value={k} checked={form.kind === k} onChange={() => set("kind", k)} className="sr-only" />
                          {k}
                        </label>
                      ))}
                    </div>
                    {errors.kind && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.kind}</p>}
                  </div>
                  <Field id="help-item" label="Item" required error={errors.item}>
                    <input {...control("item")} placeholder="e.g. Black backpack, prayer beads" />
                  </Field>
                  {select("location", "Where (last seen / found)", [...LOCATIONS, "Parking", "Shuttle Bus Bay", "Not sure"], false)}
                </>
              )}

              {type === "complaint" && select("subtype", "Category", ["Security", "Cleanliness", "Food & water", "Transport", "Seating / access", "Staff conduct", "Other"])}

              {type === "feedback" && (
                <>
                  <div className="sm:col-span-2">
                    <p id="rating-label" className="mb-2 text-sm font-semibold text-text-primary">Your rating <span className="text-brand-accent" aria-hidden="true">*</span></p>
                    <div role="radiogroup" aria-labelledby="rating-label" className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <label key={n} className="cursor-pointer rounded-lg p-1 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-accent/30">
                          <input type="radio" name="rating" value={n} checked={form.rating === n} onChange={() => set("rating", n)} className="sr-only" />
                          <Star size={30} aria-hidden="true" className={n <= form.rating ? "fill-[#E8A33D] text-[#E8A33D]" : "text-brand-border"} />
                          <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
                        </label>
                      ))}
                    </div>
                    {errors.rating && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.rating}</p>}
                  </div>
                  {select("session", "About a specific session", SESSIONS, false)}
                </>
              )}

              <Field
                id="help-details"
                label={type === "complaint" ? "What happened?" : "Details"}
                required={type === "complaint"}
                optional={type !== "complaint"}
                error={errors.details}
                className="sm:col-span-2"
              >
                <textarea {...control("details")} rows={4} />
              </Field>

              {error && <p role="alert" className="sm:col-span-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}

              <div className="sm:col-span-2">
                <PrimaryButton type="submit">Submit {current.label}</PrimaryButton>
              </div>
            </form>
          )}
        </div>

        <aside aria-labelledby="my-requests-title" className="rounded-3xl bg-white border border-brand-border p-6 lg:sticky lg:top-28">
          <h3 id="my-requests-title" className="font-cinzel text-lg font-bold">My requests ({tickets.length})</h3>
          {tickets.length === 0 ? (
            <p className="mt-3 text-sm text-text-muted">Requests you submit will appear here with their reference number.</p>
          ) : (
            <ul className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
              {tickets.map((t) => (
                <li key={t.id} className="rounded-2xl border border-brand-border p-3.5 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-text-primary">{t.label}{t.kind ? ` · ${t.kind}` : ""}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${STATUS_STYLE[t.status] || "bg-gray-100 text-gray-700"}`}>{t.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    {t.id} · {new Date(t.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {(t.subtype || t.item) && <p className="mt-1 text-xs">{t.subtype || t.item}</p>}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </div>
  );
};

export default HelpCentre;
