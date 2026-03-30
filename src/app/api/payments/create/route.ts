import { getSession } from "@/lib/auth/session"
import { createRazorpayOrder } from "@/lib/payments/razorpay"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { amount?: unknown; receipt?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { amount, receipt } = body

  if (typeof amount !== "number" || amount <= 0) {
    return Response.json({ error: "Invalid amount" }, { status: 400 })
  }

  if (typeof receipt !== "string" || !receipt.trim()) {
    return Response.json({ error: "Invalid receipt" }, { status: 400 })
  }

  try {
    const order = await createRazorpayOrder(amount, receipt)
    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error("[payments/create]", err)
    return Response.json({ error: "Failed to create payment order" }, { status: 500 })
  }
}
