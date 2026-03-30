"use server"

import { db } from "@/lib/db"
import { coupons } from "@/lib/db/schema"
import { eq, and, sql, desc } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"

export type Coupon = typeof coupons.$inferSelect
type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string }

export async function validateCoupon(
  code: string,
  orderTotal: number
): Promise<ActionResult<{ couponId: string; discount: number }>> {
  const session = await getSession()
  if (!session) return { success: false, error: "Please login first" }

  const coupon = await db.query.coupons.findFirst({
    where: and(eq(coupons.code, code.toUpperCase()), eq(coupons.isActive, true)),
  })

  if (!coupon) return { success: false, error: "Invalid coupon code" }

  const now = new Date()
  if (coupon.startsAt && now < coupon.startsAt) {
    return { success: false, error: "Coupon is not yet active" }
  }
  if (coupon.expiresAt && now > coupon.expiresAt) {
    return { success: false, error: "Coupon has expired" }
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { success: false, error: "Coupon usage limit reached" }
  }
  if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
    return {
      success: false,
      error: `Minimum order of ₹${(coupon.minOrderValue / 100).toFixed(0)} required`,
    }
  }

  let discount: number
  if (coupon.type === "percentage") {
    discount = Math.floor((orderTotal * coupon.value) / 100)
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount)
    }
  } else {
    discount = coupon.value
  }

  discount = Math.min(discount, orderTotal)

  return { success: true, data: { couponId: coupon.id, discount } }
}

export async function getCouponsAdmin(): Promise<Coupon[]> {
  const session = await getSession()
  if (!session || session.role !== "admin") return []

  return db.query.coupons.findMany({
    orderBy: [desc(coupons.createdAt)],
  })
}

export async function createCoupon(
  data: Omit<typeof coupons.$inferInsert, "id" | "createdAt" | "usedCount">
): Promise<ActionResult<Coupon>> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  const [created] = await db
    .insert(coupons)
    .values({ ...data, code: data.code.toUpperCase() })
    .returning()

  return { success: true, data: created }
}

export async function updateCoupon(
  id: string,
  data: Partial<Omit<typeof coupons.$inferInsert, "id" | "createdAt">>
): Promise<ActionResult<Coupon>> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  const [updated] = await db
    .update(coupons)
    .set(data)
    .where(eq(coupons.id, id))
    .returning()

  if (!updated) return { success: false, error: "Coupon not found" }
  return { success: true, data: updated }
}

export async function incrementCouponUsage(couponId: string): Promise<void> {
  await db
    .update(coupons)
    .set({ usedCount: sql`${coupons.usedCount} + 1` })
    .where(eq(coupons.id, couponId))
}
