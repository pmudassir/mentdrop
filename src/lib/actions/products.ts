"use server"

import { db } from "@/lib/db"
import { products, productVariants, categories } from "@/lib/db/schema"
import { eq, and, desc, asc, ilike, sql, ne } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import {
  MOCK_PRODUCTS,
  getMockFeatured,
  getMockNewArrivals,
  getMockProductsByCategory,
  getMockProductBySlug,
  getMockSearch,
  getMockVariants,
} from "@/lib/mock-data"

export type Product = typeof products.$inferSelect
export type ProductVariant = typeof productVariants.$inferSelect
export type ProductWithVariants = Product & { variants: ProductVariant[] }

type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string }

const IS_MOCK = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("placeholder")

// ─── Public Queries ───

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (IS_MOCK) return getMockFeatured(limit)
  try {
    return await db.query.products.findMany({
      where: and(eq(products.isActive, true), eq(products.isFeatured, true)),
      orderBy: [desc(products.createdAt)],
      limit,
    })
  } catch { return getMockFeatured(limit) }
}

export async function getNewArrivals(limit = 12): Promise<Product[]> {
  if (IS_MOCK) return getMockNewArrivals(limit)
  try {
    return await db.query.products.findMany({
      where: eq(products.isActive, true),
      orderBy: [desc(products.createdAt)],
      limit,
    })
  } catch { return getMockNewArrivals(limit) }
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  if (IS_MOCK) {
    const p = getMockProductBySlug(slug)
    return p ? { ...p, variants: getMockVariants(p.id) } : null
  }
  try {
    const product = await db.query.products.findFirst({
      where: and(eq(products.slug, slug), eq(products.isActive, true)),
      with: { variants: { where: eq(productVariants.isActive, true) } },
    })
    return product ?? null
  } catch {
    const p = getMockProductBySlug(slug)
    return p ? { ...p, variants: getMockVariants(p.id) } : null
  }
}

export async function getProductsByCategory(
  categoryId: number,
  opts: {
    page?: number
    limit?: number
    sort?: "newest" | "price_asc" | "price_desc" | "popular"
    minPrice?: number
    maxPrice?: number
  } = {}
): Promise<{ products: Product[]; total: number }> {
  const { page = 1, limit = 20, sort = "newest" } = opts

  if (IS_MOCK) {
    let items = getMockProductsByCategory(categoryId)
    if (sort === "price_asc") items = [...items].sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice))
    if (sort === "price_desc") items = [...items].sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice))
    if (sort === "popular") items = [...items].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    const total = items.length
    return { products: items.slice((page - 1) * limit, page * limit), total }
  }

  const conditions = [eq(products.isActive, true), eq(products.categoryId, categoryId)]
  const orderBy = {
    newest: [desc(products.createdAt)],
    price_asc: [asc(sql`COALESCE(${products.salePrice}, ${products.basePrice})`)],
    price_desc: [desc(sql`COALESCE(${products.salePrice}, ${products.basePrice})`)],
    popular: [desc(products.reviewCount), desc(products.avgRating)],
  }[sort]

  const where = and(...conditions)

  try {
    const [items, countResult] = await Promise.all([
      db.query.products.findMany({
        where,
        orderBy,
        limit,
        offset: (page - 1) * limit,
      }),
      db.select({ count: sql<number>`count(*)` }).from(products).where(where),
    ])
    return { products: items, total: Number(countResult[0]?.count ?? 0) }
  } catch {
    const items = getMockProductsByCategory(categoryId)
    return { products: items.slice((page - 1) * limit, page * limit), total: items.length }
  }
}

export async function searchProducts(query: string, limit = 20): Promise<Product[]> {
  if (!query.trim()) return []
  if (IS_MOCK) return getMockSearch(query).slice(0, limit)
  try {
    return await db.query.products.findMany({
      where: and(eq(products.isActive, true), ilike(products.name, `%${query}%`)),
      orderBy: [desc(products.createdAt)],
      limit,
    })
  } catch { return getMockSearch(query).slice(0, limit) }
}

export async function getRelatedProducts(
  productId: string,
  categoryId: number | null,
  limit = 6
): Promise<Product[]> {
  if (!categoryId) return []
  if (IS_MOCK) {
    return getMockProductsByCategory(categoryId).filter((p) => p.id !== productId).slice(0, limit)
  }
  try {
    return await db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        eq(products.categoryId, categoryId),
        ne(products.id, productId)
      ),
      limit,
    })
  } catch { return [] }
}

// ─── Admin Queries ───

export async function getProductsAdmin(opts: {
  page?: number; limit?: number; search?: string; categoryId?: number
} = {}): Promise<{ products: Product[]; total: number }> {
  const session = await getSession()
  if (!session || session.role !== "admin") return { products: [], total: 0 }

  if (IS_MOCK) {
    const items = MOCK_PRODUCTS
    return { products: items, total: items.length }
  }

  const { page = 1, limit = 20, search, categoryId } = opts
  const conditions = []
  if (search) conditions.push(ilike(products.name, `%${search}%`))
  if (categoryId) conditions.push(eq(products.categoryId, categoryId))
  const where = conditions.length > 0 ? and(...conditions) : undefined

  try {
    const [items, countResult] = await Promise.all([
      db.query.products.findMany({
        where,
        orderBy: [desc(products.createdAt)],
        limit,
        offset: (page - 1) * limit,
      }),
      db.select({ count: sql<number>`count(*)` }).from(products).where(where),
    ])
    return { products: items, total: Number(countResult[0]?.count ?? 0) }
  } catch { return { products: [], total: 0 } }
}

export async function getProductAdmin(id: string): Promise<ProductWithVariants | null> {
  const session = await getSession()
  if (!session || session.role !== "admin") return null

  if (IS_MOCK) {
    const p = MOCK_PRODUCTS.find((x) => x.id === id)
    return p ? { ...p, variants: [] } : null
  }

  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: { variants: true },
    })
    return product ?? null
  } catch { return null }
}

export async function createProduct(
  data: Omit<typeof products.$inferInsert, "id" | "createdAt" | "updatedAt">,
  variants?: Omit<typeof productVariants.$inferInsert, "id" | "productId" | "createdAt">[]
): Promise<ActionResult<ProductWithVariants>> {
  const session = await getSession()
  if (!session || session.role !== "admin") return { success: false, error: "Unauthorized" }

  try {
    const [created] = await db.insert(products).values(data).returning()
    let createdVariants: ProductVariant[] = []
    if (variants?.length) {
      createdVariants = await db
        .insert(productVariants)
        .values(variants.map((v) => ({ ...v, productId: created.id })))
        .returning()
    }
    return { success: true, data: { ...created, variants: createdVariants } }
  } catch (e) {
    return { success: false, error: "Database error: " + (e as Error).message }
  }
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<typeof products.$inferInsert, "id" | "createdAt">>
): Promise<ActionResult<Product>> {
  const session = await getSession()
  if (!session || session.role !== "admin") return { success: false, error: "Unauthorized" }

  try {
    const [updated] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning()
    if (!updated) return { success: false, error: "Product not found" }
    return { success: true, data: updated }
  } catch (e) {
    return { success: false, error: "Database error: " + (e as Error).message }
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== "admin") return { success: false, error: "Unauthorized" }

  try {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id))
    return { success: true, data: undefined }
  } catch (e) {
    return { success: false, error: "Database error: " + (e as Error).message }
  }
}

export async function upsertVariants(
  productId: string,
  variants: Omit<typeof productVariants.$inferInsert, "id" | "createdAt">[]
): Promise<ActionResult<ProductVariant[]>> {
  const session = await getSession()
  if (!session || session.role !== "admin") return { success: false, error: "Unauthorized" }

  try {
    await db.delete(productVariants).where(eq(productVariants.productId, productId))
    if (!variants.length) return { success: true, data: [] }
    const created = await db
      .insert(productVariants)
      .values(variants.map((v) => ({ ...v, productId })))
      .returning()
    return { success: true, data: created }
  } catch (e) {
    return { success: false, error: "Database error: " + (e as Error).message }
  }
}
