"use client";

import { useEffect, useState } from "react";
import TicketDialog from "./TicketDialog";
import { toast } from "sonner";
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";
import { PinList } from "@/components/ui/shadcn-io/pin-list";
import { MessageSquare, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

type Row = {
  id: string;
  title: string;
  description: string | null;
  status: "open"|"pending"|"closed";
  updatedAt: string;
  customer: { id: string; name: string; email: string };
  assignee: { id: string; name: string; email: string } | null;
};

export default function TicketsTable({
  initial, customers, assignees, role
}: {
  initial: Row[];
  customers: { id:string; name:string }[];
  assignees: { id:string; name:string; email:string }[];
  role: "ADMIN" | "SALES" | "SUPPORT";
}) {
  const [q, setQ] = useState("");
  const [statuses, setStatuses] = useState<string[]>(["open","pending"]);
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [rows, setRows] = useState<Row[]>(initial);
  const [total, setTotal] = useState<number>(initial.length);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const canWrite = role === "ADMIN" || role === "SUPPORT";
  const canDelete = role === "ADMIN";

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    statuses.forEach(s => params.append("status", s));
    if (assigneeId) params.set("assigneeId", assigneeId);
    params.set("page", String(page));
    params.set("limit", String(limit));
    try {
      const res = await fetch(`/api/tickets?${params.toString()}`);
      const data = await res.json();
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Errore caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [q, statuses.join(","), assigneeId, page]);

  function toggleStatus(s: string) {
    setPage(1);
    setStatuses((curr) => (curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]));
  }

  async function setClosed(id: string) {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" }),
    });
    if (res.ok) { toast.success("Ticket chiuso"); load(); } else { toast.error("Errore chiusura"); }
  }

  async function onDelete(id: string) {
    if (!confirm("Eliminare questo ticket?")) return;
    const res = await fetch(`/api/tickets/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Ticket eliminato"); load(); } else { toast.error("Errore eliminazione"); }
  }

  return (
    <div className="rounded-2xl border p-3">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-[260px] flex-1">
          <div className="mb-1 text-sm">Ricerca</div>
          <input className="w-full rounded-xl border px-3 py-2" placeholder="titolo o cliente…" value={q} onChange={(e)=>{ setPage(1); setQ(e.target.value); }} />
          <div className="mt-2 grid gap-3 text-sm md:grid-cols-3">
            <div className="flex items-center gap-3">
              {["open","pending","closed"].map(s=>(
                <label key={s} className="flex items-center gap-2">
                  <input type="checkbox" checked={statuses.includes(s)} onChange={()=>toggleStatus(s)} /> {s}
                </label>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-sm">Assegnatario</label>
              <select className="w-full rounded-xl border px-3 py-2" value={assigneeId} onChange={(e)=>{ setPage(1); setAssigneeId(e.target.value); }}>
                <option value="">Tutti</option>
                {assignees.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canWrite && (
            <FlipButton 
              onClick={()=>{ setEditing(undefined); setOpen(true); }} 
              className="rounded-xl bg-primary px-3 py-2 text-sm text-white"
              frontText="+ Nuovo"
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
              <th className="px-3 py-2 text-left">Titolo</th>
              <th className="px-3 py-2 text-left">Cliente</th>
              <th className="px-3 py-2 text-left">Assegnato</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Aggiornato</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r)=>(
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">
                  <div className="font-medium">{r.title}</div>
                  {r.description && <div className="text-xs text-gray-500 line-clamp-1">{r.description}</div>}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">{r.customer.name}</div>
                  <div className="text-xs text-gray-500">{r.customer.email}</div>
                </td>
                <td className="px-3 py-2">{r.assignee ? r.assignee.name : "—"}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    r.status === "open" ? "bg-yellow-100 text-yellow-800" :
                    r.status === "pending" ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }`}>{r.status}</span>
                </td>
                <td className="px-3 py-2">{new Date(r.updatedAt).toLocaleString("it-IT")}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    {canWrite && (
                      <FlipButton 
                        onClick={()=>{ setEditing(r); setOpen(true); }} 
                        className="rounded-xl border px-3 py-1"
                        frontText="Modifica"
                        backText="Edit"
                      />
                    )}
                    {canWrite && r.status !== "closed" && (
                      <FlipButton 
                        onClick={()=>setClosed(r.id)} 
                        className="rounded-xl border px-3 py-1"
                        frontText="Chiudi"
                        backText="Close"
                      />
                    )}
                    {canDelete && (
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
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Nessun ticket</td></tr>
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

      <TicketDialog
        open={open}
        onOpenChange={setOpen}
        customers={customers}
        assignees={assignees}
        initial={editing ? {
          id: editing.id,
          customerId: editing.customer.id,
          title: editing.title,
          description: editing.description,
          assigneeId: editing.assignee?.id ?? "",
          status: editing.status,
        } : undefined}
        onSaved={load}
      />

      {/* PinList - Quick Actions */}
      <div className="mt-6">
        <PinList 
          items={[
            {
              id: 1,
              name: 'Ticket Aperti',
              info: `${rows.filter(r => r.status === 'open').length} ticket aperti`,
              icon: AlertTriangle,
              pinned: true,
            },
            {
              id: 2,
              name: 'Ticket Chiusi',
              info: `${rows.filter(r => r.status === 'closed').length} ticket risolti`,
              icon: CheckCircle,
              pinned: true,
            },
            {
              id: 3,
              name: 'Nuovo Ticket',
              info: 'Crea un nuovo ticket',
              icon: MessageSquare,
              pinned: false,
            },
            {
              id: 4,
              name: 'Analisi Supporto',
              info: 'Analizza le performance',
              icon: BarChart3,
              pinned: false,
            },
          ]}
          labels={{
            pinned: 'Ticket Pinnati',
            unpinned: 'Azioni Rapide'
          }}
          className="max-w-2xl"
        />
      </div>
    </div>
  );
} 