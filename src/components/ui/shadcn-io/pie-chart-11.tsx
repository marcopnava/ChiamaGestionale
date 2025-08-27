"use client"
import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive pie chart"

const desktopData = [
  { month: "january", desktop: 186, fill: "#8884d8" },
  { month: "february", desktop: 305, fill: "#82ca9d" },
  { month: "march", desktop: 237, fill: "#ffc658" },
  { month: "april", desktop: 173, fill: "#ff7300" },
  { month: "may", desktop: 209, fill: "#8dd1e1" },
]

const chartConfig = {
  january: {
    label: "January",
    color: "#8884d8",
  },
  february: {
    label: "February", 
    color: "#82ca9d",
  },
  march: {
    label: "March",
    color: "#ffc658",
  },
  april: {
    label: "April",
    color: "#ff7300",
  },
  may: {
    label: "May",
    color: "#8dd1e1",
  },
}

export function ChartPieInteractive() {
  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month)
  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  )
  const months = React.useMemo(() => desktopData.map((item) => item.month), [])

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h3 className="text-lg font-semibold">Pie Chart - Interactive</h3>
          <p className="text-sm text-muted-foreground">January - May 2024</p>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]
              if (!config) {
                return null
              }
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: config.color,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center">
        <div className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart width={300} height={300}>
            <Pie
              data={desktopData}
              dataKey="desktop"
              nameKey="month"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {desktopData[activeIndex].desktop.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </div>
      </div>
    </div>
  )
} 