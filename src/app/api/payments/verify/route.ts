import { getSession } from "@/lib/auth/session"
import { verifyRazorpaySignature } from "@/lib/payments/razorpay"
import { createOrder } from "@/lib/actions/orders"
import type { Order } from "@/lib/actions/orders"

type OrderData = {
  items: {
    productId: string
    variantId: string | null
    quantity: number
    unitPrice: number
  }[]
  shippingAddress: NonNullable<Order["shippingAddress"]>
  paymentMethod: string
  couponId?: string
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: {
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    orderData?: OrderData
  }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderData } = body

  if (!orderData) {
    return Response.json({ error: "Missing order data" }, { status: 400 })
  }

  // COD path — no signature to verify
  if (orderData.paymentMethod === "cod") {
    const result = await createOrder({
      ...orderData,
      razorpayOrderId: undefined,
      razorpayPaymentId: undefined,
    })

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ success: true, orderNumber: result.data.orderNumber })
  }

  // Online payment path — verify signature
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return Response.json(
      { error: "Missing payment verification fields" },
      { status: 400 }
    )
  }

  let isValid: boolean
  try {
    isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
  } catch {
    return Response.json({ error: "Signature verification error" }, { status: 400 })
  }

  if (!isValid) {
    return Response.json({ error: "Invalid payment signature" }, { status: 400 })
  }

  const result = await createOrder({
    ...orderData,
    razorpayOrderId,
    razorpayPaymentId,
  })

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 500 })
  }

  return Response.json({ success: true, orderNumber: result.data.orderNumber })
}
