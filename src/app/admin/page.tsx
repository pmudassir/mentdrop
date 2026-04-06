import { getOrderStats, getOrdersAdmin } from "@/lib/actions/orders"
import { StatCard } from "@/components/admin/stat-card"
import { RevenueChartDynamic as RevenueChart } from "@/components/admin/revenue-chart-wrapper"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ShoppingBag, IndianRupee, Clock, CheckCircle2 } from "lucide-react"
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

export default async function AdminOverviewPage() {
  const [stats, { orders: recentOrders }] = await Promise.all([
    getOrderStats(),
    getOrdersAdmin({ page: 1, limit: 10 }),
  ])

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-headline-lg text-on-surface">Overview</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Welcome back to your store dashboard.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toLocaleString("en-IN")}
          icon={ShoppingBag}
        />
        <StatCard
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={IndianRupee}
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders.toLocaleString("en-IN")}
          icon={Clock}
          subtext="Awaiting confirmation"
        />
        <StatCard
          label="Delivered Orders"
          value={stats.deliveredOrders.toLocaleString("en-IN")}
          icon={CheckCircle2}
          subtext="Successfully fulfilled"
        />
      </div>

      {/* Low stock alert */}
      <div className="rounded-2xl bg-warning-container px-5 py-4 flex items-start gap-3">
        <span className="text-warning text-lg flex-shrink-0 mt-0.5">⚠</span>
        <div>
          <p className="text-body-sm font-semibold text-warning">Inventory Alert</p>
          <p className="text-body-sm text-warning/80 mt-0.5">
            Review your product variants regularly to avoid stockouts. Variants with fewer than 5 units need restocking.
          </p>
        </div>
      </div>

      {/* Revenue chart */}
      <RevenueChart />

      {/* Recent orders table */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-title-lg text-on-surface">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container">
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Order
                </th>
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Date
                </th>
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Items
                </th>
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Total
                </th>
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-on-surface-variant text-body-md"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container transition-colors"
                  >
                    <td className="px-6 py-3.5 text-body-sm font-medium text-on-surface">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {order.items.length}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={orderStatusVariant(order.status)}>
                        {orderStatusLabel(order.status)}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
