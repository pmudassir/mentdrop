import { ProductCard } from "@/components/storefront/product-card"
import type { Product } from "@/lib/actions/products"

export function CompleteTheLook({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="mb-8">
        <p className="text-label-md tracking-[0.18em] uppercase text-on-surface-variant/50 mb-1">
          Style It
        </p>
        <h2 className="text-serif text-3xl font-semibold text-on-surface">
          Complete the Ensemble
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
