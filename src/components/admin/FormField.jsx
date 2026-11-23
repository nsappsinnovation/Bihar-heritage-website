import React from "react";

/**
 * Reusable form field component.
 * Supports: text, textarea, select, checkbox, date, url, number
 */
const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  options = [],
  rows = 4,
  required = false,
}) => {
  const baseInput =
    "w-full px-4 py-3 rounded-2xl border border-[#E7DED3] bg-white text-[#2F241D] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B85C38]/30 focus:border-[#B85C38] transition placeholder:text-[#6F665E]/50";

  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name={name}
          checked={!!value}
          onChange={(e) => onChange(name, e.target.checked)}
          className="w-4 h-4 rounded border-[#E7DED3] text-[#B85C38] focus:ring-[#B85C38]/30 cursor-pointer"
        />
        <span className="text-sm font-sans text-[#2F241D]">{label}</span>
      </label>
    );
  }

  if (type === "select") {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold font-sans text-[#6F665E] uppercase tracking-wider">
          {label} {required && <span className="text-[#B85C38]">*</span>}
        </label>
        <select
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          className={baseInput + " cursor-pointer"}
        >
          <option value="">Select…</option>
          {options.map((opt) => {
            const optVal = typeof opt === "object" && opt !== null ? opt.value : opt;
            const optLabel = typeof opt === "object" && opt !== null ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold font-sans text-[#6F665E] uppercase tracking-wider">
          {label} {required && <span className="text-[#B85C38]">*</span>}
        </label>
        <textarea
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={baseInput + " resize-y min-h-[100px]"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold font-sans text-[#6F665E] uppercase tracking-wider">
        {label} {required && <span className="text-[#B85C38]">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={baseInput}
      />
    </div>
  );
};

export default FormField;
