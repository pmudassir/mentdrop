import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, eq, ilike } from "drizzle-orm"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? ""
  const category = request.nextUrl.searchParams.get("category")

  if (!q.trim()) {
    return NextResponse.json({ products: [] })
  }

  const conditions = [eq(products.isActive, true), ilike(products.name, `%${q}%`)]
  if (category) {
    // category filter by name match in category join — simplified
  }

  const results = await db.query.products.findMany({
    where: and(...conditions),
    limit: 20,
  })

  return NextResponse.json({ products: results })
}
