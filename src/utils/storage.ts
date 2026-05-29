/** Clés autorisées — évite les collisions et les clés arbitraires en localStorage */
export const STORAGE_KEYS = {
  THEME: "canaria_theme",
  SESSION: "canaria_session",
  USERS: "canaria_users",
  SAVED_JOBS: "canaria_saved_jobs",
  APPLICATIONS: "canaria_applications",
  ENROLLMENTS: "canaria_enrollments",
  CV_HISTORY: "canaria_cv_history",
  ADMIN_CHECKLIST: "canaria_admin_checklist",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

const ALLOWED_KEYS = new Set<string>(Object.values(STORAGE_KEYS));
const MAX_ENTRY_BYTES = 512_000;

function isAllowedKey(key: string): key is StorageKey {
  return ALLOWED_KEYS.has(key);
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

export function readStoredJson<T>(key: StorageKey, fallback: T): T {
  if (!isAllowedKey(key)) return fallback;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    if (byteLength(raw) > MAX_ENTRY_BYTES) {
      localStorage.removeItem(key);
      return fallback;
    }
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export function readStoredArray<T>(key: StorageKey): T[] {
  const value = readStoredJson<unknown>(key, []);
  return Array.isArray(value) ? (value as T[]) : [];
}

export function writeStoredJson<T>(key: StorageKey, value: T): boolean {
  if (!isAllowedKey(key)) return false;

  try {
    const serialized = JSON.stringify(value);
    if (byteLength(serialized) > MAX_ENTRY_BYTES) {
      console.warn(`[CanariaConnect] Données trop volumineuses pour ${key}`);
      return false;
    }
    localStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
}

export function removeStored(key: StorageKey): void {
  if (isAllowedKey(key)) {
    localStorage.removeItem(key);
  }
}

export interface UserSession {
  email: string;
  fullName: string;
  status?: string;
  phone?: string;
  bio?: string;
}

/** Ne jamais persister de mot de passe dans la session */
export function toSafeSession(user: UserSession): UserSession {
  return {
    email: String(user.email ?? "").trim().toLowerCase(),
    fullName: String(user.fullName ?? "").trim(),
    status: user.status,
    phone: user.phone,
    bio: user.bio,
  };
}

export function persistSession(user: UserSession): boolean {
  const safe = toSafeSession(user);
  if (!safe.email || !safe.fullName) return false;
  return writeStoredJson(STORAGE_KEYS.SESSION, safe);
}

export function readSession(): UserSession | null {
  const session = readStoredJson<UserSession | null>(STORAGE_KEYS.SESSION, null);
  if (!session?.email || !session?.fullName) return null;
  return toSafeSession(session);
}
