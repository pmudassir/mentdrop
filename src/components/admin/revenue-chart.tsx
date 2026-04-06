"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type DataPoint = { date: string; revenue: number; orders: number }

// Generate last 30 days of mock data if real data not available
function generateMockData(): DataPoint[] {
  const days = 30
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    const orders = Math.floor(Math.random() * 12) + 1
    const revenue = orders * (Math.floor(Math.random() * 180000) + 80000)
    return { date: label, revenue, orders }
  })
}

function formatRevenue(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
  return `₹${value}`
}

export function RevenueChart({ data }: { data?: DataPoint[] }) {
  const chartData = data ?? generateMockData()
  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = chartData.reduce((s, d) => s + d.orders, 0)

  return (
    <div className="rounded-2xl bg-surface-container-lowest shadow-md p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-title-lg text-on-surface mb-1">Revenue — Last 30 Days</h2>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-display-sm font-semibold text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
                {formatRevenue(totalRevenue)}
              </p>
              <p className="text-label-sm text-on-surface-variant">Total revenue</p>
            </div>
            <div className="w-px h-8 bg-outline-variant/30" />
            <div>
              <p className="text-headline-md font-semibold text-on-surface">
                {totalOrders}
              </p>
              <p className="text-label-sm text-on-surface-variant">Orders</p>
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2D5F3F" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#2D5F3F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#4A4845" }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            tickFormatter={formatRevenue}
            tick={{ fontSize: 10, fill: "#4A4845" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [formatRevenue(Number(value)), "Revenue"]}
            contentStyle={{
              background: "#fff",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(45,95,63,0.1)",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2D5F3F"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#2D5F3F", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
