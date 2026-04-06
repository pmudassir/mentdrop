import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getOrderByNumber } from "@/lib/actions/orders"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import type { BadgeProps } from "@/components/ui/badge"

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded"

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
]

const CANCELLED_STATUSES: OrderStatus[] = ["cancelled", "returned", "refunded"]

function getStatusVariant(status: string): BadgeProps["variant"] {
  const map: Record<OrderStatus, BadgeProps["variant"]> = {
    pending: "warning",
    confirmed: "tertiary",
    processing: "tertiary",
    shipped: "default",
    out_for_delivery: "default",
    delivered: "success",
    cancelled: "error",
    returned: "error",
    refunded: "error",
  }
  return map[status as OrderStatus] ?? "outline"
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

type Props = {
  params: Promise<{ orderNumber: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderNumber } = await params
  const order = await getOrderByNumber(orderNumber)

  if (!order) notFound()

  const isCancelled = CANCELLED_STATUSES.includes(order.status as OrderStatus)
  const currentStepIndex = isCancelled
    ? -1
    : STATUS_STEPS.indexOf(order.status as OrderStatus)

  const shippingAddr = order.shippingAddress as {
    name: string
    phone: string
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  } | null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <Link
            href="/orders"
            className="text-label-md text-on-surface-variant hover:text-primary transition-colors mb-2 inline-block"
          >
            ← My Orders
          </Link>
          <h1 className="text-headline-md text-on-surface">{order.orderNumber}</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={getStatusVariant(order.status)} className="text-label-md px-4 py-1.5">
          {formatStatus(order.status)}
        </Badge>
      </div>

      {/* ── Order Timeline ── */}
      {!isCancelled ? (
        <div className="bg-surface-container-low rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-lg text-on-surface">Order Progress</h2>
            <span className="text-catalog text-primary bg-primary-container px-3 py-1 rounded-full">
              {formatStatus(order.status)}
            </span>
          </div>

          {/* Vertical timeline */}
          <div className="flex flex-col gap-0">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              const isPending = index > currentStepIndex
              const isLast = index === STATUS_STEPS.length - 1

              const stepMeta: Record<string, { desc: string; icon: string }> = {
                pending:          { icon: "🕐", desc: "Order received, awaiting confirmation" },
                confirmed:        { icon: "✅", desc: "Order confirmed and being prepared" },
                processing:       { icon: "📦", desc: "Items being carefully packed" },
                shipped:          { icon: "🚚", desc: "Your order is on its way" },
                out_for_delivery: { icon: "🛵", desc: "Out for delivery — arriving today" },
                delivered:        { icon: "🎉", desc: "Delivered! Enjoy your purchase" },
              }
              const meta = stepMeta[step] ?? { icon: "•", desc: "" }

              return (
                <div key={step} className="flex gap-4">
                  {/* Spine column */}
                  <div className="flex flex-col items-center">
                    {/* Node */}
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500 ${
                      isCompleted ? "bg-primary text-on-primary" :
                      isCurrent   ? "bg-primary text-on-primary pulse-primary" :
                                    "bg-surface-container-highest text-on-surface-variant/40"
                    }`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm">{meta.icon}</span>
                      )}
                    </div>
                    {/* Connecting line */}
                    {!isLast && (
                      <div className={`w-0.5 flex-1 my-1 min-h-[2rem] rounded-full transition-colors duration-500 ${
                        isCompleted ? "bg-primary/40" : "bg-surface-container-highest"
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-5 pt-1.5 flex-1 min-w-0 ${isLast ? "" : ""}`}>
                    <p className={`text-body-sm font-medium leading-tight ${
                      isPending ? "text-on-surface-variant/40" :
                      isCurrent  ? "text-on-surface" :
                                   "text-on-surface"
                    }`}>
                      {formatStatus(step)}
                    </p>
                    {!isPending && (
                      <p className="text-label-sm text-on-surface-variant/60 mt-0.5">{meta.desc}</p>
                    )}
                    {isCurrent && order.trackingNumber && (
                      <div className="mt-2 inline-flex items-center gap-2 bg-primary-container rounded-lg px-3 py-1.5">
                        <span className="text-label-sm text-on-primary-container font-medium">
                          {order.trackingNumber}
                        </span>
                        {order.trackingUrl && (
                          <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer"
                            className="text-label-sm text-primary hover:underline">
                            Track →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-error-container rounded-2xl p-5 mb-6">
          <p className="text-title-sm text-on-error-container">
            This order has been {formatStatus(order.status).toLowerCase()}.
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-surface-container-low rounded-2xl p-6 mb-6">
        <h2 className="text-title-lg text-on-surface mb-4">Items</h2>
        <div className="flex flex-col gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container">
                {item.productSnapshot?.image ? (
                  <Image
                    src={item.productSnapshot.image}
                    alt={item.productSnapshot.name ?? "Product"}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
                    <span className="text-label-sm text-on-surface-variant">IMG</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-md text-on-surface truncate">
                  {item.productSnapshot?.name ?? `Product #${item.productId.slice(0, 8)}`}
                </p>
                <p className="text-body-sm text-on-surface-variant mt-0.5">
                  Qty: {item.quantity}
                </p>
                <p className="text-title-sm text-on-surface mt-1">
                  {formatPrice(item.totalPrice)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="mt-6 pt-4 border-t border-surface-container-highest flex flex-col gap-2 text-body-md">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Subtotal</span>
            <span className="text-on-surface">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-success">Discount</span>
              <span className="text-success">− {formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Shipping</span>
            <span className={order.shippingCost === 0 ? "text-success" : "text-on-surface"}>
              {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
            </span>
          </div>
          <div className="flex justify-between text-title-md font-medium mt-1 pt-2 border-t border-surface-container-highest">
            <span className="text-on-surface">Total</span>
            <span className="text-on-surface">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address & Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {shippingAddr && (
          <div className="bg-surface-container-low rounded-2xl p-5">
            <h3 className="text-label-lg text-on-surface-variant mb-3">Shipping Address</h3>
            <p className="text-body-md text-on-surface">{shippingAddr.name}</p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {shippingAddr.line1}
              {shippingAddr.line2 ? `, ${shippingAddr.line2}` : ""}
            </p>
            <p className="text-body-sm text-on-surface-variant">
              {shippingAddr.city}, {shippingAddr.state} – {shippingAddr.pincode}
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1">{shippingAddr.phone}</p>
          </div>
        )}

        <div className="bg-surface-container-low rounded-2xl p-5">
          <h3 className="text-label-lg text-on-surface-variant mb-3">Payment</h3>
          <p className="text-body-md text-on-surface capitalize">
            {order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : order.paymentMethod === "razorpay"
              ? "Online Payment"
              : order.paymentMethod}
          </p>
          {order.razorpayPaymentId && (
            <p className="text-body-sm text-on-surface-variant mt-1">
              ID: {order.razorpayPaymentId}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button variant="secondary" size="md" asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
        <Button variant="gold" size="md" asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
