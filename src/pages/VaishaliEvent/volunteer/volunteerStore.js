// ── Volunteer store (IBC Vaishali 2026) ────────────────────────────────────
// Same approach as guest/guestStore.js: there is no volunteer endpoint on the
// Heritage-Backend yet, so records live in this browser's localStorage. Swap
// the function bodies for `api` calls (src/services/apiClient.js) later.

import { useEffect, useState } from "react";
import { ANNOUNCEMENTS } from "../eventData";
import { seedComplaints, seedNotices, seedShifts, seedTasks, statusForProgress } from "./volunteerData";

const VOLUNTEERS_KEY = "ibc26_volunteers";
const SESSION_KEY = "ibc26_volunteer_session";
const TASKS_KEY = "ibc26_vol_tasks";
const SHIFTS_KEY = "ibc26_vol_shifts";
const NOTICES_KEY = "ibc26_vol_notices";
const READS_KEY = "ibc26_vol_notice_reads";
const COMPLAINTS_KEY = "ibc26_vol_complaints";
const CHANGE_EVENT = "ibc26-volunteer-change";

export const DEMO_ID = "VOL26-DEMO01";

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
};

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const randomCode = (length) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
};
const newId = (prefix, existing) => {
  let id;
  do id = `${prefix}-${randomCode(6)}`;
  while (existing.has(id));
  return id;
};

const normaliseEmail = (email) => email.trim().toLowerCase();
const now = () => new Date().toISOString();

/** Re-render whenever any volunteer data changes (this tab or another). */
export const useVolunteerStore = (selector) => {
  const [value, setValue] = useState(selector);
  useEffect(() => {
    const refresh = () => setValue(selector());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
    // selector is recreated each render; subscribe once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
};

// ── Assignments a coordinator would normally create ─────────────────────────
const seedFor = (volunteer) => {
  const tasks = read(TASKS_KEY, []);
  if (!tasks.some((t) => t.volunteerId === volunteer.volunteerId)) {
    const ids = new Set(tasks.map((t) => t.id));
    const mine = seedTasks(volunteer.department).map((t) => {
      const id = newId("TSK", ids);
      ids.add(id);
      return { ...t, id, volunteerId: volunteer.volunteerId, status: statusForProgress(t.progress) };
    });
    write(TASKS_KEY, [...tasks, ...mine]);
  }
  const shifts = read(SHIFTS_KEY, []);
  if (!shifts.some((s) => s.volunteerId === volunteer.volunteerId)) {
    const ids = new Set(shifts.map((s) => s.id));
    const mine = seedShifts(volunteer.department).map((s) => {
      const id = newId("SHF", ids);
      ids.add(id);
      return { ...s, id, volunteerId: volunteer.volunteerId, status: "Scheduled" };
    });
    write(SHIFTS_KEY, [...shifts, ...mine]);
  }
  if (!localStorage.getItem(NOTICES_KEY)) {
    write(NOTICES_KEY, seedNotices().map((n, i) => ({ ...n, id: `VN-${i + 1}` })));
  }
  if (!localStorage.getItem(COMPLAINTS_KEY)) {
    write(
      COMPLAINTS_KEY,
      seedComplaints().map((c, i) => ({
        ...c,
        id: `CMP-SEED${i + 1}`,
        reportedBy: "Coordinator desk",
        createdAt: "2026-10-30T10:00:00.000Z",
        history: [{ status: "Submitted", at: "2026-10-30T10:00:00.000Z" }, { status: c.status, at: "2026-10-31T09:00:00.000Z", note: `Assigned to ${c.assignee}` }],
      }))
    );
  }
};

// ── Volunteers & session ────────────────────────────────────────────────────
export const registerVolunteer = (data) => {
  const volunteers = read(VOLUNTEERS_KEY, []);
  const email = normaliseEmail(data.email);
  if (volunteers.some((v) => v.email === email)) {
    throw new Error("This email is already registered as a volunteer. Sign in on the dashboard with your Volunteer ID.");
  }
  const volunteer = {
    ...data,
    email,
    volunteerId: newId("VOL26", new Set(volunteers.map((v) => v.volunteerId))),
    registeredAt: now(),
  };
  if (!write(VOLUNTEERS_KEY, [...volunteers, volunteer])) {
    throw new Error("Your browser blocked saving the registration. Please enable site storage and try again.");
  }
  write(SESSION_KEY, volunteer.volunteerId);
  seedFor(volunteer);
  return volunteer;
};

export const signInVolunteer = (volunteerId, email) => {
  const id = volunteerId.trim().toUpperCase();
  const v = read(VOLUNTEERS_KEY, []).find((x) => x.volunteerId === id && x.email === normaliseEmail(email));
  if (v) {
    write(SESSION_KEY, v.volunteerId);
    seedFor(v);
  }
  return v || null;
};

/** Development shortcut: signs in a sample volunteer with pre-filled data. */
export const startDemoSession = () => {
  const volunteers = read(VOLUNTEERS_KEY, []);
  let demo = volunteers.find((v) => v.volunteerId === DEMO_ID);
  if (!demo) {
    demo = {
      volunteerId: DEMO_ID,
      fullName: "Demo Volunteer",
      email: "demo.volunteer@example.com",
      phone: "+91 98765 43210",
      organisation: "Nava Nalanda Mahavihara",
      department: "Hospitality",
      registeredAt: now(),
      demo: true,
    };
    write(VOLUNTEERS_KEY, [...volunteers, demo]);
  }
  write(SESSION_KEY, DEMO_ID);
  seedFor(demo);
  return demo;
};

export const getCurrentVolunteer = () => {
  const id = read(SESSION_KEY, null);
  return id ? read(VOLUNTEERS_KEY, []).find((v) => v.volunteerId === id) || null : null;
};

export const signOutVolunteer = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* nothing to clear */
  }
};

// ── Tasks ───────────────────────────────────────────────────────────────────
export const getTasks = (volunteerId) => read(TASKS_KEY, []).filter((t) => t.volunteerId === volunteerId);

export const setTaskProgress = (taskId, progress) => {
  const p = Math.max(0, Math.min(100, Math.round(progress)));
  write(TASKS_KEY, read(TASKS_KEY, []).map((t) => (t.id === taskId ? { ...t, progress: p, status: statusForProgress(p), updatedAt: now() } : t)));
};

// ── Shifts ──────────────────────────────────────────────────────────────────
export const getShifts = (volunteerId) =>
  read(SHIFTS_KEY, [])
    .filter((s) => s.volunteerId === volunteerId)
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

const patchShift = (id, patch) =>
  write(SHIFTS_KEY, read(SHIFTS_KEY, []).map((s) => (s.id === id ? { ...s, ...patch } : s)));

export const checkInShift = (id) => patchShift(id, { status: "Checked in", checkedInAt: now() });
export const requestShiftSwap = (id, reason) => patchShift(id, { status: "Swap requested", swapReason: reason });
export const cancelShiftSwap = (id) => patchShift(id, { status: "Scheduled", swapReason: undefined });

// ── Announcements & notifications ───────────────────────────────────────────
/** Volunteer notices + the public event announcements, newest first. */
export const getNotices = (volunteerId) => {
  const reads = read(READS_KEY, {})[volunteerId] || [];
  const event = ANNOUNCEMENTS.map((a) => ({ id: `EV-${a.id}`, type: "event", date: a.date, title: a.title, text: a.text }));
  return [...read(NOTICES_KEY, []), ...event]
    .map((n) => ({ ...n, read: reads.includes(n.id) }))
    .sort((a, b) => b.date.localeCompare(a.date));
};

export const markNoticesRead = (volunteerId, ids) => {
  const all = read(READS_KEY, {});
  write(READS_KEY, { ...all, [volunteerId]: [...new Set([...(all[volunteerId] || []), ...ids])] });
};

// ── Complaints ──────────────────────────────────────────────────────────────
export const getComplaints = () => read(COMPLAINTS_KEY, []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const submitComplaint = (volunteer, data) => {
  const complaints = read(COMPLAINTS_KEY, []);
  const at = now();
  const record = {
    ...data,
    id: newId("CMP", new Set(complaints.map((c) => c.id))),
    reportedBy: `${volunteer.fullName} (${volunteer.volunteerId})`,
    status: "Submitted",
    assignee: null,
    createdAt: at,
    history: [{ status: "Submitted", at }],
  };
  if (!write(COMPLAINTS_KEY, [record, ...complaints])) throw new Error("Could not save the complaint. Please try again.");
  return record;
};

/** Apply a change and append it to the complaint's history timeline. */
export const updateComplaint = (id, { status, assignee, note }) => {
  write(
    COMPLAINTS_KEY,
    read(COMPLAINTS_KEY, []).map((c) => {
      if (c.id !== id) return c;
      const next = { ...c };
      if (assignee !== undefined) next.assignee = assignee;
      if (status) next.status = status;
      if (status === "Resolved") next.resolution = note;
      next.history = [...c.history, { status: next.status, at: now(), note }];
      return next;
    })
  );
};
