"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useState, useCallback } from "react"
import { formatPrice } from "@/lib/utils"
import { useWishlistStore } from "@/store/wishlist"
import type { Product } from "@/lib/actions/products"
import { cn } from "@/lib/utils"

export function ProductCard({ product, colors }: { product: Product; colors?: string[] }) {
  const { addItem, removeItem, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)
  const [hovered, setHovered] = useState(false)
  const [heartAnim, setHeartAnim] = useState(false)

  const effectivePrice = product.salePrice ?? product.basePrice
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0

  const images = product.images ?? []
  const primaryImage = images[0] ?? "/placeholder.svg"
  const secondImage = images[1] ?? primaryImage

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setHeartAnim(true)
    if (wishlisted) {
      removeItem(product.id)
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        image: primaryImage,
        price: effectivePrice,
        slug: product.slug,
      })
    }
  }

  const onAnimEnd = useCallback(() => setHeartAnim(false), [])

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-low mb-3">

        {/* Base image */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            hovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover image */}
        <Image
          src={secondImage}
          alt={`${product.name} — alternate view`}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover tint overlay */}
        <div className={cn(
          "absolute inset-0 bg-on-surface/5 transition-opacity duration-500",
          hovered ? "opacity-100" : "opacity-0"
        )} />

        {/* Wishlist button — always visible on mobile, hover-reveal on desktop */}
        <button
          onClick={toggleWishlist}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
            "bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm",
            // On mobile (touch): always visible. On desktop: fade in on hover.
            "opacity-100 translate-y-0 md:opacity-0 md:-translate-y-1",
            hovered && "md:opacity-100 md:translate-y-0"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              heartAnim && "heart-pop",
              wishlisted ? "fill-burgundy text-burgundy" : "text-on-surface-variant"
            )}
            onAnimationEnd={onAnimEnd}
          />
        </button>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-burgundy text-white text-[10px] font-semibold tracking-wide">
            {discountPercent}% OFF
          </span>
        )}

        {/* New badge (no discount, recently added) */}
        {!hasDiscount && product.isFeatured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/90 text-white text-[10px] font-semibold tracking-wide">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5">
        <p className="text-catalog text-on-surface-variant/60 mb-0.5 truncate">
          {product.tags?.[0] ?? "ethnic wear"}
        </p>
        <h3 className="text-[0.95rem] font-medium leading-snug text-on-surface truncate group-hover:text-primary transition-colors"
          style={{ fontFamily: "var(--font-display)" }}>
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm font-semibold text-gold">
            {formatPrice(effectivePrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-on-surface-variant/50 line-through">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>
        {product.avgRating && product.avgRating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] text-accent">{"★".repeat(Math.min(product.avgRating, 5))}</span>
            <span className="text-[10px] text-on-surface-variant/50">({product.reviewCount})</span>
          </div>
        )}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {colors.slice(0, 5).map((hex) => (
              <span
                key={hex}
                className="w-3.5 h-3.5 rounded-full border border-outline-variant/40 shadow-sm"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-[10px] text-on-surface-variant/50">+{colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
