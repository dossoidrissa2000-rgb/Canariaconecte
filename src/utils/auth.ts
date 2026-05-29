const PASSWORD_PREFIX = "sha256:";
const SALT = "canaria-connect-v1";

async function digest(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${SALT}:${password}`);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string): Promise<string> {
  return `${PASSWORD_PREFIX}${await digest(password)}`;
}

export async function verifyPassword(
  input: string,
  stored: string
): Promise<boolean> {
  if (!stored) return false;
  if (stored.startsWith(PASSWORD_PREFIX)) {
    const hash = await digest(input);
    return stored === `${PASSWORD_PREFIX}${hash}`;
  }
  // Migration des anciens comptes en clair
  return input === stored;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
