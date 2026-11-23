import React, { useEffect } from "react";
import { EVENT } from "../eventData";
import SOSButton from "../SOSButton";
import GuestPageHeader from "../guest/GuestPageHeader";
import VolunteerRegistrationForm from "./VolunteerRegistrationForm";

const VolunteerRegistrationPage = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = `Become a Volunteer – ${EVENT.title} ${EVENT.subtitle} | Bihar Heritage`;
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="bg-brand-dark min-h-screen">
      <GuestPageHeader eyebrow="Volunteer Programme" title="Become a Volunteer">
        Serve the Sangha and our international guests in Vaishali. Volunteers support registration, hospitality, logistics,
        medical and cultural teams across all three conference days.
      </GuestPageHeader>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <VolunteerRegistrationForm />
      </div>
      <SOSButton />
    </main>
  );
};

export default VolunteerRegistrationPage;
