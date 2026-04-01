/**
 * Mock data for dev/demo — used when DATABASE_URL is not configured.
 * Images use picsum.photos (always available, consistent by seed).
 * Replace with real data by running: pnpm db:push && pnpm db:seed
 */

import type { Category } from "@/lib/actions/categories"
import type { Product, ProductVariant } from "@/lib/actions/products"
import type { Order, OrderWithItems } from "@/lib/actions/orders"
import type { User, Address } from "@/lib/actions/auth"
import type { Review } from "@/lib/actions/reviews"

// ─────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Kurtas",            nameHi: "कुर्ता",             slug: "kurtas",     description: "Everyday elegance — cotton, silk & printed kurtas",    parentId: null, imageUrl: "https://picsum.photos/seed/kurta-cat/400/500",  sortOrder: 1, isActive: true, createdAt: new Date() },
  { id: 2, name: "Abayas",            nameHi: "अबाया",              slug: "abayas",     description: "Premium full-coverage abayas in modern silhouettes",   parentId: null, imageUrl: "https://picsum.photos/seed/abaya-cat/400/500",  sortOrder: 2, isActive: true, createdAt: new Date() },
  { id: 3, name: "Pakistani Dresses", nameHi: "पाकिस्तानी ड्रेस",  slug: "pakistani",  description: "Embroidered suits, gharara & bridal collections",      parentId: null, imageUrl: "https://picsum.photos/seed/pak-cat/400/500",    sortOrder: 3, isActive: true, createdAt: new Date() },
  { id: 4, name: "Sarees",            nameHi: "साड़ी",              slug: "sarees",     description: "Silk, cotton & georgette sarees for every occasion",   parentId: null, imageUrl: "https://picsum.photos/seed/saree-cat/400/500",  sortOrder: 4, isActive: true, createdAt: new Date() },
  { id: 5, name: "Suit Sets",         nameHi: "सूट सेट",           slug: "suits",      description: "3-piece & 2-piece ethnic suit sets",                  parentId: null, imageUrl: "https://picsum.photos/seed/suit-cat/400/500",   sortOrder: 5, isActive: true, createdAt: new Date() },
  { id: 6, name: "Trending",          nameHi: "ट्रेंडिंग",          slug: "trending",   description: "What everyone is wearing right now",                  parentId: null, imageUrl: "https://picsum.photos/seed/trend-cat/400/500",  sortOrder: 6, isActive: true, createdAt: new Date() },
]

// ─────────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────────

function product(
  id: string, name: string, nameHi: string, slug: string,
  categoryId: number, basePrice: number, salePrice: number | null,
  images: string[], description: string, tags: string[],
  isFeatured = false, avgRating: 0|1|2|3|4|5 = 4, reviewCount = 0,
): Product {
  return {
    id, name, nameHi, slug, description, categoryId,
    basePrice, salePrice, images, tags,
    material: null, careInstructions: null,
    isFeatured, isActive: true, avgRating, reviewCount,
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000),
    updatedAt: new Date(),
  }
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`

export const MOCK_PRODUCTS: Product[] = [
  // ─── Kurtas ───
  product("p01", "Chanderi Silk Kurta",          "चंदेरी सिल्क कुर्ता",    "chanderi-silk-kurta",    1, 249900, 179900, [img("kurta1"), img("kurta1b"), img("kurta1c")], "Handwoven Chanderi silk kurta with delicate zari border. Light as a feather, ideal for festive occasions.",                       ["kurta","silk","festive","chanderi"],              true, 5, 142),
  product("p02", "Anarkali Printed Cotton Kurta", "अनारकली कॉटन कुर्ता",   "anarkali-cotton-kurta",  1, 129900, 99900,  [img("kurta2"), img("kurta2b")],                 "Flared Anarkali silhouette in breathable cotton with block-printed motifs. Everyday luxury.",                                     ["kurta","cotton","anarkali","printed"],            false, 4, 87),
  product("p03", "Lucknowi Chikankari Kurta",     "लखनवी चिकनकारी कुर्ता", "chikankari-kurta",       1, 299900, null,   [img("kurta3"), img("kurta3b")],                 "Authentic Lucknowi chikankari embroidery on pure georgette. Each piece is hand-embroidered.",                                      ["kurta","chikankari","georgette","embroidered"],   true, 5, 203),
  product("p04", "Rayon Palazzo Kurta Set",       "रेयॉन पालाज़ो सेट",      "rayon-palazzo-kurta",    1, 89900,  69900,  [img("kurta4"), img("kurta4b")],                 "Comfortable rayon kurta with matching palazzo pants. Perfect for office and casual outings.",                                      ["kurta","rayon","palazzo","set"],                 false, 4, 56),
  // ─── Abayas ───
  product("p05", "Classic Black Abaya",               "क्लासिक ब्लैक अबाया", "classic-black-abaya",    2, 199900, 159900, [img("abaya1"), img("abaya1b"), img("abaya1c")], "Full-length premium crepe abaya with subtle embroidery on cuffs. Timeless and modest.",                                           ["abaya","black","modest","crepe"],                 true, 5, 178),
  product("p06", "Dubai Open Abaya with Embroidery",  "दुबई ओपन अबाया",      "dubai-open-abaya",       2, 349900, 279900, [img("abaya2"), img("abaya2b")],                 "Open-front abaya with intricate gold embroidery on the border. Dubai-inspired modern silhouette.",                                 ["abaya","dubai","embroidered","gold"],             false, 4, 94),
  product("p07", "Butterfly Abaya — Olive Green",     "बटरफ्लाई अबाया",      "butterfly-abaya-olive",  2, 249900, null,   [img("abaya3"), img("abaya3b")],                 "Dramatic butterfly sleeves in olive green crepe. Flowy and contemporary modest fashion.",                                          ["abaya","butterfly","olive","modest"],             false, 4, 62),
  product("p08", "Pearl Embellished Nida Abaya",      "पर्ल अबाया",           "pearl-nida-abaya",       2, 449900, 389900, [img("abaya4"), img("abaya4b")],                 "Luxury Nida fabric with hand-placed pearl embellishments. Ideal for Eid and weddings.",                                            ["abaya","pearl","nida","wedding","eid"],           true, 5, 131),
  // ─── Pakistani ───
  product("p09", "Embroidered Lawn Suit 3-Piece",  "एम्ब्रॉयडर्ड लॉन सूट", "embroidered-lawn-suit",  3, 399900, 319900, [img("pak1"), img("pak1b"), img("pak1c")],      "Premium Pakistani lawn fabric with machine embroidery on shirt, dupatta and plain trouser.",                                       ["pakistani","lawn","embroidered","3-piece"],       true, 5, 189),
  product("p10", "Gharara Set — Ruby Red",          "घरारा सेट",             "gharara-ruby-red",       3, 599900, 499900, [img("pak2"), img("pak2b")],                     "Traditional gharara in ruby red with heavy zardozi work. Comes with kameez and dupatta.",                                           ["pakistani","gharara","red","zardozi","bridal"],   false, 5, 76),
  product("p11", "Digital Print Lawn Kurta",        "डिजिटल प्रिंट लॉन",    "digital-print-lawn",     3, 179900, 139900, [img("pak3"), img("pak3b")],                     "Vibrant digital print on premium lawn fabric. Lightweight summer collection.",                                                     ["pakistani","lawn","printed","summer"],            false, 4, 43),
  product("p12", "Bridal Lehenga Suit",             "ब्राइडल लहंगा सूट",    "bridal-lehenga-suit",    3, 1299900, 999900,[img("pak4"), img("pak4b"), img("pak4c")],      "Heavily embroidered bridal lehenga suit with matching shawl. Handcrafted in 45 days.",                                             ["pakistani","bridal","lehenga","embroidered"],     true, 5, 218),
  // ─── Sarees ───
  product("p13", "Banarasi Silk Saree — Gold",  "बनारसी सिल्क साड़ी",  "banarasi-silk-gold",       4, 899900,  749900, [img("saree1"), img("saree1b"), img("saree1c")], "Pure Banarasi silk saree with gold zari weave. Comes with unstitched blouse piece.",                                                ["saree","banarasi","silk","gold","wedding"],       true, 5, 267),
  product("p14", "Cotton Handloom Saree",       "कॉटन हैंडलूम साड़ी",  "cotton-handloom-saree",    4, 349900,  null,   [img("saree2"), img("saree2b")],                 "Handwoven cotton saree from Pochampally weavers. Cool, comfortable, socially conscious.",                                           ["saree","cotton","handloom","pochampally"],        false, 4, 89),
  product("p15", "Georgette Chiffon Saree",     "जॉर्जेट चिफॉन साड़ी", "georgette-teal-saree",     4, 449900,  359900, [img("saree3"), img("saree3b")],                 "Embellished georgette saree with sequin border. Perfect for parties and receptions.",                                               ["saree","georgette","chiffon","teal","party"],     false, 4, 112),
  product("p16", "Kanjivaram Silk Saree",       "कांजीवरम सिल्क साड़ी", "kanjivaram-silk-saree",   4, 1199900, 999900, [img("saree4"), img("saree4b")],                 "Authentic Kanjivaram silk with traditional temple border. Heirloom quality, passed down generations.",                             ["saree","kanjivaram","silk","south-indian"],       true, 5, 154),
  // ─── Suit Sets ───
  product("p17", "Patiala Salwar Kameez Set",      "पटियाला सलवार कमीज़",   "patiala-salwar-kameez",  5, 169900, 129900, [img("suit1"), img("suit1b")],                   "Vibrant Patiala salwar with matching kameez and chunni. Comfortable and colorful.",                                                 ["suit","patiala","salwar","set"],                  false, 4, 67),
  product("p18", "Palazzo Suit with Dupatta",      "पालाज़ो सूट",            "palazzo-suit-dupatta",   5, 219900, 179900, [img("suit2"), img("suit2b")],                   "Flowy palazzo pants with printed top and sheer dupatta. Contemporary Indo-western look.",                                           ["suit","palazzo","contemporary","indo-western"],   false, 4, 81),
  product("p19", "Mughal Embroidered Suit Set",    "मुगल एम्ब्रॉयडर्ड सूट", "mughal-embroidered-suit",5, 499900, 399900, [img("suit3"), img("suit3b"), img("suit3c")],   "Mughal-inspired embroidery on rich silk base. 3-piece suit with straight pants and dupatta.",                                       ["suit","mughal","embroidered","silk","3-piece"],   true, 5, 143),
  product("p20", "Casual Cotton Suit Set",         "कैज़ुअल कॉटन सूट",       "casual-cotton-suit",     5, 99900,  79900,  [img("suit4"), img("suit4b")],                   "Easy breezy cotton suit for everyday wear. Machine washable, pre-shrunk.",                                                         ["suit","cotton","casual","daily-wear"],            false, 4, 38),
  // ─── Trending ───
  product("p21", "Cape Style Anarkali",  "केप स्टाइल अनारकली",   "cape-anarkali",     6, 359900, 289900, [img("trend1"), img("trend1b")],                 "On-trend cape overlay on flared Anarkali. The most-photographed look this season.",                      ["trending","cape","anarkali","new"],               true, 5, 197),
  product("p22", "Co-Ord Ethnic Set",    "को-ऑर्ड एथनिक सेट",   "coord-ethnic-set",  6, 279900, 229900, [img("trend2"), img("trend2b")],                 "Matching ethnic top and skirt set. Mix-and-match both pieces separately.",                                ["trending","coord","set","modern"],                false, 4, 72),
  product("p23", "Mirror Work Kurti",    "मिरर वर्क कुर्ती",      "mirror-work-kurti", 6, 199900, null,   [img("trend3"), img("trend3b")],                 "Rajasthani-inspired mirror work on cotton kurti. Festival season essential.",                              ["trending","mirror-work","rajasthani","festive"],  true, 5, 161),
  product("p24", "Sharara Suit — Lavender","शरारा सूट — लैवेंडर", "sharara-lavender",  6, 449900, 369900, [img("trend4"), img("trend4b"), img("trend4c")], "Wide-leg sharara in soft lavender organza. Trending bridal alternative for mehendi & haldi.",             ["trending","sharara","lavender","bridal"],         false, 4, 93),
]

// ─────────────────────────────────────────────────────────────────
// Product Variants
// ─────────────────────────────────────────────────────────────────

const APPAREL_SIZES = ["XS","S","M","L","XL","XXL"]
const MODEST_SIZES  = ["S","M","L","XL","XXL","XXXL"]
const FREE_SIZE     = ["Free Size"]

const CAT_COLORS: Record<number, string[]> = {
  1: ["Ivory","Sage Green","Blush Pink","Deep Navy"],
  2: ["Black","Midnight Blue","Olive Green"],
  3: ["Ivory","Ruby Red","Powder Blue","Sage Green"],
  4: ["As Shown"],
  5: ["Ivory","Mustard Yellow","Deep Teal"],
  6: ["Ivory","Dusty Rose","Sage Green","Lavender"],
}

function buildVariants(p: Product): ProductVariant[] {
  const sizes = p.categoryId === 4 ? FREE_SIZE : p.categoryId === 2 ? MODEST_SIZES : APPAREL_SIZES
  const colors = CAT_COLORS[p.categoryId] ?? ["Ivory","Sage Green"]
  const rows: ProductVariant[] = []
  let i = 0
  for (const color of colors) {
    for (const size of sizes) {
      rows.push({
        id: `${p.id}-v${++i}`,
        productId: p.id,
        sku: `SWD-${p.slug.slice(0,8).toUpperCase()}-${size.replace(" ","")}-${color.slice(0,3).toUpperCase()}`,
        size, color,
        colorHex: null,
        priceOverride: null,
        stock: 8 + (i % 10),
        reservedStock: 0,
        isActive: true,
        createdAt: new Date(),
      })
    }
  }
  return rows
}

export const MOCK_VARIANTS: Record<string, ProductVariant[]> = Object.fromEntries(
  MOCK_PRODUCTS.map((p) => [p.id, buildVariants(p)])
)

// ─────────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  { id: "u01", phone: "+919876543210", name: "Ananya Sharma",    email: "ananya@example.com", role: "customer", createdAt: new Date("2024-01-15"), updatedAt: new Date() },
  { id: "u02", phone: "+919988776655", name: "Priya Mehta",      email: "priya@example.com",  role: "customer", createdAt: new Date("2024-02-20"), updatedAt: new Date() },
  { id: "u03", phone: "+918877665544", name: "Zara Khan",        email: "zara@example.com",   role: "customer", createdAt: new Date("2024-03-10"), updatedAt: new Date() },
  { id: "admin01", phone: "+919000000000", name: "Store Admin", email: "admin@swadesh.com",   role: "admin",    createdAt: new Date("2024-01-01"), updatedAt: new Date() },
]

export const MOCK_USER = MOCK_USERS[0]

// ─────────────────────────────────────────────────────────────────
// Addresses
// ─────────────────────────────────────────────────────────────────

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr01", userId: "u01",
    label: "Home",
    name: "Ananya Sharma", phone: "9876543210",
    line1: "42, Gulmohar Lane", line2: "Bandra West",
    city: "Mumbai", state: "Maharashtra", pincode: "400050",
    isDefault: true, createdAt: new Date(),
  },
  {
    id: "addr02", userId: "u01",
    label: "Work",
    name: "Ananya Sharma", phone: "9876543210",
    line1: "Sunrise Tech Park, Tower B, Floor 6", line2: "Andheri East",
    city: "Mumbai", state: "Maharashtra", pincode: "400069",
    isDefault: false, createdAt: new Date(),
  },
]

// ─────────────────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────────────────

function daysAgo(n: number) { return new Date(Date.now() - n * 86400000) }

export const MOCK_ORDERS: OrderWithItems[] = [
  {
    id: "ord01", orderNumber: "SWD-20240315-001", userId: "u01",
    status: "delivered",
    subtotal: 429800, discount: 0, shippingCost: 0, total: 429800,
    paymentMethod: "razorpay", couponId: null,
    razorpayOrderId: "order_mock01", razorpayPaymentId: "pay_mock01",
    trackingNumber: "DTDC12345678", trackingUrl: null,
    shippingAddress: { name: "Ananya Sharma", phone: "9876543210", line1: "42, Gulmohar Lane", line2: "Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    supplierId: null, notes: null,
    createdAt: daysAgo(30), updatedAt: daysAgo(25),
    items: [
      { id: "oi01", orderId: "ord01", productId: "p01", variantId: "p01-v1", quantity: 1, unitPrice: 179900, totalPrice: 179900, productSnapshot: { name: "Chanderi Silk Kurta", image: img("kurta1"), size: "M", color: "Ivory", sku: "SWD-CHANDERA-M-IVO" }, createdAt: daysAgo(30) },
      { id: "oi02", orderId: "ord01", productId: "p05", variantId: "p05-v1", quantity: 1, unitPrice: 159900, totalPrice: 159900, productSnapshot: { name: "Classic Black Abaya", image: img("abaya1"), size: "L", color: "Black", sku: "SWD-CLASSIC-L-BLA" },  createdAt: daysAgo(30) },
      { id: "oi03", orderId: "ord01", productId: "p04", variantId: "p04-v1", quantity: 1, unitPrice: 69900,  totalPrice: 69900,  productSnapshot: { name: "Rayon Palazzo Kurta Set", image: img("kurta4"), size: "S", color: "Sage Green", sku: "SWD-RAYONPA-S-SAG" }, createdAt: daysAgo(30) },
    ],
  },
  {
    id: "ord02", orderNumber: "SWD-20240328-002", userId: "u01",
    status: "shipped",
    subtotal: 319900, discount: 31990, shippingCost: 0, total: 287910,
    paymentMethod: "razorpay", couponId: null,
    razorpayOrderId: "order_mock02", razorpayPaymentId: "pay_mock02",
    trackingNumber: "BLUEDART9876543", trackingUrl: null,
    shippingAddress: { name: "Ananya Sharma", phone: "9876543210", line1: "42, Gulmohar Lane", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    supplierId: null, notes: null,
    createdAt: daysAgo(5), updatedAt: daysAgo(3),
    items: [
      { id: "oi04", orderId: "ord02", productId: "p09", variantId: "p09-v1", quantity: 1, unitPrice: 319900, totalPrice: 319900, productSnapshot: { name: "Embroidered Lawn Suit 3-Piece", image: img("pak1"), size: "M", color: "Ivory", sku: "SWD-EMBROID-M-IVO" }, createdAt: daysAgo(5) },
    ],
  },
  {
    id: "ord03", orderNumber: "SWD-20240331-003", userId: "u01",
    status: "confirmed",
    subtotal: 749900, discount: 0, shippingCost: 0, total: 749900,
    paymentMethod: "cod", couponId: null,
    razorpayOrderId: null, razorpayPaymentId: null,
    trackingNumber: null, trackingUrl: null,
    shippingAddress: { name: "Ananya Sharma", phone: "9876543210", line1: "42, Gulmohar Lane", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    supplierId: null, notes: null,
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
    items: [
      { id: "oi05", orderId: "ord03", productId: "p13", variantId: "p13-v1", quantity: 1, unitPrice: 749900, totalPrice: 749900, productSnapshot: { name: "Banarasi Silk Saree — Gold", image: img("saree1"), size: "Free Size", color: "As Shown", sku: "SWD-BANARA-FreeSiz-AS" }, createdAt: daysAgo(1) },
    ],
  },
  {
    id: "ord04", orderNumber: "SWD-20240210-004", userId: "u02",
    status: "delivered",
    subtotal: 399900, discount: 0, shippingCost: 7900, total: 407800,
    paymentMethod: "razorpay", couponId: null,
    razorpayOrderId: "order_mock04", razorpayPaymentId: "pay_mock04",
    trackingNumber: null, trackingUrl: null,
    shippingAddress: { name: "Priya Mehta", phone: "9988776655", line1: "15, Vasant Vihar", city: "Delhi", state: "Delhi", pincode: "110057" },
    supplierId: null, notes: null,
    createdAt: daysAgo(48), updatedAt: daysAgo(42),
    items: [
      { id: "oi06", orderId: "ord04", productId: "p19", variantId: "p19-v1", quantity: 1, unitPrice: 399900, totalPrice: 399900, productSnapshot: { name: "Mughal Embroidered Suit Set", image: img("suit3"), size: "M", color: "Ivory", sku: "SWD-MUGHALE-M-IVO" }, createdAt: daysAgo(48) },
    ],
  },
  {
    id: "ord05", orderNumber: "SWD-20240318-005", userId: "u03",
    status: "processing",
    subtotal: 289900, discount: 20000, shippingCost: 0, total: 269900,
    paymentMethod: "razorpay", couponId: null,
    razorpayOrderId: "order_mock05", razorpayPaymentId: "pay_mock05",
    trackingNumber: null, trackingUrl: null,
    shippingAddress: { name: "Zara Khan", phone: "8877665544", line1: "7, Rose Garden, Juhu", city: "Mumbai", state: "Maharashtra", pincode: "400049" },
    supplierId: null, notes: null,
    createdAt: daysAgo(12), updatedAt: daysAgo(10),
    items: [
      { id: "oi07", orderId: "ord05", productId: "p21", variantId: "p21-v1", quantity: 1, unitPrice: 289900, totalPrice: 289900, productSnapshot: { name: "Cape Style Anarkali", image: img("trend1"), size: "S", color: "Ivory", sku: "SWD-CAPEANA-S-IVO" }, createdAt: daysAgo(12) },
    ],
  },
  {
    id: "ord06", orderNumber: "SWD-20240320-006", userId: "u01",
    status: "cancelled",
    subtotal: 999900, discount: 0, shippingCost: 0, total: 999900,
    paymentMethod: "razorpay", couponId: null,
    razorpayOrderId: null, razorpayPaymentId: null,
    trackingNumber: null, trackingUrl: null,
    shippingAddress: { name: "Ananya Sharma", phone: "9876543210", line1: "42, Gulmohar Lane", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    supplierId: null, notes: null,
    createdAt: daysAgo(10), updatedAt: daysAgo(9),
    items: [
      { id: "oi08", orderId: "ord06", productId: "p12", variantId: "p12-v1", quantity: 1, unitPrice: 999900, totalPrice: 999900, productSnapshot: { name: "Bridal Lehenga Suit", image: img("pak4"), size: "M", color: "Ivory", sku: "SWD-BRIDALLEG-M-IVO" }, createdAt: daysAgo(10) },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────────────────────────

const REVIEW_POOL: Array<{ userName: string; title: string; body: string; rating: 4 | 5 }> = [
  { userName: "Ananya S.",   rating: 5, title: "Absolutely stunning!",         body: "The quality is beyond what I expected. The fabric is soft and the embroidery is intricate. Got so many compliments at the wedding." },
  { userName: "Priya M.",    rating: 5, title: "Perfect for the occasion",     body: "Ordered for my sister's wedding. The fit was perfect in M size and the colour matched exactly as shown. Highly recommend." },
  { userName: "Zara K.",     rating: 4, title: "Beautiful but runs slightly large", body: "Gorgeous piece but I'd suggest sizing down. The fabric quality is excellent. Delivery was faster than expected." },
  { userName: "Riya T.",     rating: 5, title: "Worth every rupee",            body: "The craftsmanship is incredible. You can feel the difference between this and the cheaper alternatives. A wardrobe staple." },
  { userName: "Sana A.",     rating: 5, title: "Exactly as described",         body: "Photos don't do justice to how beautiful this is in person. The colour is rich and the drape is perfect. Will order again." },
  { userName: "Meena R.",    rating: 4, title: "Great quality, minor issues",  body: "The stitching is excellent and fabric is premium. One thread came loose but customer support fixed it quickly. Overall happy." },
  { userName: "Fatima B.",   rating: 5, title: "Fell in love with it",         body: "I've been looking for something like this for ages. The fit is true to size and the colour is so vibrant. Five stars easily." },
  { userName: "Kavya P.",    rating: 5, title: "Heirloom quality",             body: "My mother-in-law complimented me on this. She's been wearing sarees for 50 years and knows quality when she sees it. That says it all." },
  { userName: "Divya N.",    rating: 4, title: "Lovely, small delay in delivery", body: "Beautiful product. The embroidery work is very detailed. Delivery took 2 extra days but the packaging was excellent." },
  { userName: "Aisha M.",    rating: 5, title: "Swadesh never disappoints",    body: "This is my fourth order from Swadesh. Every single time the quality is consistent and the packaging is beautiful. Loyal customer for life." },
]

function makeReviews(productId: string, count: number): (Review & { user: { name: string | null } })[] {
  return Array.from({ length: count }, (_, i) => {
    const pool = REVIEW_POOL[i % REVIEW_POOL.length]
    return {
      id: `rev-${productId}-${i + 1}`,
      productId,
      userId: MOCK_USERS[i % 3].id,
      rating: pool.rating,
      title: pool.title,
      body: pool.body,
      images: [],
      isVerified: i % 3 !== 0,
      createdAt: daysAgo(Math.floor(Math.random() * 90) + 5),
      user: { name: pool.userName },
    }
  })
}

// Pre-generate 4 reviews per product
export const MOCK_REVIEWS: Record<string, ReturnType<typeof makeReviews>> = Object.fromEntries(
  MOCK_PRODUCTS.map((p) => [p.id, makeReviews(p.id, 4)])
)

// ─────────────────────────────────────────────────────────────────
// Admin stats
// ─────────────────────────────────────────────────────────────────

export const MOCK_ORDER_STATS = {
  totalOrders: 6,
  totalRevenue: MOCK_ORDERS.reduce((s, o) => s + o.total, 0),
  pendingOrders: MOCK_ORDERS.filter((o) => o.status === "pending").length,
  deliveredOrders: MOCK_ORDERS.filter((o) => o.status === "delivered").length,
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

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

export function getMockVariants(productId: string): ProductVariant[] {
  return MOCK_VARIANTS[productId] ?? []
}

export function getMockOrders(userId: string): OrderWithItems[] {
  return MOCK_ORDERS.filter((o) => o.userId === userId || userId.startsWith("mock-"))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getMockOrderByNumber(orderNumber: string): OrderWithItems | null {
  return MOCK_ORDERS.find((o) => o.orderNumber === orderNumber) ?? null
}

export function getMockReviews(productId: string, page: number, limit: number) {
  // In mock mode, return a rotating pool based on product slug prefix
  const all = MOCK_REVIEWS[productId] ?? REVIEW_POOL.slice(0, 4).map((r, i) => ({
    id: `rev-generic-${i}`,
    productId,
    userId: MOCK_USERS[i % 3].id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    images: [] as string[],
    isVerified: true,
    createdAt: daysAgo(i * 7 + 3),
    user: { name: r.userName },
  }))
  const total = all.length
  const paged = all.slice((page - 1) * limit, page * limit)
  return { reviews: paged, total }
}

export function getMockProfile(): User {
  return MOCK_USER
}

export function getMockAddresses(): Address[] {
  return MOCK_ADDRESSES
}
