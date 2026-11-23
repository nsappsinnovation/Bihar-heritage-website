import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Bell, CalendarClock, CheckCircle2, ClipboardList, LogOut, MessageSquareWarning, PlayCircle, X } from "lucide-react";
import { EVENT, VOLUNTEER_REGISTER_PATH } from "../eventData";
import SOSButton from "../SOSButton";
import GuestPageHeader from "../guest/GuestPageHeader";
import { Field, PrimaryButton, inputClass } from "../guest/FormFields";
import TasksPanel from "./TasksPanel";
import ShiftsPanel from "./ShiftsPanel";
import NoticesPanel from "./NoticesPanel";
import ComplaintsPanel from "./ComplaintsPanel";
import {
  getComplaints,
  getCurrentVolunteer,
  getNotices,
  getShifts,
  getTasks,
  signInVolunteer,
  signOutVolunteer,
  startDemoSession,
  useVolunteerStore,
} from "./volunteerStore";

const TABS = [
  { id: "tasks", label: "Tasks", Icon: ClipboardList },
  { id: "shifts", label: "Shifts", Icon: CalendarClock },
  { id: "notices", label: "Announcements", Icon: Bell },
  { id: "complaints", label: "Complaints", Icon: MessageSquareWarning },
];

const SignIn = ({ onSignedIn }) => {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!id.trim() || !email.trim()) return setError("Enter both your Volunteer ID and email.");
    const v = signInVolunteer(id, email);
    if (!v) return setError("No volunteer matches that ID and email on this device. Check both and try again.");
    onSignedIn(v);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-6">
      <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-white border border-brand-border p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h2 className="font-cinzel text-2xl font-bold">Volunteer sign in</h2>
          <p className="mt-1 text-sm">Use the Volunteer ID you received after registering (e.g. VOL26-7KQ2MX) and your email.</p>
        </div>
        <Field id="vol-id" label="Volunteer ID" required>
          <input id="vol-id" value={id} onChange={(e) => setId(e.target.value.toUpperCase())} spellCheck={false} placeholder="VOL26-XXXXXX" className={`${inputClass(false)} font-semibold tracking-wider`} />
        </Field>
        <Field id="vol-email" label="Email address" required>
          <input id="vol-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass(false)} />
        </Field>
        {error && <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}
        <PrimaryButton type="submit" className="w-full">Open dashboard</PrimaryButton>
        <p className="text-center text-sm">
          Not a volunteer yet?{" "}
          <Link to={VOLUNTEER_REGISTER_PATH} className="font-semibold text-brand-accent hover:underline">Become a Volunteer</Link>
        </p>
      </form>

      <div className="rounded-3xl border border-dashed border-[#C79A4A] bg-[#FFF8EC] p-6 text-center">
        <p className="text-sm">For development and previews, explore the dashboard with sample data.</p>
        <button
          type="button"
          onClick={() => onSignedIn(startDemoSession())}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E8A33D] hover:bg-[#1F0C02] hover:text-[#F4E4C1] px-7 py-3 font-cinzel text-xs font-bold tracking-[0.2em] uppercase text-[#1F0C02] transition-colors cursor-pointer"
        >
          <PlayCircle size={16} aria-hidden="true" /> Volunteer Demo Login
        </button>
      </div>
    </div>
  );
};

const Stat = ({ label, value, sub, onClick }) => (
  <button type="button" onClick={onClick} className="text-left rounded-2xl bg-white border border-brand-border hover:border-brand-accent p-4 sm:p-5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/20">
    <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</span>
    <span className="mt-1 block font-cinzel text-2xl sm:text-3xl font-bold text-text-primary">{value}</span>
    {sub && <span className="block text-xs text-text-muted mt-0.5">{sub}</span>}
  </button>
);

const Dashboard = ({ volunteer, onSignOut, welcome, onDismissWelcome }) => {
  const [params, setParams] = useSearchParams();
  const tabRefs = useRef([]);
  const active = TABS.some((t) => t.id === params.get("tab")) ? params.get("tab") : "tasks";
  const setTab = (id) => setParams(id === "tasks" ? {} : { tab: id }, { replace: true });

  const stats = useVolunteerStore(() => {
    const tasks = getTasks(volunteer.volunteerId);
    return {
      progress: tasks.length ? Math.round((tasks.filter((t) => t.status === "Done").length / tasks.length) * 100) : 0,
      openTasks: tasks.filter((t) => t.status !== "Done").length,
      shifts: getShifts(volunteer.volunteerId).filter((s) => s.status !== "Checked in").length,
      unread: getNotices(volunteer.volunteerId).filter((n) => !n.read).length,
      complaints: getComplaints().filter((c) => c.status !== "Resolved").length,
    };
  });

  const onKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === active);
    const to = e.key === "ArrowRight" ? (i + 1) % TABS.length : e.key === "ArrowLeft" ? (i - 1 + TABS.length) % TABS.length : null;
    if (to === null) return;
    e.preventDefault();
    setTab(TABS[to].id);
    tabRefs.current[to]?.focus();
  };

  return (
    <>
      <GuestPageHeader eyebrow="Volunteer Dashboard" title={`Namaste, ${volunteer.fullName.split(" ")[0]}`}>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>Volunteer ID <span className="font-cinzel font-bold tracking-wider text-[#E8A33D]">{volunteer.volunteerId}</span></span>
          <span className="text-[#C79A4A]" aria-hidden="true">•</span>
          <span>{volunteer.department}</span>
          {volunteer.demo && <span className="rounded-full border border-[#E8A33D]/60 px-2.5 py-0.5 text-xs text-[#E8A33D]">Demo data</span>}
          <button type="button" onClick={() => setTab("notices")} className="relative inline-flex items-center gap-1.5 text-sm text-[#C79A4A] hover:text-[#F4E4C1] cursor-pointer" aria-label={`Notifications, ${stats.unread} unread`}>
            <Bell size={15} aria-hidden="true" />
            {stats.unread > 0 && <span className="absolute -top-2 -right-3 min-w-[1.1rem] rounded-full bg-[#C56A3D] px-1 text-center text-[0.6rem] font-bold leading-[1.1rem] text-white">{stats.unread}</span>}
          </button>
          <button type="button" onClick={onSignOut} className="inline-flex items-center gap-1.5 text-sm text-[#C79A4A] hover:text-[#F4E4C1] cursor-pointer">
            <LogOut size={14} aria-hidden="true" /> Sign out
          </button>
        </span>
      </GuestPageHeader>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {welcome === volunteer.volunteerId && (
          <div role="status" className="mb-8 flex items-start gap-4 rounded-2xl bg-[#EEF7EE] border border-green-200 p-5">
            <CheckCircle2 size={24} className="shrink-0 text-green-700" aria-hidden="true" />
            <div className="flex-1 text-sm text-green-900">
              <p className="font-semibold text-base text-green-800">Welcome to the volunteer team!</p>
              <p className="mt-1">Your Volunteer ID is <strong className="tracking-wider">{volunteer.volunteerId}</strong>. Keep it safe — you'll need it with your email to sign in again.</p>
            </div>
            <button type="button" onClick={onDismissWelcome} aria-label="Dismiss" className="rounded-full p-1.5 text-green-800 hover:bg-green-100 cursor-pointer">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Stat label="Task progress" value={`${stats.progress}%`} sub={`${stats.openTasks} open tasks`} onClick={() => setTab("tasks")} />
          <Stat label="Upcoming shifts" value={stats.shifts} sub="11 – 13 Dec" onClick={() => setTab("shifts")} />
          <Stat label="Unread notices" value={stats.unread} onClick={() => setTab("notices")} />
          <Stat label="Open complaints" value={stats.complaints} onClick={() => setTab("complaints")} />
        </div>

        <div role="tablist" aria-label="Dashboard sections" onKeyDown={onKeyDown} className="mb-8 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
          {TABS.map(({ id, label, Icon }, i) => {
            const on = active === id;
            return (
              <button
                key={id}
                ref={(el) => (tabRefs.current[i] = el)}
                id={`vtab-${id}`}
                role="tab"
                aria-selected={on}
                aria-controls={`vpanel-${id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30 ${
                  on ? "bg-[#1F0C02] border-[#1F0C02] text-[#F4E4C1] shadow-md" : "bg-white border-brand-border text-text-primary hover:border-brand-accent"
                }`}
              >
                <Icon size={16} aria-hidden="true" className={on ? "text-[#E8A33D]" : "text-brand-accent"} />
                {label}
                {id === "notices" && stats.unread > 0 && (
                  <span className="rounded-full bg-[#C56A3D] px-1.5 text-[0.65rem] font-bold text-white">{stats.unread}</span>
                )}
              </button>
            );
          })}
        </div>

        <section id={`vpanel-${active}`} role="tabpanel" aria-labelledby={`vtab-${active}`} tabIndex={-1} className="focus:outline-none">
          {active === "tasks" && <TasksPanel volunteer={volunteer} />}
          {active === "shifts" && <ShiftsPanel volunteer={volunteer} />}
          {active === "notices" && <NoticesPanel volunteer={volunteer} />}
          {active === "complaints" && <ComplaintsPanel volunteer={volunteer} />}
        </section>
      </div>
    </>
  );
};

const VolunteerDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(getCurrentVolunteer);
  const [welcome, setWelcome] = useState(location.state?.justRegistered || null);

  useEffect(() => {
    const prev = document.title;
    document.title = `Volunteer Dashboard – ${EVENT.title} ${EVENT.subtitle} | Bihar Heritage`;
    return () => {
      document.title = prev;
    };
  }, []);

  const signOut = () => {
    signOutVolunteer();
    setVolunteer(null);
    setWelcome(null);
    navigate(location.pathname, { replace: true });
  };

  return (
    <main className="bg-brand-dark min-h-screen">
      {volunteer ? (
        <Dashboard key={volunteer.volunteerId} volunteer={volunteer} onSignOut={signOut} welcome={welcome} onDismissWelcome={() => setWelcome(null)} />
      ) : (
        <>
          <GuestPageHeader eyebrow="Volunteer Dashboard" title="Welcome, Volunteer">
            Your tasks, shifts, announcements and complaint tracking in one place.
          </GuestPageHeader>
          <SignIn onSignedIn={setVolunteer} />
        </>
      )}
      <SOSButton />
    </main>
  );
};

export default VolunteerDashboardPage;
