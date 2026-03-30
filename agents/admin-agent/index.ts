import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: `You are an AI assistant for the Swadesh admin dashboard.

You help the store owner with:
- Revenue summaries and analytics
- Order management insights
- Inventory and stock alerts
- Customer behavior analysis
- Business recommendations

Be concise, data-driven, and actionable in responses.`,

  tools: {
    get_revenue_summary: tool({
      description: "Get revenue summary for a time period",
      inputSchema: z.object({
        period: z.enum(["today", "week", "month", "year"]).describe("Time period for the summary"),
      }),
      execute: async ({ period }) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/analytics?period=${period}`
          )
          const data = await res.json()
          const text = `**${period.charAt(0).toUpperCase() + period.slice(1)} Revenue:**\n• Orders: ${data.totalOrders}\n• Revenue: ₹${(data.totalRevenue / 100).toFixed(0)}\n• Avg Order: ₹${(data.avgOrderValue / 100).toFixed(0)}`
          return { content: [{ type: "text" as const, text }] }
        } catch {
          return { content: [{ type: "text" as const, text: "Analytics unavailable." }] }
        }
      },
    }),

    get_order_stats: tool({
      description: "Get overall order statistics including pending, delivered, and cancelled counts",
      inputSchema: z.object({}),
      execute: async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders/stats`
          )
          const data = await res.json()
          const text = `**Order Stats:**\n• Total: ${data.totalOrders}\n• Revenue: ₹${(data.totalRevenue / 100).toFixed(0)}\n• Pending: ${data.pendingOrders}\n• Delivered: ${data.deliveredOrders}`
          return { content: [{ type: "text" as const, text }] }
        } catch {
          return { content: [{ type: "text" as const, text: "Stats unavailable." }] }
        }
      },
    }),

    get_top_products: tool({
      description: "Get best-selling products by units sold",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(20).default(10).describe("Number of products to return"),
      }),
      execute: async ({ limit }) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products/top?limit=${limit}`
          )
          const data = await res.json()
          const list = (data.products ?? [])
            .map((p: { name: string; totalSold: number; totalRevenue: number }, i: number) =>
              `${i + 1}. ${p.name} — ${p.totalSold} sold (₹${(p.totalRevenue / 100).toFixed(0)})`
            )
            .join("\n")
          return { content: [{ type: "text" as const, text: `**Top ${limit} Products:**\n${list || "No data yet."}` }] }
        } catch {
          return { content: [{ type: "text" as const, text: "Product data unavailable." }] }
        }
      },
    }),
  },
})
