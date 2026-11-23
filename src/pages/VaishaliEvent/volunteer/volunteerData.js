// ── Volunteer programme reference data (IBC Vaishali 2026) ─────────────────

export const DEPARTMENTS = [
  "Registration Desk",
  "Hospitality",
  "Protocol & VIP",
  "Logistics & Transport",
  "Medical Support",
  "Security Liaison",
  "Media & Communications",
  "Cultural Programme",
];

export const PRIORITIES = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-800 border-amber-200",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
export const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

export const TASK_STATUSES = ["To Do", "In Progress", "Done"];
export const statusForProgress = (p) => (p >= 100 ? "Done" : p > 0 ? "In Progress" : "To Do");

export const COMPLAINT_STATUSES = ["Submitted", "Assigned", "In Progress", "Resolved"];
export const COMPLAINT_CATEGORIES = [
  "Facilities & Cleanliness",
  "Crowd / Queue Management",
  "Food & Water",
  "Transport",
  "Accessibility",
  "Lost & Found",
  "Staff / Volunteer Conduct",
  "Other",
];

export const TEAM_LEADS = [
  { name: "Ritika Sinha", role: "Volunteer Coordinator" },
  { name: "Arjun Kumar", role: "Logistics Lead" },
  { name: "Dr. Neha Prasad", role: "Medical Lead" },
  { name: "Sanjay Mishra", role: "Security Liaison Lead" },
  { name: "Ven. Dhammika", role: "Protocol Lead" },
];

export const NOTICE_TYPES = {
  urgent: { label: "Urgent", cls: "bg-red-50 text-red-700 border-red-200" },
  shift: { label: "Shift", cls: "bg-amber-50 text-amber-800 border-amber-200" },
  general: { label: "General", cls: "bg-sky-50 text-sky-800 border-sky-200" },
  event: { label: "Event Update", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
};

// Times are IST; `date` is the conference day
export const seedTasks = (dept) => [
  { title: "Attend volunteer orientation & collect ID badge", priority: "High", due: "2026-12-10T16:00", location: "Main Entrance Pavilion", progress: 0 },
  { title: `Set up the ${dept} desk and signage`, priority: "High", due: "2026-12-11T07:30", location: "Main Entrance Pavilion", progress: 0 },
  { title: "Guide delegates to the Inaugural Ceremony seating", priority: "Medium", due: "2026-12-11T09:00", location: "Smriti Stupa Forecourt", progress: 0 },
  { title: "Distribute water & programme booklets", priority: "Medium", due: "2026-12-11T10:30", location: "Main Auditorium", progress: 0 },
  { title: "Escort heritage-walk group to buses", priority: "Medium", due: "2026-12-12T15:45", location: "Main Entrance Pavilion", progress: 0 },
  { title: "Collect delegate feedback forms", priority: "Low", due: "2026-12-13T16:00", location: "Stupa Lawns", progress: 0 },
];

export const seedShifts = (dept) => [
  { date: "2026-12-11", start: "07:00", end: "13:00", department: dept, location: "Main Entrance Pavilion", lead: "Ritika Sinha" },
  { date: "2026-12-11", start: "17:30", end: "20:30", department: "Cultural Programme", location: "Stupa Lawns", lead: "Ven. Dhammika" },
  { date: "2026-12-12", start: "09:00", end: "14:00", department: dept, location: "Seminar Halls 1–3", lead: "Arjun Kumar" },
  { date: "2026-12-12", start: "15:30", end: "18:30", department: "Logistics & Transport", location: "Kolhua Archaeological Site", lead: "Arjun Kumar" },
  { date: "2026-12-13", start: "06:00", end: "12:00", department: dept, location: "Relic Stupa, Vaishali", lead: "Sanjay Mishra" },
];

export const seedNotices = () => [
  { type: "urgent", date: "2026-10-31T18:00", title: "Orientation is mandatory", text: "All volunteers must attend orientation on 10 December, 14:00 at the Main Entrance Pavilion to collect ID badges and uniforms." },
  { type: "shift", date: "2026-10-30T11:00", title: "Day 2 shift timings revised", text: "Heritage-walk support shifts on 12 December now start at 15:30 instead of 16:00." },
  { type: "general", date: "2026-10-28T09:00", title: "Volunteer meals", text: "Breakfast and lunch are provided at the Delegate Dining Hall. Show your volunteer badge at the counter." },
  { type: "general", date: "2026-10-26T09:00", title: "Volunteer WhatsApp group", text: "Your team lead will add you to your department group one week before the event." },
];

export const seedComplaints = () => [
  { category: "Facilities & Cleanliness", priority: "Medium", location: "Delegate Dining Hall", description: "Hand-wash station near the dining hall is out of soap.", status: "Assigned", assignee: "Arjun Kumar" },
  { category: "Accessibility", priority: "High", location: "Smriti Stupa Forecourt", description: "Wheelchair ramp at the east gate is blocked by stacked chairs.", status: "In Progress", assignee: "Ritika Sinha" },
];
