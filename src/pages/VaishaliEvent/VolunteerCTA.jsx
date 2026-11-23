import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, CalendarClock, HandHeart, MessageSquareWarning, PlayCircle } from "lucide-react";
import { VOLUNTEER_DASHBOARD_PATH, VOLUNTEER_REGISTER_PATH } from "./eventData";
import { SectionHeading } from "./Ornaments";
import { startDemoSession } from "./volunteer/volunteerStore";

const PERKS = [
  { Icon: ClipboardList, text: "Clear task assignments with priorities" },
  { Icon: CalendarClock, text: "Shift schedules across all three days" },
  { Icon: MessageSquareWarning, text: "On-ground issue reporting & tracking" },
];

const VolunteerCTA = () => {
  const navigate = useNavigate();

  const demo = () => {
    startDemoSession();
    navigate(VOLUNTEER_DASHBOARD_PATH);
  };

  return (
    <section aria-labelledby="volunteer-title" className="px-6 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading id="volunteer-title" eyebrow="Serve with us" title="Volunteer Programme" />
        <div className="rounded-3xl bg-white border border-brand-border p-6 sm:p-10 grid gap-8 md:grid-cols-[3fr_2fr] items-center">
          <div>
            <p>
              Welcome delegates from across the Buddhist world, support the programme team and help Vaishali shine as a host.
              Volunteers get a personal dashboard for tasks, shifts, announcements and issue tracking.
            </p>
            <ul className="mt-5 space-y-2.5">
              {PERKS.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-text-primary">
                  <Icon size={18} className="shrink-0 text-brand-accent" aria-hidden="true" /> {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to={VOLUNTEER_REGISTER_PATH}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F0C02] hover:bg-brand-accent px-7 py-4 font-cinzel text-xs font-bold tracking-[0.2em] uppercase text-[#F4E4C1] transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30"
            >
              <HandHeart size={16} aria-hidden="true" /> Become a Volunteer
            </Link>
            <button
              type="button"
              onClick={demo}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C79A4A] hover:bg-[#FFF8EC] px-7 py-4 font-cinzel text-xs font-bold tracking-[0.2em] uppercase text-text-primary transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30"
            >
              <PlayCircle size={16} className="text-brand-accent" aria-hidden="true" /> Volunteer Demo Login
            </button>
            <Link to={VOLUNTEER_DASHBOARD_PATH} className="text-center text-sm font-semibold text-brand-accent hover:underline">
              Already a volunteer? Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerCTA;
