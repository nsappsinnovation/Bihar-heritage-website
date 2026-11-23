// ── Guest registration store (IBC Vaishali 2026) ───────────────────────────
// All guest data goes through this module. There is no guest endpoint on the
// Heritage-Backend yet, so records are kept in this browser's localStorage;
// when the API exists, replace the bodies of these functions with `api` calls
// (src/services/apiClient.js) and the pages keep working unchanged.

import { DAYS } from "./guestOptions";

const GUESTS_KEY = "ibc26_guests";
const SESSION_KEY = "ibc26_guest_session";
const TICKETS_KEY = "ibc26_tickets";
const REMINDERS_KEY = "ibc26_reminders";

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
    return true;
  } catch {
    return false;
  }
};

// No 0/O/1/I/L so IDs can be read aloud and typed without mistakes
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

export const findGuestByEmail = (email) =>
  read(GUESTS_KEY, []).find((g) => g.email === normaliseEmail(email)) || null;

export const registerGuest = (data) => {
  const guests = read(GUESTS_KEY, []);
  const email = normaliseEmail(data.email);
  if (guests.some((g) => g.email === email)) {
    throw new Error("This email is already registered. Use “Find my pass” to open your dashboard.");
  }
  const guest = {
    ...data,
    email,
    registrationId: newId("IBC26", new Set(guests.map((g) => g.registrationId))),
    registeredAt: new Date().toISOString(),
  };
  if (!write(GUESTS_KEY, [...guests, guest])) {
    throw new Error("Your browser blocked saving the registration. Please enable site storage and try again.");
  }
  write(SESSION_KEY, guest.registrationId);
  return guest;
};

/** Look up a pass by Registration ID + email (both must match). */
export const signInGuest = (registrationId, email) => {
  const id = registrationId.trim().toUpperCase();
  const guest = read(GUESTS_KEY, []).find(
    (g) => g.registrationId === id && g.email === normaliseEmail(email)
  );
  if (guest) write(SESSION_KEY, guest.registrationId);
  return guest || null;
};

export const DEMO_GUEST_ID = "IBC26-DEMO01";

/** Signs in a sample delegate with pre-filled data so the guest dashboard can be previewed. */
export const startDemoGuest = () => {
  const guests = read(GUESTS_KEY, []);
  let demo = guests.find((g) => g.registrationId === DEMO_GUEST_ID);
  if (!demo) {
    demo = {
      registrationId: DEMO_GUEST_ID,
      fullName: "Demo Guest",
      gender: "",
      email: "demo.guest@example.com",
      phone: "+91 98765 43210",
      nationality: "IN",
      organisation: "Nava Nalanda Mahavihara",
      designation: "Professor of Buddhist Studies",
      category: "Delegate",
      days: DAYS.map((d) => d.id),
      assistance: "",
      consent: true,
      registeredAt: new Date().toISOString(),
      demo: true,
    };
    if (!write(GUESTS_KEY, [...guests, demo])) {
      throw new Error("Your browser blocked saving the demo profile. Please enable site storage and try again.");
    }
  }
  write(SESSION_KEY, DEMO_GUEST_ID);
  return demo;
};

export const getCurrentGuest = () => {
  const id = read(SESSION_KEY, null);
  return id ? read(GUESTS_KEY, []).find((g) => g.registrationId === id) || null : null;
};

export const signOutGuest = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* nothing to clear */
  }
};

// ── Help desk tickets: complaint / feedback / lost & found / assistance ──
export const submitTicket = (registrationId, ticket) => {
  const tickets = read(TICKETS_KEY, []);
  const record = {
    ...ticket,
    registrationId,
    id: newId("T", new Set(tickets.map((t) => t.id))),
    status: "Received",
    createdAt: new Date().toISOString(),
  };
  if (!write(TICKETS_KEY, [record, ...tickets])) {
    throw new Error("Could not save your request. Please call the Event Helpdesk instead.");
  }
  return record;
};

export const getTickets = (registrationId) =>
  read(TICKETS_KEY, []).filter((t) => t.registrationId === registrationId);

// ── Session reminders: { [registrationId]: [sessionKey, …] } ──
export const getReminders = (registrationId) => read(REMINDERS_KEY, {})[registrationId] || [];

export const setReminders = (registrationId, keys) => {
  const all = read(REMINDERS_KEY, {});
  write(REMINDERS_KEY, { ...all, [registrationId]: keys });
};
