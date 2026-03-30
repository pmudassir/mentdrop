import Link from "next/link"
import { Package } from "lucide-react"
import { getMyOrders } from "@/lib/actions/orders"
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
  })
}

export default async function OrdersPage() {
  const { orders } = await getMyOrders()

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-on-surface-variant" />
        </div>
        <h1 className="text-headline-lg text-on-surface mb-2">No orders yet</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">
          When you place an order, it will appear here.
        </p>
        <Button variant="gold" size="lg" asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-display-sm text-on-surface mb-8">My Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-surface-container-low rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-label-md text-on-surface-variant mb-1">Order</p>
                <p className="text-title-md text-primary">{order.orderNumber}</p>
              </div>
              <Badge variant={getStatusVariant(order.status)}>
                {formatStatus(order.status)}
              </Badge>
            </div>

            <div className="flex items-end justify-between gap-4 mt-4 flex-wrap">
              <div className="flex flex-col gap-1">
                <p className="text-body-sm text-on-surface-variant">
                  Placed on {formatDate(order.createdAt)}
                </p>
                <p className="text-title-sm text-on-surface">
                  {formatPrice(order.total)}
                  {order.paymentMethod === "cod" && (
                    <span className="text-label-sm text-on-surface-variant ml-2">COD</span>
                  )}
                </p>
              </div>

              <Link
                href={`/orders/${order.orderNumber}`}
                className="text-label-md text-primary hover:underline min-h-[44px] flex items-center"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
