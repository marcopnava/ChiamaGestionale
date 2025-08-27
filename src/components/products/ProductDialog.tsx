"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

type P = {
  id?: string;
  name?: string;
  description?: string | null;
  monthly?: number | string;
  kind?: "SaaS" | "Platform";
  isActive?: boolean;
};

export default function ProductDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: P;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [monthly, setMonthly] = useState(String(initial?.monthly ?? "49"));
  const [kind, setKind] = useState<"SaaS" | "Platform">((initial?.kind as any) ?? "SaaS");
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
    setMonthly(String(initial?.monthly ?? "49"));
    setKind((initial?.kind as any) ?? "SaaS");
    setIsActive(initial?.isActive ?? true);
  }, [initial, open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { name, description, monthly: parseFloat(monthly), kind, isActive };
      const isEdit = Boolean(initial?.id);
      const res = await fetch(isEdit ? `/api/products/${initial!.id}` : "/api/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) throw new Error(data?.error || "Errore salvataggio");
      toast.success(isEdit ? "Prodotto aggiornato" : "Prodotto creato");
      onOpenChange(false);
      onSaved();
    } catch (e: any) {
      toast.error(e?.message || "Errore");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-3">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 text-lg font-semibold">{initial?.id ? "Modifica prodotto" : "Nuovo prodotto"}</div>

        <label className="mb-1 block text-sm">Nome</label>
        <input className="mb-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} required />

        <label className="mb-1 block text-sm">Descrizione</label>
        <textarea className="mb-2 w-full rounded-xl border px-3 py-2" value={description} onChange={(e)=>setDescription(e.target.value)} rows={3} />

        <div>
          <label className="mb-1 block text-sm">Prezzo mensile (€)</label>
          <input type="number" min="0" step="0.01" className="mb-2 w-full rounded-xl border px-3 py-2" value={monthly} onChange={(e)=>setMonthly(e.target.value)} required />
        </div>

        <div>
          <label className="mb-1 block text-sm">Tipo Prodotto</label>
          <Select value={kind} onValueChange={(value) => setKind(value as "SaaS" | "Platform")}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Seleziona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SaaS">SaaS (Software as a Service)</SelectItem>
              <SelectItem value="Platform">Platform (Piattaforma)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <label className="mb-2 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e)=>setIsActive(e.target.checked)} /> Attivo
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <FlipButton 
            type="button" 
            onClick={()=>onOpenChange(false)} 
            className="rounded-xl border px-3 py-2 text-sm"
            frontText="Annulla"
            backText="Cancel"
          />
                      <FlipButton
              disabled={loading}
              className="rounded-xl bg-primary px-3 py-2 text-sm text-white disabled:opacity-60"
              frontText={loading ? "Salvataggio…" : "Salva"}
              backText="Save"
            >
              {loading && <Spinner variant="ellipsis" size={16} className="ml-2" />}
            </FlipButton>
        </div>
      </form>
    </div>
  );
} 