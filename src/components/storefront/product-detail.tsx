"use client"

import * as React from "react"
import Image from "next/image"
import { Heart, Minus, Plus, ChevronDown, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { toast } from "@/components/ui/use-toast"
import type { ProductWithVariants } from "@/lib/actions/products"
import type { Review } from "@/lib/actions/reviews"
import { cn } from "@/lib/utils"

type Props = {
  product: ProductWithVariants
  reviews: Review[]
}

const ACCORDIONS = [
  {
    id: "fabric",
    label: "Fabric & Care",
    defaultContent: "Dry clean recommended. Store in a cool, dry place away from direct sunlight. Iron on low heat with a cloth between iron and fabric.",
  },
  {
    id: "size",
    label: "Size Guide",
    defaultContent: "XS (32–34\"), S (34–36\"), M (36–38\"), L (38–40\"), XL (40–42\"). For custom sizing, contact our atelier team.",
  },
  {
    id: "promise",
    label: "The Swadesh Promise",
    defaultContent: "Every piece is quality-checked before dispatch. 7-day easy returns. Free shipping on orders above ₹999.",
  },
  {
    id: "details",
    label: "Product Details",
    getContent: (product: ProductWithVariants) =>
      product.description ?? "Authentic Indian ethnic wear, carefully sourced from master artisans.",
  },
]

export function ProductDetail({ product, reviews }: Props) {
  const [selectedImage, setSelectedImage] = React.useState(0)
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null)
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null)
  const [quantity, setQuantity] = React.useState(1)
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null)
  const [pincode, setPincode] = React.useState("")

  const addItem = useCartStore((s) => s.addItem)
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)

  const images = product.images?.length ? product.images : ["/placeholder.svg"]
  const sizes = [...new Set(product.variants.filter((v) => v.size).map((v) => v.size!))]
  const colors = [...new Set(product.variants.filter((v) => v.color).map((v) => v.color!))]
  const colorHexMap = Object.fromEntries(
    product.variants.filter((v) => v.color && v.colorHex).map((v) => [v.color!, v.colorHex!])
  )

  const selectedVariant = product.variants.find(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor)
  )

  const effectivePrice = selectedVariant?.priceOverride ?? product.salePrice ?? product.basePrice
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0
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
    toast({ title: "Added to bag", description: product.name, variant: "success" })
  }

  function toggleWishlist() {
    if (wishlisted) {
      removeWishlist(product.id)
    } else {
      addWishlist({
        productId: product.id,
        name: product.name,
        image: images[0],
        price: effectivePrice,
        slug: product.slug,
      })
      toast({ title: "Saved to wishlist", variant: "success" })
    }
  }

  return (
    <div>
      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* ── Left: Image Gallery ── */}
          <div className="w-full lg:w-[55%] flex flex-col sm:flex-row gap-4">
            {/* Thumbnails — hidden on mobile, vertical on sm+ */}
            {images.length > 1 && (
              <div className="hidden sm:flex flex-col gap-2 w-20 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 transition-all",
                      selectedImage === i ? "ring-2 ring-primary" : "opacity-60 hover:opacity-90"
                    )}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-low">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                {hasDiscount && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-primary text-on-primary text-label-sm font-semibold">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Mobile dot indicators */}
              {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-3 sm:hidden">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        selectedImage === i ? "bg-primary w-4" : "bg-on-surface-variant/30"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="w-full lg:w-[45%] lg:pt-2">
            {/* Name */}
            <h1 className="text-serif font-semibold text-on-surface leading-tight mb-1" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
              {product.name}
            </h1>
            {product.nameHi && (
              <p className="text-hindi text-on-surface-variant/60 text-sm mb-3">{product.nameHi}</p>
            )}

            {/* Rating */}
            {product.avgRating && product.avgRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-accent text-sm">{"★".repeat(product.avgRating)}</span>
                <span className="text-label-md text-on-surface-variant">
                  {product.avgRating}.0 ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-serif text-2xl font-semibold text-gold">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-body-lg text-on-surface-variant/50 line-through">
                  {formatPrice(product.basePrice)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-label-sm bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                  Save {formatPrice(product.basePrice - effectivePrice)}
                </span>
              )}
            </div>

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mb-5">
                <p className="text-label-md text-on-surface-variant mb-2.5">
                  Colour{selectedColor ? `: ${selectedColor}` : ""}
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                      title={color}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        selectedColor === color ? "border-primary scale-110" : "border-transparent hover:border-outline"
                      )}
                      style={{ backgroundColor: colorHexMap[color] ?? "#ccc" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-label-md text-on-surface-variant">Size</p>
                  <button className="text-label-sm text-primary underline underline-offset-2">Size Guide</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={cn(
                        "min-w-[2.75rem] h-10 px-3 rounded-full border text-label-md font-medium transition-all",
                        selectedSize === size
                          ? "bg-primary text-on-primary border-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-label-md text-on-surface-variant">Qty</p>
              <div className="flex items-center gap-3 bg-surface-container rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-title-sm text-on-surface w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-6">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 bg-primary hover:bg-primary/90 text-on-primary rounded-full"
              >
                {inStock ? "Add to Bag" : "Out of Stock"}
              </Button>
              <button
                onClick={toggleWishlist}
                className={cn(
                  "w-12 h-12 rounded-full border flex items-center justify-center transition-all",
                  wishlisted
                    ? "bg-primary-container border-primary text-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                )}
                aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart className={cn("w-5 h-5", wishlisted && "fill-primary")} />
              </button>
            </div>

            {/* Delivery check */}
            <div className="flex items-center gap-2.5 bg-surface-container rounded-xl px-4 py-3 mb-6">
              <MapPin className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Check delivery by pincode"
                maxLength={6}
                className="flex-1 bg-transparent text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
              />
              {pincode.length === 6 && (
                <span className="text-label-sm text-primary font-medium">✓ Deliverable</span>
              )}
            </div>

            {/* Security */}
            <div className="flex items-center gap-2 text-on-surface-variant/60 mb-6">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span className="text-label-sm">AES-256 Encrypted · Secure Checkout</span>
            </div>

            {/* Accordions */}
            <div className="flex flex-col divide-y divide-outline-variant/20">
              {ACCORDIONS.map((acc) => (
                <div key={acc.id}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="flex items-center justify-between w-full py-4 text-left"
                  >
                    <span className="text-title-sm text-on-surface">{acc.label}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-on-surface-variant transition-transform",
                        openAccordion === acc.id && "rotate-180"
                      )}
                    />
                  </button>
                  {openAccordion === acc.id && (
                    <p className="pb-4 text-body-md text-on-surface-variant leading-relaxed">
                      {acc.getContent ? acc.getContent(product) : acc.defaultContent}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      {reviews.length > 0 && (
        <section className="bg-surface-container-low py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-serif text-2xl sm:text-3xl font-semibold text-on-surface mb-8">
              Voices of Elegance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="bg-surface-container-lowest rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-accent text-sm">{"★".repeat(review.rating)}</span>
                    {review.isVerified && (
                      <span className="text-label-sm text-success bg-success-container px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <p className="text-title-sm text-on-surface mb-1">{review.title}</p>
                  )}
                  {review.body && (
                    <p className="text-body-md text-on-surface-variant leading-relaxed line-clamp-3">
                      {review.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
