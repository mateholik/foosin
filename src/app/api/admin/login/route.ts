import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
  getAdminPassword,
  getExpectedAdminToken,
} from "@/lib/admin-auth";

type LoginRequestBody = {
  password?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginRequestBody;
  const suppliedPassword = payload.password?.trim() ?? "";

  if (!suppliedPassword) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  if (suppliedPassword !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, getExpectedAdminToken(), getAdminCookieOptions());
  return response;
}
