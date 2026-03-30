"use client"

import * as React from "react"
import Image from "next/image"
import { Heart, Minus, Plus, Star, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { toast } from "@/components/ui/use-toast"
import type { ProductWithVariants, ProductVariant } from "@/lib/actions/products"
import type { Review } from "@/lib/actions/reviews"

type Props = {
  product: ProductWithVariants
  reviews: Review[]
}

export function ProductDetail({ product, reviews }: Props) {
  const [selectedImage, setSelectedImage] = React.useState(0)
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null)
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null)
  const [quantity, setQuantity] = React.useState(1)

  const addItem = useCartStore((s) => s.addItem)
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)

  const images = product.images?.length ? product.images : ["/placeholder.svg"]

  // Get unique sizes and colors from variants
  const sizes = [...new Set(product.variants.filter((v) => v.size).map((v) => v.size!))]
  const colors = [...new Set(product.variants.filter((v) => v.color).map((v) => v.color!))]
  const colorHexMap = Object.fromEntries(
    product.variants.filter((v) => v.color && v.colorHex).map((v) => [v.color!, v.colorHex!])
  )

  // Find matching variant
  const selectedVariant = product.variants.find(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor)
  )

  const effectivePrice = selectedVariant?.priceOverride ?? product.salePrice ?? product.basePrice
  const hasDiscount = effectivePrice < product.basePrice
  const inStock = selectedVariant ? selectedVariant.stock - selectedVariant.reservedStock > 0 : true

  function handleAddToCart() {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      image: images[0],
      size: selectedSize,
      color: selectedColor,
      sku: selectedVariant?.sku ?? product.slug,
      price: effectivePrice,
    })
    toast({ title: "Added to cart", description: product.name, variant: "success" })
  }

  function toggleWishlist() {
    if (wishlisted) {
      removeWishlist(product.id)
      toast({ title: "Removed from wishlist" })
    } else {
      addWishlist({
        productId: product.id,
        name: product.name,
        image: images[0],
        price: effectivePrice,
        slug: product.slug,
      })
      toast({ title: "Added to wishlist", variant: "success" })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Gallery */}
      <div className="flex flex-col-reverse sm:flex-row gap-3">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px]">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`shrink-0 w-16 h-20 rounded-xl overflow-hidden transition-all ${
                  i === selectedImage ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" width={64} height={80} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-low">
          <Image
            src={images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col">
        {/* Title & Price */}
        <h1 className="text-headline-lg text-on-surface">{product.name}</h1>
        {product.nameHi && (
          <p className="text-body-lg text-on-surface-variant text-hindi mt-1">{product.nameHi}</p>
        )}

        <div className="flex items-center gap-3 mt-4">
          <span className="text-display-sm text-on-surface">{formatPrice(effectivePrice)}</span>
          {hasDiscount && (
            <>
              <span className="text-body-lg text-on-surface-variant line-through">
                {formatPrice(product.basePrice)}
              </span>
              <Badge variant="default">
                {Math.round(((product.basePrice - effectivePrice) / product.basePrice) * 100)}% OFF
              </Badge>
            </>
          )}
        </div>

        {/* Rating */}
        {product.avgRating && product.avgRating > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < product.avgRating! ? "fill-primary text-primary" : "text-outline-variant"
                  }`}
                />
              ))}
            </div>
            <span className="text-body-sm text-on-surface-variant">
              {product.avgRating}/5 ({product.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-body-lg text-on-surface-variant mt-6 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Size selector */}
        {sizes.length > 0 && (
          <div className="mt-6">
            <p className="text-title-sm text-on-surface mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                  className={`h-11 min-w-[3rem] px-4 rounded-full text-body-md transition-colors ${
                    selectedSize === size
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color selector */}
        {colors.length > 0 && (
          <div className="mt-6">
            <p className="text-title-sm text-on-surface mb-3">
              Color{selectedColor && `: ${selectedColor}`}
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    selectedColor === color ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : ""
                  }`}
                  style={{ backgroundColor: colorHexMap[color] ?? "#ccc" }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Actions */}
        <div className="flex items-center gap-4 mt-8">
          <div className="flex items-center gap-1 bg-surface-container rounded-full">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2.5 rounded-full hover:bg-surface-container-high transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-body-md">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2.5 rounded-full hover:bg-surface-container-high transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="gold"
            size="lg"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button variant="secondary" size="icon" onClick={toggleWishlist} aria-label="Wishlist">
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary text-primary" : ""}`} />
          </Button>
          <Button variant="secondary" size="icon" aria-label="Share">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Material & Care */}
        {(product.material || product.careInstructions) && (
          <div className="mt-8 p-5 rounded-2xl bg-surface-container-low">
            {product.material && (
              <p className="text-body-md text-on-surface">
                <span className="text-title-sm">Material:</span> {product.material}
              </p>
            )}
            {product.careInstructions && (
              <p className="text-body-md text-on-surface-variant mt-2">
                <span className="text-title-sm text-on-surface">Care:</span>{" "}
                {product.careInstructions}
              </p>
            )}
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-10">
            <h3 className="text-headline-sm text-on-surface mb-4">
              Reviews ({reviews.length})
            </h3>
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-2xl bg-surface-container-low">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? "fill-primary text-primary" : "text-outline-variant"
                          }`}
                        />
                      ))}
                    </div>
                    {review.isVerified && <Badge variant="success">Verified</Badge>}
                  </div>
                  {review.title && (
                    <p className="text-title-sm text-on-surface">{review.title}</p>
                  )}
                  {review.body && (
                    <p className="text-body-md text-on-surface-variant mt-1">{review.body}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
