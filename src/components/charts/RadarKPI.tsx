"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

type KP = { kpi: string; value: number };

export function RadarKPI({
  data = [
    { kpi: "MRR", value: 80 },
    { kpi: "Churn", value: 30 },
    { kpi: "ARPU", value: 65 },
    { kpi: "NPS", value: 75 },
  ],
}: { data?: KP[] }) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="kpi" />
          <Radar
            dataKey="value"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
} 