import { getApiBaseUrl, type ExpalUser } from "./api";

const TOKEN_KEY = "expal_web_token";
const USER_KEY = "expal_web_user";

export function readStoredToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_KEY) || "";
}

export function readStoredUser(): ExpalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ExpalUser) : null;
  } catch {
    return null;
  }
}

export function writeSession(token: string, user: ExpalUser): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function exchangeGoogleIdToken(
  idToken: string,
): Promise<{ token: string; user: ExpalUser }> {
  const api = getApiBaseUrl();
  await fetch(`${api}/health`).catch(() => {});
  const res = await fetch(`${api}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token || !data.user?.id) {
    throw new Error(data.error || `Google sign-in failed (${res.status})`);
  }
  return { token: data.token, user: data.user as ExpalUser };
}

export async function fetchProfile(token: string): Promise<ExpalUser> {
  const api = getApiBaseUrl();
  const res = await fetch(`${api}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id) {
    throw new Error(data.error || "Could not load profile");
  }
  return data as ExpalUser;
}

export async function submitAccountSetup(
  token: string,
  payload: Record<string, unknown>,
): Promise<ExpalUser> {
  const api = getApiBaseUrl();
  const res = await fetch(`${api}/api/journey/onboarding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Could not save your account setup");
  }
  return (data.user || data) as ExpalUser;
}
