// Minimal iCalendar (.ics) builder so guests can put sessions, with alarms,
// into Google / Apple / Outlook calendars. Works offline, no backend needed.

const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escape = (text = "") =>
  String(text).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

/**
 * @param {{ uid: string, title: string, start: Date, end: Date, location?: string, description?: string }[]} events
 * @param {number} alarmMinutes  minutes before start to remind
 */
export const buildIcs = (events, alarmMinutes = 30) => {
  const now = stamp(new Date());
  const body = events.flatMap((e) => [
    "BEGIN:VEVENT",
    `UID:${e.uid}@biharheritage`,
    `DTSTAMP:${now}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${escape(e.title)}`,
    e.location && `LOCATION:${escape(e.location)}`,
    e.description && `DESCRIPTION:${escape(e.description)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escape(e.title)}`,
    `TRIGGER:-PT${alarmMinutes}M`,
    "END:VALARM",
    "END:VEVENT",
  ].filter(Boolean));

  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bihar Heritage//IBC Vaishali 2026//EN", "CALSCALE:GREGORIAN", ...body, "END:VCALENDAR"].join("\r\n");
};

export const downloadFile = (filename, content, type) => {
  const url = URL.createObjectURL(content instanceof Blob ? content : new Blob([content], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
