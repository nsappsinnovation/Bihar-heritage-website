import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EVENT, EVENT_PATH } from "../eventData";
import { DharmaWheel } from "../Ornaments";

/** Dark banner shared by the registration and dashboard pages. */
const GuestPageHeader = ({ eyebrow, title, children }) => (
  <header className="relative overflow-hidden bg-[#1F0C02] pt-32 pb-14 md:pb-20 px-6">
    <DharmaWheel className="absolute -right-20 -top-10 w-80 h-80 text-[#C79A4A]/10" />
    <DharmaWheel className="absolute -left-24 bottom-[-6rem] w-72 h-72 text-[#C79A4A]/[0.07]" />
    <div className="relative max-w-6xl mx-auto">
      <Link
        to={EVENT_PATH}
        className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#C79A4A] hover:text-[#F4E4C1] transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {EVENT.title} · {EVENT.subtitle}
      </Link>
      <p className="mt-6 font-cinzel text-xs tracking-[0.3em] uppercase !text-[#E8A33D]">{eyebrow}</p>
      <h1 className="mt-3 font-cinzel text-3xl md:text-5xl font-bold !text-[#F4E4C1] leading-tight">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-[#F4E4C1]/75">{children}</div>}
    </div>
  </header>
);

export default GuestPageHeader;
