import { NextResponse } from "next/server";
import { z } from "zod";
import { loginWithEmailPassword } from "@/lib/auth";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, password } = Body.parse(json);
    const res = await loginWithEmailPassword(email, password); // set cookie httpOnly
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: res.error }, { status: 401 });
    }
    return NextResponse.json({ ok: true, user: res.user });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status: 400 });
  }
} 