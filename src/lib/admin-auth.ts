import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "foosin_admin_session";
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12;

export function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD environment variable.");
  }
  return password;
}

function createAdminSessionToken(password: string) {
  return createHash("sha256").update(`foosin-admin:${password}`).digest("hex");
}

export function getExpectedAdminToken() {
  return createAdminSessionToken(getAdminPassword());
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return token === getExpectedAdminToken();
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  };
}
