"use server"

import { db } from "@/lib/db"
import { orders, orderItems, productVariants, products } from "@/lib/db/schema"
import { eq, desc, and, sql } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { generateOrderNumber } from "@/lib/utils"
import { getMockOrders, getMockOrderByNumber, MOCK_ORDERS, MOCK_ORDER_STATS } from "@/lib/mock-data"

const IS_MOCK = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("placeholder")

export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect
export type OrderWithItems = Order & { items: OrderItem[] }

type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string }

// ─── Customer Queries ───

export async function getMyOrders(page = 1, limit = 10): Promise<{ orders: Order[]; total: number }> {
  const session = await getSession()
  if (!session) return { orders: [], total: 0 }

  if (IS_MOCK) {
    const all = getMockOrders(session.userId)
    return { orders: all.slice((page - 1) * limit, page * limit) as Order[], total: all.length }
  }

  const where = eq(orders.userId, session.userId)

  const [items, countResult] = await Promise.all([
    db.query.orders.findMany({
      where,
      orderBy: [desc(orders.createdAt)],
      limit,
      offset: (page - 1) * limit,
    }),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(where),
  ])

  return { orders: items, total: Number(countResult[0]?.count ?? 0) }
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderWithItems | null> {
  const session = await getSession()
  if (!session) return null

  if (IS_MOCK) return getMockOrderByNumber(orderNumber)

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.orderNumber, orderNumber), eq(orders.userId, session.userId)),
    with: { items: true },
  })
  return order ?? null
}

// ─── Create Order ───

export async function createOrder(data: {
  items: {
    productId: string
    variantId: string | null
    quantity: number
    unitPrice: number
  }[]
  shippingAddress: NonNullable<Order["shippingAddress"]>
  paymentMethod: string
  couponId?: string
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
}): Promise<ActionResult<Order>> {
  const session = await getSession()
  if (!session) return { success: false, error: "Please login to place an order" }

  const orderNumber = generateOrderNumber()

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId: session.userId,
      status: data.paymentMethod === "cod" ? "confirmed" : "pending",
      subtotal: data.subtotal,
      discount: data.discount,
      shippingCost: data.shippingCost,
      total: data.total,
      paymentMethod: data.paymentMethod,
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      shippingAddress: data.shippingAddress,
      couponId: data.couponId,
    })
    .returning()

  if (data.items.length > 0) {
    await db.insert(orderItems).values(
      data.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      }))
    )
  }

  // Validate stock and decrement for each variant
  for (const item of data.items) {
    if (item.variantId) {
      const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, item.variantId),
      })
      if (!variant || variant.stock < item.quantity) {
        // Roll back the order by deleting it
        await db.delete(orders).where(eq(orders.id, order.id))
        return { success: false, error: `Insufficient stock for one or more items` }
      }
      await db
        .update(productVariants)
        .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
        .where(eq(productVariants.id, item.variantId))
    }
  }

  return { success: true, data: order }
}

// ─── Admin Queries ───

export async function getOrdersAdmin(opts: {
  page?: number
  limit?: number
  status?: string
} = {}): Promise<{ orders: OrderWithItems[]; total: number }> {
  const session = await getSession()
  if (!session || session.role !== "admin") return { orders: [], total: 0 }

  if (IS_MOCK) {
    const { page = 1, limit = 20, status } = opts
    const filtered = status ? MOCK_ORDERS.filter((o) => o.status === status) : MOCK_ORDERS
    return { orders: filtered.slice((page - 1) * limit, page * limit), total: filtered.length }
  }

  const { page = 1, limit = 20, status } = opts
  const conditions = []

  if (status) {
    conditions.push(eq(orders.status, status as Order["status"]))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [items, countResult] = await Promise.all([
    db.query.orders.findMany({
      where,
      with: { items: true },
      orderBy: [desc(orders.createdAt)],
      limit,
      offset: (page - 1) * limit,
    }),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(where),
  ])

  return { orders: items, total: Number(countResult[0]?.count ?? 0) }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  trackingNumber?: string,
  trackingUrl?: string
): Promise<ActionResult<Order>> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  const updateData: Record<string, unknown> = {
    status,
    updatedAt: new Date(),
  }
  if (trackingNumber) updateData.trackingNumber = trackingNumber
  if (trackingUrl) updateData.trackingUrl = trackingUrl

  const [updated] = await db
    .update(orders)
    .set(updateData)
    .where(eq(orders.id, orderId))
    .returning()

  if (!updated) return { success: false, error: "Order not found" }
  return { success: true, data: updated }
}

// ─── Admin Stats ───

export async function getOrderStats(): Promise<{
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  deliveredOrders: number
}> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, deliveredOrders: 0 }
  }

  if (IS_MOCK) return MOCK_ORDER_STATS

  const [stats] = await db
    .select({
      totalOrders: sql<number>`count(*)`,
      totalRevenue: sql<number>`COALESCE(sum(${orders.total}), 0)`,
      pendingOrders: sql<number>`count(*) filter (where ${orders.status} = 'pending')`,
      deliveredOrders: sql<number>`count(*) filter (where ${orders.status} = 'delivered')`,
    })
    .from(orders)

  return {
    totalOrders: Number(stats.totalOrders),
    totalRevenue: Number(stats.totalRevenue),
    pendingOrders: Number(stats.pendingOrders),
    deliveredOrders: Number(stats.deliveredOrders),
  }
}
