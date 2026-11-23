/**
 * Data adapter for the Bihar Heritage Atlas.
 *
 * The atlas owns no site data of its own:
 *  - protected sites come from defaultProtectedSites.json (or the CMS copy)
 *  - excavations / explorations come from defaultExcavations (or the CMS copy)
 *  - living-heritage traditions come from biharHeritage.json
 * Zone / region / circuit JSON files only hold references (site_id, heritage_id).
 */
import { getData, STORAGE_KEYS } from "./cmsStorage";
import { getExcavationPath } from "./excavationLinks";
import defaultProtectedSites from "../data/defaults/defaultProtectedSites.json";
import { defaultExcavations } from "../data/defaults/defaultExcavations";
import livingHeritageData from "../data/biharHeritage.json";
import districtSummaries from "../data/districtSummaries.json";
import { heritageImageMap } from "../pages/IntangibleHeritage/heritageImages";

// Data district names → GeoJSON Dist_Name
const DISTRICT_ALIASES = {
  "west champaran": "Pashchim Champaran",
  "pashchim champaran": "Pashchim Champaran",
  "east champaran": "Purba Champaran",
  "purba champaran": "Purba Champaran",
  kaimur: "Kaimur (Bhabua)",
  "kaimur (bhabua)": "Kaimur (Bhabua)",
  rajgir: "Nalanda",
};

export const toMapDistrict = (name = "") =>
  DISTRICT_ALIASES[String(name).trim().toLowerCase()] || String(name).trim();

const isPublished = (item) => {
  const status = String(item?.status || "Published").toLowerCase();
  return status !== "draft" && status !== "archived";
};

export const loadProtectedSites = () =>
  getData(STORAGE_KEYS.PROTECTED_SITES, defaultProtectedSites).filter(isPublished);

export const loadExcavations = () =>
  getData(STORAGE_KEYS.EXCAVATION, defaultExcavations).filter(isPublished);

// Fall back to bundled coordinates when a CMS copy predates them
const withDefaultCoords = (items, defaults) => {
  const byId = new Map(defaults.map((d) => [String(d.id), d.coordinates]));
  return items.map((item) =>
    item.coordinates ? item : { ...item, coordinates: byId.get(String(item.id)) }
  );
};

const protectedToMarker = (site) => ({
  id: site.id,
  kind: "protected",
  title: site.name,
  category: site.category,
  description: site.subtitle || site.description,
  image: site.image,
  coordinates: site.coordinates,
  link: "/protected-sites",
});

const excavationToMarker = (item) => ({
  id: item.id,
  kind: item.type === "exploration" ? "exploration" : "excavation",
  title: item.title,
  category: item.type === "exploration" ? "Exploration" : "Excavation",
  period: item.period,
  description: item.description,
  image: item.image,
  coordinates: item.coordinates,
  link: getExcavationPath(item),
});

/** { [GeoJSON district]: { summary, sites: [...protected], digs: [...excavations] } } */
export const buildDistrictData = (protectedSites, excavations) => {
  const out = {};
  const bucket = (district) => {
    const key = toMapDistrict(district);
    if (!out[key]) out[key] = { summary: districtSummaries[key] || "", sites: [], digs: [] };
    return out[key];
  };
  withDefaultCoords(protectedSites, defaultProtectedSites).forEach((s) =>
    bucket(s.district).sites.push(protectedToMarker(s))
  );
  withDefaultCoords(excavations, defaultExcavations).forEach((e) =>
    bucket(e.district).digs.push(excavationToMarker(e))
  );
  Object.keys(districtSummaries).forEach((k) => bucket(k));
  return out;
};

const heritageById = new Map((livingHeritageData.heritages || []).map((h) => [h.id, h]));
const categoryLabel = new Map((livingHeritageData.categories || []).map((c) => [c.id, c.label]));

/** Turns a zone/region/circuit entry into a display card, resolving references. */
export const resolveAtlasEntry = (entry, sitesById) => {
  if (entry.site_id !== undefined) {
    const site = sitesById.get(String(entry.site_id));
    if (!site) return null;
    return {
      ...entry,
      title: site.name,
      district: toMapDistrict(site.district),
      type: entry.period ? undefined : site.category,
      description: entry.significance || site.subtitle || site.description,
      image: site.image,
    };
  }
  if (entry.heritage_id !== undefined) {
    const h = heritageById.get(entry.heritage_id);
    if (!h) return null;
    return {
      ...entry,
      title: h.title,
      type: `Living Heritage · ${categoryLabel.get(h.category) || h.category}`,
      description: entry.significance || h.shortDescription,
      // same priority as the Intangible Heritage page: bundled asset, then remote URL
      image: (h.imageKey && heritageImageMap[h.imageKey]) || heritageImageMap[h.id] || h.image || h.imageUrl,
    };
  }
  return { ...entry, description: entry.description || entry.significance };
};
