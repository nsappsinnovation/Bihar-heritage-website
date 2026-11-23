import React, { useEffect, useRef, useState } from "react";
import { Siren, Phone, X } from "lucide-react";
import { EMERGENCY_CONTACTS } from "./eventData";

const SOSButton = () => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const focusables = () => dialog.querySelectorAll("a[href], button");
    focusables()[0]?.focus();

    // Esc closes; Tab cycles within the dialog
    const onKey = (e) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const els = focusables();
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="SOS — emergency contacts and assistance"
        className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-5 py-3.5 text-white font-bold tracking-widest shadow-xl shadow-red-900/40 ring-4 ring-red-600/25 transition-transform hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-red-300"
      >
        <span className="relative flex h-3 w-3" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping motion-reduce:animate-none" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        SOS
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-title"
            className="relative w-full sm:max-w-md max-h-[90svh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Siren size={22} aria-hidden="true" />
                </span>
                <div>
                  <h2 id="sos-title" className="text-xl">Emergency Assistance</h2>
                  <p className="text-xs text-text-muted">Tap a number to call immediately</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close emergency contacts"
                className="rounded-full p-2 hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <ul className="mt-6 space-y-3">
              {EMERGENCY_CONTACTS.map((c) => (
                <li key={c.id}>
                  <a
                    href={`tel:${c.number.replace(/[^\d+]/g, "")}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4 hover:border-red-400 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                  >
                    <span>
                      <span className="block font-semibold text-text-primary">{c.label}</span>
                      {c.note && <span className="block text-xs text-text-muted mt-0.5">{c.note}</span>}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
                      <Phone size={14} aria-hidden="true" /> {c.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
