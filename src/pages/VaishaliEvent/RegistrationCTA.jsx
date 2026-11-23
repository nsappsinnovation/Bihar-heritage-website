import React from "react";
import { ArrowRight } from "lucide-react";
import { EVENT, REGISTRATION_URL } from "./eventData";
import { DharmaWheel } from "./Ornaments";

const RegistrationCTA = () => (
  <section aria-labelledby="register-title" className="px-6 pb-20 md:pb-28">
    <div className="relative overflow-hidden max-w-5xl mx-auto rounded-3xl bg-[#1F0C02] px-6 py-14 md:px-16 text-center">
      <DharmaWheel className="absolute -left-16 -bottom-16 w-64 h-64 text-[#C79A4A]/10" />
      <DharmaWheel className="absolute -right-16 -top-16 w-64 h-64 text-[#C79A4A]/10" />
      <p className="relative font-cinzel text-xs tracking-[0.3em] uppercase text-[#C79A4A]">Guest Registration</p>
      <h2 id="register-title" className="relative mt-3 font-cinzel text-2xl md:text-4xl !text-[#F4E4C1]">
        Join us in Vaishali
      </h2>
      <p className="relative mt-4 max-w-2xl mx-auto !text-[#F4E4C1]/75">
        {EVENT.description}
      </p>
      <a
        href={REGISTRATION_URL}
        className="group relative mt-8 inline-flex items-center gap-3 rounded-full bg-[#E8A33D] hover:bg-[#F4E4C1] px-9 py-4 font-cinzel text-xs font-bold tracking-[0.22em] uppercase text-[#1F0C02] transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F4E4C1]/50"
      >
        Register Now
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </a>
    </div>
  </section>
);

export default RegistrationCTA;
