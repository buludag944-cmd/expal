import { NextResponse } from "next/server";
import { setAdminSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ ok: true });
}
