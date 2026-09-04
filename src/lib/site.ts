export const PRODUCTION_SITE_URL = "https://expalapp.netlify.app";

export const SITE = {
  name: "EXPal",
  tagline: "Your friend away from home",
  headline: "Relocate smarter. Settle faster. Thrive longer.",
  description:
    "EXPal is a free community for expats — housing, visa guidance, local know-how, events, and job referrals in one place. Read guides without creating an account.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL).replace(
    /\/$/,
    "",
  ),
  appUrl: (process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_SITE_URL).replace(
    /\/$/,
    "",
  ),
  appId: process.env.NEXT_PUBLIC_APP_ID || "com.yourbrandexpal",
  author: "EXPal editorial",
  apiUrl: (process.env.NEXT_PUBLIC_API_URL || "https://expalapp-1.onrender.com").replace(
    /\/$/,
    "",
  ),
};

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${suffix}`;
}
