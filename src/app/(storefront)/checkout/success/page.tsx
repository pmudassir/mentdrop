import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  searchParams: Promise<{ order?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
      {/* Checkmark */}
      <div className="w-24 h-24 rounded-full bg-success-container flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-success" />
      </div>

      <h1 className="text-display-sm text-on-surface mb-2">Order Confirmed!</h1>
      <p className="text-body-lg text-on-surface-variant mb-4">
        Thank you for your order. We&apos;ll start processing it right away.
      </p>

      {order && (
        <div className="inline-block bg-surface-container-low rounded-2xl px-6 py-4 mb-8">
          <p className="text-label-md text-on-surface-variant mb-1">Order Number</p>
          <p className="text-headline-md text-primary tracking-wider">{order}</p>
        </div>
      )}

      {!order && <div className="mb-8" />}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {order && (
          <Button variant="gold" size="lg" asChild>
            <Link href={`/orders/${order}`}>Track Order</Link>
          </Button>
        )}
        <Button variant={order ? "secondary" : "gold"} size="lg" asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>

      <p className="text-label-sm text-on-surface-variant mt-8">
        A confirmation will be sent to your registered number.
      </p>
    </div>
  )
}
