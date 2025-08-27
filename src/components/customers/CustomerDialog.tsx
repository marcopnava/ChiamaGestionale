"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string | null;
    status?: "lead" | "active" | "churn";
    joinedAt?: string | null;
  };
  onSaved: () => void;
};

export default function CustomerDialog({ open, onOpenChange, initial, onSaved }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [status, setStatus] = useState<"lead"|"active"|"churn">(initial?.status ?? "lead");
  const [joinedAt, setJoinedAt] = useState(initial?.joinedAt ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setPhone(initial?.phone ?? "");
    setStatus((initial?.status as any) ?? "lead");
    setJoinedAt(initial?.joinedAt ?? "");
  }, [initial, open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body: any = { name, email, phone, status, joinedAt: joinedAt || null };
      const isEdit = Boolean(initial?.id);
      const res = await fetch(isEdit ? `/api/customers/${initial!.id}` : "/api/customers", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) throw new Error(data?.error || "Errore salvataggio");
      toast.success(isEdit ? "Cliente aggiornato" : "Cliente creato");
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
        <div className="mb-3 text-lg font-semibold">{initial?.id ? "Modifica cliente" : "Nuovo cliente"}</div>

        <label className="mb-1 block text-sm">Nome</label>
        <input className="mb-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} required />

        <label className="mb-1 block text-sm">Email</label>
        <input type="email" className="mb-2 w-full rounded-xl border px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} required />

        <label className="mb-1 block text-sm">Telefono</label>
        <input className="mb-2 w-full rounded-xl border px-3 py-2" value={phone ?? ""} onChange={(e)=>setPhone(e.target.value)} />

        <label className="mb-1 block text-sm">Status Cliente</label>
        <Select value={status} onValueChange={(value) => setStatus(value as "lead" | "active" | "churn")}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Seleziona status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lead">Lead (Potenziale cliente)</SelectItem>
            <SelectItem value="active">Attivo (Cliente attivo)</SelectItem>
            <SelectItem value="churn">Churn (Cliente perso)</SelectItem>
          </SelectContent>
        </Select>

        <label className="mb-1 block text-sm">Data iscrizione</label>
        <input type="datetime-local" className="mb-3 w-full rounded-xl border px-3 py-2" value={joinedAt ?? ""} onChange={(e)=>setJoinedAt(e.target.value)} />

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