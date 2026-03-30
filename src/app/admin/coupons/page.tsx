import { getCouponsAdmin } from "@/lib/actions/coupons"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { AddCouponDrawer } from "./add-coupon-drawer"

export default async function AdminCouponsPage() {
  const coupons = await getCouponsAdmin()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">Coupons</h1>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <AddCouponDrawer />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container">
                {["Code", "Type", "Value", "Min Order", "Used / Limit", "Expires", "Active"].map(
                  (h) => (
                    <th key={h} className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-on-surface-variant text-body-md"
                  >
                    No coupons yet.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-surface-container transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-body-sm font-medium text-on-surface">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant capitalize">
                      {coupon.type}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm font-medium text-on-surface">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : formatPrice(coupon.value)}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {coupon.minOrderValue && coupon.minOrderValue > 0
                        ? formatPrice(coupon.minOrderValue)
                        : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {coupon.usedCount}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Never"}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={coupon.isActive ? "success" : "error"}>
                        {coupon.isActive ? "Active" : "Inactive"}
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
