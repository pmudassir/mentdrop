"use server"

import { db } from "@/lib/db"
import { reviews, products } from "@/lib/db/schema"
import { eq, desc, and, sql } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { getMockReviews } from "@/lib/mock-data"

export type Review = typeof reviews.$inferSelect
type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string }

const IS_MOCK = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("placeholder")

export async function getProductReviews(
  productId: string,
  page = 1,
  limit = 10
): Promise<{ reviews: Review[]; total: number }> {
  if (IS_MOCK) return getMockReviews(productId, page, limit) as { reviews: Review[]; total: number }

  const where = eq(reviews.productId, productId)

  const [items, countResult] = await Promise.all([
    db.query.reviews.findMany({
      where,
      orderBy: [desc(reviews.createdAt)],
      limit,
      offset: (page - 1) * limit,
      with: { user: { columns: { name: true } } },
    }),
    db.select({ count: sql<number>`count(*)` }).from(reviews).where(where),
  ])

  return { reviews: items, total: Number(countResult[0]?.count ?? 0) }
}

export async function createReview(data: {
  productId: string
  rating: number
  title?: string
  body?: string
  images?: string[]
}): Promise<ActionResult<Review>> {
  const session = await getSession()
  if (!session) return { success: false, error: "Please login to leave a review" }

  if (data.rating < 1 || data.rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5" }
  }

  // Check for existing review
  const existing = await db.query.reviews.findFirst({
    where: and(
      eq(reviews.productId, data.productId),
      eq(reviews.userId, session.userId)
    ),
  })
  if (existing) return { success: false, error: "You already reviewed this product" }

  const [created] = await db
    .insert(reviews)
    .values({
      productId: data.productId,
      userId: session.userId,
      rating: data.rating,
      title: data.title,
      body: data.body,
      images: data.images ?? [],
    })
    .returning()

  // Update product average rating
  const [stats] = await db
    .select({
      avg: sql<number>`round(avg(${reviews.rating}))`,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(eq(reviews.productId, data.productId))

  await db
    .update(products)
    .set({
      avgRating: Number(stats.avg),
      reviewCount: Number(stats.count),
    })
    .where(eq(products.id, data.productId))

  return { success: true, data: created }
}
