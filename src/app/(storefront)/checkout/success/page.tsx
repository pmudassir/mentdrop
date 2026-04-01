import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { getFeaturedProducts } from "@/lib/actions/products"
import { ProductCard } from "@/components/storefront/product-card"

type Props = { searchParams: Promise<{ order?: string }> }

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams
  const featured = await getFeaturedProducts(3).catch(() => [])

  // Estimated delivery: 5-7 days from now
  const today = new Date()
  const from = new Date(today.getTime() + 5 * 86400000)
  const to = new Date(today.getTime() + 7 * 86400000)
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
  const estimatedDelivery = `${fmt(from)} – ${fmt(to)}, ${to.getFullYear()}`

  return (
    <div>
      {/* Success section */}
      <div className="bg-surface-container-low py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>

          {/* Hindi + English thank you */}
          <p className="text-hindi text-on-surface-variant/50 text-sm mb-1">धन्यवाद</p>
          <h1 className="text-serif font-semibold text-on-surface mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
            Thank You for Your Order
          </h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-md mx-auto mb-8">
            Your order has been placed and is being processed with the utmost care in our digital atelier.
          </p>

          {/* Order number + delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
            {order && (
              <div className="bg-surface-container-lowest rounded-2xl p-4">
                <p className="text-label-sm text-on-surface-variant/60 uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-serif text-xl font-semibold text-primary">{order}</p>
              </div>
            )}
            <div className="bg-surface-container-lowest rounded-2xl p-4">
              <p className="text-label-sm text-on-surface-variant/60 uppercase tracking-wider mb-1">Estimated Delivery</p>
              <p className="text-serif text-xl font-semibold text-on-surface">{estimatedDelivery}</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {order && (
              <Link
                href={`/orders/${order}`}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-on-primary text-body-md font-medium transition-colors hover:bg-primary/90"
              >
                Track Your Order <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/"
              className="px-7 py-3.5 rounded-full border border-on-surface/20 text-body-md text-on-surface hover:bg-surface-container transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Swadesh Promise */}
          <div className="mt-10 inline-flex items-center gap-2 bg-primary/5 rounded-full px-5 py-2.5">
            <span className="text-primary text-sm">✦</span>
            <p className="text-label-sm text-on-surface-variant">
              <strong className="text-on-surface">The Swadesh Promise</strong> — Quality-checked, carefully packed & shipped with care
            </p>
          </div>
        </div>
      </div>

      {/* Complete the look */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="mb-8">
            <p className="text-label-md tracking-[0.18em] uppercase text-on-surface-variant/50 mb-1">
              You Might Also Love
            </p>
            <h2 className="text-serif text-3xl font-semibold text-on-surface">Complete the Look</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
