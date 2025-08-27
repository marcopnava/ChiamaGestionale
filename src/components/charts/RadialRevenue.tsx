"use client";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

export function RadialRevenue({ percent = 72 }: { percent?: number }) {
  const data = [{ name: "Ricavi", value: percent, fill: "#3B82F6" }];

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar background dataKey="value" />
          <Legend />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
} 