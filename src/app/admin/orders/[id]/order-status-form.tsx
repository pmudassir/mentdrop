"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateOrderStatus } from "@/lib/actions/orders"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { Order } from "@/lib/actions/orders"

const ORDER_STATUSES: Order["status"][] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
]

function statusLabel(status: Order["status"]): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

interface OrderStatusFormProps {
  orderId: string
  currentStatus: Order["status"]
}

export function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<Order["status"]>(currentStatus)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingUrl, setTrackingUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await updateOrderStatus(
        orderId,
        status,
        trackingNumber.trim() || undefined,
        trackingUrl.trim() || undefined
      )

      if (!result.success) {
        setError(result.error)
        return
      }

      setSuccess(true)
      router.refresh()
    })
  }

  return (
    <div className="rounded-2xl bg-surface-container-lowest shadow-md p-6 space-y-4">
      <h2 className="text-title-lg text-on-surface">Update Status</h2>

      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-error-container px-4 py-3">
          <AlertCircle className="w-4 h-4 text-on-error-container shrink-0 mt-0.5" />
          <p className="text-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-success-container px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <p className="text-body-sm text-success">Status updated.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="order-status">
            New Status
          </label>
          <select
            id="order-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Order["status"])}
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface focus:outline-2 focus:outline-primary"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>

        {(status === "shipped" || status === "out_for_delivery") && (
          <>
            <div className="space-y-1.5">
              <label className="text-label-md text-on-surface-variant" htmlFor="tracking-number">
                Tracking Number
              </label>
              <input
                id="tracking-number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. DTDC123456789"
                className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label-md text-on-surface-variant" htmlFor="tracking-url">
                Tracking URL
              </label>
              <input
                id="tracking-url"
                type="url"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://track.example.com/..."
                className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
              />
            </div>
          </>
        )}

        <Button type="submit" size="md" className="w-full" disabled={isPending}>
          {isPending ? "Updating…" : "Confirm Update"}
        </Button>
      </form>
    </div>
  )
}
