import React, { useState } from "react";
import { CalendarPlus, Clock, LogIn, MapPin, Repeat, User, Users } from "lucide-react";
import { SCHEDULE } from "../eventData";
import { buildIcs, downloadFile } from "../guest/ics";
import { inputClass } from "../guest/FormFields";
import { cancelShiftSwap, checkInShift, getShifts, requestShiftSwap, useVolunteerStore } from "./volunteerStore";
import { Chip, ghostButton } from "./ui";

const DAYS = SCHEDULE.map((d, i) => ({ id: `2026-12-${11 + i}`, tab: d.tab, label: d.date.replace(" 2026", "") }));

const STATUS_CLS = {
  Scheduled: "bg-sky-50 text-sky-800 border-sky-200",
  "Checked in": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Swap requested": "bg-amber-50 text-amber-800 border-amber-200",
};

const toDate = (date, time) => new Date(`${date}T${time}:00+05:30`);
const todayIst = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const ShiftsPanel = ({ volunteer }) => {
  const shifts = useVolunteerStore(() => getShifts(volunteer.volunteerId));
  const [day, setDay] = useState(DAYS[0].id);
  const [swapFor, setSwapFor] = useState(null);
  const [reason, setReason] = useState("");

  const dayShifts = shifts.filter((s) => s.date === day);
  // Check-in opens on the shift date; the demo account can check in any time
  const canCheckIn = (s) => s.status === "Scheduled" && (volunteer.demo || s.date === todayIst());

  const submitSwap = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    requestShiftSwap(swapFor, reason.trim());
    setSwapFor(null);
    setReason("");
  };

  const exportIcs = () =>
    downloadFile(
      "IBC26-volunteer-shifts.ics",
      buildIcs(
        shifts.map((s) => ({
          uid: s.id,
          title: `Volunteer shift – ${s.department}`,
          start: toDate(s.date, s.start),
          end: toDate(s.date, s.end),
          location: s.location,
          description: `Team lead: ${s.lead}`,
        })),
        30
      ),
      "text/calendar"
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-cinzel text-xl font-bold">My Shifts</h2>
          <p className="text-sm text-text-muted">{shifts.length} shifts across the three conference days · times in IST</p>
        </div>
        <button type="button" onClick={exportIcs} className={ghostButton}>
          <CalendarPlus size={14} aria-hidden="true" /> Add all to calendar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Choose day">
        {DAYS.map((d) => {
          const on = d.id === day;
          const count = shifts.filter((s) => s.date === d.id).length;
          return (
            <button
              key={d.id}
              type="button"
              aria-pressed={on}
              onClick={() => setDay(d.id)}
              className={`rounded-2xl border px-2 py-3 text-center transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30 ${
                on ? "bg-[#1F0C02] border-[#1F0C02] text-[#F4E4C1]" : "bg-white border-brand-border text-text-primary hover:border-brand-accent"
              }`}
            >
              <span className="block font-cinzel text-sm sm:text-base font-bold">{d.tab}</span>
              <span className={`block text-[0.65rem] sm:text-xs ${on ? "text-[#C79A4A]" : "text-text-muted"}`}>{d.label} · {count} shift{count === 1 ? "" : "s"}</span>
            </button>
          );
        })}
      </div>

      {dayShifts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-border p-8 text-center text-sm">No shifts on this day.</p>
      ) : (
        <ul className="space-y-4">
          {dayShifts.map((s) => (
            <li key={s.id} className="rounded-2xl bg-white border border-brand-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-cinzel text-lg font-bold text-text-primary">
                    <Clock size={16} className="text-brand-accent" aria-hidden="true" /> {s.start} – {s.end}
                  </p>
                  <div className="mt-2 grid gap-1 text-sm">
                    <span className="flex items-center gap-2"><Users size={14} className="text-brand-gold" aria-hidden="true" /> {s.department}</span>
                    <span className="flex items-center gap-2"><MapPin size={14} className="text-brand-gold" aria-hidden="true" /> {s.location}</span>
                    <span className="flex items-center gap-2"><User size={14} className="text-brand-gold" aria-hidden="true" /> Team lead: {s.lead}</span>
                  </div>
                  {s.swapReason && <p className="mt-2 text-xs italic text-text-muted">Swap reason: {s.swapReason}</p>}
                </div>
                <Chip cls={STATUS_CLS[s.status]}>{s.status}</Chip>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" disabled={!canCheckIn(s)} onClick={() => checkInShift(s.id)} className={ghostButton} title={canCheckIn(s) ? undefined : "Check-in opens on the shift date"}>
                  <LogIn size={14} aria-hidden="true" /> {s.status === "Checked in" ? "Checked in" : "Check in"}
                </button>
                {s.status === "Scheduled" && (
                  <button type="button" onClick={() => setSwapFor(swapFor === s.id ? null : s.id)} aria-expanded={swapFor === s.id} className={ghostButton}>
                    <Repeat size={14} aria-hidden="true" /> Request swap
                  </button>
                )}
                {s.status === "Swap requested" && (
                  <button type="button" onClick={() => cancelShiftSwap(s.id)} className={ghostButton}>Cancel swap request</button>
                )}
              </div>

              {swapFor === s.id && (
                <form onSubmit={submitSwap} className="mt-4 flex flex-col sm:flex-row gap-2">
                  <label htmlFor={`swap-${s.id}`} className="sr-only">Reason for swap</label>
                  <input id={`swap-${s.id}`} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for swap request" required className={inputClass(false)} />
                  <button type="submit" className="shrink-0 rounded-full bg-[#1F0C02] hover:bg-brand-accent px-5 py-3 text-xs font-semibold text-[#F4E4C1] cursor-pointer">Send request</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShiftsPanel;
