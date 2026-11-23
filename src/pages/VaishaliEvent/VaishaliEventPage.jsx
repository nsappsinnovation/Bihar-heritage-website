import React, { useEffect } from "react";
import EventHero from "./EventHero";
import ProgrammeSchedule from "./ProgrammeSchedule";
import Announcements from "./Announcements";
import VenueInfo from "./VenueInfo";
import RegistrationCTA from "./RegistrationCTA";
import VolunteerCTA from "./VolunteerCTA";
import SOSButton from "./SOSButton";
import { EVENT } from "./eventData";

const VaishaliEventPage = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = `${EVENT.title} – ${EVENT.subtitle} | Bihar Heritage`;
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="bg-brand-dark">
      <EventHero />
      <ProgrammeSchedule />
      <Announcements />
      <VenueInfo />
      <VolunteerCTA />
      <RegistrationCTA />
      <SOSButton />
    </main>
  );
};

export default VaishaliEventPage;
