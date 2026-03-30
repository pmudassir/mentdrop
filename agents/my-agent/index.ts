import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: `You are Priya, a friendly customer support assistant for Swadesh — a premium Indian ethnic wear store.

You help customers with:
- Finding the right ethnic wear (kurtas, abayas, Pakistani dresses, sarees)
- Checking order status and tracking
- Size recommendations
- Product availability
- Return and refund policy (7-day returns)
- Payment methods (UPI, Cards, COD available under ₹3000)
- Shipping (free above ₹999, 3-7 business days)

Tone: Warm, helpful, professional. Use occasional Hindi words naturally (like "bilkul", "zaroor").
Always be concise and mobile-friendly in responses.`,

  tools: {
    search_products: tool({
      description: "Search for products by name, category, or style",
      inputSchema: z.object({
        query: z.string().describe("Search query for products"),
      }),
      execute: async ({ query }) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/search?q=${encodeURIComponent(query)}`
          )
          const data = await res.json()
          const products = data.products?.slice(0, 5) ?? []
          const text = products.length
            ? `Found ${products.length} products:\n${products.map((p: { name: string; salePrice?: number; basePrice: number }) => `• ${p.name} — ₹${((p.salePrice ?? p.basePrice) / 100).toFixed(0)}`).join("\n")}`
            : `No products found for "${query}"`
          return { content: [{ type: "text" as const, text }] }
        } catch {
          return { content: [{ type: "text" as const, text: "Search is currently unavailable." }] }
        }
      },
    }),

    check_order_status: tool({
      description: "Check the status of an order by order number",
      inputSchema: z.object({
        order_number: z.string().describe("Order number like SWDSH-ABC123"),
      }),
      execute: async ({ order_number }) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${order_number}/status`
          )
          if (!res.ok) {
            return { content: [{ type: "text" as const, text: `Order ${order_number} not found. Please check the number and try again.` }] }
          }
          const data = await res.json()
          const text = `Order ${data.orderNumber}: **${data.status.replace(/_/g, " ")}**${data.trackingNumber ? `\nTracking: ${data.trackingNumber}` : ""}`
          return { content: [{ type: "text" as const, text }] }
        } catch {
          return { content: [{ type: "text" as const, text: "Could not fetch order status. Please try again." }] }
        }
      },
    }),

    get_size_guide: tool({
      description: "Get size chart information for ethnic wear categories",
      inputSchema: z.object({
        category: z.enum(["kurta", "abaya", "dress"]).describe("Clothing category"),
      }),
      execute: async ({ category }) => {
        const guides = {
          kurta: "XS=34, S=36, M=38, L=40, XL=42, XXL=44, 3XL=46 (chest in inches). Length: 44–52\".",
          abaya: "S=54\", M=56\", L=58\", XL=60\" (full length). Chest: one-size-fits-most with adjustable cut.",
          dress: "XS=34, S=36, M=38, L=40, XL=42, XXL=44 (chest in inches).",
        }
        return {
          content: [{
            type: "text" as const,
            text: `**${category.charAt(0).toUpperCase() + category.slice(1)} Size Guide:**\n${guides[category]}\n\nTip: When in doubt, size up for ethnic wear — it allows for movement and can be tailored easily.`,
          }],
        }
      },
    }),
  },
})
