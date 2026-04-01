"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useWishlistStore } from "@/store/wishlist"
import type { Product } from "@/lib/actions/products"

export function ProductCard({ product }: { product: Product }) {
  const { addItem, removeItem, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)

  const effectivePrice = product.salePrice ?? product.basePrice
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0

  const primaryImage = product.images?.[0] ?? "/placeholder.svg"

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
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

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-low mb-3 shadow-[0_4px_16px_rgba(45,95,63,0.06)]">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-106"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? "fill-primary text-primary" : "text-on-surface-variant"
            }`}
          />
        </button>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-on-primary text-[11px] font-semibold tracking-wide">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5">
        <h3 className="text-serif text-[1.05rem] leading-snug text-on-surface truncate group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.nameHi && (
          <p className="text-hindi text-[0.7rem] text-on-surface-variant/60 mt-0.5 truncate">
            {product.nameHi}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-title-md font-semibold text-gold">
            {formatPrice(effectivePrice)}
          </span>
          {hasDiscount && (
            <span className="text-body-sm text-on-surface-variant/50 line-through">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>
        {product.avgRating && product.avgRating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[11px] text-accent">{"★".repeat(product.avgRating)}</span>
            <span className="text-label-sm text-on-surface-variant/60">
              ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
