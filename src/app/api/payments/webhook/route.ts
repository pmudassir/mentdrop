import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("x-razorpay-signature") ?? ""

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET ?? "")
    .update(body)
    .digest("hex")

  let signaturesMatch: boolean
  try {
    signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    )
  } catch {
    signaturesMatch = false
  }

  if (!signaturesMatch) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity
    await db
      .update(orders)
      .set({ status: "confirmed", razorpayPaymentId: payment.id, updatedAt: new Date() })
      .where(eq(orders.razorpayOrderId, payment.order_id))
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity
    await db
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.razorpayOrderId, payment.order_id))
  }

  return NextResponse.json({ received: true })
}
