import { NextResponse } from "next/server"
import { getOrderStats } from "@/lib/actions/orders"
import { getSession } from "@/lib/auth/session"

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const stats = await getOrderStats()
  return NextResponse.json(stats)
}
