"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import Link from "next/link"
import Image from "next/image"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { useUIStore } from "@/store/ui"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore()
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()
  const total = getTotal()

  return (
    <DialogPrimitive.Root open={cartOpen} onOpenChange={(open) => !open && closeCart()}>
      <DialogPrimitive.Portal>
        {/* Overlay — 15% opacity per Leher Vastra */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/15 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "duration-300"
          )}
        />

        {/* Panel — slides in from right */}
        <DialogPrimitive.Content
          className={cn(
            "fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px]",
            "bg-surface-container-lowest flex flex-col",
            "shadow-[-20px_0_60px_rgba(0,0,0,0.08)]",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
            "duration-300"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-on-surface" />
              <DialogPrimitive.Title className="text-title-lg text-on-surface">
                Your Bag
              </DialogPrimitive.Title>
              {items.length > 0 && (
                <span className="text-catalog text-on-surface-variant/50">
                  {items.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              )}
            </div>
            <DialogPrimitive.Close
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
              style={{ transition: "all 0.2s cubic-bezier(0.33,1,0.68,1)" }}
            >
              <X className="w-4 h-4" />
            </DialogPrimitive.Close>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-on-surface-variant/20 mb-4" />
                <p className="text-serif text-xl text-on-surface mb-2">Your bag is empty</p>
                <p className="text-body-md text-on-surface-variant mb-6">
                  Discover pieces crafted for you
                </p>
                <Button onClick={closeCart} asChild className="rounded-full">
                  <Link href="/category/trending">Explore Collection</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4 py-4 border-b border-outline-variant/10 last:border-0">
                  {/* Image */}
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-sm font-medium text-on-surface leading-snug line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    {(item.size || item.color) && (
                      <p className="text-catalog text-on-surface-variant/50 mb-2">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {/* Qty */}
                      <div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-body-sm text-on-surface w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-body-sm font-semibold text-gold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="self-start text-on-surface-variant/40 hover:text-burgundy transition-colors mt-0.5"
                    aria-label="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer — only when items exist */}
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-outline-variant/20 space-y-3 bg-surface-container-lowest">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-body-md text-on-surface-variant">Subtotal</span>
                <span className="text-title-md font-semibold text-on-surface">{formatPrice(total)}</span>
              </div>
              <p className="text-label-sm text-on-surface-variant/50">
                Shipping & taxes calculated at checkout
              </p>

              <Button
                size="lg"
                asChild
                onClick={closeCart}
                className="w-full bg-primary hover:bg-primary/90 text-on-primary rounded-full font-medium"
                style={{ transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)" }}
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <button
                onClick={closeCart}
                className="w-full text-center text-body-sm text-on-surface-variant hover:text-primary transition-colors py-1"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
