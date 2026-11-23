/**
 * URL helpers for excavation / exploration records.
 *
 * Records come from two places (bundled defaults and the admin CMS) and only the
 * defaults have stable string ids, so the public route is keyed on a slug derived
 * from the title, with the id kept as a fallback match for older links.
 */
export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getExcavationSlug = (item) =>
  slugify(item?.title) || String(item?.id ?? "");

export const getExcavationPath = (item) => `/excavations/${getExcavationSlug(item)}`;

export const findExcavationBySlug = (items = [], slug = "") => {
  if (!slug) return undefined;
  const target = slug.toLowerCase();
  return (
    items.find((item) => getExcavationSlug(item) === target) ||
    items.find((item) => String(item?.id).toLowerCase() === target)
  );
};
