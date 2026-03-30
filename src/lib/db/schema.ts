import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
  uniqueIndex,
  index,
  pgEnum,
  serial,
  smallint,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── Enums ───

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"])

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
])

export const supplierTypeEnum = pgEnum("supplier_type", ["direct", "platform"])

export const couponTypeEnum = pgEnum("coupon_type", ["percentage", "fixed"])

// ─── Users ───

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phone: varchar("phone", { length: 15 }).notNull().unique(),
    name: varchar("name", { length: 100 }),
    email: varchar("email", { length: 255 }),
    role: userRoleEnum("role").default("customer").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_phone_idx").on(table.phone),
    index("users_email_idx").on(table.email),
  ]
)

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  wishlists: many(wishlists),
}))

// ─── Addresses ───

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 50 }).default("Home"),
    name: varchar("name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 15 }).notNull(),
    line1: text("line1").notNull(),
    line2: text("line2"),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    pincode: varchar("pincode", { length: 6 }).notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("addresses_user_idx").on(table.userId)]
)

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}))

// ─── Categories ───

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    nameHi: varchar("name_hi", { length: 200 }),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    description: text("description"),
    parentId: integer("parent_id"),
    imageUrl: text("image_url"),
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("categories_slug_idx").on(table.slug),
    index("categories_parent_idx").on(table.parentId),
  ]
)

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_parent",
  }),
  children: many(categories, { relationName: "category_parent" }),
  products: many(products),
}))

// ─── Products ───

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    nameHi: varchar("name_hi", { length: 500 }),
    slug: varchar("slug", { length: 280 }).notNull().unique(),
    description: text("description"),
    categoryId: integer("category_id").references(() => categories.id),
    basePrice: integer("base_price").notNull(), // paisa
    salePrice: integer("sale_price"), // paisa
    images: jsonb("images").$type<string[]>().default([]),
    tags: jsonb("tags").$type<string[]>().default([]),
    material: varchar("material", { length: 100 }),
    careInstructions: text("care_instructions"),
    isActive: boolean("is_active").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    avgRating: smallint("avg_rating").default(0),
    reviewCount: integer("review_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_category_idx").on(table.categoryId),
    index("products_featured_idx").on(table.isFeatured),
    index("products_active_idx").on(table.isActive),
  ]
)

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  reviews: many(reviews),
  supplierProducts: many(supplierProducts),
  wishlists: many(wishlists),
}))

// ─── Product Variants ───

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 50 }).notNull().unique(),
    size: varchar("size", { length: 20 }),
    color: varchar("color", { length: 50 }),
    colorHex: varchar("color_hex", { length: 7 }),
    priceOverride: integer("price_override"), // paisa, null = use product price
    stock: integer("stock").default(0).notNull(),
    reservedStock: integer("reserved_stock").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("variants_sku_idx").on(table.sku),
    index("variants_product_idx").on(table.productId),
  ]
)

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}))

// ─── Suppliers ───

export const suppliers = pgTable("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  whatsapp: varchar("whatsapp", { length: 15 }),
  email: varchar("email", { length: 255 }),
  type: supplierTypeEnum("type").default("direct").notNull(),
  notes: text("notes"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  supplierProducts: many(supplierProducts),
}))

// ─── Supplier Products ───

export const supplierProducts = pgTable(
  "supplier_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    costPrice: integer("cost_price").notNull(), // paisa
    leadTimeDays: integer("lead_time_days").default(3).notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("supplier_products_supplier_idx").on(table.supplierId),
    index("supplier_products_product_idx").on(table.productId),
  ]
)

export const supplierProductsRelations = relations(supplierProducts, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierProducts.supplierId],
    references: [suppliers.id],
  }),
  product: one(products, {
    fields: [supplierProducts.productId],
    references: [products.id],
  }),
}))

// ─── Orders ───

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    status: orderStatusEnum("status").default("pending").notNull(),
    subtotal: integer("subtotal").notNull(), // paisa
    discount: integer("discount").default(0).notNull(), // paisa
    shippingCost: integer("shipping_cost").default(0).notNull(), // paisa
    total: integer("total").notNull(), // paisa
    couponId: uuid("coupon_id"),
    paymentMethod: varchar("payment_method", { length: 20 }), // razorpay / cod
    razorpayOrderId: varchar("razorpay_order_id", { length: 100 }),
    razorpayPaymentId: varchar("razorpay_payment_id", { length: 100 }),
    shippingAddress: jsonb("shipping_address").$type<{
      name: string
      phone: string
      line1: string
      line2?: string
      city: string
      state: string
      pincode: string
    }>(),
    trackingNumber: varchar("tracking_number", { length: 100 }),
    trackingUrl: text("tracking_url"),
    supplierId: uuid("supplier_id"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("orders_number_idx").on(table.orderNumber),
    index("orders_user_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    index("orders_created_idx").on(table.createdAt),
  ]
)

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  supplier: one(suppliers, {
    fields: [orders.supplierId],
    references: [suppliers.id],
  }),
  coupon: one(coupons, { fields: [orders.couponId], references: [coupons.id] }),
}))

// ─── Order Items ───

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    variantId: uuid("variant_id").references(() => productVariants.id),
    productSnapshot: jsonb("product_snapshot").$type<{
      name: string
      image: string
      size?: string
      color?: string
      sku: string
    }>(),
    quantity: integer("quantity").notNull(),
    unitPrice: integer("unit_price").notNull(), // paisa
    totalPrice: integer("total_price").notNull(), // paisa
  },
  (table) => [index("order_items_order_idx").on(table.orderId)]
)

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}))

// ─── Reviews ───

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    rating: smallint("rating").notNull(), // 1-5
    title: varchar("title", { length: 200 }),
    body: text("body"),
    images: jsonb("images").$type<string[]>().default([]),
    isVerified: boolean("is_verified").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("reviews_product_idx").on(table.productId),
    index("reviews_user_idx").on(table.userId),
  ]
)

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}))

// ─── Coupons ───

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 30 }).notNull().unique(),
    type: couponTypeEnum("type").notNull(),
    value: integer("value").notNull(), // percentage (e.g. 10) or paisa
    minOrderValue: integer("min_order_value").default(0), // paisa
    maxDiscount: integer("max_discount"), // paisa, for percentage type
    usageLimit: integer("usage_limit"),
    usedCount: integer("used_count").default(0).notNull(),
    perUserLimit: integer("per_user_limit").default(1),
    isActive: boolean("is_active").default(true).notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("coupons_code_idx").on(table.code)]
)

export const couponsRelations = relations(coupons, ({ many }) => ({
  orders: many(orders),
}))

// ─── Wishlists ───

export const wishlists = pgTable(
  "wishlists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("wishlists_user_product_idx").on(table.userId, table.productId),
    index("wishlists_user_idx").on(table.userId),
  ]
)

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}))
