/**
 * One-time cleanup of data that earlier versions of this site saved in the
 * visitor's browser: CMS content copies ("bh_*"), the admin session, and the
 * guest / volunteer registrations of the removed conference module ("ibc26_*",
 * which included personal details). The site no longer stores anything in the
 * browser, so every one of these keys is stale and is deleted.
 *
 * Keep this for at least one release so returning visitors are cleaned up.
 */
const LEGACY_PREFIXES = ["bh_", "ibc26_"];

const purge = (storage) => {
  const stale = [];
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (key && LEGACY_PREFIXES.some((prefix) => key.startsWith(prefix))) stale.push(key);
  }
  stale.forEach((key) => storage.removeItem(key));
};

export const clearLegacyStorage = () => {
  for (const name of ["localStorage", "sessionStorage"]) {
    try {
      purge(window[name]);
    } catch {
      /* storage is blocked or unavailable — nothing to clean */
    }
  }
};
