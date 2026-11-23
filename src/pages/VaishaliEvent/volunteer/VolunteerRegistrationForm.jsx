import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HandHeart } from "lucide-react";
import { VOLUNTEER_DASHBOARD_PATH } from "../eventData";
import { Field, FormSection, PrimaryButton, describedBy, inputClass } from "../guest/FormFields";
import { DEPARTMENTS } from "./volunteerData";
import { registerVolunteer, startDemoSession } from "./volunteerStore";

const EMPTY = { fullName: "", email: "", phone: "", organisation: "", department: "" };

const validate = (f) => {
  const e = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  const digits = f.phone.replace(/[\s()-]/g, "");
  if (!/^(\+\d{1,3})?\d{10}$/.test(digits)) e.phone = "Enter a 10-digit mobile number (country code optional, e.g. +91).";
  if (!f.organisation.trim()) e.organisation = "Enter your organisation, institution or “Individual”.";
  if (!f.department) e.department = "Choose a preferred department.";
  return e;
};

const VolunteerRegistrationForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setFormError("");
    const first = Object.keys(errs)[0];
    if (first) return document.getElementById(`v-${first}`)?.focus();
    try {
      const v = registerVolunteer({
        fullName: form.fullName.trim(),
        email: form.email,
        phone: form.phone.trim(),
        organisation: form.organisation.trim(),
        department: form.department,
      });
      navigate(VOLUNTEER_DASHBOARD_PATH, { state: { justRegistered: v.volunteerId } });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const demo = () => {
    startDemoSession();
    navigate(VOLUNTEER_DASHBOARD_PATH);
  };

  const text = (k, label, props = {}) => (
    <Field id={`v-${k}`} label={label} required error={errors[k]} className={props.wide ? "sm:col-span-2" : ""}>
      <input id={`v-${k}`} value={form[k]} onChange={set(k)} className={inputClass(errors[k])} {...describedBy(`v-${k}`, errors[k])} {...props.input} />
    </Field>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-white border border-brand-border p-6 sm:p-10 shadow-sm space-y-8">
      <FormSection step="1" title="Your details">
        {text("fullName", "Full name", { wide: true, input: { autoComplete: "name" } })}
        {text("email", "Email address", { input: { type: "email", autoComplete: "email" } })}
        {text("phone", "Mobile number", { input: { type: "tel", autoComplete: "tel", placeholder: "+91 98765 43210" } })}
      </FormSection>
      <FormSection step="2" title="Where you'd like to serve">
        {text("organisation", "Organisation / Institution", { input: { autoComplete: "organization" } })}
        <Field id="v-department" label="Preferred department" required error={errors.department}>
          <select id="v-department" value={form.department} onChange={set("department")} className={inputClass(errors.department)} {...describedBy("v-department", errors.department)}>
            <option value="">Select a department</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
      </FormSection>

      {formError && <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{formError}</p>}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <PrimaryButton type="submit"><HandHeart size={16} aria-hidden="true" /> Register as Volunteer</PrimaryButton>
        <p className="text-sm">
          Already registered?{" "}
          <Link to={VOLUNTEER_DASHBOARD_PATH} className="font-semibold text-brand-accent hover:underline">Sign in</Link>
          {" · "}
          <button type="button" onClick={demo} className="font-semibold text-brand-accent hover:underline cursor-pointer">Try the demo</button>
        </p>
      </div>
    </form>
  );
};

export default VolunteerRegistrationForm;
