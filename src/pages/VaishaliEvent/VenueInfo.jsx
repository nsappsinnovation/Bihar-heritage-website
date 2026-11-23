import React from "react";
import { MapPin, Map, Plane, TrainFront, Bus } from "lucide-react";
import venue2 from "../../assets/VaishaliEvent/VaishaliEvent2.webp";
import venue3 from "../../assets/VaishaliEvent/VaishaliEvent3.webp";
import venue4 from "../../assets/VaishaliEvent/VaishaliEvent4.webp";
import { EVENT, VENUE_MAP_URL } from "./eventData";
import { SectionHeading } from "./Ornaments";

const TRAVEL = [
  { Icon: Plane, text: "Patna Airport (PAT) — approx. 55 km, about 1.5 hours by road" },
  { Icon: TrainFront, text: "Hajipur Junction — approx. 35 km; Muzaffarpur Junction — approx. 40 km" },
  { Icon: Bus, text: "Official shuttle buses run from Patna & Hajipur on all three days" },
];

const VenueInfo = () => (
  <section aria-labelledby="venue-title" className="py-20 md:py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionHeading id="venue-title" eyebrow="Where we gather" title="Venue Information" />
      <div className="grid gap-10 lg:grid-cols-2 items-center">
        <div className="grid grid-cols-2 gap-3">
          <img src={venue2} alt="Vaishali conference venue" loading="lazy" className="col-span-2 h-56 sm:h-72 w-full object-cover rounded-2xl" />
          <img src={venue3} alt="Vaishali heritage site" loading="lazy" className="h-36 sm:h-44 w-full object-cover rounded-2xl" />
          <img src={venue4} alt="Vaishali stupa grounds" loading="lazy" className="h-36 sm:h-44 w-full object-cover rounded-2xl" />
        </div>
        <div>
          <h3 className="text-2xl">{EVENT.venue}</h3>
          <p className="mt-3 flex items-start gap-2">
            <MapPin size={18} className="mt-1 shrink-0 text-brand-accent" aria-hidden="true" />
            <span>
              {EVENT.addressLines[0]}
              <br />
              {EVENT.addressLines[1]}
            </span>
          </p>
          <p className="mt-4">
            Built to enshrine the sacred relic casket excavated at Vaishali, the Smriti Stupa and museum complex
            stand near the ancient Licchavi capital, minutes from the Relic Stupa and the Ashokan pillar at Kolhua.
          </p>
          <ul className="mt-6 space-y-3">
            {TRAVEL.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm">
                <Icon size={18} className="mt-0.5 shrink-0 text-brand-gold" aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <a
            href={VENUE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1F0C02] hover:bg-brand-accent px-7 py-3.5 font-cinzel text-xs font-bold tracking-[0.2em] uppercase text-[#F4E4C1] transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30"
          >
            <Map size={16} aria-hidden="true" />
            Explore Interactive Venue Map
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default VenueInfo;
