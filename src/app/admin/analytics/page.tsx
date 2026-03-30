import { getOrderStats } from "@/lib/actions/orders"
import { StatCard } from "@/components/admin/stat-card"
import { formatPrice } from "@/lib/utils"
import { ShoppingBag, IndianRupee, Clock, CheckCircle2 } from "lucide-react"

export default async function AdminAnalyticsPage() {
  const stats = await getOrderStats()

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-headline-lg text-on-surface">Analytics</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Store performance overview.
        </p>
      </div>

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
        />
        <StatCard
          label="Delivered Orders"
          value={stats.deliveredOrders.toLocaleString("en-IN")}
          icon={CheckCircle2}
        />
      </div>

      <div className="rounded-2xl bg-surface-container-lowest shadow-md p-8 flex flex-col items-center justify-center gap-3 min-h-48">
        <p className="text-title-lg text-on-surface">Detailed Analytics</p>
        <p className="text-body-md text-on-surface-variant text-center max-w-sm">
          Charts and trend analysis will be available in the next release.
        </p>
      </div>
    </div>
  )
}
