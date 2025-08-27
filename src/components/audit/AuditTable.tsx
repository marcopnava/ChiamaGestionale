"use client";

import { useEffect, useMemo, useState } from "react";
import AuditExportBar from "./AuditExportBar";
import { toast } from "sonner";
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";

type Row = {
  id: string;
  createdAt: string;
  user?: { id: string; name: string | null; email: string | null } | null;
  userId: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: string;
  entityId: string;
  metadata: any;
};

export default function AuditTable({
  initial,
  users,
  entities
}: {
  initial: Row[];
  users: { id: string; name: string | null; email: string | null }[];
  entities: string[];
}) {
  const [q, setQ] = useState("");
  const [entity, setEntity] = useState("");
  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState<Row[]>(initial);
  const [total, setTotal] = useState(initial.length);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (entity) p.set("entity", entity);
    if (action) p.set("action", action);
    if (userId) p.set("userId", userId);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    p.set("page", String(page));
    p.set("limit", String(limit));
    return p.toString();
  }, [q, entity, action, userId, from, to, page, limit]);

  async function load() {
    try {
      const res = await fetch(`/api/audit?${qs}`);
      const data = await res.json();
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Errore caricamento");
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [qs]);

  function metaPreview(m: any) {
    try {
      const s = JSON.stringify(m ?? {}, null, 0);
      return s.length > 80 ? s.slice(0, 80) + "…" : s;
    } catch { return ""; }
  }

  return (
    <div className="rounded-2xl border p-3">
      {/* Filtri */}
      <div className="mb-3 grid gap-2 md:grid-cols-5">
        <input className="rounded-xl border px-3 py-2 text-sm" placeholder="Cerca in entity/id/metadata…" value={q} onChange={(e)=>{ setPage(1); setQ(e.target.value); }} />
        <select className="rounded-xl border px-3 py-2 text-sm" value={entity} onChange={(e)=>{ setPage(1); setEntity(e.target.value); }}>
          <option value="">Tutte le entity</option>
          {entities.map((e)=> <option key={e} value={e}>{e}</option>)}
        </select>
        <select className="rounded-xl border px-3 py-2 text-sm" value={action} onChange={(e)=>{ setPage(1); setAction(e.target.value); }}>
          <option value="">Tutte le azioni</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>
        <select className="rounded-xl border px-3 py-2 text-sm" value={userId} onChange={(e)=>{ setPage(1); setUserId(e.target.value); }}>
          <option value="">Tutti gli utenti</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email || u.id}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="date" className="w-full rounded-xl border px-3 py-2 text-sm" value={from} onChange={(e)=>{ setPage(1); setFrom(e.target.value); }} />
          <input type="date" className="w-full rounded-xl border px-3 py-2 text-sm" value={to} onChange={(e)=>{ setPage(1); setTo(e.target.value); }} />
        </div>
      </div>

      {/* Export */}
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-blue-900">{total} risultati</span>
        <AuditExportBar qs={qs} />
      </div>

      {/* Tabella */}
      <div className="overflow-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Timestamp</th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Action</th>
              <th className="px-3 py-2 text-left">Entity</th>
              <th className="px-3 py-2 text-left">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t align-top">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(r.createdAt).toLocaleString("it-IT")}</td>
                <td className="px-3 py-2">
                  {r.user?.name || r.user?.email || r.userId}
                  {r.user?.email && <div className="text-xs text-gray-500">{r.user.email}</div>}
                </td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    r.action === "CREATE" ? "bg-green-100 text-green-800" :
                    r.action === "UPDATE" ? "bg-blue-100 text-blue-800" :
                    "bg-red-100 text-red-800"
                  }`}>{r.action}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">{r.entity}</div>
                  <div className="text-xs text-gray-500">{r.entityId}</div>
                </td>
                <td className="px-3 py-2">
                  <code className="block max-w-[360px] truncate rounded bg-gray-50 px-2 py-1">{metaPreview(r.metadata)}</code>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">Nessun log</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <FlipButton 
            disabled={page<=1} 
            onClick={()=>setPage(p=>Math.max(1,p-1))} 
            className="rounded-xl border px-3 py-2 disabled:opacity-50"
            frontText="Prev"
            backText="←"
          />
          <span>p.{page}</span>
          <FlipButton 
            disabled={rows.length < limit} 
            onClick={()=>setPage(p=>p+1)} 
            className="rounded-xl border px-3 py-2 disabled:opacity-50"
            frontText="Next"
            backText="→"
          />
        </div>
      </div>
    </div>
  );
} 