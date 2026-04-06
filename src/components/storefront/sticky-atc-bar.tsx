"use client"

import { useEffect, useRef, useState } from "react"
import { ShoppingBag } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"

type Props = {
  productName: string
  price: number
  sizes: string[]
  selectedSize: string | null
  onSizeChange: (size: string) => void
  onAddToCart: () => void
  inStock: boolean
  anchorRef: React.RefObject<HTMLElement | null>
}

export function StickyATCBar({
  productName, price, sizes, selectedSize, onSizeChange, onAddToCart, inStock, anchorRef
}: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = anchorRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [anchorRef])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up pb-safe md:bottom-0">
      {/* Backdrop */}
      <div className="bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/20 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          {/* Product name + price */}
          <div className="hidden sm:block flex-shrink-0">
            <p className="text-body-sm font-medium text-on-surface line-clamp-1 max-w-[200px]">{productName}</p>
            <p className="text-label-sm text-gold font-semibold">{formatPrice(price)}</p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-outline-variant/30 flex-shrink-0" />

          {/* Size chips */}
          {sizes.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
              <span className="text-label-sm text-on-surface-variant flex-shrink-0 hidden md:block">Size:</span>
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  className={cn(
                    "flex-shrink-0 h-9 px-3.5 rounded-full border text-label-md font-medium transition-all",
                    "duration-200",
                    selectedSize === size
                      ? "bg-primary text-on-primary border-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                  )}
                  style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onAddToCart}
            disabled={!inStock}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full font-medium text-body-sm transition-all duration-300",
              inStock
                ? "bg-primary hover:bg-primary/90 text-on-primary shadow-md hover:shadow-lg"
                : "bg-surface-container text-on-surface-variant cursor-not-allowed"
            )}
            style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{inStock ? "Add to Bag" : "Out of Stock"}</span>
            <span className="sm:hidden">{inStock ? "Add" : "Out of Stock"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
