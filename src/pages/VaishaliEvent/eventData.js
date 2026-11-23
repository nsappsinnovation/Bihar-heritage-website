// ── International Buddhist Conference – Vaishali 2026 ──────────────────────
// Single source of truth for the event page and the homepage hero card.

export const EVENT_PATH = "/vaishali-buddhist-conference-2026";

export const EVENT = {
  title: "International Buddhist Conference",
  subtitle: "Vaishali 2026",
  theme: "Vaishali — Cradle of the Sangha, Light of the Dhamma",
  dateLabel: "11 – 13 December 2026",
  // Opening ceremony, Indian Standard Time
  start: new Date("2026-12-11T09:00:00+05:30"),
  venue: "Buddha Samyak Darshan Museum & Smriti Stupa",
  city: "Vaishali, Bihar",
  addressLines: ["Buddha Samyak Darshan Museum & Smriti Stupa", "Vaishali, Bihar, India, 844128"],
  address: "Buddha Samyak Darshan Museum & Smriti Stupa, Vaishali, Bihar, India, 844128",
  shortDescription:
    "Scholars, monastics and pilgrims from across the world gather in the land where the Buddha preached and the first women's Sangha was founded.",
  description:
    "Three days of keynote addresses, scholarly sessions, meditation, cultural performances and heritage walks across Vaishali — the ancient Licchavi republic where the Buddha delivered his last sermon and announced his Mahaparinirvana.",
};

export const REGISTER_PATH = `${EVENT_PATH}/register`;
export const DASHBOARD_PATH = `${EVENT_PATH}/dashboard`;
export const VOLUNTEER_REGISTER_PATH = `${EVENT_PATH}/volunteer/register`;
export const VOLUNTEER_DASHBOARD_PATH = `${EVENT_PATH}/volunteer/dashboard`;
export const REGISTRATION_URL = REGISTER_PATH;
export const VENUE_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Buddha+Samyak+Darshan+Museum+Vaishali";

export const SCHEDULE = [
  {
    id: "day1",
    tab: "Day 1",
    date: "11 December 2026",
    weekday: "Friday",
    theme: "Opening & Foundations",
    sessions: [
      { time: "09:45 – 09:55", title: "Bodhi Tree Rituals", location: "Smriti Stupa Forecourt" },
      { time: "09:55 – 10:00", title: "Assemble near Dias", location: "Smriti Stupa Forecourt" },
      { time: "10:00 – 10:30", title: "Prayers and Chanting: Theravāda (15 min) and Mahāyāna (15 min)", location: "Smriti Stupa Forecourt" },
      { time: "10:30 – 10:45", title: "Inaugural Prayer Ceremony on the Stage", location: "Smriti Stupa Forecourt" },
      { time: "10:45 – 10:55", title: "Felicitation of Dignitaries on the Stage", location: "Smriti Stupa Forecourt" },
      { time: "10:55 – 11:00", title: "Offering of the Light", location: "Smriti Stupa Forecourt" },
      { time: "11:00 – 11:10", title: "Welcome Speech: Significance of Vaiśālī, Summary of Conference and Introduction of the Dignitaries", location: "Smriti Stupa Forecourt" },
      { time: "11:10 – 11:15", title: "Short Documentary on Vaishali", location: "Smriti Stupa Forecourt" },
      { time: "11:15 – 12:15", title: "Inaugural Speech by the Dignitaries", location: "Smriti Stupa Forecourt" },
      { time: "12:15 – 12:30", title: "Vote of Thanks", location: "Smriti Stupa Forecourt" },
      { time: "12:30 – 14:00", title: "Lunch", location: "Delegate Dining Hall" },
      { time: "14:00 – 17:00", title: "Tripiṭaka Chanting & Religious Rituals", location: "Smriti Stupa Forecourt" },
      { time: "14:00 – 17:00", title: "1st Academic Session", location: "Main Auditorium" },
      { time: "14:00 – 17:00", title: "Round Table Discussion on promotion of tourism in Bihar with tour operators", location: "Main Auditorium" },
      { time: "17:00 – 18:00", title: "Religious Talk by Eminent Buddhist Scholars at the Stage", location: "Smriti Stupa Forecourt" },
      { time: "18:00 – 20:00", title: "Cultural Programme at the Open-Air Stage (by International Artists)", location: "Open-Air Amphitheatre" },
      { time: "20:00 – 21:00", title: "Dinner", location: "Delegate Dining Hall" },
    ],
  },
  {
    id: "day2",
    tab: "Day 2",
    date: "12 December 2026",
    weekday: "Saturday",
    theme: "Dhamma, Scholarship & Dialogue",
    sessions: [
      { time: "08:00 – 08:30", title: "Heritage Walk from Main Gate to Chak Ramdas village (Vaishali Mud Stupa)", location: "Chak Ramdas Village, Vaishali" },
      { time: "08:30 – 09:30", title: "Breakfast", location: "Delegate Dining Hall" },
      { time: "09:30 – 12:30", title: "Religious Programme: Tripiṭaka Chanting & Religious Rituals", location: "Smriti Stupa Forecourt" },
      { time: "09:30 – 12:30", title: "Academic Programme: 2nd Academic Session", location: "Main Auditorium" },
      { time: "12:30 – 13:30", title: "Lunch", location: "Delegate Dining Hall" },
      { time: "13:30 – 17:00", title: "Religious Programme: Tripiṭaka Chanting & Religious Rituals", location: "Smriti Stupa Forecourt" },
      { time: "13:30 – 17:00", title: "Academic Programme: 3rd Academic Session", location: "Main Auditorium" },
      { time: "17:00 – 18:00", title: "Religious Talk", location: "Smriti Stupa Forecourt" },
      { time: "18:00 – 20:00", title: "Cultural Programme at the Open-Air Stage (by State Artists)", location: "Open-Air Amphitheatre" },
      { time: "20:00 – 21:00", title: "Dinner", location: "Delegate Dining Hall" },
    ],
  },
  {
    id: "day3",
    tab: "Day 3",
    date: "13 December 2026",
    weekday: "Sunday",
    theme: "Pilgrimage & Valediction",
    sessions: [
      { time: "07:30 – 09:00", title: "Heritage Walk to Kolhua (Kutarashala Vihar), Bihar", location: "Kolhua Archaeological Site" },
      { time: "09:00 – 10:00", title: "Breakfast", location: "Delegate Dining Hall" },
      { time: "10:00 – 11:00", title: "Closing Ceremony", location: "Smriti Stupa Forecourt" },
      { time: "12:00 – 14:00", title: "Lunch and Departure", location: "Delegate Dining Hall" },
    ],
  },
];

// type: update | schedule | notice | reminder
export const ANNOUNCEMENTS = [
  {
    id: 1,
    type: "update",
    date: "2026-10-28",
    title: "Delegate registration is now open",
    text: "Guests, scholars and pilgrims can now register online. Registered delegates will receive a confirmation and entry pass by email.",
  },
  {
    id: 2,
    type: "schedule",
    date: "2026-10-25",
    title: "Heritage walks on Day 2 and Day 3",
    text: "Day 2 begins with a heritage walk to Chak Ramdas village (Vaishali Mud Stupa) at 08:00 on 12 December. Day 3 opens with a walk to Kolhua at 07:30 on 13 December. Please assemble at the Main Gate.",
  },
  {
    id: 3,
    type: "notice",
    date: "2026-10-20",
    title: "Photo ID required at entry",
    text: "Please carry a valid government photo ID (passport for international delegates) along with your entry pass.",
  },
  {
    id: 4,
    type: "reminder",
    date: "2026-10-15",
    title: "Dress code & venue etiquette",
    text: "Modest attire is requested inside the Smriti Stupa. Footwear must be removed in the relic chamber and meditation hall.",
  },
];

export const EMERGENCY_CONTACTS = [
  { id: "medical", label: "Medical Emergency / Ambulance", number: "108", note: "First-aid post at Main Entrance Pavilion" },
  { id: "police", label: "Police / Security", number: "112", note: "Security desk at every gate" },
  { id: "helpdesk", label: "Event Helpdesk", number: "1800-345-6789", note: "Lost & found, directions, accessibility support" },
  { id: "fire", label: "Fire Services", number: "101" },
  { id: "women", label: "Women Helpline", number: "181" },
];
