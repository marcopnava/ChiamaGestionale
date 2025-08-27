"use client";

import { useState } from "react";
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";

export default function AuditExportBar({ qs }: { qs: string }) {
  const [busy, setBusy] = useState<null | "csv" | "xlsx" | "pdf">(null);
  function go(fmt: "csv" | "xlsx" | "pdf") {
    setBusy(fmt);
    const url = `/api/audit/export${qs ? `?${qs}&` : "?"}format=${fmt}`;
    setTimeout(() => {
      window.open(url, "_blank");
      setBusy(null);
    }, 300);
  }
  const Btn = ({ f, label }: { f: "csv"|"xlsx"|"pdf"; label: string }) => (
    <FlipButton disabled={!!busy} onClick={() => go(f)} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
      frontText={busy === f ? `…${label}` : label}
      backText={f.toUpperCase()}
    />
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Btn f="csv" label="Export CSV" />
      <Btn f="xlsx" label="Export Excel" />
      <Btn f="pdf" label="Export PDF" />
    </div>
  );
} 