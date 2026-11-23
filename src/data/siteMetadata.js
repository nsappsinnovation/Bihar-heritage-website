/**
 * Rich archaeological metadata fallback for the bundled default sites.
 *
 * CMS records carry their own period / lead_agency / district; this map fills the
 * gaps (notably coordinates) for the sites that ship with the app. Shared by the
 * home carousel and the excavation detail page.
 */
export const siteMetadata = {
  // Excavation Sites
  "Bhadariya Excavation": {
    coords: "24.9610° N, 86.8920° E",
    period: "c. 6th Cent. BCE (2,600 Yrs BP)",
    excavation: "BHDS & ASI (Active)",
    category: "Ancient Habitational Site",
    status: "Active Excavation"
  },
  "Lal Pahari Excavation": {
    coords: "25.1685° N, 86.0942° E",
    period: "Pala Era (9th - 11th Cent. CE)",
    excavation: "BHDS & Visva-Bharati",
    category: "Hilltop Monastic Complex",
    status: "Active Excavation Site"
  },
  "Nalanda University": {
    coords: "25.1378° N, 85.4438° E",
    period: "5th - 12th Century CE",
    excavation: "1915 - 1937",
    category: "Monastic Mahavihara",
    status: "UNESCO Heritage"
  },
  "Vikramashila": {
    coords: "25.3216° N, 87.2798° E",
    period: "8th - 12th Century CE",
    excavation: "1960 - 1982",
    category: "Buddhist University",
    status: "Protected Site"
  },
  "Patliputra": {
    coords: "25.5941° N, 85.1764° E",
    period: "6th Cent. BCE - 5th Cent. CE",
    excavation: "1892 - 1913",
    category: "Imperial Capital",
    status: "State Protected"
  },
  "Rohtasgarh Fort": {
    coords: "24.6291° N, 83.9214° E",
    period: "7th – 17th Century CE",
    excavation: "Ongoing Studies",
    category: "Hill Fortress",
    status: "Protected Monument"
  },
  "Rajgir Hills": {
    coords: "25.0300° N, 85.4180° E",
    period: "6th Cent. BCE - 12th Cent. CE",
    excavation: "1905 - 1950",
    category: "Ancient Fortified City",
    status: "Protected Zone"
  },
  "Telhara Monastery": {
    coords: "25.1633° N, 85.1950° E",
    period: "1st – 12th Century CE",
    excavation: "2009 - 2014",
    category: "Monastic Settlement",
    status: "Archaeological Site"
  },
  // Exploration Activities
  "Lari Mound Exploration": {
    coords: "25.0450° N, 84.8210° E",
    period: "Pre-Mauryan to Pala Era",
    excavation: "BHDS Survey & Exploration",
    category: "27-Acre Urban Mound",
    status: "Active Exploration Site"
  },
  "Kutumba Garh Exploration": {
    coords: "24.6214° N, 84.2381° E",
    period: "Gupta & Medieval Era",
    excavation: "Bihar Archaeology & BHDS",
    category: "Fortified Citadel Mound",
    status: "Active Exploration Site"
  },
  "Rohtasgarh Tunnel Study": {
    coords: "24.6291° N, 83.9214° E",
    period: "Medieval Period",
    excavation: "Active Research",
    category: "Subterranean Survey",
    status: "BHDS Archive"
  },
  "Chausa Excavation": {
    coords: "25.5186° N, 83.8967° E",
    period: "Gupta Era (4th - 6th Cent.)",
    excavation: "Bronze Hoard Finds",
    category: "Metal Hoard Study",
    status: "ASI Excavation"
  },
  "Kesaria Stupa Mapping": {
    coords: "26.3392° N, 84.8872° E",
    period: "Mauryan - Gupta Era",
    excavation: "GIS Mapping",
    category: "Monolithic Stupa",
    status: "World's Tallest Stupa"
  },
  "Sasaram Tombs Documentation": {
    coords: "24.9197° N, 84.0267° E",
    period: "Sur Empire (16th Century)",
    excavation: "Digital Survey",
    category: "Mausoleum Complex",
    status: "Digital Archive"
  },
  "Nalanda Digital Reconstruction": {
    coords: "25.1378° N, 85.4438° E",
    period: "Golden Era",
    excavation: "AR/VR Capture",
    category: "Photogrammetry",
    status: "Digital Reconstruction"
  },
  "Vikramshila River Excavation": {
    coords: "25.3216° N, 87.2798° E",
    period: "Pala Era",
    excavation: "Underwater Survey",
    category: "Trade Route Study",
    status: "Riverbed Archaeology"
  }
};
