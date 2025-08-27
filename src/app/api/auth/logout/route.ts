import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST() {
  await logout(); // delete cookie
  return NextResponse.json({ ok: true });
} 