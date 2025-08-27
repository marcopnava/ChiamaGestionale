"use client";

import { useEffect, useState } from "react";
import SaleDialog from "./SaleDialog";
import { toast } from "sonner";
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";
import { PinList } from "@/components/ui/shadcn-io/pin-list";
import { ShoppingCart, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

type SaleRow = {
  id: string;
  months: number;
  amount: number; // Float from Prisma
  status: "pending" | "paid" | "failed";
  soldAt: string;
  customer: { id: string; name: string; email: string };
  product: { id: string; name: string; monthly: number };
};

export default function SalesTable({
  initial, customers, products, role
}: {
  initial: SaleRow[];
  customers: { id: string; name: string }[];
  products: { id: string; name: string; monthly: number }[];
  role: "ADMIN" | "SALES" | "SUPPORT";
}) {
  const [q, setQ] = useState("");
  const [statuses, setStatuses] = useState<string[]>(["pending","paid"]);
  const [rows, setRows] = useState<SaleRow[]>(initial);
  const [total, setTotal] = useState<number>(initial.length);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isWriter = role === "ADMIN" || role === "SALES";

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    statuses.forEach(s => params.append("status", s));
    params.set("page", String(page));
    params.set("limit", String(limit));
    try {
      const res = await fetch(`/api/sales?${params.toString()}`);
      const data = await res.json();
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Errore caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [q, statuses.join(","), page]);

  function toggleStatus(s: string) {
    setPage(1);
    setStatuses((curr) => (curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]));
  }

  async function onPay(id: string) {
    const res = await fetch(`/api/sales/${id}/pay`, { method: "POST" });
    if (res.ok) { toast.success("Pagamento registrato"); load(); } else { toast.error("Errore pagamento"); }
  }

  async function onDelete(id: string) {
    if (!confirm("Eliminare questa vendita?")) return;
    const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Vendita eliminata"); load(); } else { toast.error("Errore eliminazione"); }
  }

  function Progress({ status }: { status: SaleRow["status"] }) {
    const pct = status === "paid" ? 100 : status === "pending" ? 33 : 0;
    return (
      <div className="h-2 w-28 rounded bg-secondary">
        <div className="h-2 rounded bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-3">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-[260px] flex-1">
          <div className="mb-1 text-sm">Ricerca</div>
          <input className="w-full rounded-xl border px-3 py-2" placeholder="cliente o prodotto…" value={q} onChange={(e)=>{ setPage(1); setQ(e.target.value); }} />
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            {["pending","paid","failed"].map(s=>(
              <label key={s} className="flex items-center gap-2">
                <input type="checkbox" checked={statuses.includes(s)} onChange={()=>toggleStatus(s)} /> {s}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isWriter && (
            <FlipButton 
              onClick={()=>setOpen(true)} 
              className="rounded-xl bg-primary px-3 py-2 text-sm text-white"
              frontText="+ Nuova vendita"
              backText="Aggiungi"
            />
          )}
          {loading && <Spinner variant="bars" size={20} className="text-primary" />}
        </div>
      </div>

      <div className="overflow-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Cliente</th>
              <th className="px-3 py-2 text-left">Prodotto</th>
              <th className="px-3 py-2 text-left">Mesi</th>
              <th className="px-3 py-2 text-left">Importo</th>
              <th className="px-3 py-2 text-left">Stato</th>
              <th className="px-3 py-2 text-left">Data</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r)=>(
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">
                  <div className="font-medium">{r.customer.name}</div>
                  <div className="text-xs text-gray-500">{r.customer.email}</div>
                </td>
                <td className="px-3 py-2">{r.product.name}</td>
                <td className="px-3 py-2">{r.months}</td>
                <td className="px-3 py-2">€ {Number(r.amount).toFixed(2)}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      r.status === "paid" ? "bg-green-100 text-green-800"
                      : r.status === "pending" ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                    }`}>{r.status}</span>
                    <Progress status={r.status} />
                  </div>
                </td>
                <td className="px-3 py-2">{new Date(r.soldAt).toLocaleDateString("it-IT")}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <a href={`/api/sales/${r.id}/invoice`} target="_blank" className="rounded-xl border px-3 py-1">Fattura</a>
                    {isWriter && r.status !== "paid" && (
                      <FlipButton 
                        onClick={()=>onPay(r.id)} 
                        className="rounded-xl border px-3 py-1"
                        frontText="Segna pagata"
                        backText="Paid"
                      />
                    )}
                    {isWriter && (
                      <FlipButton 
                        onClick={()=>onDelete(r.id)} 
                        className="rounded-xl border px-3 py-1 text-red-600"
                        frontText="Elimina"
                        backText="Delete"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-500">Nessun risultato</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-blue-900">{total} risultati</span>
        <div className="flex items-center gap-2">
          <FlipButton 
            disabled={page<=1} 
            onClick={()=>setPage((p)=>Math.max(1,p-1))} 
            className="rounded-xl border px-3 py-2 disabled:opacity-50"
            frontText="Prev"
            backText="←"
          />
          <span>p.{page}</span>
          <FlipButton 
            disabled={rows.length < limit} 
            onClick={()=>setPage((p)=>p+1)} 
            className="rounded-xl border px-3 py-2 disabled:opacity-50"
            frontText="Next"
            backText="→"
          />
        </div>
      </div>

      <SaleDialog
        open={open}
        onOpenChange={setOpen}
        customers={customers}
        products={products.map(p => ({ ...p, monthly: p.monthly.toString() }))}
        onSaved={load}
      />

      {/* PinList - Quick Actions */}
      <div className="mt-6">
        <PinList 
          items={[
            {
              id: 1,
              name: 'Vendite Pagate',
              info: `${rows.filter(r => r.status === 'paid').length} vendite completate`,
              icon: DollarSign,
              pinned: true,
            },
            {
              id: 2,
              name: 'Vendite in Attesa',
              info: `${rows.filter(r => r.status === 'pending').length} vendite in attesa`,
              icon: ShoppingCart,
              pinned: true,
            },
            {
              id: 3,
              name: 'Nuova Vendita',
              info: 'Registra una nuova vendita',
              icon: ShoppingCart,
              pinned: false,
            },
            {
              id: 4,
              name: 'Analisi Vendite',
              info: 'Analizza le performance',
              icon: TrendingUp,
              pinned: false,
            },
          ]}
          labels={{
            pinned: 'Vendite Pinnate',
            unpinned: 'Azioni Rapide'
          }}
          className="max-w-2xl"
        />
      </div>
    </div>
  );
} 