"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"

const FREE_SHIPPING_THRESHOLD = 99900
const SHIPPING_COST = 7900
const COD_LIMIT = 300000 // ₹3000 in paisa

type ShippingAddress = {
  name: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

type FieldErrors = Partial<Record<keyof ShippingAddress, string>>

function validateAddress(addr: ShippingAddress): FieldErrors {
  const errors: FieldErrors = {}
  if (!addr.name.trim()) errors.name = "Name is required"
  if (!addr.phone.trim() || !/^\d{10}$/.test(addr.phone.trim()))
    errors.phone = "Enter a valid 10-digit phone number"
  if (!addr.line1.trim()) errors.line1 = "Address line 1 is required"
  if (!addr.city.trim()) errors.city = "City is required"
  if (!addr.state.trim()) errors.state = "State is required"
  if (!addr.pincode.trim() || !/^\d{6}$/.test(addr.pincode.trim()))
    errors.pincode = "Enter a valid 6-digit pincode"
  return errors
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: () => void) => void
    }
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [step, setStep] = useState<1 | 2>(1)
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [paymentError, setPaymentError] = useState("")
  const [isPending, startTransition] = useTransition()

  const subtotal = getTotal()
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shippingCost

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart")
    }
  }, [items.length, router])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  function handleAddressChange(field: keyof ShippingAddress, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleContinue() {
    const errors = validateAddress(address)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setStep(2)
  }

  function buildOrderData() {
    return {
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      shippingAddress: {
        name: address.name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      subtotal,
      discount: 0,
      shippingCost,
      total,
    }
  }

  async function handleRazorpay() {
    setPaymentError("")
    startTransition(async () => {
      try {
        const res = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            receipt: `receipt_${Date.now()}`,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setPaymentError(data.error ?? "Failed to create payment order")
          return
        }

        const { orderId, amount, currency, keyId } = await res.json()

        const options = {
          key: keyId,
          amount,
          currency,
          name: "Swadesh",
          description: "Order Payment",
          order_id: orderId,
          prefill: {
            name: address.name,
            contact: address.phone,
          },
          handler: async (response: {
            razorpay_order_id: string
            razorpay_payment_id: string
            razorpay_signature: string
          }) => {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderData: {
                  ...buildOrderData(),
                  paymentMethod: "razorpay",
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                },
              }),
            })

            const verifyData = await verifyRes.json()
            if (verifyData.success && verifyData.orderNumber) {
              clearCart()
              router.push(`/checkout/success?order=${verifyData.orderNumber}`)
            } else {
              setPaymentError("Payment verification failed. Please contact support.")
            }
          },
          theme: { color: "#B8860B" },
        }

        const rzp = new window.Razorpay(options)
        rzp.on("payment.failed", () => {
          setPaymentError("Payment failed. Please try again.")
        })
        rzp.open()
      } catch {
        setPaymentError("Something went wrong. Please try again.")
      }
    })
  }

  async function handleCOD() {
    setPaymentError("")
    startTransition(async () => {
      try {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: null,
            razorpayPaymentId: null,
            razorpaySignature: null,
            orderData: {
              ...buildOrderData(),
              paymentMethod: "cod",
            },
          }),
        })

        const data = await verifyRes.json()
        if (data.success && data.orderNumber) {
          clearCart()
          router.push(`/checkout/success?order=${data.orderNumber}`)
        } else {
          setPaymentError(data.error ?? "Failed to place order. Please try again.")
        }
      } catch {
        setPaymentError("Something went wrong. Please try again.")
      }
    })
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-label-lg font-medium transition-colors ${
              step >= 1 ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
          </div>
          <span
            className={`text-label-lg ${step >= 1 ? "text-on-surface" : "text-on-surface-variant"}`}
          >
            Shipping
          </span>
        </div>

        <div className="w-12 h-px bg-surface-container-highest" />

        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-label-lg font-medium transition-colors ${
              step >= 2 ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"
            }`}
          >
            2
          </div>
          <span
            className={`text-label-lg ${step >= 2 ? "text-on-surface" : "text-on-surface-variant"}`}
          >
            Payment
          </span>
        </div>
      </div>

      {/* Step 1: Shipping Address */}
      {step === 1 && (
        <div className="bg-surface-container-low rounded-2xl p-6">
          <h2 className="text-headline-sm text-on-surface mb-6">Shipping Address</h2>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                placeholder="Rajesh Kumar"
                value={address.name}
                onChange={(e) => handleAddressChange("name", e.target.value)}
                error={fieldErrors.name}
              />
              <Input
                label="Phone Number"
                placeholder="9876543210"
                type="tel"
                maxLength={10}
                value={address.phone}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
                error={fieldErrors.phone}
              />
            </div>
            <Input
              label="Address Line 1"
              placeholder="House/Flat number, Street"
              value={address.line1}
              onChange={(e) => handleAddressChange("line1", e.target.value)}
              error={fieldErrors.line1}
            />
            <Input
              label="Address Line 2 (Optional)"
              placeholder="Landmark, Area"
              value={address.line2}
              onChange={(e) => handleAddressChange("line2", e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="City"
                placeholder="Mumbai"
                value={address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                error={fieldErrors.city}
              />
              <Input
                label="State"
                placeholder="Maharashtra"
                value={address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                error={fieldErrors.state}
              />
              <Input
                label="Pincode"
                placeholder="400001"
                maxLength={6}
                value={address.pincode}
                onChange={(e) => handleAddressChange("pincode", e.target.value)}
                error={fieldErrors.pincode}
              />
            </div>
          </div>

          <Button
            variant="gold"
            size="lg"
            className="w-full mt-8"
            onClick={handleContinue}
          >
            Continue to Payment
          </Button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          {/* Order Summary */}
          <div className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="text-headline-sm text-on-surface mb-4">Order Summary</h2>
            <div className="flex flex-col gap-2 text-body-md">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex justify-between"
                >
                  <span className="text-on-surface-variant truncate max-w-[60%]">
                    {item.name}
                    {item.size && ` (${item.size})`} × {item.quantity}
                  </span>
                  <span className="text-on-surface">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="h-px bg-surface-container-highest my-2" />
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className={shippingCost === 0 ? "text-success" : "text-on-surface"}>
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-title-md font-medium mt-1">
                <span className="text-on-surface">Total</span>
                <span className="text-on-surface">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address Preview */}
          <div className="bg-surface-container-low rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-label-lg text-on-surface-variant mb-1">Delivering to</h3>
                <p className="text-body-md text-on-surface">{address.name}</p>
                <p className="text-body-sm text-on-surface-variant">
                  {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
                  {address.state} – {address.pincode}
                </p>
                <p className="text-body-sm text-on-surface-variant">{address.phone}</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-label-sm text-primary hover:underline"
              >
                Change
              </button>
            </div>
          </div>

          {/* Payment Error */}
          {paymentError && (
            <div className="bg-error-container rounded-xl px-4 py-3">
              <p className="text-label-md text-on-error-container">{paymentError}</p>
            </div>
          )}

          {/* Payment Options */}
          <div className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="text-headline-sm text-on-surface mb-4">Choose Payment</h2>
            <div className="flex flex-col gap-3">
              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={handleRazorpay}
                disabled={isPending}
              >
                Pay {formatPrice(total)} Online
              </Button>

              {total < COD_LIMIT && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handleCOD}
                  disabled={isPending}
                >
                  Cash on Delivery
                </Button>
              )}
            </div>
            <p className="text-label-sm text-on-surface-variant text-center mt-4">
              Secured by Razorpay · 256-bit SSL encryption
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
