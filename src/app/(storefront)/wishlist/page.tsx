"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
import { useWishlistStore } from "@/store/wishlist"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const { addItem } = useCartStore()

  function handleAddToCart(item: (typeof items)[number]) {
    addItem({
      productId: item.productId,
      variantId: null,
      name: item.name,
      image: item.image,
      size: null,
      color: null,
      sku: item.productId,
      price: item.price,
    })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-on-surface-variant" />
        </div>
        <h1 className="text-headline-lg text-on-surface mb-2">Your wishlist is empty</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">
          Save items you love to your wishlist.
        </p>
        <Button variant="gold" size="lg" asChild>
          <Link href="/">Explore Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-display-sm text-on-surface mb-8">
        Wishlist
        <span className="text-body-lg text-on-surface-variant ml-3">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <div key={item.productId} className="group relative flex flex-col">
            {/* Image */}
            <Link href={`/products/${item.slug}`} className="block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-low mb-3">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            </Link>

            {/* Remove button */}
            <button
              onClick={() => removeItem(item.productId)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm hover:bg-error-container transition-colors"
              aria-label="Remove from wishlist"
            >
              <Heart className="w-4 h-4 fill-primary text-primary" />
            </button>

            {/* Info */}
            <div className="flex-1 flex flex-col px-1">
              <Link
                href={`/products/${item.slug}`}
                className="text-title-sm text-on-surface hover:text-primary transition-colors truncate"
              >
                {item.name}
              </Link>
              <p className="text-title-md text-on-surface mt-1 mb-3">
                {formatPrice(item.price)}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full mt-auto"
                onClick={() => handleAddToCart(item)}
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
