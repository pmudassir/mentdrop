/**
 * Mock data for dev/demo — used when DATABASE_URL is not configured.
 * Images use picsum.photos (always available, consistent by seed).
 * Replace with real data by running: pnpm db:push && pnpm db:seed
 */

import type { Category } from "@/lib/actions/categories"
import type { Product } from "@/lib/actions/products"

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1, name: "Kurtas", nameHi: "कुर्ता", slug: "kurtas",
    description: "Everyday elegance — cotton, silk & printed kurtas",
    parentId: null, imageUrl: "https://picsum.photos/seed/kurta-cat/400/500",
    sortOrder: 1, isActive: true, createdAt: new Date(),
  },
  {
    id: 2, name: "Abayas", nameHi: "अबाया", slug: "abayas",
    description: "Premium full-coverage abayas in modern silhouettes",
    parentId: null, imageUrl: "https://picsum.photos/seed/abaya-cat/400/500",
    sortOrder: 2, isActive: true, createdAt: new Date(),
  },
  {
    id: 3, name: "Pakistani Dresses", nameHi: "पाकिस्तानी ड्रेस", slug: "pakistani",
    description: "Embroidered suits, gharara & bridal collections",
    parentId: null, imageUrl: "https://picsum.photos/seed/pak-cat/400/500",
    sortOrder: 3, isActive: true, createdAt: new Date(),
  },
  {
    id: 4, name: "Sarees", nameHi: "साड़ी", slug: "sarees",
    description: "Silk, cotton & georgette sarees for every occasion",
    parentId: null, imageUrl: "https://picsum.photos/seed/saree-cat/400/500",
    sortOrder: 4, isActive: true, createdAt: new Date(),
  },
  {
    id: 5, name: "Suit Sets", nameHi: "सूट सेट", slug: "suits",
    description: "3-piece & 2-piece ethnic suit sets",
    parentId: null, imageUrl: "https://picsum.photos/seed/suit-cat/400/500",
    sortOrder: 5, isActive: true, createdAt: new Date(),
  },
  {
    id: 6, name: "Trending", nameHi: "ट्रेंडिंग", slug: "trending",
    description: "What everyone is wearing right now",
    parentId: null, imageUrl: "https://picsum.photos/seed/trend-cat/400/500",
    sortOrder: 6, isActive: true, createdAt: new Date(),
  },
]

function product(
  id: string,
  name: string,
  nameHi: string,
  slug: string,
  categoryId: number,
  basePrice: number,
  salePrice: number | null,
  images: string[],
  description: string,
  tags: string[],
  isFeatured = false,
): Product {
  return {
    id,
    name,
    nameHi,
    slug,
    description,
    categoryId,
    basePrice,  // in paisa
    salePrice,
    images,
    tags,
    material: null,
    careInstructions: null,
    isFeatured,
    isActive: true,
    avgRating: Math.floor(Math.random() * 2) + 4 as 0 | 1 | 2 | 3 | 4 | 5,
    reviewCount: Math.floor(Math.random() * 200) + 10,
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000),
    updatedAt: new Date(),
  }
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`

export const MOCK_PRODUCTS: Product[] = [
  // ─── Kurtas (categoryId: 1) ───
  product("p01", "Chanderi Silk Kurta", "चंदेरी सिल्क कुर्ता", "chanderi-silk-kurta",
    1, 249900, 179900,
    [img("kurta1"), img("kurta1b"), img("kurta1c")],
    "Handwoven Chanderi silk kurta with delicate zari border. Light as a feather, ideal for festive occasions.",
    ["kurta", "silk", "festive", "chanderi"], true),

  product("p02", "Anarkali Printed Cotton Kurta", "अनारकली कॉटन कुर्ता", "anarkali-cotton-kurta",
    1, 129900, 99900,
    [img("kurta2"), img("kurta2b")],
    "Flared Anarkali silhouette in breathable cotton with block-printed motifs. Everyday luxury.",
    ["kurta", "cotton", "anarkali", "printed"]),

  product("p03", "Lucknowi Chikankari Kurta", "लखनवी चिकनकारी कुर्ता", "chikankari-kurta",
    1, 299900, null,
    [img("kurta3"), img("kurta3b")],
    "Authentic Lucknowi chikankari embroidery on pure georgette. Each piece is hand-embroidered.",
    ["kurta", "chikankari", "georgette", "embroidered"], true),

  product("p04", "Rayon Palazzo Kurta Set", "रेयॉन पालाज़ो सेट", "rayon-palazzo-kurta",
    1, 89900, 69900,
    [img("kurta4"), img("kurta4b")],
    "Comfortable rayon kurta with matching palazzo pants. Perfect for office and casual outings.",
    ["kurta", "rayon", "palazzo", "set"]),

  // ─── Abayas (categoryId: 2) ───
  product("p05", "Classic Black Abaya", "क्लासिक ब्लैक अबाया", "classic-black-abaya",
    2, 199900, 159900,
    [img("abaya1"), img("abaya1b"), img("abaya1c")],
    "Full-length premium crepe abaya with subtle embroidery on cuffs. Timeless and modest.",
    ["abaya", "black", "modest", "crepe"], true),

  product("p06", "Dubai Open Abaya with Embroidery", "दुबई ओपन अबाया", "dubai-open-abaya",
    2, 349900, 279900,
    [img("abaya2"), img("abaya2b")],
    "Open-front abaya with intricate gold embroidery on the border. Dubai-inspired modern silhouette.",
    ["abaya", "dubai", "embroidered", "gold"]),

  product("p07", "Butterfly Abaya — Olive Green", "बटरफ्लाई अबाया", "butterfly-abaya-olive",
    2, 249900, null,
    [img("abaya3"), img("abaya3b")],
    "Dramatic butterfly sleeves in olive green crepe. Flowy and contemporary modest fashion.",
    ["abaya", "butterfly", "olive", "modest"]),

  product("p08", "Pearl Embellished Nida Abaya", "पर्ल अबाया", "pearl-nida-abaya",
    2, 449900, 389900,
    [img("abaya4"), img("abaya4b")],
    "Luxury Nida fabric with hand-placed pearl embellishments. Ideal for Eid and weddings.",
    ["abaya", "pearl", "nida", "wedding", "eid"], true),

  // ─── Pakistani Dresses (categoryId: 3) ───
  product("p09", "Embroidered Lawn Suit 3-Piece", "एम्ब्रॉयडर्ड लॉन सूट", "embroidered-lawn-suit",
    3, 399900, 319900,
    [img("pak1"), img("pak1b"), img("pak1c")],
    "Premium Pakistani lawn fabric with machine embroidery on shirt, dupatta and plain trouser.",
    ["pakistani", "lawn", "embroidered", "3-piece"], true),

  product("p10", "Gharara Set — Ruby Red", "घरारा सेट", "gharara-ruby-red",
    3, 599900, 499900,
    [img("pak2"), img("pak2b")],
    "Traditional gharara in ruby red with heavy zardozi work. Comes with kameez and dupatta.",
    ["pakistani", "gharara", "red", "zardozi", "bridal"]),

  product("p11", "Digital Print Lawn Kurta", "डिजिटल प्रिंट लॉन कुर्ता", "digital-print-lawn",
    3, 179900, 139900,
    [img("pak3"), img("pak3b")],
    "Vibrant digital print on premium lawn fabric. Lightweight summer collection.",
    ["pakistani", "lawn", "printed", "summer"]),

  product("p12", "Bridal Lehenga Suit", "ब्राइडल लहंगा सूट", "bridal-lehenga-suit",
    3, 1299900, 999900,
    [img("pak4"), img("pak4b"), img("pak4c")],
    "Heavily embroidered bridal lehenga suit with matching shawl. Handcrafted in 45 days.",
    ["pakistani", "bridal", "lehenga", "embroidered", "wedding"], true),

  // ─── Sarees (categoryId: 4) ───
  product("p13", "Banarasi Silk Saree — Gold", "बनारसी सिल्क साड़ी", "banarasi-silk-gold",
    4, 899900, 749900,
    [img("saree1"), img("saree1b"), img("saree1c")],
    "Pure Banarasi silk saree with gold zari weave. Comes with unstitched blouse piece.",
    ["saree", "banarasi", "silk", "gold", "wedding"], true),

  product("p14", "Cotton Handloom Saree", "कॉटन हैंडलूम साड़ी", "cotton-handloom-saree",
    4, 349900, null,
    [img("saree2"), img("saree2b")],
    "Handwoven cotton saree from Pochampally weavers. Cool, comfortable, socially conscious.",
    ["saree", "cotton", "handloom", "pochampally"]),

  product("p15", "Georgette Chiffon Saree — Teal", "जॉर्जेट चिफॉन साड़ी", "georgette-teal-saree",
    4, 449900, 359900,
    [img("saree3"), img("saree3b")],
    "Embellished georgette saree with sequin border. Perfect for parties and receptions.",
    ["saree", "georgette", "chiffon", "teal", "party"]),

  product("p16", "Kanjivaram Silk Saree", "कांजीवरम सिल्क साड़ी", "kanjivaram-silk-saree",
    4, 1199900, 999900,
    [img("saree4"), img("saree4b")],
    "Authentic Kanjivaram silk with traditional temple border. Heirloom quality, passed down generations.",
    ["saree", "kanjivaram", "silk", "south-indian", "wedding"], true),

  // ─── Suit Sets (categoryId: 5) ───
  product("p17", "Patiala Salwar Kameez Set", "पटियाला सलवार कमीज़", "patiala-salwar-kameez",
    5, 169900, 129900,
    [img("suit1"), img("suit1b")],
    "Vibrant Patiala salwar with matching kameez and chunni. Comfortable and colorful.",
    ["suit", "patiala", "salwar", "set"]),

  product("p18", "Palazzo Suit with Dupatta", "पालाज़ो सूट", "palazzo-suit-dupatta",
    5, 219900, 179900,
    [img("suit2"), img("suit2b")],
    "Flowy palazzo pants with printed top and sheer dupatta. Contemporary Indo-western look.",
    ["suit", "palazzo", "contemporary", "indo-western"]),

  product("p19", "Mughal Embroidered Suit Set", "मुगल एम्ब्रॉयडर्ड सूट", "mughal-embroidered-suit",
    5, 499900, 399900,
    [img("suit3"), img("suit3b"), img("suit3c")],
    "Mughal-inspired embroidery on rich silk base. 3-piece suit with straight pants and dupatta.",
    ["suit", "mughal", "embroidered", "silk", "3-piece"], true),

  product("p20", "Casual Cotton Suit Set", "कैज़ुअल कॉटन सूट", "casual-cotton-suit",
    5, 99900, 79900,
    [img("suit4"), img("suit4b")],
    "Easy breezy cotton suit for everyday wear. Machine washable, pre-shrunk.",
    ["suit", "cotton", "casual", "daily-wear"]),

  // ─── Trending (categoryId: 6) ───
  product("p21", "Cape Style Anarkali", "केप स्टाइल अनारकली", "cape-anarkali",
    6, 359900, 289900,
    [img("trend1"), img("trend1b")],
    "On-trend cape overlay on flared Anarkali. The most-photographed look this season.",
    ["trending", "cape", "anarkali", "new"], true),

  product("p22", "Co-Ord Ethnic Set", "को-ऑर्ड एथनिक सेट", "coord-ethnic-set",
    6, 279900, 229900,
    [img("trend2"), img("trend2b")],
    "Matching ethnic top and skirt set. Mix-and-match both pieces separately.",
    ["trending", "coord", "set", "modern"]),

  product("p23", "Mirror Work Kurti", "मिरर वर्क कुर्ती", "mirror-work-kurti",
    6, 199900, null,
    [img("trend3"), img("trend3b")],
    "Rajasthani-inspired mirror work on cotton kurti. Festival season essential.",
    ["trending", "mirror-work", "rajasthani", "festive"], true),

  product("p24", "Sharara Suit — Lavender", "शरारा सूट — लैवेंडर", "sharara-lavender",
    6, 449900, 369900,
    [img("trend4"), img("trend4b"), img("trend4c")],
    "Wide-leg sharara in soft lavender organza. Trending bridal alternative for mehendi & haldi.",
    ["trending", "sharara", "lavender", "bridal", "mehendi"]),
]

export function getMockFeatured(limit = 8): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit)
}

export function getMockNewArrivals(limit = 12): Product[] {
  return [...MOCK_PRODUCTS]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export function getMockProductsByCategory(categoryId: number): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId)
}

export function getMockProductBySlug(slug: string): Product | null {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null
}

export function getMockSearch(query: string): Product[] {
  const q = query.toLowerCase()
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.nameHi ?? "").includes(q) ||
      (p.tags as string[]).some((t) => t.includes(q))
  )
}
