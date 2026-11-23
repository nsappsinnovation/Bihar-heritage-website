/**
 * Admin authentication (local demo login).
 *
 * Credentials are checked in the browser against the demo account below and a
 * small session record is kept in localStorage. This is a UI gate only.
 */

const SESSION_KEY = "bh_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const ATTEMPTS_KEY = "bh_admin_attempts";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

const DEMO_USER_ID = "admin";
const DEMO_PASSWORD = "Heritage@2026";
const DEMO_USER = { userId: DEMO_USER_ID, name: "Administrator", role: "admin" };

const readSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
    // Legacy flag from the earlier hardcoded login.
    localStorage.removeItem("bh_admin_auth");
  } catch {
    /* nothing to clear */
  }
};

export { clearSession as logout };

export const getAdminUser = () => readSession()?.user || null;

const readAttempts = () => {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      count: Number(parsed?.count) || 0,
      lockedUntil: Number(parsed?.lockedUntil) || 0,
    };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
};

const writeAttempts = (attempts) => {
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    /* storage unavailable — the lockout simply won't persist */
  }
};

export const login = async (userId, password) => {
  const id = String(userId).trim();

  const attempts = readAttempts();
  if (attempts.lockedUntil > Date.now()) {
    const minutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
    throw new Error(
      `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`
    );
  }

  if (id !== DEMO_USER_ID || password !== DEMO_PASSWORD) {
    const count = attempts.lockedUntil ? 1 : attempts.count + 1;
    if (count >= MAX_FAILED_ATTEMPTS) {
      writeAttempts({ count: 0, lockedUntil: Date.now() + LOCKOUT_MS });
      throw new Error("Too many failed attempts. Try again in 5 minutes.");
    }
    writeAttempts({ count, lockedUntil: 0 });
    throw new Error("Invalid administrative credentials.");
  }

  writeAttempts({ count: 0, lockedUntil: 0 });

  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ user: DEMO_USER, exp: Date.now() + SESSION_TTL_MS })
    );
  } catch {
    throw new Error("Your browser blocked saving the session. Please enable site storage and try again.");
  }

  return DEMO_USER;
};

/** True when a session is present and not past its expiry. */
export const isAuthenticated = () => {
  const session = readSession();
  if (!session) return false;

  if (!session.exp || session.exp <= Date.now()) {
    clearSession();
    return false;
  }
  return true;
};
