"use client";

import { useState } from "react";
import ExportsBar from "./ExportsBar";

export default function ReportTabs({
  customers, products, sales
}: {
  customers: { id:string; name:string; email:string; status:string; joinedAt: string | null }[];
  products: { id:string; name:string; kind:"SaaS"|"Platform"; monthly:string; isActive:boolean }[];
  sales: { id:string; customer:{name:string}; product:{name:string}; months:number; amount:string; status:string; soldAt:string }[];
}) {
  const [tab, setTab] = useState<"customers"|"products"|"sales">("customers");

  return (
    <div className="rounded-2xl border p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {(["customers","products","sales"] as const).map(t => (
            <button
              key={t}
              onClick={()=>setTab(t)}
              className={`rounded-xl px-3 py-2 text-sm ${tab===t ? "bg-primary text-white" : "border"}`}
            >
              {t === "customers" ? "Clienti" : t === "products" ? "Prodotti" : "Vendite"}
            </button>
          ))}
        </div>
        <ExportsBar scope={tab} />
      </div>

      {/* Tables */}
      {tab === "customers" && (
        <div className="overflow-auto rounded-xl border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Cliente</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Iscrizione</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c=>(
                <tr key={c.id} className="border-t">
                  <td className="px-3 py-2">{c.name}</td>
                  <td className="px-3 py-2">{c.email}</td>
                  <td className="px-3 py-2">{c.status}</td>
                  <td className="px-3 py-2">{c.joinedAt ? new Date(c.joinedAt).toLocaleDateString("it-IT") : "—"}</td>
                </tr>
              ))}
              {!customers.length && <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">Nessun dato</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <div className="overflow-auto rounded-xl border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Prodotto</th>
                <th className="px-3 py-2 text-left">Tipo</th>
                <th className="px-3 py-2 text-left">Mensile</th>
                <th className="px-3 py-2 text-left">Stato</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2">{p.kind}</td>
                  <td className="px-3 py-2">€ {Number(p.monthly).toFixed(2)}</td>
                  <td className="px-3 py-2">{p.isActive ? "attivo" : "disattivo"}</td>
                </tr>
              ))}
              {!products.length && <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">Nessun dato</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "sales" && (
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
              </tr>
            </thead>
            <tbody>
              {sales.map(s=>(
                <tr key={s.id} className="border-t">
                  <td className="px-3 py-2">{s.customer.name}</td>
                  <td className="px-3 py-2">{s.product.name}</td>
                  <td className="px-3 py-2">{s.months}</td>
                  <td className="px-3 py-2">€ {Number(s.amount).toFixed(2)}</td>
                  <td className="px-3 py-2">{s.status}</td>
                  <td className="px-3 py-2">{new Date(s.soldAt).toLocaleDateString("it-IT")}</td>
                </tr>
              ))}
              {!sales.length && <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Nessun dato</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 