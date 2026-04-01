"use client"

import Image from "next/image"
import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, Lock, ShieldCheck, Tag, X } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { validateCoupon } from "@/lib/actions/coupons"

const FREE_SHIPPING_THRESHOLD = 99900
const SHIPPING_COST = 7900
const COD_LIMIT = 300000

type ShippingAddress = {
  name: string; phone: string; line1: string; line2: string
  city: string; state: string; pincode: string
}
type FieldErrors = Partial<Record<keyof ShippingAddress, string>>

function validateAddress(addr: ShippingAddress): FieldErrors {
  const errors: FieldErrors = {}
  if (!addr.name.trim()) errors.name = "Name is required"
  if (!addr.phone.trim() || !/^\d{10}$/.test(addr.phone.trim())) errors.phone = "Enter a valid 10-digit phone number"
  if (!addr.line1.trim()) errors.line1 = "Address line 1 is required"
  if (!addr.city.trim()) errors.city = "City is required"
  if (!addr.state.trim()) errors.state = "State is required"
  if (!addr.pincode.trim() || !/^\d{6}$/.test(addr.pincode.trim())) errors.pincode = "Enter a valid 6-digit pincode"
  return errors
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void; on: (event: string, handler: () => void) => void
    }
  }
}

const STEPS = ["Cart", "Shipping", "Payment"]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [step, setStep] = useState<1 | 2>(1)
  const [address, setAddress] = useState<ShippingAddress>({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [paymentError, setPaymentError] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ couponId: string; discount: number; code: string } | null>(null)
  const [couponPending, startCouponTransition] = useTransition()
  const [isPending, startTransition] = useTransition()

  const subtotal = getTotal()
  const discount = appliedCoupon?.discount ?? 0
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal - discount + shippingCost

  useEffect(() => { if (items.length === 0) router.replace("/cart") }, [items.length, router])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  function handleAddressChange(field: keyof ShippingAddress, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleContinue() {
    const errors = validateAddress(address)
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }
    setStep(2)
  }

  function applyCoupon() {
    if (!couponCode.trim()) return
    setCouponError("")
    startCouponTransition(async () => {
      const result = await validateCoupon(couponCode.trim(), subtotal)
      if (result.success) {
        setAppliedCoupon({ couponId: result.data.couponId, discount: result.data.discount, code: couponCode.trim().toUpperCase() })
        setCouponCode("")
      } else {
        setCouponError(result.error)
      }
    })
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponError("")
  }

  function buildOrderData() {
    return {
      items: items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity, unitPrice: item.price })),
      shippingAddress: { name: address.name, phone: address.phone, line1: address.line1, line2: address.line2 || undefined, city: address.city, state: address.state, pincode: address.pincode },
      subtotal, discount, shippingCost, total,
      couponId: appliedCoupon?.couponId,
    }
  }

  async function handleRazorpay() {
    setPaymentError("")
    startTransition(async () => {
      try {
        const res = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: total, receipt: `receipt_${Date.now()}` }) })
        if (!res.ok) { const data = await res.json().catch(() => ({})); setPaymentError(data.error ?? "Failed to create payment order"); return }
        const { orderId, amount, currency, keyId } = await res.json()
        const options = {
          key: keyId, amount, currency, name: "Swadesh", description: "Order Payment", order_id: orderId,
          prefill: { name: address.name, contact: address.phone },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const verifyRes = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature, orderData: { ...buildOrderData(), paymentMethod: "razorpay", razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id } }) })
            const verifyData = await verifyRes.json()
            if (verifyData.success && verifyData.orderNumber) { clearCart(); router.push(`/checkout/success?order=${verifyData.orderNumber}`) }
            else setPaymentError("Payment verification failed. Please contact support.")
          },
          theme: { color: "#2D5F3F" },
        }
        const rzp = new window.Razorpay(options)
        rzp.on("payment.failed", () => setPaymentError("Payment failed. Please try again."))
        rzp.open()
      } catch { setPaymentError("Something went wrong. Please try again.") }
    })
  }

  async function handleCOD() {
    setPaymentError("")
    startTransition(async () => {
      try {
        const verifyRes = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ razorpayOrderId: null, razorpayPaymentId: null, razorpaySignature: null, orderData: { ...buildOrderData(), paymentMethod: "cod" } }) })
        const data = await verifyRes.json()
        if (data.success && data.orderNumber) { clearCart(); router.push(`/checkout/success?order=${data.orderNumber}`) }
        else setPaymentError(data.error ?? "Failed to place order. Please try again.")
      } catch { setPaymentError("Something went wrong. Please try again.") }
    })
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-surface">
      {/* Progress bar header */}
      <div className="bg-surface-container-low border-b border-outline-variant/10 py-5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Mobile: step label */}
          <p className="text-center text-label-md text-on-surface-variant mb-3 md:hidden">
            STEP {step} OF 2 — {step === 1 ? "Shipping Information" : "Payment"}
          </p>
          {/* Desktop: breadcrumb steps */}
          <div className="hidden md:flex items-center justify-center gap-3">
            {STEPS.map((label, i) => {
              const num = i + 1
              const active = step >= num || num === 1
              const done = (num === 1) || (step > num)
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center gap-2",
                    active ? "text-on-surface" : "text-on-surface-variant/40"
                  )}>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold",
                      done ? "bg-primary text-on-primary" : active ? "border-2 border-primary text-primary" : "border border-outline-variant/30 text-on-surface-variant/40"
                    )}>
                      {done && num < step ? <Check className="w-3 h-3" /> : num}
                    </div>
                    <span className="text-label-md tracking-wide uppercase">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="w-10 h-px bg-outline-variant/30" />}
                </div>
              )
            })}
          </div>
          {/* Mobile progress bar */}
          <div className="md:hidden h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left: Form ── */}
          <div className="flex-1 min-w-0">

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div>
                <h1 className="text-serif text-2xl font-semibold text-on-surface mb-6">
                  Shipping Information
                </h1>
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Full Name" placeholder="Ananya Sharma" value={address.name} onChange={(e) => handleAddressChange("name", e.target.value)} error={fieldErrors.name} />
                    <Input label="Phone Number" placeholder="9876543210" type="tel" maxLength={10} value={address.phone} onChange={(e) => handleAddressChange("phone", e.target.value)} error={fieldErrors.phone} />
                  </div>
                  <Input label="Address Line 1" placeholder="House/Flat, Street" value={address.line1} onChange={(e) => handleAddressChange("line1", e.target.value)} error={fieldErrors.line1} />
                  <Input label="Address Line 2 (Optional)" placeholder="Landmark, Area" value={address.line2} onChange={(e) => handleAddressChange("line2", e.target.value)} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Input label="City" placeholder="Mumbai" value={address.city} onChange={(e) => handleAddressChange("city", e.target.value)} error={fieldErrors.city} />
                    <Input label="State" placeholder="Maharashtra" value={address.state} onChange={(e) => handleAddressChange("state", e.target.value)} error={fieldErrors.state} />
                    <Input label="Pincode" placeholder="400001" maxLength={6} value={address.pincode} onChange={(e) => handleAddressChange("pincode", e.target.value)} error={fieldErrors.pincode} />
                  </div>
                </div>

                {/* Security */}
                <div className="flex items-center gap-2 mt-5 text-on-surface-variant/50">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span className="text-label-sm">AES-256 Encrypted Connection · Your data is safe</span>
                </div>

                <Button size="lg" onClick={handleContinue} className="w-full mt-6 bg-primary hover:bg-primary/90 text-on-primary rounded-full">
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h1 className="text-serif text-2xl font-semibold text-on-surface mb-6">
                  Payment
                </h1>

                {/* Address preview */}
                <div className="bg-surface-container-low rounded-2xl p-4 mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-label-sm text-on-surface-variant/60 uppercase tracking-wider mb-1">Delivering to</p>
                    <p className="text-body-md text-on-surface font-medium">{address.name}</p>
                    <p className="text-body-sm text-on-surface-variant">
                      {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} – {address.pincode}
                    </p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-label-sm text-primary hover:underline underline-offset-2 whitespace-nowrap">Change</button>
                </div>

                {/* Payment methods */}
                <div className="flex flex-col gap-3 mb-5">
                  <div className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 ring-2 ring-primary cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-lg">₹</div>
                    <div className="flex-1">
                      <p className="text-title-sm text-on-surface">UPI / Cards / Netbanking</p>
                      <p className="text-body-sm text-on-surface-variant">All major payment methods accepted</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>

                  {total < COD_LIMIT && (
                    <div className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 cursor-pointer" onClick={handleCOD}>
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-lg">🏠</div>
                      <div className="flex-1">
                        <p className="text-title-sm text-on-surface">Cash on Delivery</p>
                        <p className="text-body-sm text-on-surface-variant">Pay ₹49 handling fee at doorstep</p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-outline-variant" />
                    </div>
                  )}
                </div>

                {paymentError && (
                  <div className="bg-error-container rounded-xl px-4 py-3 mb-4">
                    <p className="text-label-md text-on-error-container">{paymentError}</p>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={handleRazorpay}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[#D4A574] hover:bg-[#C49060] text-white text-body-md font-semibold tracking-wide transition-colors disabled:opacity-60 shadow-lg"
                >
                  <Lock className="w-4 h-4" />
                  SECURE HERITAGE PAY · {formatPrice(total)}
                </button>

                <p className="text-center text-label-sm text-on-surface-variant/50 mt-3">
                  Powered by Razorpay · 256-bit SSL
                </p>
              </div>
            )}
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-surface-container-low rounded-2xl p-5 sticky top-24">
              <h2 className="text-title-md text-on-surface mb-4">
                Order Summary · {items.length} {items.length === 1 ? "item" : "items"}
              </h2>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm text-on-surface truncate">{item.name}</p>
                      {item.size && <p className="text-label-sm text-on-surface-variant">{item.size}</p>}
                      <p className="text-label-sm text-on-surface-variant">×{item.quantity}</p>
                    </div>
                    <span className="text-body-sm text-on-surface font-medium flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <div className="border-t border-outline-variant/20 pt-3 mb-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-primary/8 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2 text-primary">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="text-label-md font-semibold">{appliedCoupon.code}</span>
                      <span className="text-label-sm text-on-surface-variant">−{formatPrice(appliedCoupon.discount)}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-on-surface-variant hover:text-on-surface transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError("") }}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      className="flex-1 h-9 px-3 text-body-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/40 uppercase"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponPending || !couponCode.trim()}
                      className="px-4 h-9 text-label-sm font-semibold text-primary bg-primary/10 hover:bg-primary/15 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-label-sm text-error mt-1.5">{couponError}</p>
                )}
              </div>

              <div className="border-t border-outline-variant/20 pt-3 flex flex-col gap-2 text-body-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="text-on-surface">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-success">Discount</span>
                    <span className="text-success font-medium">−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className={shippingCost === 0 ? "text-success font-medium" : "text-on-surface"}>
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-outline-variant/20 text-title-sm font-semibold">
                  <span className="text-on-surface">Total Payable</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-label-sm text-on-surface-variant/60 mt-3 text-center">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
