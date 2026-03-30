/**
 * Seed script — inserts categories and products into real Neon DB.
 * Run: DATABASE_URL=... pnpm tsx scripts/seed.ts
 */
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../src/lib/db/schema"
import { eq } from "drizzle-orm"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`

async function seed() {
  console.log("🌱 Seeding Swadesh database…")

  // ── Categories ──────────────────────────────────────────────
  const catData = [
    { name: "Kurtas", nameHi: "कुर्ता", slug: "kurtas", description: "Everyday elegance — cotton, silk & printed kurtas", imageUrl: img("kurta-cat"), sortOrder: 1 },
    { name: "Abayas", nameHi: "अबाया", slug: "abayas", description: "Premium full-coverage abayas in modern silhouettes", imageUrl: img("abaya-cat"), sortOrder: 2 },
    { name: "Pakistani Dresses", nameHi: "पाकिस्तानी ड्रेस", slug: "pakistani", description: "Embroidered suits, gharara & bridal collections", imageUrl: img("pak-cat"), sortOrder: 3 },
    { name: "Sarees", nameHi: "साड़ी", slug: "sarees", description: "Silk, cotton & georgette sarees for every occasion", imageUrl: img("saree-cat"), sortOrder: 4 },
    { name: "Suit Sets", nameHi: "सूट सेट", slug: "suits", description: "3-piece & 2-piece ethnic suit sets", imageUrl: img("suit-cat"), sortOrder: 5 },
    { name: "Trending", nameHi: "ट्रेंडिंग", slug: "trending", description: "What everyone is wearing right now", imageUrl: img("trend-cat"), sortOrder: 6 },
  ]

  // Upsert categories (skip if already exist)
  const existingCats = await db.query.categories.findMany()
  const existingSlugs = new Set(existingCats.map((c) => c.slug))

  const toInsertCats = catData.filter((c) => !existingSlugs.has(c.slug))
  let insertedCats: typeof schema.categories.$inferSelect[] = []
  if (toInsertCats.length > 0) {
    insertedCats = await db.insert(schema.categories).values(toInsertCats).returning()
    console.log(`  ✓ Inserted ${insertedCats.length} categories`)
  } else {
    console.log(`  ✓ Categories already exist, skipping`)
  }

  // Build slug→id map
  const allCats = await db.query.categories.findMany()
  const catBySlug = Object.fromEntries(allCats.map((c) => [c.slug, c.id]))

  // ── Products ──────────────────────────────────────────────
  const productData = [
    // Kurtas
    { name: "Chanderi Silk Kurta", nameHi: "चंदेरी सिल्क कुर्ता", slug: "chanderi-silk-kurta", catSlug: "kurtas", basePrice: 249900, salePrice: 179900, images: [img("kurta1"), img("kurta1b"), img("kurta1c")], description: "Handwoven Chanderi silk kurta with delicate zari border.", tags: ["kurta","silk","festive","chanderi"], isFeatured: true, avgRating: 5, reviewCount: 142 },
    { name: "Anarkali Printed Cotton Kurta", nameHi: "अनारकली कॉटन कुर्ता", slug: "anarkali-cotton-kurta", catSlug: "kurtas", basePrice: 129900, salePrice: 99900, images: [img("kurta2"), img("kurta2b")], description: "Flared Anarkali silhouette in breathable cotton with block-printed motifs.", tags: ["kurta","cotton","anarkali","printed"], isFeatured: false, avgRating: 4, reviewCount: 87 },
    { name: "Lucknowi Chikankari Kurta", nameHi: "लखनवी चिकनकारी कुर्ता", slug: "chikankari-kurta", catSlug: "kurtas", basePrice: 299900, salePrice: null, images: [img("kurta3"), img("kurta3b")], description: "Authentic Lucknowi chikankari embroidery on pure georgette.", tags: ["kurta","chikankari","georgette","embroidered"], isFeatured: true, avgRating: 5, reviewCount: 203 },
    { name: "Rayon Palazzo Kurta Set", nameHi: "रेयॉन पालाज़ो सेट", slug: "rayon-palazzo-kurta", catSlug: "kurtas", basePrice: 89900, salePrice: 69900, images: [img("kurta4"), img("kurta4b")], description: "Comfortable rayon kurta with matching palazzo pants.", tags: ["kurta","rayon","palazzo","set"], isFeatured: false, avgRating: 4, reviewCount: 56 },
    // Abayas
    { name: "Classic Black Abaya", nameHi: "क्लासिक ब्लैक अबाया", slug: "classic-black-abaya", catSlug: "abayas", basePrice: 199900, salePrice: 159900, images: [img("abaya1"), img("abaya1b"), img("abaya1c")], description: "Full-length premium crepe abaya with subtle embroidery on cuffs.", tags: ["abaya","black","modest","crepe"], isFeatured: true, avgRating: 5, reviewCount: 178 },
    { name: "Dubai Open Abaya with Embroidery", nameHi: "दुबई ओपन अबाया", slug: "dubai-open-abaya", catSlug: "abayas", basePrice: 349900, salePrice: 279900, images: [img("abaya2"), img("abaya2b")], description: "Open-front abaya with intricate gold embroidery on the border.", tags: ["abaya","dubai","embroidered","gold"], isFeatured: false, avgRating: 4, reviewCount: 94 },
    { name: "Butterfly Abaya — Olive Green", nameHi: "बटरफ्लाई अबाया", slug: "butterfly-abaya-olive", catSlug: "abayas", basePrice: 249900, salePrice: null, images: [img("abaya3"), img("abaya3b")], description: "Dramatic butterfly sleeves in olive green crepe.", tags: ["abaya","butterfly","olive","modest"], isFeatured: false, avgRating: 4, reviewCount: 62 },
    { name: "Pearl Embellished Nida Abaya", nameHi: "पर्ल अबाया", slug: "pearl-nida-abaya", catSlug: "abayas", basePrice: 449900, salePrice: 389900, images: [img("abaya4"), img("abaya4b")], description: "Luxury Nida fabric with hand-placed pearl embellishments.", tags: ["abaya","pearl","nida","wedding","eid"], isFeatured: true, avgRating: 5, reviewCount: 131 },
    // Pakistani
    { name: "Embroidered Lawn Suit 3-Piece", nameHi: "एम्ब्रॉयडर्ड लॉन सूट", slug: "embroidered-lawn-suit", catSlug: "pakistani", basePrice: 399900, salePrice: 319900, images: [img("pak1"), img("pak1b"), img("pak1c")], description: "Premium Pakistani lawn fabric with machine embroidery on shirt, dupatta and trouser.", tags: ["pakistani","lawn","embroidered","3-piece"], isFeatured: true, avgRating: 5, reviewCount: 189 },
    { name: "Gharara Set — Ruby Red", nameHi: "घरारा सेट", slug: "gharara-ruby-red", catSlug: "pakistani", basePrice: 599900, salePrice: 499900, images: [img("pak2"), img("pak2b")], description: "Traditional gharara in ruby red with heavy zardozi work.", tags: ["pakistani","gharara","red","zardozi","bridal"], isFeatured: false, avgRating: 5, reviewCount: 76 },
    { name: "Digital Print Lawn Kurta", nameHi: "डिजिटल प्रिंट लॉन कुर्ता", slug: "digital-print-lawn", catSlug: "pakistani", basePrice: 179900, salePrice: 139900, images: [img("pak3"), img("pak3b")], description: "Vibrant digital print on premium lawn fabric. Lightweight summer collection.", tags: ["pakistani","lawn","printed","summer"], isFeatured: false, avgRating: 4, reviewCount: 43 },
    { name: "Bridal Lehenga Suit", nameHi: "ब्राइडल लहंगा सूट", slug: "bridal-lehenga-suit", catSlug: "pakistani", basePrice: 1299900, salePrice: 999900, images: [img("pak4"), img("pak4b"), img("pak4c")], description: "Heavily embroidered bridal lehenga suit with matching shawl.", tags: ["pakistani","bridal","lehenga","embroidered","wedding"], isFeatured: true, avgRating: 5, reviewCount: 218 },
    // Sarees
    { name: "Banarasi Silk Saree — Gold", nameHi: "बनारसी सिल्क साड़ी", slug: "banarasi-silk-gold", catSlug: "sarees", basePrice: 899900, salePrice: 749900, images: [img("saree1"), img("saree1b"), img("saree1c")], description: "Pure Banarasi silk saree with gold zari weave.", tags: ["saree","banarasi","silk","gold","wedding"], isFeatured: true, avgRating: 5, reviewCount: 267 },
    { name: "Cotton Handloom Saree", nameHi: "कॉटन हैंडलूम साड़ी", slug: "cotton-handloom-saree", catSlug: "sarees", basePrice: 349900, salePrice: null, images: [img("saree2"), img("saree2b")], description: "Handwoven cotton saree from Pochampally weavers.", tags: ["saree","cotton","handloom","pochampally"], isFeatured: false, avgRating: 4, reviewCount: 89 },
    { name: "Georgette Chiffon Saree — Teal", nameHi: "जॉर्जेट चिफॉन साड़ी", slug: "georgette-teal-saree", catSlug: "sarees", basePrice: 449900, salePrice: 359900, images: [img("saree3"), img("saree3b")], description: "Embellished georgette saree with sequin border.", tags: ["saree","georgette","chiffon","teal","party"], isFeatured: false, avgRating: 4, reviewCount: 112 },
    { name: "Kanjivaram Silk Saree", nameHi: "कांजीवरम सिल्क साड़ी", slug: "kanjivaram-silk-saree", catSlug: "sarees", basePrice: 1199900, salePrice: 999900, images: [img("saree4"), img("saree4b")], description: "Authentic Kanjivaram silk with traditional temple border.", tags: ["saree","kanjivaram","silk","south-indian","wedding"], isFeatured: true, avgRating: 5, reviewCount: 154 },
    // Suit Sets
    { name: "Patiala Salwar Kameez Set", nameHi: "पटियाला सलवार कमीज़", slug: "patiala-salwar-kameez", catSlug: "suits", basePrice: 169900, salePrice: 129900, images: [img("suit1"), img("suit1b")], description: "Vibrant Patiala salwar with matching kameez and chunni.", tags: ["suit","patiala","salwar","set"], isFeatured: false, avgRating: 4, reviewCount: 67 },
    { name: "Palazzo Suit with Dupatta", nameHi: "पालाज़ो सूट", slug: "palazzo-suit-dupatta", catSlug: "suits", basePrice: 219900, salePrice: 179900, images: [img("suit2"), img("suit2b")], description: "Flowy palazzo pants with printed top and sheer dupatta.", tags: ["suit","palazzo","contemporary","indo-western"], isFeatured: false, avgRating: 4, reviewCount: 81 },
    { name: "Mughal Embroidered Suit Set", nameHi: "मुगल एम्ब्रॉयडर्ड सूट", slug: "mughal-embroidered-suit", catSlug: "suits", basePrice: 499900, salePrice: 399900, images: [img("suit3"), img("suit3b"), img("suit3c")], description: "Mughal-inspired embroidery on rich silk base.", tags: ["suit","mughal","embroidered","silk","3-piece"], isFeatured: true, avgRating: 5, reviewCount: 143 },
    { name: "Casual Cotton Suit Set", nameHi: "कैज़ुअल कॉटन सूट", slug: "casual-cotton-suit", catSlug: "suits", basePrice: 99900, salePrice: 79900, images: [img("suit4"), img("suit4b")], description: "Easy breezy cotton suit for everyday wear.", tags: ["suit","cotton","casual","daily-wear"], isFeatured: false, avgRating: 4, reviewCount: 38 },
    // Trending
    { name: "Cape Style Anarkali", nameHi: "केप स्टाइल अनारकली", slug: "cape-anarkali", catSlug: "trending", basePrice: 359900, salePrice: 289900, images: [img("trend1"), img("trend1b")], description: "On-trend cape overlay on flared Anarkali.", tags: ["trending","cape","anarkali","new"], isFeatured: true, avgRating: 5, reviewCount: 197 },
    { name: "Co-Ord Ethnic Set", nameHi: "को-ऑर्ड एथनिक सेट", slug: "coord-ethnic-set", catSlug: "trending", basePrice: 279900, salePrice: 229900, images: [img("trend2"), img("trend2b")], description: "Matching ethnic top and skirt set.", tags: ["trending","coord","set","modern"], isFeatured: false, avgRating: 4, reviewCount: 72 },
    { name: "Mirror Work Kurti", nameHi: "मिरर वर्क कुर्ती", slug: "mirror-work-kurti", catSlug: "trending", basePrice: 199900, salePrice: null, images: [img("trend3"), img("trend3b")], description: "Rajasthani-inspired mirror work on cotton kurti.", tags: ["trending","mirror-work","rajasthani","festive"], isFeatured: true, avgRating: 5, reviewCount: 161 },
    { name: "Sharara Suit — Lavender", nameHi: "शरारा सूट — लैवेंडर", slug: "sharara-lavender", catSlug: "trending", basePrice: 449900, salePrice: 369900, images: [img("trend4"), img("trend4b"), img("trend4c")], description: "Wide-leg sharara in soft lavender organza.", tags: ["trending","sharara","lavender","bridal","mehendi"], isFeatured: false, avgRating: 4, reviewCount: 93 },
  ]

  const existingProds = await db.query.products.findMany()
  const existingProdSlugs = new Set(existingProds.map((p) => p.slug))

  const toInsertProds = productData
    .filter((p) => !existingProdSlugs.has(p.slug))
    .map(({ catSlug, ...p }) => ({
      name: p.name,
      nameHi: p.nameHi,
      slug: p.slug,
      categoryId: catBySlug[catSlug],
      basePrice: p.basePrice,
      salePrice: p.salePrice ?? null,
      images: p.images,
      tags: p.tags,
      description: p.description,
      isFeatured: p.isFeatured,
      isActive: true,
      avgRating: p.avgRating as 0 | 1 | 2 | 3 | 4 | 5,
      reviewCount: p.reviewCount,
    }))

  if (toInsertProds.length > 0) {
    await db.insert(schema.products).values(toInsertProds)
    console.log(`  ✓ Inserted ${toInsertProds.length} products`)
  } else {
    console.log(`  ✓ Products already exist, skipping`)
  }

  // ── Sample coupons ──────────────────────────────────────────
  const existingCoupons = await db.query.coupons.findMany()
  if (existingCoupons.length === 0) {
    await db.insert(schema.coupons).values([
      { code: "SWADESH10", type: "percentage", value: 10, minOrderValue: 50000, maxDiscount: 20000, usageLimit: 1000, perUserLimit: 1, isActive: true },
      { code: "WELCOME200", type: "fixed", value: 20000, minOrderValue: 100000, usageLimit: 500, perUserLimit: 1, isActive: true },
      { code: "EID20", type: "percentage", value: 20, minOrderValue: 150000, maxDiscount: 50000, usageLimit: 200, perUserLimit: 1, isActive: true },
    ])
    console.log("  ✓ Inserted 3 sample coupons")
  }

  console.log("✅ Seed complete!")
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
