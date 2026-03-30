import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { sql, and, gte } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const period = request.nextUrl.searchParams.get("period") ?? "month"

  const periodStart = new Date()
  if (period === "today") periodStart.setHours(0, 0, 0, 0)
  else if (period === "week") periodStart.setDate(periodStart.getDate() - 7)
  else if (period === "month") periodStart.setMonth(periodStart.getMonth() - 1)
  else if (period === "year") periodStart.setFullYear(periodStart.getFullYear() - 1)

  const [stats] = await db
    .select({
      totalOrders: sql<number>`count(*)`,
      totalRevenue: sql<number>`COALESCE(sum(${orders.total}), 0)`,
      avgOrderValue: sql<number>`COALESCE(avg(${orders.total}), 0)`,
    })
    .from(orders)
    .where(gte(orders.createdAt, periodStart))

  return NextResponse.json({
    period,
    totalOrders: Number(stats.totalOrders),
    totalRevenue: Number(stats.totalRevenue),
    avgOrderValue: Math.round(Number(stats.avgOrderValue)),
  })
}
