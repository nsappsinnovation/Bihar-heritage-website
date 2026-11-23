import React, { useEffect, useState } from "react";
import { Download, Printer } from "lucide-react";
import { EVENT } from "../eventData";
import { DharmaWheel } from "../Ornaments";
import { DAYS, countryName } from "./guestOptions";

const DARK = "#1F0C02";
const CREAM = "#F4E4C1";
const GOLD = "#C79A4A";
const SAFFRON = "#E8A33D";

// Compact, scanner-friendly payload for gate staff
const passPayload = (g) => `IBC26|${g.registrationId}|${g.fullName}|${g.category}|${g.days.join(",")}`;

const shortDays = (days) =>
  DAYS.filter((d) => days.includes(d.id)).map((d) => d.label.split(" · ")[0]).join(" · ");

const displayName = (g) => [g.title, g.fullName].filter(Boolean).join(" ");

const loadQr = () => import("qrcode").then((m) => m.default || m);

/** Draw the pass on a canvas (1080×1600) and return it as a PNG blob. */
const renderPassPng = async (guest) => {
  const QR = await loadQr();
  await Promise.all(["700 40px Cinzel", "400 24px Poppins", "600 24px Poppins"].map((f) => document.fonts?.load(f)));

  const W = 1080;
  const H = 1600;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");

  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  const center = (text, y, font, color) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, W / 2, y);
  };

  center("DIGITAL GUEST PASS", 130, "600 26px Poppins", SAFFRON);
  center(EVENT.title.toUpperCase(), 200, "700 44px Cinzel", CREAM);
  center(EVENT.subtitle.toUpperCase(), 255, "700 36px Cinzel", GOLD);
  center(`${EVENT.dateLabel}  •  ${EVENT.city}`, 310, "400 26px Poppins", CREAM);

  // QR on a cream tile
  const qrSize = 560;
  const qrX = (W - qrSize) / 2;
  const qrY = 370;
  ctx.fillStyle = CREAM;
  ctx.fillRect(qrX - 30, qrY - 30, qrSize + 60, qrSize + 60);
  const qrCanvas = document.createElement("canvas");
  await QR.toCanvas(qrCanvas, passPayload(guest), { width: qrSize, margin: 0, errorCorrectionLevel: "M", color: { dark: DARK, light: CREAM } });
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  center(guest.registrationId, 1060, "700 54px Cinzel", SAFFRON);
  center(displayName(guest), 1150, "600 44px Poppins", CREAM);
  center([guest.designation, guest.organisation].filter(Boolean).join(", ").slice(0, 60), 1205, "400 28px Poppins", CREAM);

  ctx.fillStyle = SAFFRON;
  const badge = guest.category.toUpperCase();
  ctx.font = "600 28px Poppins";
  const bw = ctx.measureText(badge).width + 70;
  ctx.beginPath();
  ctx.roundRect((W - bw) / 2, 1250, bw, 64, 32);
  ctx.fill();
  center(badge, 1292, "600 28px Poppins", DARK);

  center(`Attending: ${shortDays(guest.days)}`, 1380, "400 28px Poppins", CREAM);
  center(countryName(guest.nationality), 1425, "400 26px Poppins", GOLD);
  center("Show this pass with a valid photo ID at the venue entrance.", 1510, "400 22px Poppins", "rgba(244,228,193,0.65)");

  return new Promise((resolve) => c.toBlob(resolve, "image/png"));
};

const GuestPass = ({ guest, onDownload }) => {
  const [qr, setQr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadQr()
      .then((QR) => QR.toDataURL(passPayload(guest), { width: 480, margin: 0, errorCorrectionLevel: "M", color: { dark: DARK, light: CREAM } }))
      .then((url) => !cancelled && setQr(url))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [guest]);

  const download = async () => {
    setBusy(true);
    try {
      const blob = await renderPassPng(guest);
      onDownload(`IBC-Vaishali-2026-Pass-${guest.registrationId}.png`, blob);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,380px)_1fr] items-start">
      <article
        id="guest-pass"
        aria-label={`Digital guest pass for ${guest.fullName}`}
        className="relative overflow-hidden rounded-3xl bg-[#1F0C02] p-6 sm:p-7 text-center text-[#F4E4C1] ring-1 ring-[#C79A4A]/50 shadow-xl print:shadow-none"
      >
        <DharmaWheel className="absolute -right-16 -top-16 w-48 h-48 text-[#C79A4A]/10" />
        <p className="relative text-[0.65rem] font-semibold tracking-[0.3em] uppercase !text-[#E8A33D]">Digital Guest Pass</p>
        <p className="relative mt-2 font-cinzel text-lg font-bold leading-snug !text-[#F4E4C1]">{EVENT.title}</p>
        <p className="relative font-cinzel text-sm !text-[#C79A4A]">{EVENT.subtitle} · {EVENT.dateLabel}</p>

        <div className="relative mx-auto mt-5 w-52 h-52 sm:w-56 sm:h-56 rounded-2xl bg-[#F4E4C1] p-3">
          {qr ? (
            <img src={qr} alt={`QR code for registration ${guest.registrationId}`} className="w-full h-full" />
          ) : (
            <div className="w-full h-full animate-pulse rounded-lg bg-[#1F0C02]/10" aria-label="Generating QR code" />
          )}
        </div>

        <p className="relative mt-5 font-cinzel text-2xl font-bold tracking-wider !text-[#E8A33D]">{guest.registrationId}</p>
        <p className="relative mt-2 text-lg font-semibold !text-[#F4E4C1]">{displayName(guest)}</p>
        <p className="relative text-sm !text-[#F4E4C1]/70">{[guest.designation, guest.organisation].filter(Boolean).join(", ")}</p>
        <span className="relative mt-4 inline-block rounded-full bg-[#E8A33D] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1F0C02]">
          {guest.category}
        </span>
        <p className="relative mt-4 text-sm !text-[#F4E4C1]">Attending: {shortDays(guest.days)}</p>
        <p className="relative text-xs !text-[#C79A4A]">{countryName(guest.nationality)}</p>
      </article>

      <div className="space-y-4 print:hidden">
        <h3 className="font-cinzel text-xl font-bold">Your entry pass</h3>
        <p className="text-sm">
          Show this QR pass along with a valid photo ID (passport for international delegates) at the venue entrance.
          Save it to your phone so it works even without mobile signal.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-[#1F0C02] hover:bg-brand-accent disabled:opacity-60 px-6 py-3 font-cinzel text-xs font-bold tracking-[0.18em] uppercase text-[#F4E4C1] transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30"
          >
            <Download size={16} aria-hidden="true" />
            {busy ? "Preparing…" : "Download Pass"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-[#1F0C02] hover:bg-[#1F0C02] hover:text-[#F4E4C1] px-6 py-3 font-cinzel text-xs font-bold tracking-[0.18em] uppercase text-[#1F0C02] transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/30"
          >
            <Printer size={16} aria-hidden="true" />
            Print / Save PDF
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-white border border-brand-border p-5 text-sm">
          <dt className="text-text-muted">Email</dt>
          <dd className="font-medium text-text-primary break-all">{guest.email}</dd>
          <dt className="text-text-muted">Mobile</dt>
          <dd className="font-medium text-text-primary">{guest.phone}</dd>
          <dt className="text-text-muted">Registered on</dt>
          <dd className="font-medium text-text-primary">
            {new Date(guest.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </dd>
          {guest.assistance && (
            <>
              <dt className="text-text-muted">Assistance requested</dt>
              <dd className="font-medium text-text-primary">{guest.assistance}</dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default GuestPass;
