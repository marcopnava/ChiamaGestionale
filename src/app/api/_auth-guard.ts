import { currentUser } from "@/lib/auth";

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  return user as { id: string; role: string; email: string | null };
} 