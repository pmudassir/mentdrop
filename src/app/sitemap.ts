import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://swadesh.store"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/search`, changeFrequency: "weekly", priority: 0.5 },
  ]

  // Only query DB if DATABASE_URL is set (skips at build time without env)
  if (!process.env.DATABASE_URL) {
    return staticRoutes
  }

  try {
    const { db } = await import("@/lib/db")
    const { products, categories } = await import("@/lib/db/schema")
    const { eq } = await import("drizzle-orm")

    const [allProducts, allCategories] = await Promise.all([
      db.query.products.findMany({
        where: eq(products.isActive, true),
        columns: { slug: true, updatedAt: true },
      }),
      db.query.categories.findMany({
        where: eq(categories.isActive, true),
        columns: { slug: true },
      }),
    ])

    const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((cat) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))

    const productRoutes: MetadataRoute.Sitemap = allProducts.map((p) => ({
      url: `${BASE_URL}/products/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      lastModified: p.updatedAt,
    }))

    return [...staticRoutes, ...categoryRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
