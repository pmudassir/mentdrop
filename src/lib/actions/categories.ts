"use server"

import { cache } from "react"
import { db } from "@/lib/db"
import { categories } from "@/lib/db/schema"
import { eq, asc, isNull, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import {
  MOCK_CATEGORIES,
  getMockProductsByCategory,
} from "@/lib/mock-data"

export type Category = typeof categories.$inferSelect
type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string }

const IS_MOCK = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("placeholder")

export const getCategories = cache(async function getCategories(): Promise<Category[]> {
  if (IS_MOCK) return MOCK_CATEGORIES
  try {
    return await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [asc(categories.sortOrder), asc(categories.name)],
    })
  } catch { return MOCK_CATEGORIES }
})

export const getRootCategories = cache(async function getRootCategories(): Promise<Category[]> {
  if (IS_MOCK) return MOCK_CATEGORIES.filter((c) => !c.parentId)
  try {
    return await db.query.categories.findMany({
      where: and(eq(categories.isActive, true), isNull(categories.parentId)),
      orderBy: [asc(categories.sortOrder)],
    })
  } catch { return MOCK_CATEGORIES.filter((c) => !c.parentId) }
})

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (IS_MOCK) return MOCK_CATEGORIES.find((c) => c.slug === slug)
  try {
    return await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    })
  } catch { return MOCK_CATEGORIES.find((c) => c.slug === slug) }
}

export async function getCategoryChildren(parentId: number): Promise<Category[]> {
  if (IS_MOCK) return MOCK_CATEGORIES.filter((c) => c.parentId === parentId)
  try {
    return await db.query.categories.findMany({
      where: and(eq(categories.parentId, parentId), eq(categories.isActive, true)),
      orderBy: [asc(categories.sortOrder)],
    })
  } catch { return [] }
}

export async function createCategory(
  data: Omit<typeof categories.$inferInsert, "id" | "createdAt">
): Promise<ActionResult<Category>> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }
  try {
    const [created] = await db.insert(categories).values(data).returning()
    return { success: true, data: created }
  } catch (e) {
    return { success: false, error: "Database error: " + (e as Error).message }
  }
}

export async function updateCategory(
  id: number,
  data: Partial<Omit<typeof categories.$inferInsert, "id" | "createdAt">>
): Promise<ActionResult<Category>> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }
  try {
    const [updated] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning()
    if (!updated) return { success: false, error: "Category not found" }
    return { success: true, data: updated }
  } catch (e) {
    return { success: false, error: "Database error: " + (e as Error).message }
  }
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }
  try {
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id))
    return { success: true, data: undefined }
  } catch (e) {
    return { success: false, error: "Database error: " + (e as Error).message }
  }
}
