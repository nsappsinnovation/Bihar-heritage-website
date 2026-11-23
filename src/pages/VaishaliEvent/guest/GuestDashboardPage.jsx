import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, LifeBuoy, LogOut, Map, Ticket, UserPlus, X } from "lucide-react";
import { EVENT, REGISTER_PATH } from "../eventData";
import SOSButton from "../SOSButton";
import GuestPageHeader from "./GuestPageHeader";
import GuestPass from "./GuestPass";
import ScheduleAndReminders from "./ScheduleAndReminders";
import VenueMap from "./VenueMap";
import HelpCentre from "./HelpCentre";
import { Field, PrimaryButton, inputClass } from "./FormFields";
import { downloadFile } from "./ics";
import { getCurrentGuest, signInGuest, signOutGuest } from "./guestStore";

const TABS = [
  { id: "pass", label: "My Pass", Icon: Ticket },
  { id: "schedule", label: "Schedule & Reminders", Icon: CalendarDays },
  { id: "map", label: "Venue Map", Icon: Map },
  { id: "help", label: "Help & SOS", Icon: LifeBuoy },
];

// When printing, show only the pass card (dark background kept)
const PRINT_CSS = `@media print {
  body * { visibility: hidden !important; }
  #guest-pass, #guest-pass * { visibility: visible !important; }
  #guest-pass { position: absolute; left: 50%; top: 0; transform: translateX(-50%); width: 380px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}`;

const FindMyPass = ({ onFound }) => {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!id.trim() || !email.trim()) return setError("Enter both your Registration ID and email.");
    const guest = signInGuest(id, email);
    if (!guest) return setError("No registration matches that ID and email on this device. Check both and try again.");
    onFound(guest);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h2 className="font-cinzel text-2xl font-bold">Find my pass</h2>
          <p className="mt-1 text-sm">Enter the Registration ID shown after you registered (e.g. IBC26-7KQ2MX) and your email.</p>
        </div>
        <Field id="find-id" label="Registration ID" required>
          <input
            id="find-id"
            value={id}
            onChange={(e) => setId(e.target.value.toUpperCase())}
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="IBC26-XXXXXX"
            className={`${inputClass(false)} font-semibold tracking-wider`}
          />
        </Field>
        <Field id="find-email" label="Email address" required>
          <input id="find-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass(false)} />
        </Field>
        {error && <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}
        <PrimaryButton type="submit" className="w-full">Open my dashboard</PrimaryButton>
        <p className="text-center text-sm">
          Not registered yet?{" "}
          <Link to={REGISTER_PATH} className="font-semibold text-brand-accent hover:underline">Register for the conference</Link>
        </p>
      </form>
    </div>
  );
};

const GuestDashboardPage = () => {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [guest, setGuest] = useState(getCurrentGuest);
  const [welcome, setWelcome] = useState(location.state?.justRegistered || null);
  const tabRefs = useRef([]);

  const active = TABS.some((t) => t.id === params.get("tab")) ? params.get("tab") : "pass";
  const setTab = (id) => setParams(id === "pass" ? {} : { tab: id }, { replace: true });

  useEffect(() => {
    const prev = document.title;
    document.title = `Guest Dashboard – ${EVENT.title} ${EVENT.subtitle} | Bihar Heritage`;
    return () => {
      document.title = prev;
    };
  }, []);

  const onKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === active);
    const to = e.key === "ArrowRight" ? (i + 1) % TABS.length : e.key === "ArrowLeft" ? (i - 1 + TABS.length) % TABS.length : null;
    if (to === null) return;
    e.preventDefault();
    setTab(TABS[to].id);
    tabRefs.current[to]?.focus();
  };

  const signOut = () => {
    signOutGuest();
    setGuest(null);
    setWelcome(null);
  };

  const download = (name, content, type) => downloadFile(name, content, type);

  if (!guest) {
    return (
      <main className="bg-brand-dark min-h-screen">
        <GuestPageHeader eyebrow="Guest Dashboard" title="Welcome, Guest">
          Open your digital pass, personal schedule and on-site assistance.
        </GuestPageHeader>
        <FindMyPass onFound={setGuest} />
        <SOSButton />
      </main>
    );
  }

  const firstName = guest.fullName.split(" ")[0];

  return (
    <main className="bg-brand-dark min-h-screen">
      <style>{PRINT_CSS}</style>
      <GuestPageHeader eyebrow="Guest Dashboard" title={`Namaste, ${firstName}`}>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>
            Registration ID <span className="font-cinzel font-bold tracking-wider text-[#E8A33D]">{guest.registrationId}</span>
          </span>
          <span className="text-[#C79A4A]" aria-hidden="true">•</span>
          <span>{guest.category}</span>
          <button type="button" onClick={signOut} className="inline-flex items-center gap-1.5 text-sm text-[#C79A4A] hover:text-[#F4E4C1] cursor-pointer">
            <LogOut size={14} aria-hidden="true" /> Sign out
          </button>
        </span>
      </GuestPageHeader>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {welcome === guest.registrationId && (
          <div role="status" className="mb-8 flex items-start gap-4 rounded-2xl bg-[#EEF7EE] border border-green-200 p-5">
            <CheckCircle2 size={24} className="shrink-0 text-green-700" aria-hidden="true" />
            <div className="flex-1 text-sm text-green-900">
              <p className="font-semibold text-base text-green-800">Registration successful!</p>
              <p className="mt-1">
                Your Registration ID is <strong className="tracking-wider">{guest.registrationId}</strong>. Download your pass below and keep this ID safe — you'll
                need it with your email to open this dashboard on another visit.
              </p>
            </div>
            <button type="button" onClick={() => setWelcome(null)} aria-label="Dismiss" className="rounded-full p-1.5 text-green-800 hover:bg-green-100 cursor-pointer">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        <div
          role="tablist"
          aria-label="Dashboard sections"
          onKeyDown={onKeyDown}
          className="mb-8 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] print:hidden"
        >
          {TABS.map(({ id, label, Icon }, i) => {
            const on = active === id;
            return (
              <button
                key={id}
                ref={(el) => (tabRefs.current[i] = el)}
                id={`dtab-${id}`}
                role="tab"
                aria-selected={on}
                aria-controls={`dpanel-${id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30 ${
                  on ? "bg-[#1F0C02] border-[#1F0C02] text-[#F4E4C1] shadow-md" : "bg-white border-brand-border text-text-primary hover:border-brand-accent"
                }`}
              >
                <Icon size={16} aria-hidden="true" className={on ? "text-[#E8A33D]" : "text-brand-accent"} />
                {label}
              </button>
            );
          })}
        </div>

        <section id={`dpanel-${active}`} role="tabpanel" aria-labelledby={`dtab-${active}`} tabIndex={-1} className="focus:outline-none">
          {active === "pass" && <GuestPass guest={guest} onDownload={download} />}
          {active === "schedule" && <ScheduleAndReminders guest={guest} onDownload={download} />}
          {active === "map" && <VenueMap />}
          {active === "help" && <HelpCentre guest={guest} />}
        </section>

        <p className="mt-14 text-center text-sm text-text-muted print:hidden">
          Registering someone else?{" "}
          <Link to={REGISTER_PATH} onClick={signOut} className="inline-flex items-center gap-1 font-semibold text-brand-accent hover:underline">
            <UserPlus size={14} aria-hidden="true" /> New registration
          </Link>
        </p>
      </div>
      <SOSButton />
    </main>
  );
};

export default GuestDashboardPage;
