import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "expal_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

function secret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

export function isAdminConfigured(): boolean {
  return Boolean(adminPassword());
}

function sign(value: string): string {
  return createHmac("sha256", secret() || "dev-only").update(value).digest("hex");
}

function cookieValue(expiresAt: number): string {
  const payload = `ok.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyPassword(password: string): boolean {
  const expected = adminPassword();
  if (!expected || !password) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function parseSession(raw: string | undefined): boolean {
  if (!raw) return false;
  const parts = raw.split(".");
  if (parts.length !== 3) return false;
  const [flag, expires, mac] = parts;
  if (flag !== "ok") return false;
  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = sign(`${flag}.${expires}`);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return parseSession(store.get(COOKIE)?.value);
}

export async function setAdminSession(): Promise<void> {
  const store = await cookies();
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  store.set(COOKIE, cookieValue(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
