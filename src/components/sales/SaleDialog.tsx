"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

type Opt = { id: string; name: string; monthly?: string; };

export default function SaleDialog({
  open, onOpenChange, customers, products, onSaved
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customers: Opt[];
  products: (Opt & { monthly: string })[];
  onSaved: () => void;
}) {
  const [customerId, setCustomerId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [months, setMonths] = useState<string>("12");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCustomerId(customers[0]?.id ?? "");
      setProductId(products[0]?.id ?? "");
      setMonths("12");
    }
  }, [open]);

  const amount = useMemo(() => {
    const p = products.find(p => p.id === productId);
    const m = parseInt(months || "0", 10);
    if (!p || !m) return 0;
    return Number(p.monthly) * m;
  }, [productId, months, products]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, productId, months: parseInt(months, 10) }),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) throw new Error(data?.error || "Errore salvataggio");
      toast.success("Vendita creata");
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
        <div className="mb-3 text-lg font-semibold">Nuova vendita</div>

        <label className="mb-1 block text-sm">Cliente</label>
        <Select value={customerId} onValueChange={setCustomerId}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Seleziona cliente" />
          </SelectTrigger>
          <SelectContent>
            {customers.map(c => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="mb-1 block text-sm">Prodotto</label>
        <Select value={productId} onValueChange={setProductId}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Seleziona prodotto" />
          </SelectTrigger>
          <SelectContent>
            {products.map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} (€{Number(p.monthly).toFixed(2)}/mese)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="mb-1 block text-sm">Durata (mesi)</label>
        <input type="number" min="1" max="60" className="mb-2 w-full rounded-xl border px-3 py-2" value={months} onChange={(e)=>setMonths(e.target.value)} />

        <div className="mb-3 text-sm">Importo: <b>€ {amount.toFixed(2)}</b></div>

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
              frontText={loading ? "Salvataggio…" : "Crea"}
              backText="Create"
            >
              {loading && <Spinner variant="ellipsis" size={16} className="ml-2" />}
            </FlipButton>
        </div>
      </form>
    </div>
  );
} 