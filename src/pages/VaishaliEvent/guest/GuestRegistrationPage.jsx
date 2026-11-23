import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, ClipboardList, HandHeart, MapPin, QrCode, ShieldCheck, Ticket } from "lucide-react";
import { DASHBOARD_PATH, EVENT } from "../eventData";
import GuestPageHeader from "./GuestPageHeader";
import { Field, FormSection, PrimaryButton, describedBy, inputClass } from "./FormFields";
import { ATTENDEE_CATEGORIES, DAYS, getCountries } from "./guestOptions";
import { registerGuest, startDemoGuest } from "./guestStore";
import VolunteerRegistrationForm from "../volunteer/VolunteerRegistrationForm";

const ROLES = [
  { id: "delegate", label: "Delegate", hint: "Attend the conference", Icon: Ticket },
  { id: "volunteer", label: "Volunteer", hint: "Serve with the team", Icon: HandHeart },
];

const EMPTY = {
  fullName: "",
  gender: "",
  email: "",
  phone: "",
  nationality: "IN",
  organisation: "",
  designation: "",
  category: "",
  days: [],
  assistance: "",
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = (f) => {
  const e = {};
  if (f.fullName.trim().length < 2) e.fullName = "Please enter your full name as on your photo ID.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address.";
  const digits = f.phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) e.phone = "Enter a phone number with country code, e.g. +91 98765 43210.";
  if (!f.nationality) e.nationality = "Please select your nationality.";
  if (!f.organisation.trim()) e.organisation = "Enter your organisation, or “Independent”.";
  if (!f.designation.trim()) e.designation = "Enter your designation, or “Not applicable”.";
  if (!f.category) e.category = "Please choose an attendee category.";
  if (f.days.length === 0) e.days = "Select at least one day you will attend.";
  if (!f.consent) e.consent = "Please confirm to continue.";
  return e;
};

// Order in which errors receive focus after a failed submit
const FIELD_ORDER = ["fullName", "email", "phone", "nationality", "organisation", "designation", "category", "days", "consent"];

const GuestRegistrationPage = () => {
  const navigate = useNavigate();
  const countries = useMemo(getCountries, []);
  const [role, setRole] = useState("delegate");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const prev = document.title;
    document.title = `Guest Registration – ${EVENT.title} ${EVENT.subtitle} | Bihar Heritage`;
    return () => {
      document.title = prev;
    };
  }, []);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const toggleDay = (id) =>
    set("days", form.days.includes(id) ? form.days.filter((d) => d !== id) : DAYS.map((d) => d.id).filter((d) => d === id || form.days.includes(d)));

  const loginAsDemo = () => {
    try {
      startDemoGuest();
      navigate(DASHBOARD_PATH);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setSubmitError("");
    const found = validate(form);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const guest = registerGuest({
        ...form,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        organisation: form.organisation.trim(),
        designation: form.designation.trim(),
        assistance: form.assistance.trim(),
      });
      navigate(DASHBOARD_PATH, { state: { justRegistered: guest.registrationId } });
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  };

  const text = (name, props = {}) => ({
    id: `reg-${name}`,
    name,
    value: form[name],
    onChange: (e) => set(name, e.target.value),
    className: inputClass(errors[name]),
    ...describedBy(`reg-${name}`, errors[name], props.hint),
  });

  return (
    <main className="bg-brand-dark min-h-screen">
      <GuestPageHeader eyebrow="Guest Registration" title="Register for the Conference">
        Register once to receive your Registration ID, a QR digital pass and a personal dashboard with the
        schedule, reminders, venue map and on-site assistance.
      </GuestPageHeader>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid gap-8 lg:grid-cols-[1fr_320px] items-start">
        <div className="space-y-6">
          <div role="radiogroup" aria-label="Register as" className="grid grid-cols-2 gap-3">
            {ROLES.map(({ id, label, hint, Icon }) => {
              const checked = role === id;
              return (
                <label
                  key={id}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-4 cursor-pointer transition-all has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-accent/20 ${
                    checked
                      ? "border-[#1F0C02] bg-[#1F0C02] text-[#F4E4C1]"
                      : "border-brand-border bg-white hover:border-brand-accent"
                  }`}
                >
                  <input type="radio" name="role" value={id} checked={checked} onChange={() => setRole(id)} className="sr-only" />
                  <Icon size={20} className={checked ? "text-[#E8A33D]" : "text-brand-accent"} aria-hidden="true" />
                  <span>
                    <span className="block font-cinzel text-sm font-bold tracking-wide">{label}</span>
                    <span className={`block text-xs ${checked ? "text-[#F4E4C1]/70" : "text-text-muted"}`}>{hint}</span>
                  </span>
                </label>
              );
            })}
          </div>

          {role === "volunteer" ? (
            <VolunteerRegistrationForm />
          ) : (
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="rounded-3xl bg-white border border-brand-border p-5 sm:p-8 md:p-10 shadow-sm space-y-8"
        >
          <p className="text-sm text-text-muted">
            Fields marked <span className="text-brand-accent">*</span> are required.
          </p>

          <FormSection step="1" title="Personal Details">
            <Field id="reg-fullName" label="Full name" required error={errors.fullName} hint="As printed on your photo ID / passport" className="sm:col-span-2">
              <input {...text("fullName", { hint: true })} autoComplete="name" placeholder="e.g. Ananya Sharma" />
            </Field>
            <Field id="reg-gender" label="Gender" optional>
              <select {...text("gender")}>
                <option value="">Prefer not to say</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </Field>
            <Field id="reg-nationality" label="Nationality" required error={errors.nationality}>
              <select {...text("nationality")} autoComplete="country">
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </Field>
          </FormSection>

          <FormSection step="2" title="Contact Information">
            <Field id="reg-email" label="Email address" required error={errors.email} hint="Your pass and updates are linked to this email">
              <input {...text("email", { hint: true })} type="email" autoComplete="email" inputMode="email" placeholder="name@example.com" />
            </Field>
            <Field id="reg-phone" label="Mobile number" required error={errors.phone} hint="Include country code">
              <input {...text("phone", { hint: true })} type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" />
            </Field>
          </FormSection>

          <FormSection step="3" title="Organisation & Role">
            <Field id="reg-organisation" label="Organisation / Institution" required error={errors.organisation}>
              <input {...text("organisation")} autoComplete="organization" placeholder="e.g. Nava Nalanda Mahavihara" />
            </Field>
            <Field id="reg-designation" label="Designation" required error={errors.designation}>
              <input {...text("designation")} autoComplete="organization-title" placeholder="e.g. Professor of Buddhist Studies" />
            </Field>
            <div className="sm:col-span-2" role="radiogroup" aria-labelledby="reg-category-label" aria-describedby={errors.category ? "reg-category-error" : undefined}>
              <p id="reg-category-label" className="mb-2 text-sm font-semibold text-text-primary">
                Attendee category <span className="text-brand-accent" aria-hidden="true">*</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ATTENDEE_CATEGORIES.map((c) => {
                  const checked = form.category === c;
                  return (
                    <label
                      key={c}
                      className={`flex items-center justify-center text-center rounded-xl border px-3 py-3 text-sm cursor-pointer transition-all has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-accent/20 ${
                        checked
                          ? "border-[#1F0C02] bg-[#1F0C02] text-[#F4E4C1] font-semibold"
                          : `bg-white hover:border-brand-accent ${errors.category ? "border-red-400" : "border-brand-border"}`
                      }`}
                    >
                      <input type="radio" name="category" value={c} checked={checked} onChange={() => set("category", c)} className="sr-only" />
                      {c}
                    </label>
                  );
                })}
              </div>
              {errors.category && <p id="reg-category-error" className="mt-1.5 text-xs font-medium text-red-600">{errors.category}</p>}
            </div>
          </FormSection>

          <FormSection step="4" title="Attendance">
            <div className="sm:col-span-2">
              <p id="reg-days-label" className="mb-2 text-sm font-semibold text-text-primary">
                Days you will attend <span className="text-brand-accent" aria-hidden="true">*</span>
              </p>
              <div role="group" aria-labelledby="reg-days-label" aria-describedby={errors.days ? "reg-days-error" : undefined} className="grid sm:grid-cols-3 gap-2">
                {DAYS.map((d) => {
                  const checked = form.days.includes(d.id);
                  return (
                    <label
                      key={d.id}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition-all has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-accent/20 ${
                        checked ? "border-brand-accent bg-[#FBF1E7]" : `bg-white hover:border-brand-accent ${errors.days ? "border-red-400" : "border-brand-border"}`
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="days"
                        checked={checked}
                        onChange={() => toggleDay(d.id)}
                        className="h-4 w-4 accent-[#C56A3D]"
                      />
                      <span className="text-sm font-medium text-text-primary">{d.label}</span>
                    </label>
                  );
                })}
              </div>
              {errors.days && <p id="reg-days-error" className="mt-1.5 text-xs font-medium text-red-600">{errors.days}</p>}
            </div>
            <Field id="reg-assistance" label="Accessibility or special assistance needs" optional hint="Wheelchair access, dietary needs, interpreter, etc." className="sm:col-span-2">
              <textarea {...text("assistance", { hint: true })} rows={3} />
            </Field>
          </FormSection>

          <div className="border-t border-brand-border pt-7 space-y-5">
            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                aria-invalid={Boolean(errors.consent) || undefined}
                aria-describedby={errors.consent ? "reg-consent-error" : undefined}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#C56A3D]"
              />
              <span>
                I confirm these details are correct and agree to carry a valid photo ID with my digital pass. My details
                will be used only for conference registration, security and communication.
              </span>
            </label>
            {errors.consent && <p id="reg-consent-error" className="-mt-3 ml-7 text-xs font-medium text-red-600">{errors.consent}</p>}

            {submitError && (
              <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {submitError}{" "}
                <Link to={DASHBOARD_PATH} className="font-semibold underline">Find my pass</Link>
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-center">
                <Link to={DASHBOARD_PATH} className="font-semibold text-brand-accent hover:underline">
                  Already registered? Find my pass
                </Link>
                {" · "}
                <button type="button" onClick={loginAsDemo} className="font-semibold text-brand-accent hover:underline cursor-pointer">
                  Login
                </button>
              </p>
              <PrimaryButton type="submit" disabled={submitting}>
                <Ticket size={16} aria-hidden="true" />
                {submitting ? "Registering…" : "Complete Registration"}
              </PrimaryButton>
            </div>
          </div>
        </form>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-3xl bg-[#1F0C02] p-6 text-[#F4E4C1]">
            <p className="font-cinzel text-xs tracking-[0.25em] uppercase !text-[#C79A4A]">The Conference</p>
            <p className="mt-2 font-cinzel text-xl font-bold !text-[#F4E4C1]">{EVENT.title}</p>
            <p className="mt-1 text-sm italic !text-[#F4E4C1]/70">{EVENT.theme}</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex gap-3"><CalendarDays size={18} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />{EVENT.dateLabel}</li>
              <li className="flex gap-3"><MapPin size={18} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />{EVENT.venue}, {EVENT.city}</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white border border-brand-border p-6">
            <p className="font-cinzel text-sm font-bold text-text-primary">After you register</p>
            {role === "volunteer" ? (
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex gap-3"><ClipboardList size={18} className="shrink-0 text-brand-accent" aria-hidden="true" />A personal dashboard with your task assignments and priorities.</li>
                <li className="flex gap-3"><CalendarDays size={18} className="shrink-0 text-brand-accent" aria-hidden="true" />Shift schedules across all three conference days.</li>
                <li className="flex gap-3"><ShieldCheck size={18} className="shrink-0 text-brand-accent" aria-hidden="true" />Notices, on-ground issue reporting and SOS in one place.</li>
              </ul>
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex gap-3"><QrCode size={18} className="shrink-0 text-brand-accent" aria-hidden="true" />A unique Registration ID and QR digital pass, downloadable to your phone.</li>
                <li className="flex gap-3"><CalendarDays size={18} className="shrink-0 text-brand-accent" aria-hidden="true" />Your personal schedule with session reminders.</li>
                <li className="flex gap-3"><ShieldCheck size={18} className="shrink-0 text-brand-accent" aria-hidden="true" />SOS, helpdesk, lost &amp; found and feedback in one place.</li>
              </ul>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default GuestRegistrationPage;
