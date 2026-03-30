import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products, orderItems } from "@/lib/db/schema"
import { sql, desc, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = Math.min(
    20,
    parseInt(request.nextUrl.searchParams.get("limit") ?? "10", 10)
  )

  const topProducts = await db
    .select({
      productId: orderItems.productId,
      name: products.name,
      totalSold: sql<number>`sum(${orderItems.quantity})`,
      totalRevenue: sql<number>`sum(${orderItems.totalPrice})`,
    })
    .from(orderItems)
    .innerJoin(products, eq(products.id, orderItems.productId))
    .groupBy(orderItems.productId, products.name)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(limit)

  return NextResponse.json({ products: topProducts })
}
