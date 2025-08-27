"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function MobileTopbar() {
  const router = useRouter();
  async function onLogout() {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      toast.success("Disconnesso");
      router.replace("/login");
      router.refresh();
    } else {
      toast.error("Errore logout");
    }
  }

  return (
    <div className="mb-2 flex items-center justify-between border-b p-3 md:hidden">
      <span className="font-semibold text-primary">Admin</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onLogout}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 