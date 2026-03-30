import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

type Params = { params: Promise<{ orderNumber: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { orderNumber } = await params

  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
    columns: {
      orderNumber: true,
      status: true,
      trackingNumber: true,
      trackingUrl: true,
    },
  })

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(order)
}
