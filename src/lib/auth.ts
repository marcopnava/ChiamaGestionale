"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "uid";

export async function loginWithEmailPassword(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false as const, error: "Invalid credentials" };
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return { ok: false as const, error: "Invalid credentials" };

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 giorni
  });

  return { ok: true as const, user: { id: user.id, email: user.email, role: user.role } };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { ok: true as const };
}

export async function currentUser() {
  const cookieStore = await cookies();
  const id = cookieStore.get(COOKIE_NAME)?.value;
  if (!id) return null;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, name: true, createdAt: true },
  });
  return user;
} 