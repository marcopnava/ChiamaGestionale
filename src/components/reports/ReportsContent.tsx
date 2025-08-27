"use client";

import { useEffect, useState } from "react";
import { RadarKPI } from "@/components/charts/RadarKPI";
import { Skeleton } from "@/components/ui/skeleton";
import { PinList } from "@/components/ui/shadcn-io/pin-list";
import { BarChart3, TrendingUp, DollarSign, AlertTriangle, Users, Package } from "lucide-react";

export default function ReportsContent({
  customers, products, sales
}: {
  customers: any[]; products: any[]; sales: any[];
}) {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<{ paidRevenue:number; mrr:number; arpu:number; churnRate:number; radar:{kpi:string;value:number}[] } | null>(null);
  const [churn, setChurn] = useState<{ id:string; name:string; email:string; status:string; score:number; mrr:number; ticketsOpen:number }[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/reports/summary").then(r=>r.json()),
      fetch("/api/reports/churn").then(r=>r.json())
    ]).then(([s, c]) => {
      if (!alive) return;
      setKpi(s);
      setChurn(c.rows || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { alive = false; };
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Report</h1>

      {/* KPI Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-[90px] w-full" />
            <Skeleton className="h-[90px] w-full" />
            <Skeleton className="h-[90px] w-full" />
            <Skeleton className="h-[90px] w-full" />
          </>
        ) : (
          <>
            <Card title="Ricavi pagati" value={`€ ${kpi ? kpi.paidRevenue.toFixed(2) : "0.00"}`} />
            <Card title="MRR" value={`€ ${kpi ? kpi.mrr.toFixed(2) : "0.00"}`} />
            <Card title="ARPU" value={`€ ${kpi ? kpi.arpu.toFixed(2) : "0.00"}`} />
            <Card title="Churn" value={`${kpi ? kpi.churnRate.toFixed(1) : "0.0"}%`} />
          </>
        )}
      </div>

      {/* Radar KPI */}
      <div className="rounded-2xl border p-4">
        {loading || !kpi ? <Skeleton className="h-[220px] w-full" /> : <RadarKPI data={kpi.radar} />}
      </div>

      {/* Tabs + Export + Tables */}
      <ReportTabs customers={customers} products={products} sales={sales} />

      {/* Churn Top Risks */}
      <div className="rounded-2xl border p-4">
        <div className="mb-2 text-sm font-semibold">Top clienti a rischio (AI)</div>
        {loading ? (
          <Skeleton className="h-[160px] w-full" />
        ) : (
          <div className="overflow-auto rounded-xl border">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Cliente</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">MRR</th>
                  <th className="px-3 py-2 text-left">Ticket aperti</th>
                  <th className="px-3 py-2 text-left">Rischio</th>
                </tr>
              </thead>
              <tbody>
                {churn.map(r=>(
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.email}</td>
                    <td className="px-3 py-2">{r.status}</td>
                    <td className="px-3 py-2">€ {r.mrr.toFixed(2)}</td>
                    <td className="px-3 py-2">{r.ticketsOpen}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        r.score > 0.7 ? "bg-red-100 text-red-800" :
                        r.score > 0.4 ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>{(r.score*100).toFixed(0)}%</span>
                    </td>
                  </tr>
                ))}
                {!churn.length && <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Nessun rischio rilevato</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PinList - Quick Actions */}
      <div className="mt-6">
        <PinList 
          items={[
            {
              id: 1,
              name: 'KPI Dashboard',
              info: 'Visualizza i principali indicatori',
              icon: BarChart3,
              pinned: true,
            },
            {
              id: 2,
              name: 'Analisi Churn',
              info: `${churn.length} clienti a rischio`,
              icon: AlertTriangle,
              pinned: true,
            },
            {
              id: 3,
              name: 'Report Vendite',
              info: 'Analizza le performance vendite',
              icon: TrendingUp,
              pinned: false,
            },
            {
              id: 4,
              name: 'Analisi Clienti',
              info: `${customers.length} clienti totali`,
              icon: Users,
              pinned: false,
            },
            {
              id: 5,
              name: 'Analisi Prodotti',
              info: `${products.length} prodotti nel catalogo`,
              icon: Package,
              pinned: false,
            },
          ]}
          labels={{
            pinned: 'Report Pinnati',
            unpinned: 'Altre Analisi'
          }}
          className="max-w-2xl"
        />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-1 text-lg font-semibold text-primary">{value}</div>
    </div>
  );
}

// Import ReportTabs directly
import ReportTabs from "./ReportTabs"; 