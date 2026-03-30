import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { OrderStatusForm } from "./order-status-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { Order } from "@/lib/actions/orders"

function orderStatusVariant(
  status: Order["status"]
): "warning" | "tertiary" | "default" | "success" | "error" | "secondary" {
  switch (status) {
    case "pending":
      return "warning"
    case "confirmed":
    case "processing":
      return "tertiary"
    case "shipped":
    case "out_for_delivery":
      return "default"
    case "delivered":
      return "success"
    case "cancelled":
    case "returned":
    case "refunded":
      return "error"
    default:
      return "secondary"
  }
}

function orderStatusLabel(status: Order["status"]): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    notFound()
  }

  const { id } = await params

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: true },
  })

  if (!order) {
    notFound()
  }

  const addr = order.shippingAddress

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/admin/orders"
        className="flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors min-h-[44px] w-fit"
      >
        <ChevronLeft className="w-4 h-4" />
        Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface font-mono">
            {order.orderNumber}
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge variant={orderStatusVariant(order.status)} className="text-label-md px-4 py-1.5">
          {orderStatusLabel(order.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: items + payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden">
            <div className="px-6 py-4">
              <h2 className="text-title-lg text-on-surface">
                Items ({order.items.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container">
                    <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                      Product
                    </th>
                    <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container transition-colors">
                      <td className="px-6 py-3.5">
                        <div>
                          <p className="text-body-sm font-medium text-on-surface">
                            {item.productSnapshot?.name ?? item.productId}
                          </p>
                          {(item.productSnapshot?.size || item.productSnapshot?.color) && (
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {[item.productSnapshot.size, item.productSnapshot.color]
                                .filter(Boolean)
                                .join(" / ")}
                            </p>
                          )}
                          {item.productSnapshot?.sku && (
                            <p className="text-xs text-on-surface-variant font-mono">
                              {item.productSnapshot.sku}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-body-sm text-on-surface-variant text-center">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="px-6 py-3.5 text-body-sm font-medium text-on-surface">
                        {formatPrice(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Totals */}
            <div className="px-6 py-4 space-y-2 bg-surface-container">
              <div className="flex justify-between text-body-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-body-sm text-success">
                  <span>Discount</span>
                  <span>− {formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-body-sm text-on-surface-variant">
                <span>Shipping</span>
                <span>
                  {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-title-md text-on-surface pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-2xl bg-surface-container-lowest shadow-md p-6 space-y-3">
            <h2 className="text-title-lg text-on-surface">Payment</h2>
            <div className="grid grid-cols-2 gap-3 text-body-sm">
              <div>
                <p className="text-on-surface-variant">Method</p>
                <p className="text-on-surface font-medium capitalize">
                  {order.paymentMethod ?? "—"}
                </p>
              </div>
              {order.razorpayOrderId && (
                <div>
                  <p className="text-on-surface-variant">Razorpay Order ID</p>
                  <p className="text-on-surface font-mono text-xs break-all">
                    {order.razorpayOrderId}
                  </p>
                </div>
              )}
              {order.razorpayPaymentId && (
                <div>
                  <p className="text-on-surface-variant">Payment ID</p>
                  <p className="text-on-surface font-mono text-xs break-all">
                    {order.razorpayPaymentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: customer + address + status update */}
        <div className="space-y-6">
          {/* Customer / Shipping */}
          <div className="rounded-2xl bg-surface-container-lowest shadow-md p-6 space-y-3">
            <h2 className="text-title-lg text-on-surface">Ship To</h2>
            {addr ? (
              <address className="not-italic space-y-1 text-body-sm text-on-surface-variant">
                <p className="text-on-surface font-medium">{addr.name}</p>
                <p>{addr.phone}</p>
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>
                  {addr.city}, {addr.state} — {addr.pincode}
                </p>
              </address>
            ) : (
              <p className="text-body-sm text-on-surface-variant">No address provided.</p>
            )}
          </div>

          {/* Tracking */}
          {(order.trackingNumber || order.trackingUrl) && (
            <div className="rounded-2xl bg-surface-container-lowest shadow-md p-6 space-y-2">
              <h2 className="text-title-lg text-on-surface">Tracking</h2>
              {order.trackingNumber && (
                <p className="text-body-sm font-mono text-on-surface">{order.trackingNumber}</p>
              )}
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-primary hover:underline"
                >
                  Track Shipment ↗
                </a>
              )}
            </div>
          )}

          {/* Status Update */}
          <OrderStatusForm orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  )
}
