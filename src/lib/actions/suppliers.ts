"use server"

import { db } from "@/lib/db"
import { suppliers, supplierProducts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"

export type Supplier = typeof suppliers.$inferSelect
export type SupplierProduct = typeof supplierProducts.$inferSelect

type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string }

export async function getSuppliersAdmin(): Promise<Supplier[]> {
  const session = await getSession()
  if (!session || session.role !== "admin") return []

  return db.query.suppliers.findMany({
    where: eq(suppliers.isActive, true),
    orderBy: [desc(suppliers.createdAt)],
  })
}

export async function createSupplier(
  data: Omit<typeof suppliers.$inferInsert, "id" | "createdAt">
): Promise<ActionResult<Supplier>> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  const [created] = await db.insert(suppliers).values(data).returning()
  return { success: true, data: created }
}

export async function updateSupplier(
  id: string,
  data: Partial<Omit<typeof suppliers.$inferInsert, "id" | "createdAt">>
): Promise<ActionResult<Supplier>> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  const [updated] = await db
    .update(suppliers)
    .set(data)
    .where(eq(suppliers.id, id))
    .returning()

  if (!updated) return { success: false, error: "Supplier not found" }
  return { success: true, data: updated }
}

export async function linkSupplierProduct(
  data: Omit<typeof supplierProducts.$inferInsert, "id" | "createdAt">
): Promise<ActionResult<SupplierProduct>> {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  const [created] = await db.insert(supplierProducts).values(data).returning()
  return { success: true, data: created }
}

export async function getProductSuppliers(productId: string): Promise<SupplierProduct[]> {
  return db.query.supplierProducts.findMany({
    where: eq(supplierProducts.productId, productId),
    with: { supplier: true },
  })
}
