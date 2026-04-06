"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/storefront/product-card"
import type { Product } from "@/lib/actions/products"

export function CompleteTheLook({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!products.length) return null

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.75
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <section className="py-14 sm:py-20 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-catalog text-on-surface-variant/50 mb-2">Style It</p>
            <h2 className="text-serif text-3xl sm:text-4xl font-semibold text-on-surface">
              Complete the Ensemble
            </h2>
          </div>
          {/* Arrow controls — desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bleed scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-4 sm:px-6 max-w-7xl mx-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="snap-start flex-shrink-0"
            style={{ width: "clamp(220px, 40vw, 280px)" }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
