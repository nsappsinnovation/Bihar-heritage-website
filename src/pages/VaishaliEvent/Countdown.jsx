import React, { useEffect, useState } from "react";

const getRemaining = (target) => {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    done: diff === 0,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

// Ticks every second and stops itself once the target time is reached
const useCountdown = (target) => {
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    if (getRemaining(target).done) return;
    const id = setInterval(() => {
      const next = getRemaining(target);
      setRemaining(next);
      if (next.done) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return remaining;
};

const pad = (n) => String(n).padStart(2, "0");

const Countdown = ({ target, className = "", variant = "cards" }) => {
  const { done, days, hours, minutes, seconds } = useCountdown(target);

  if (done) {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E8A33D]/15 border border-[#E8A33D]/30 backdrop-blur-md ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8A33D] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8A33D]" />
        </span>
        <p
          role="status"
          className="font-cinzel text-[#F4E4C1] text-xs sm:text-sm tracking-[0.2em] uppercase font-medium"
        >
          The Conference has begun
        </p>
      </div>
    );
  }

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  if (variant === "cards") {
    return (
      <div className={className}>
        <span className="sr-only" aria-live="polite">
          {days} days, {hours} hours, {minutes} minutes and {seconds} seconds until the conference begins
        </span>
        <div className="flex items-center gap-2 sm:gap-2.5" aria-hidden="true">
          {units.map((u, i) => (
            <React.Fragment key={u.label}>
              <div className="flex flex-col items-center justify-center min-w-[58px] sm:min-w-[68px] px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg bg-black/45 backdrop-blur-md border border-[#E8A33D]/30 shadow-md shadow-black/50 hover:border-[#E8A33D]/60 transition-colors">
                <span className="font-cinzel text-xl sm:text-2xl font-light text-[#F4E4C1] tabular-nums tracking-tight">
                  {pad(u.value)}
                </span>
                <span className="mt-0.5 text-[0.55rem] sm:text-[0.6rem] tracking-[0.22em] uppercase font-semibold text-[#C79A4A]">
                  {u.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span className="text-[#C79A4A]/40 text-base font-light select-none">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <span className="sr-only" aria-live="polite">
        {days} days, {hours} hours and {minutes} minutes until the conference begins
      </span>
      <div className="flex items-center gap-4 sm:gap-6" aria-hidden="true">
        {units.map((u, i) => (
          <React.Fragment key={u.label}>
            <div className="flex flex-col">
              <span className="font-cinzel text-2xl sm:text-3xl font-light text-[#F4E4C1] tabular-nums tracking-tight">
                {u.label === "Days" ? u.value : pad(u.value)}
              </span>
              <span className="mt-0.5 text-[0.6rem] tracking-[0.2em] uppercase font-medium text-[#C79A4A]/80">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-[#C79A4A]/30 text-lg font-light -mt-3 select-none">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
