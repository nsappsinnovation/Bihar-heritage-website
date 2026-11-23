import { SCHEDULE } from "../eventData";

export const ATTENDEE_CATEGORIES = [
  "Delegate",
  "Speaker / Scholar",
  "Monastic / Sangha Member",
  "Pilgrim",
  "Government Official",
  "Media",
  "Student",
  "Volunteer",
];

// Conference days in calendar order: { id, label, date (YYYY-MM-DD) }
const MONTHS = { December: "12" };
export const DAYS = SCHEDULE.map((d) => {
  const [day, month, year] = d.date.split(" ");
  return {
    id: d.id,
    label: `${d.tab} · ${d.weekday}, ${day} ${month.slice(0, 3)}`,
    date: `${year}-${MONTHS[month]}-${day.padStart(2, "0")}`,
  };
});

export const dayLabel = (id) => DAYS.find((d) => d.id === id)?.label || id;

/** Start/end Date (IST) of a schedule session. */
export const sessionTimes = (dayId, time) => {
  const day = DAYS.find((d) => d.id === dayId);
  const [start, end] = time.split("–").map((t) => t.trim());
  return {
    start: new Date(`${day.date}T${start}:00+05:30`),
    end: new Date(`${day.date}T${end}:00+05:30`),
  };
};

export const sessionKey = (dayId, session) => `${dayId}|${session.time}|${session.title}`;

// ISO 3166-1 alpha-2 codes; display names come from the browser (Intl).
const REGION_CODES =
  "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI KH CM CA CV CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW".split(" ");

let countries;
export const getCountries = () => {
  if (countries) return countries;
  let names;
  try {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    names = { of: (code) => code };
  }
  const list = REGION_CODES.map((code) => ({ code, name: names.of(code) })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  // India first: most guests are domestic
  const india = list.find((c) => c.code === "IN");
  countries = [india, ...list.filter((c) => c.code !== "IN")];
  return countries;
};

export const countryName = (code) => getCountries().find((c) => c.code === code)?.name || code;
