"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { validateCoupon } from "@/lib/actions/coupons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"

const FREE_SHIPPING_THRESHOLD = 99900 // ₹999 in paisa
const SHIPPING_COST = 7900 // ₹79 in paisa

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const [couponSuccess, setCouponSuccess] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponId, setCouponId] = useState<string | undefined>(undefined)
  const [isPending, startTransition] = useTransition()

  const subtotal = getTotal()
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal - discount + shippingCost

  function handleApplyCoupon() {
    if (!couponCode.trim()) return
    setCouponError("")
    setCouponSuccess("")

    startTransition(async () => {
      const result = await validateCoupon(couponCode.trim(), subtotal)
      if (result.success) {
        setDiscount(result.data.discount)
        setCouponId(result.data.couponId)
        setCouponSuccess(`Coupon applied! You save ${formatPrice(result.data.discount)}`)
      } else {
        setDiscount(0)
        setCouponId(undefined)
        setCouponError(result.error)
      }
    })
  }

  function handleRemoveCoupon() {
    setCouponCode("")
    setCouponError("")
    setCouponSuccess("")
    setDiscount(0)
    setCouponId(undefined)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-on-surface-variant" />
        </div>
        <h1 className="text-headline-lg text-on-surface mb-2">Your cart is empty</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button variant="gold" size="lg" asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-display-sm text-on-surface mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex gap-4 bg-surface-container-low rounded-2xl p-4"
            >
              {/* Image */}
              <div className="relative w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="text-title-sm text-on-surface truncate">{item.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    {item.size && (
                      <span className="text-body-sm text-on-surface-variant">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="text-body-sm text-on-surface-variant">
                        Color: {item.color}
                      </span>
                    )}
                  </div>
                  <p className="text-title-md text-on-surface mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* Quantity + Remove */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 bg-surface-container rounded-full">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variantId, item.quantity - 1)
                      }
                      className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-body-lg text-on-surface w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variantId, item.quantity + 1)
                      }
                      className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-low rounded-2xl p-6 sticky top-4">
            <h2 className="text-title-lg text-on-surface mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              {couponSuccess ? (
                <div className="flex items-center justify-between bg-success-container rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-success" />
                    <span className="text-label-md text-success">{couponCode.toUpperCase()}</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-label-sm text-on-surface-variant hover:text-error transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      error={couponError}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleApplyCoupon}
                    disabled={isPending || !couponCode.trim()}
                    className="flex-shrink-0 self-start mt-0.5"
                  >
                    Apply
                  </Button>
                </div>
              )}
              {couponSuccess && (
                <p className="text-label-sm text-success mt-2">{couponSuccess}</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-3 text-body-md">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-surface">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-success">Discount</span>
                  <span className="text-success">− {formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  <span className="text-on-surface">{formatPrice(shippingCost)}</span>
                )}
              </div>

              {shippingCost > 0 && (
                <p className="text-label-sm text-on-surface-variant">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                </p>
              )}

              {/* Divider */}
              <div className="h-px bg-surface-container-highest my-1" />

              <div className="flex justify-between text-title-md">
                <span className="text-on-surface">Total</span>
                <span className="text-on-surface">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              className="w-full mt-6"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </Button>

            <p className="text-label-sm text-on-surface-variant text-center mt-3">
              Secure checkout · UPI, Cards &amp; COD
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
