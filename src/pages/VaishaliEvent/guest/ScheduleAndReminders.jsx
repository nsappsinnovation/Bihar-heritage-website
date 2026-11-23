import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, BellOff, BellRing, CalendarPlus, Clock, MapPin } from "lucide-react";
import { EVENT, SCHEDULE } from "../eventData";
import { buildIcs } from "./ics";
import { sessionKey, sessionTimes } from "./guestOptions";
import { getReminders, setReminders } from "./guestStore";

const fmtWhen = (date) =>
  date.toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) + " IST";

const untilText = (date, now) => {
  const mins = Math.round((date - now) / 60000);
  if (mins <= 0) return "now";
  if (mins < 60) return `in ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `in ${hours} h`;
  return `in ${Math.round(hours / 24)} days`;
};

// Every session as a flat list with real Date objects
const ALL_SESSIONS = SCHEDULE.flatMap((day) =>
  day.sessions.map((s) => ({ ...s, dayId: day.id, key: sessionKey(day.id, s), ...sessionTimes(day.id, s.time) }))
);

const ScheduleAndReminders = ({ guest, onDownload }) => {
  const firstOwnDay = Math.max(0, SCHEDULE.findIndex((d) => guest.days.includes(d.id)));
  const [active, setActive] = useState(firstOwnDay);
  const [selected, setSelected] = useState(() => getReminders(guest.registrationId));
  const [now, setNow] = useState(() => new Date());
  const tabRefs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const save = (keys) => {
    setSelected(keys);
    setReminders(guest.registrationId, keys);
  };
  const toggle = (key) => save(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  const ownSessions = ALL_SESSIONS.filter((s) => guest.days.includes(s.dayId));
  const remindAll = () => save(ownSessions.map((s) => s.key));

  const reminders = useMemo(
    () => ALL_SESSIONS.filter((s) => selected.includes(s.key)).sort((a, b) => a.start - b.start),
    [selected]
  );
  const upcoming = reminders.filter((s) => s.end > now);
  const next = upcoming[0];

  const exportIcs = (sessions, name) =>
    onDownload(
      name,
      buildIcs(
        sessions.map((s) => ({
          uid: `${guest.registrationId}-${s.key}`.replace(/[^\w-]/g, ""),
          title: `${s.title} — IBC Vaishali 2026`,
          start: s.start,
          end: s.end,
          location: `${s.location}, ${EVENT.address}`,
          description: `Registration ID: ${guest.registrationId}`,
        }))
      ),
      "text/calendar"
    );

  const onKeyDown = (e) => {
    const last = SCHEDULE.length - 1;
    const to =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : null;
    if (to === null) return;
    e.preventDefault();
    setActive(to);
    tabRefs.current[to]?.focus();
  };

  const day = SCHEDULE[active];
  const attending = guest.days.includes(day.id);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">
      {/* ── Schedule ── */}
      <div>
        <div role="tablist" aria-label="Conference days" onKeyDown={onKeyDown} className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {SCHEDULE.map((d, i) => {
            const isActive = i === active;
            const mine = guest.days.includes(d.id);
            return (
              <button
                key={d.id}
                ref={(el) => (tabRefs.current[i] = el)}
                id={`gtab-${d.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`gpanel-${d.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative rounded-2xl border px-2 py-3 text-center transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30 ${
                  isActive ? "bg-[#1F0C02] border-[#1F0C02] text-[#F4E4C1] shadow-lg" : "bg-white border-brand-border hover:border-brand-accent"
                }`}
              >
                <span className="block font-cinzel text-sm sm:text-base font-bold">{d.tab}</span>
                <span className={`block text-[0.65rem] sm:text-xs mt-0.5 ${isActive ? "text-[#C79A4A]" : "text-text-muted"}`}>
                  {d.date.replace(" 2026", "")}
                </span>
                {mine && (
                  <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${isActive ? "bg-[#E8A33D] text-[#1F0C02]" : "bg-[#FBF1E7] text-brand-accent"}`}>
                    Attending
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div id={`gpanel-${day.id}`} role="tabpanel" aria-labelledby={`gtab-${day.id}`}>
          <p className="mb-5 text-sm">
            <span className="font-semibold text-text-primary">{day.weekday}, {day.date}</span>
            <span className="mx-2 text-brand-gold">•</span>
            <span className="italic">{day.theme}</span>
          </p>
          {!attending && (
            <p className="mb-5 rounded-xl bg-[#FBF1E7] border border-brand-border px-4 py-3 text-sm">
              You are not registered for this day. Contact the Event Helpdesk to add it to your pass.
            </p>
          )}
          <ol className="space-y-3">
            {day.sessions.map((s) => {
              const key = sessionKey(day.id, s);
              const on = selected.includes(key);
              return (
                <li key={key} className={`flex items-start gap-4 rounded-2xl border bg-white p-4 sm:p-5 transition-colors ${on ? "border-brand-accent" : "border-brand-border"}`}>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-brand-accent">
                      <Clock size={14} aria-hidden="true" /> {s.time} IST
                    </p>
                    <h4 className="mt-1 text-base md:text-lg font-semibold">{s.title}</h4>
                    <p className="mt-1 flex items-center gap-2 text-sm text-text-muted">
                      <MapPin size={14} aria-hidden="true" /> {s.location}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    aria-pressed={on}
                    aria-label={`${on ? "Remove reminder for" : "Remind me about"} ${s.title}`}
                    className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-full border transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30 ${
                      on ? "bg-brand-accent border-brand-accent text-white" : "border-brand-border text-text-muted hover:border-brand-accent hover:text-brand-accent"
                    }`}
                  >
                    {on ? <BellRing size={18} aria-hidden="true" /> : <Bell size={18} aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* ── Reminders ── */}
      <aside aria-labelledby="reminders-title" className="space-y-4 lg:sticky lg:top-28">
        <div className="rounded-3xl bg-[#1F0C02] p-6 text-[#F4E4C1]">
          <p className="font-cinzel text-xs tracking-[0.25em] uppercase !text-[#C79A4A]">Next reminder</p>
          {next ? (
            <>
              <p className="mt-2 text-lg font-semibold !text-[#F4E4C1]">{next.title}</p>
              <p className="mt-1 text-sm !text-[#F4E4C1]/75">{fmtWhen(next.start)} · {next.location}</p>
              <p className="mt-3 inline-block rounded-full bg-[#E8A33D] px-3 py-1 text-xs font-bold !text-[#1F0C02]">{untilText(next.start, now)}</p>
            </>
          ) : (
            <p className="mt-2 text-sm !text-[#F4E4C1]/75">Tap the bell on any session to set a reminder.</p>
          )}
        </div>

        <div className="rounded-3xl bg-white border border-brand-border p-6">
          <h3 id="reminders-title" className="font-cinzel text-lg font-bold">My reminders ({upcoming.length})</h3>
          {upcoming.length > 0 ? (
            <ul className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {upcoming.map((s) => (
                <li key={s.key} className="flex items-start justify-between gap-3 text-sm">
                  <span>
                    <span className="block font-medium text-text-primary">{s.title}</span>
                    <span className="block text-xs text-text-muted">{fmtWhen(s.start)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggle(s.key)}
                    aria-label={`Remove reminder for ${s.title}`}
                    className="shrink-0 rounded-full p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <BellOff size={16} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <button type="button" onClick={remindAll} className="mt-3 text-sm font-semibold text-brand-accent hover:underline cursor-pointer">
              Remind me of every session on my days
            </button>
          )}

          <div className="mt-5 space-y-2 border-t border-brand-border pt-5">
            <button
              type="button"
              disabled={upcoming.length === 0}
              onClick={() => exportIcs(upcoming, `IBC-Vaishali-2026-reminders-${guest.registrationId}.ics`)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1F0C02] hover:bg-brand-accent disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#F4E4C1] transition-colors cursor-pointer"
            >
              <CalendarPlus size={16} aria-hidden="true" />
              Add reminders to calendar
            </button>
            <p className="text-xs text-text-muted">
              Downloads a calendar file that alerts you 30 minutes before each session (Google, Apple &amp; Outlook calendars).
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ScheduleAndReminders;
