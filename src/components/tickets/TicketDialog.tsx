"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

type Opt = { id: string; name: string; email?: string };

export default function TicketDialog({
  open, onOpenChange, customers, assignees, initial, onSaved
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customers: Opt[];
  assignees: Opt[]; // utenti role SUPPORT
  initial?: {
    id?: string;
    customerId?: string;
    title?: string;
    description?: string | null;
    assigneeId?: string | null;
    status?: "open"|"pending"|"closed";
  };
  onSaved: () => void;
}) {
  const isEdit = Boolean(initial?.id);
  const [customerId, setCustomerId] = useState(initial?.customerId ?? customers[0]?.id ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [assigneeId, setAssigneeId] = useState(initial?.assigneeId ?? "");
  const [status, setStatus] = useState<"open"|"pending"|"closed">(initial?.status ?? "open");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCustomerId(initial?.customerId ?? customers[0]?.id ?? "");
      setTitle(initial?.title ?? "");
      setDescription(initial?.description ?? "");
      setAssigneeId(initial?.assigneeId ?? "");
      setStatus(initial?.status ?? "open");
    }
  }, [open, initial, customers]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body: any = isEdit
        ? { title, description, assigneeId: assigneeId || null, status }
        : { customerId, title, description, assigneeId: assigneeId || null };

      const url = isEdit ? `/api/tickets/${initial!.id}` : "/api/tickets";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) throw new Error(data?.error || "Errore salvataggio");
      toast.success(isEdit ? "Ticket aggiornato" : "Ticket creato");
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
        <div className="mb-3 text-lg font-semibold">{isEdit ? "Modifica ticket" : "Nuovo ticket"}</div>

        {!isEdit && (
          <>
            <label className="mb-1 block text-sm">Cliente</label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Seleziona cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        <label className="mb-1 block text-sm">Titolo</label>
        <input className="mb-2 w-full rounded-xl border px-3 py-2" value={title} onChange={(e)=>setTitle(e.target.value)} required />

        <label className="mb-1 block text-sm">Descrizione</label>
        <textarea rows={4} className="mb-2 w-full rounded-xl border px-3 py-2" value={description ?? ""} onChange={(e)=>setDescription(e.target.value)} />

        <label className="mb-1 block text-sm">Assegnatario</label>
        <Select value={assigneeId} onValueChange={setAssigneeId}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Seleziona assegnatario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nessuno (Non assegnato)</SelectItem>
            {assignees.map(a => (
              <SelectItem key={a.id} value={a.id}>{a.name} ({a.email || 'Support'})</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isEdit && (
          <>
            <label className="mb-1 block text-sm">Status</label>
            <select className="mb-2 w-full rounded-xl border px-3 py-2" value={status} onChange={(e)=>setStatus(e.target.value as any)}>
              <option value="open">open</option>
              <option value="pending">pending</option>
              <option value="closed">closed</option>
            </select>
          </>
        )}

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