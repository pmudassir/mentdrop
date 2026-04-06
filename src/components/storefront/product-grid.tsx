"use client"

import { motion } from "motion/react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/actions/products"

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[]
  columns?: 2 | 3 | 4
}) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  }[columns]

  return (
    <div className={`grid ${gridCols} gap-4 sm:gap-6`}>
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: Math.min(i * 0.06, 0.5),
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  )
}
