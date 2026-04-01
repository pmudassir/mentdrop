/**
 * Variant seed script — adds size/colour variants to all products.
 * Run: DATABASE_URL=... pnpm tsx scripts/seed-variants.ts
 */
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../src/lib/db/schema"
import { eq } from "drizzle-orm"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

// Standard size sets per category type
const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const MODEST_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"]
const FREE_SIZE = ["Free Size"]

// Color palettes per slug pattern
const COLORS: Record<string, string[]> = {
  kurtas:    ["Ivory", "Sage Green", "Blush Pink", "Deep Navy"],
  abayas:    ["Black", "Midnight Blue", "Olive Green"],
  pakistani: ["Ivory", "Ruby Red", "Powder Blue", "Sage Green"],
  sarees:    ["As Shown"],  // sarees are unstitched — just one variant for stock
  suits:     ["Ivory", "Mustard Yellow", "Deep Teal"],
  trending:  ["Ivory", "Dusty Rose", "Sage Green", "Lavender"],
}

function sku(productSlug: string, size: string, color: string) {
  return `SWD-${productSlug.slice(0, 8).toUpperCase()}-${size.replace(" ", "")}-${color.slice(0, 3).toUpperCase()}`
}

async function seedVariants() {
  console.log("🌱 Seeding product variants…")

  // Check if variants already exist
  const existingCount = await db.select().from(schema.productVariants)
  if (existingCount.length > 0) {
    console.log(`  ℹ️  ${existingCount.length} variants already exist.`)
    const confirm = process.argv.includes("--force")
    if (!confirm) {
      console.log("  Pass --force to re-seed. Exiting.")
      return
    }
    console.log("  --force passed, deleting existing variants…")
    await db.delete(schema.productVariants)
  }

  const allProducts = await db.query.products.findMany({
    with: { category: true },
  })

  console.log(`  Found ${allProducts.length} products`)

  const variantRows: (typeof schema.productVariants.$inferInsert)[] = []

  for (const product of allProducts) {
    const catSlug = (product.category as { slug: string } | null)?.slug ?? ""

    let sizes: string[]
    if (catSlug === "sarees") {
      sizes = FREE_SIZE
    } else if (catSlug === "abayas") {
      sizes = MODEST_SIZES
    } else {
      sizes = APPAREL_SIZES
    }

    const colors = COLORS[catSlug] ?? ["Ivory", "Sage Green"]

    for (const color of colors) {
      for (const size of sizes) {
        variantRows.push({
          productId: product.id,
          sku: sku(product.slug, size, color),
          size,
          color,
          stock: Math.floor(Math.random() * 15) + 5, // 5-20 units
          priceOverride: null,
          isActive: true,
        })
      }
    }
  }

  // Batch insert in chunks of 100
  const CHUNK = 100
  let inserted = 0
  for (let i = 0; i < variantRows.length; i += CHUNK) {
    await db.insert(schema.productVariants).values(variantRows.slice(i, i + CHUNK))
    inserted += Math.min(CHUNK, variantRows.length - i)
  }

  console.log(`  ✓ Inserted ${inserted} variants across ${allProducts.length} products`)
  console.log("✅ Variant seed complete!")
}

seedVariants().catch((err) => {
  console.error("❌ Variant seed failed:", err)
  process.exit(1)
})
