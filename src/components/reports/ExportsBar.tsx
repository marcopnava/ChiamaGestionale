"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";

export default function ExportsBar({ scope }: { scope: "customers"|"products"|"sales" }) {
  const [loading, setLoading] = useState<null | "csv" | "xlsx" | "pdf">(null);

  function dl(fmt: "csv"|"xlsx"|"pdf") {
    setLoading(fmt);
    toast.info(`Preparazione ${fmt.toUpperCase()}…`);
    const url = `/api/reports/export?scope=${scope}&format=${fmt}`;
    // piccolo delay solo per feedback visivo
    setTimeout(() => {
      window.open(url, "_blank");
      setLoading(null);
      toast.success(`${fmt.toUpperCase()} pronto`);
    }, 400);
  }

  const Btn = ({ fmt, label }: { fmt: "csv"|"xlsx"|"pdf"; label: string }) => (
    <FlipButton
      onClick={() => dl(fmt)}
      className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
      disabled={loading !== null}
      frontText={loading === fmt ? `…${label}` : label}
      backText={fmt.toUpperCase()}
    />
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Btn fmt="csv" label="Export CSV" />
      <Btn fmt="xlsx" label="Export Excel" />
      <Btn fmt="pdf" label="Export PDF" />
    </div>
  );
} 