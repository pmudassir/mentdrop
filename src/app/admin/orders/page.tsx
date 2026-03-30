import Link from "next/link"
import { getOrdersAdmin } from "@/lib/actions/orders"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/lib/actions/orders"

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
]

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
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const status = params.status ?? ""
  const page = Number(params.page ?? 1)

  const { orders, total } = await getOrdersAdmin({
    page,
    limit: 20,
    status: status || undefined,
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-headline-lg text-on-surface">Orders</h1>
        <p className="text-body-sm text-on-surface-variant mt-0.5">
          {total} order{total !== 1 ? "s" : ""}
          {status ? ` · ${status}` : ""}
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/orders${tab.value ? `?status=${tab.value}` : ""}`}
            className={[
              "px-4 py-2 rounded-full text-body-sm font-medium transition-colors min-h-[44px] flex items-center",
              status === tab.value
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container">
                {["Order #", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-on-surface-variant text-body-md"
                  >
                    No orders{status ? ` with status "${status}"` : ""}.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container transition-colors"
                  >
                    <td className="px-6 py-3.5 text-body-sm font-mono font-medium text-on-surface">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {order.shippingAddress?.name ?? "—"}
                      {order.shippingAddress?.phone && (
                        <span className="block text-xs">
                          {order.shippingAddress.phone}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant text-center">
                      {order.items.length}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm font-medium text-on-surface">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={orderStatusVariant(order.status)}>
                        {orderStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-body-sm text-primary hover:underline min-h-[44px] flex items-center"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="px-6 py-4 flex items-center justify-between gap-4 bg-surface-container">
            <p className="text-body-sm text-on-surface-variant">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page - 1}`}
                  className="px-4 py-2 rounded-full bg-surface-container-high text-body-sm text-on-surface hover:bg-surface-container-highest transition-colors"
                >
                  Previous
                </Link>
              )}
              {page * 20 < total && (
                <Link
                  href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page + 1}`}
                  className="px-4 py-2 rounded-full bg-surface-container-high text-body-sm text-on-surface hover:bg-surface-container-highest transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
