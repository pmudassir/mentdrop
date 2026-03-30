import Link from "next/link"
import Image from "next/image"
import { getFeaturedProducts, getNewArrivals } from "@/lib/actions/products"
import { getRootCategories } from "@/lib/actions/categories"
import { ProductGrid } from "@/components/storefront/product-grid"
import { Button } from "@/components/ui/button"

export const revalidate = 60

export default async function HomePage() {
  const [featured, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(12),
    getRootCategories(),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-xl">
            <p className="text-label-lg text-primary mb-3 tracking-wider uppercase">
              New Collection
            </p>
            <h1 className="text-display-md sm:text-display-lg text-on-surface mb-4">
              Elegance in Every{" "}
              <span className="text-primary">Thread</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-md">
              Discover handpicked ethnic wear that celebrates the artistry of Indian fashion.
              From everyday kurtas to statement abayas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="gold" size="lg" asChild>
                <Link href="/category/trending">Shop Trending</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/category/kurtas">Explore Kurtas</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative gold accent */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container/10 blur-3xl" />
      </section>

      {/* Trending Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-headline-lg text-on-surface mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container"
              >
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-title-lg text-white">{cat.name}</h3>
                  {cat.nameHi && (
                    <p className="text-body-sm text-white/80 text-hindi">{cat.nameHi}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products — Drape Carousel style */}
      {featured.length > 0 && (
        <section className="bg-surface-container-low py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-label-lg text-primary mb-1 tracking-wider uppercase">
                  Curated for You
                </p>
                <h2 className="text-headline-lg text-on-surface">Featured Collection</h2>
              </div>
              <Link href="/category/featured" className="text-body-md text-primary hover:underline">
                View All
              </Link>
            </div>
            <ProductGrid products={featured} columns={4} />
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-headline-lg text-on-surface">New Arrivals</h2>
            <Link href="/category/new" className="text-body-md text-primary hover:underline">
              View All
            </Link>
          </div>
          <ProductGrid products={newArrivals} columns={4} />
        </section>
      )}

      {/* Trust Banner */}
      <section className="bg-surface-container py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Free Shipping", sub: "On orders above ₹999" },
              { label: "Easy Returns", sub: "7-day return policy" },
              { label: "Secure Payment", sub: "UPI, Cards & COD" },
              { label: "Quality Promise", sub: "Handpicked collections" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-title-sm text-on-surface">{item.label}</p>
                <p className="text-body-sm text-on-surface-variant mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
