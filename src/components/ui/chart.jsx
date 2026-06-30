"use client"

import * as React from "react"
import { Tooltip as RechartsTooltip } from "recharts"
import { cn } from "../../utils/cn"

export function ChartContainer({ children, className, config }) {
  return <div className={cn("w-full", className)}>{children}</div>
}

export function ChartTooltip({ content, ...props }) {
  // Dùng Tooltip từ recharts đã import
  return <RechartsTooltip {...props} content={content} />
}

export function ChartTooltipContent({ active, payload, label, hideLabel }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg border bg-white p-2 shadow-sm min-w-[120px]">
      {!hideLabel && (
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      )}
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="font-medium">{entry.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫</span>
        </div>
      ))}
    </div>
  )
}

export function ChartLegend({ payload }) {
  return (
    <ul className="flex flex-wrap gap-3 justify-center mt-3 text-sm">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></span>
          <span className="text-gray-700 font-medium">{entry.payload.packageName}</span>
        </li>
      ))}
    </ul>
  );
}
