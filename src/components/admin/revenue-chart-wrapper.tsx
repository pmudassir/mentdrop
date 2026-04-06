"use client"

import dynamic from "next/dynamic"

export const RevenueChartDynamic = dynamic(
  () => import("./revenue-chart").then((m) => ({ default: m.RevenueChart })),
  { ssr: false, loading: () => <div className="rounded-2xl bg-surface-container-lowest shadow-md h-[320px] animate-pulse" /> }
)
