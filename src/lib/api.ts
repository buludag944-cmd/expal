export const PRODUCTION_API_URL = "https://expalapp-1.onrender.com";

export function getApiBaseUrl(): string {
  let url = (process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL).trim();
  if (url && !/^https?:\/\//i.test(url)) url = `http://${url}`;
  return url.replace(/\/$/, "");
}

export type ExpalUser = {
  id: number | string;
  firstName?: string;
  lastName?: string;
  email?: string;
  onboardingComplete?: boolean;
  profileImage?: string | null;
  destinationCity?: string;
  destinationCountry?: string;
};

export function nextPathAfterAuth(user: Pick<ExpalUser, "onboardingComplete">): "/setup" | "/account" {
  return user.onboardingComplete ? "/account" : "/setup";
}

export function displayName(user: ExpalUser | null): string {
  if (!user) return "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email || "there";
}
