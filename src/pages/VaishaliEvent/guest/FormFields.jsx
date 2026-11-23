import React from "react";

export const inputClass = (invalid) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-text-primary placeholder:text-text-muted/70 transition-colors focus:outline-none focus-visible:ring-4 ${
    invalid
      ? "border-red-500 focus-visible:ring-red-200"
      : "border-brand-border hover:border-brand-gold focus:border-brand-accent focus-visible:ring-brand-accent/20"
  }`;

/** Label + control + hint/error, wired up with ids for screen readers. */
export const Field = ({ id, label, required, optional, hint, error, className = "", children }) => (
  <div className={className}>
    <label htmlFor={id} className="block mb-1.5 text-sm font-semibold text-text-primary">
      {label}
      {required && <span className="text-brand-accent" aria-hidden="true"> *</span>}
      {optional && <span className="font-normal text-text-muted"> (optional)</span>}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
    ) : hint ? (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-text-muted">{hint}</p>
    ) : null}
  </div>
);

/** aria props for a control rendered inside <Field>. */
export const describedBy = (id, error, hint) => ({
  "aria-invalid": Boolean(error) || undefined,
  "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});

export const FormSection = ({ step, title, children }) => (
  <fieldset className="border-t border-brand-border pt-7 first:border-t-0 first:pt-0">
    <legend className="flex items-center gap-3 mb-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F0C02] font-cinzel text-sm font-bold text-[#E8A33D]">
        {step}
      </span>
      <span className="font-cinzel text-lg md:text-xl font-bold text-text-primary">{title}</span>
    </legend>
    <div className="grid gap-5 sm:grid-cols-2">{children}</div>
  </fieldset>
);

export const PrimaryButton = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#1F0C02] hover:bg-brand-accent disabled:opacity-60 disabled:cursor-wait px-8 py-3.5 font-cinzel text-xs font-bold tracking-[0.2em] uppercase text-[#F4E4C1] transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30 ${className}`}
  >
    {children}
  </button>
);
