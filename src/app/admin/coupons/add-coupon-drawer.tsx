"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createCoupon } from "@/lib/actions/coupons"
import { Button } from "@/components/ui/button"
import { Plus, X, AlertCircle } from "lucide-react"

export function AddCouponDrawer() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [code, setCode] = useState("")
  const [type, setType] = useState<"percentage" | "fixed">("percentage")
  const [value, setValue] = useState("")
  const [minOrderValue, setMinOrderValue] = useState("")
  const [maxDiscount, setMaxDiscount] = useState("")
  const [usageLimit, setUsageLimit] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [isActive, setIsActive] = useState(true)

  function resetForm() {
    setCode("")
    setType("percentage")
    setValue("")
    setMinOrderValue("")
    setMaxDiscount("")
    setUsageLimit("")
    setExpiresAt("")
    setIsActive(true)
    setError(null)
  }

  function handleClose() {
    setOpen(false)
    resetForm()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      setError("Please enter a valid value.")
      return
    }

    const parsedValue =
      type === "percentage" ? Math.round(numValue) : Math.round(numValue * 100)

    startTransition(async () => {
      const result = await createCoupon({
        code: code.trim().toUpperCase(),
        type,
        value: parsedValue,
        minOrderValue: minOrderValue ? Math.round(parseFloat(minOrderValue) * 100) : 0,
        maxDiscount: maxDiscount ? Math.round(parseFloat(maxDiscount) * 100) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive,
        startsAt: null,
        perUserLimit: 1,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      handleClose()
      router.refresh()
    })
  }

  return (
    <>
      <Button size="md" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" />
        Add Coupon
      </Button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-on-surface/30"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add coupon"
        className={[
          "fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-surface shadow-xl transition-transform duration-300 overflow-y-auto",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-title-lg text-on-surface">New Coupon</h2>
          <button
            onClick={handleClose}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-xl bg-error-container px-4 py-3">
              <AlertCircle className="w-4 h-4 text-on-error-container shrink-0 mt-0.5" />
              <p className="text-body-sm text-on-error-container">{error}</p>
            </div>
          )}

          {/* Code */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="coupon-code">
              Code <span className="text-error">*</span>
            </label>
            <input
              id="coupon-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SAVE20"
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary font-mono tracking-wider"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="coupon-type">
              Discount Type <span className="text-error">*</span>
            </label>
            <select
              id="coupon-type"
              value={type}
              onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface focus:outline-2 focus:outline-primary"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          {/* Value */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="coupon-value">
              Value <span className="text-error">*</span>
              <span className="ml-1 text-on-surface-variant/70">
                ({type === "percentage" ? "%" : "₹"})
              </span>
            </label>
            <input
              id="coupon-value"
              type="number"
              min="0.01"
              step={type === "percentage" ? "1" : "1"}
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === "percentage" ? "20" : "100"}
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
            />
          </div>

          {/* Min Order Value */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="coupon-min">
              Min Order Value (₹)
            </label>
            <input
              id="coupon-min"
              type="number"
              min="0"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
              placeholder="499"
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
            />
          </div>

          {/* Max Discount (only for percentage) */}
          {type === "percentage" && (
            <div className="space-y-1.5">
              <label className="text-label-md text-on-surface-variant" htmlFor="coupon-max">
                Max Discount Cap (₹)
              </label>
              <input
                id="coupon-max"
                type="number"
                min="0"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="200"
                className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
              />
            </div>
          )}

          {/* Usage Limit */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="coupon-limit">
              Total Usage Limit
            </label>
            <input
              id="coupon-limit"
              type="number"
              min="1"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="Leave blank for unlimited"
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
            />
          </div>

          {/* Expires At */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="coupon-expires">
              Expires At
            </label>
            <input
              id="coupon-expires"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface focus:outline-2 focus:outline-primary"
            />
          </div>

          {/* Active */}
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <div>
              <p className="text-body-md text-on-surface">Active</p>
              <p className="text-xs text-on-surface-variant">
                Customers can use this coupon immediately
              </p>
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="md" className="flex-1" disabled={isPending}>
              {isPending ? "Creating…" : "Create Coupon"}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
