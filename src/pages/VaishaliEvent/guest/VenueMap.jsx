import React, { useMemo, useState } from "react";
import { Clock, ExternalLink, MapPin, Navigation } from "lucide-react";
import { SCHEDULE, VENUE_MAP_URL } from "../eventData";

// Illustrative site plan (viewBox 800×560). Zone names match SCHEDULE
// `location` values so each zone can list the sessions held there.
// TODO: replace coordinates with the official venue layout when available.
const ZONES = [
  { id: "stupa", name: "Smriti Stupa Forecourt", kind: "venue", shape: "circle", cx: 400, cy: 225, r: 70, info: "The Smriti Stupa enshrining the Vaishali relic casket. Ceremonies are held on the forecourt." },
  { id: "lawns", name: "Stupa Lawns", kind: "venue", x: 250, y: 120, w: 300, h: 230, info: "Open lawns around the stupa for the evening programmes and peace prayer.", under: true },
  { id: "museum", name: "Museum Galleries", kind: "venue", x: 40, y: 150, w: 180, h: 140, info: "Buddha Samyak Darshan Museum. Open to delegates between sessions." },
  { id: "meditation", name: "Meditation Hall", kind: "venue", x: 40, y: 30, w: 180, h: 100, info: "Silent hall for meditation. Footwear off; please keep phones silent." },
  { id: "dining", name: "Delegate Dining Hall", kind: "venue", x: 40, y: 310, w: 180, h: 110, info: "Lunch for registered delegates. Vegetarian and Jain options available." },
  { id: "auditorium", name: "Main Auditorium", kind: "venue", x: 580, y: 150, w: 180, h: 140, info: "Keynotes, plenaries and the valedictory sessions. Simultaneous interpretation available." },
  { id: "seminar", name: "Seminar Halls 1–3", kind: "venue", x: 580, y: 310, w: 180, h: 110, info: "Overflow hall for academic sessions." },
  { id: "amphitheatre", name: "Open-Air Amphitheatre", kind: "venue", x: 580, y: 30, w: 180, h: 100, info: "Cultural evening performances." },
  { id: "entrance", name: "Main Entrance Pavilion", kind: "venue", x: 300, y: 450, w: 200, h: 80, info: "Registration & check-in, pass scanning, shuttle departures, helpdesk." },
  { id: "parking", name: "Parking", kind: "facility", x: 40, y: 450, w: 180, h: 80, info: "Car and coach parking. Accessible bays near the entrance." },
  { id: "shuttle", name: "Shuttle Bus Bay", kind: "facility", x: 580, y: 450, w: 180, h: 80, info: "Official shuttles to Patna, Hajipur and the heritage walk sites." },
];

const POINTS = [
  { id: "firstaid", name: "First-Aid Post", short: "+", x: 285, y: 440, color: "#DC2626", info: "Doctor and ambulance on standby at the Main Entrance Pavilion." },
  { id: "helpdesk", name: "Helpdesk · Lost & Found", short: "i", x: 515, y: 440, color: "#1F5FA8", info: "Directions, lost & found, accessibility support, interpreter requests." },
  { id: "wc1", name: "Restrooms (West)", short: "WC", x: 230, y: 300, color: "#5A5A5A", info: "Includes accessible restroom." },
  { id: "wc2", name: "Restrooms (East)", short: "WC", x: 570, y: 300, color: "#5A5A5A", info: "Includes accessible restroom." },
  { id: "water", name: "Drinking Water", short: "W", x: 400, y: 380, color: "#0E7490", info: "Filtered drinking water. Please carry a reusable bottle." },
];

const OFFSITE = ["Kolhua Archaeological Site", "Chak Ramdas Village, Vaishali"];

const sessionsAt = (name) =>
  SCHEDULE.flatMap((d) => d.sessions.filter((s) => s.location === name).map((s) => ({ ...s, day: d.tab })));

const mapsLink = (place) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} Vaishali Bihar`)}`;

const VenueMap = () => {
  const [selectedId, setSelectedId] = useState("entrance");
  const [filter, setFilter] = useState("all");

  const all = useMemo(() => [...ZONES, ...POINTS.map((p) => ({ ...p, kind: "point" }))], []);
  const selected = all.find((z) => z.id === selectedId);
  const sessions = selected ? sessionsAt(selected.name) : [];
  const dim = (kind) =>
    filter === "venues" ? kind !== "venue" : filter === "facilities" ? kind === "venue" : false;

  const zoneProps = (z) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": z.name,
    "aria-pressed": selectedId === z.id,
    onClick: () => setSelectedId(z.id),
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectedId(z.id);
      }
    },
    className: "cursor-pointer outline-none focus-visible:[&>*:first-child]:stroke-[#C56A3D] focus-visible:[&>*:first-child]:stroke-[4]",
    style: { opacity: dim(z.kind) ? 0.3 : 1, transition: "opacity .2s" },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div role="group" aria-label="Filter map" className="inline-flex rounded-full bg-white border border-brand-border p-1">
            {[["all", "All"], ["venues", "Session venues"], ["facilities", "Facilities"]].map(([v, label]) => (
              <button
                key={v}
                type="button"
                aria-pressed={filter === v}
                onClick={() => setFilter(v)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${filter === v ? "bg-[#1F0C02] text-[#F4E4C1]" : "text-text-secondary hover:text-brand-accent"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted">Illustrative site plan — not to scale</p>
        </div>

        <div className="rounded-3xl bg-[#FBF6EC] border border-brand-border p-2 sm:p-4 overflow-hidden">
          <svg viewBox="0 0 800 560" className="w-full h-auto" role="group" aria-label="Interactive venue map. Select a place to see details.">
            {/* paths */}
            <path d="M400 450 V300 M220 220 H330 M470 220 H580 M220 365 H300 M500 365 H580" stroke="#E8DFC8" strokeWidth="14" strokeLinecap="round" fill="none" />
            {ZONES.filter((z) => z.under).map((z) => (
              <g key={z.id} {...zoneProps(z)}>
                <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="28" fill={selectedId === z.id ? "#CFE3B4" : "#DCEBC6"} stroke={selectedId === z.id ? "#C56A3D" : "#B9D39A"} strokeWidth={selectedId === z.id ? 3 : 1.5} />
                <text x={z.x + 16} y={z.y + 26} fontSize="13" fill="#4D6B2E" fontWeight="600">{z.name}</text>
              </g>
            ))}
            {ZONES.filter((z) => !z.under).map((z) => {
              const on = selectedId === z.id;
              const fill = on ? "#1F0C02" : z.kind === "facility" ? "#EFE7D6" : "#FFFFFF";
              const textFill = on ? "#F4E4C1" : "#2C2C2C";
              return (
                <g key={z.id} {...zoneProps(z)}>
                  {z.shape === "circle" ? (
                    <>
                      <circle cx={z.cx} cy={z.cy} r={z.r} fill={on ? "#1F0C02" : "#F4E4C1"} stroke={on ? "#E8A33D" : "#C2A55D"} strokeWidth="3" />
                      <circle cx={z.cx} cy={z.cy} r={z.r - 22} fill="none" stroke={on ? "#E8A33D" : "#C2A55D"} strokeWidth="1.5" />
                      <text x={z.cx} y={z.cy - 4} textAnchor="middle" fontSize="15" fontWeight="700" fill={on ? "#F4E4C1" : "#1F0C02"} fontFamily="Cinzel, serif">Smriti</text>
                      <text x={z.cx} y={z.cy + 15} textAnchor="middle" fontSize="15" fontWeight="700" fill={on ? "#F4E4C1" : "#1F0C02"} fontFamily="Cinzel, serif">Stupa</text>
                    </>
                  ) : (
                    <>
                      <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="16" fill={fill} stroke={on ? "#E8A33D" : "#C2A55D"} strokeWidth={on ? 3 : 1.5} />
                      <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill={textFill}>
                        {z.name}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
            {POINTS.map((p) => {
              const on = selectedId === p.id;
              return (
                <g key={p.id} {...zoneProps({ ...p, kind: "point" })}>
                  <circle cx={p.x} cy={p.y} r={on ? 19 : 15} fill={p.color} stroke="#fff" strokeWidth="3" />
                  <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={p.short.length > 1 ? 10 : 15} fontWeight="700" fill="#fff">{p.short}</text>
                </g>
              );
            })}
            <g transform="translate(755 525)" aria-hidden="true">
              <path d="M0 -18 L7 4 L0 0 L-7 4 Z" fill="#1F0C02" />
              <text y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1F0C02">N</text>
            </g>
          </svg>
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-secondary">
          {POINTS.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: p.color }} aria-hidden="true" />
              {p.name}
            </li>
          ))}
        </ul>
      </div>

      <aside aria-live="polite" className="space-y-4 lg:sticky lg:top-28">
        {selected && (
          <div className="rounded-3xl bg-white border border-brand-border p-6">
            <p className="font-cinzel text-xs tracking-[0.25em] uppercase text-brand-accent">
              {selected.kind === "venue" ? "Session venue" : "Facility"}
            </p>
            <h3 className="mt-2 font-cinzel text-xl font-bold">{selected.name}</h3>
            <p className="mt-2 text-sm">{selected.info}</p>
            {sessions.length > 0 && (
              <>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-text-muted">Sessions here</p>
                <ul className="mt-2 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {sessions.map((s) => (
                    <li key={s.day + s.time} className="text-sm">
                      <span className="block font-medium text-text-primary">{s.title}</span>
                      <span className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Clock size={12} aria-hidden="true" /> {s.day} · {s.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <div className="rounded-3xl bg-white border border-brand-border p-6">
          <p className="font-cinzel text-sm font-bold">Off-site programme locations</p>
          <ul className="mt-3 space-y-2">
            {OFFSITE.map((place) => (
              <li key={place}>
                <a href={mapsLink(place)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-accent hover:underline">
                  <MapPin size={14} aria-hidden="true" /> {place}
                  <ExternalLink size={12} aria-hidden="true" />
                  <span className="sr-only">(opens Google Maps in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={VENUE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1F0C02] hover:bg-brand-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#F4E4C1] transition-colors"
          >
            <Navigation size={15} aria-hidden="true" />
            Directions to the venue
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </div>
      </aside>
    </div>
  );
};

export default VenueMap;
