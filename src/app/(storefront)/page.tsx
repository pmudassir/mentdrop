import Link from "next/link"
import { getFeaturedProducts, getNewArrivals } from "@/lib/actions/products"
import { getRootCategories } from "@/lib/actions/categories"
import { ProductGrid } from "@/components/storefront/product-grid"
import { HeroSection } from "@/components/storefront/sections/hero-section"
import { CategoryTiles } from "@/components/storefront/sections/category-tiles"
import { StorytellingBlock } from "@/components/storefront/sections/storytelling-block"
import { NewsletterBlock } from "@/components/storefront/sections/newsletter-block"

export const revalidate = 60

export default async function HomePage() {
  const [featured, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(8),
    getRootCategories(),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection />

      {/* Category tiles */}
      <CategoryTiles categories={categories} />

      {/* Heritage Best Sellers */}
      {featured.length > 0 && (
        <section className="bg-surface-container-low py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-label-md tracking-[0.18em] uppercase text-on-surface-variant/50 mb-1">
                  Curated for You
                </p>
                <h2 className="text-serif text-3xl sm:text-4xl font-semibold text-on-surface">
                  Heritage Best Sellers
                </h2>
              </div>
              <Link
                href="/category/kurtas"
                className="text-body-md text-primary hover:underline underline-offset-4 hidden sm:block"
              >
                View All
              </Link>
            </div>
            <ProductGrid products={featured} columns={4} />
            <div className="mt-10 text-center sm:hidden">
              <Link
                href="/category/kurtas"
                className="inline-block px-8 py-3 rounded-full border border-on-surface/20 text-body-md text-on-surface hover:bg-surface-container transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Storytelling block */}
      <StorytellingBlock
        imageSeed="heritage-loom"
        eyebrow="The Art of Living Heritage"
        title="Where Every Thread Tells a Story"
        body="Our artisans spend weeks hand-embroidering each piece, drawing from centuries-old patterns passed down through generations. When you wear Swadesh, you carry a legacy of craftsmanship from India's most celebrated weaving traditions."
        ctaLabel="Discover Our Story"
        ctaHref="/category/sarees"
      />

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-label-md tracking-[0.18em] uppercase text-on-surface-variant/50 mb-1">
                Just In
              </p>
              <h2 className="text-serif text-3xl sm:text-4xl font-semibold text-on-surface">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/category/trending"
              className="text-body-md text-primary hover:underline underline-offset-4 hidden sm:block"
            >
              View All
            </Link>
          </div>
          <ProductGrid products={newArrivals} columns={4} />
          <div className="mt-10 text-center">
            <Link
              href="/category/trending"
              className="inline-block px-10 py-3.5 rounded-full border border-on-surface/20 text-body-md text-on-surface hover:bg-surface-container transition-colors"
            >
              Load More Creations
            </Link>
          </div>
        </section>
      )}

      {/* Trust Banner */}
      <section className="bg-surface-container py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { icon: "✦", label: "Free Shipping", sub: "On orders above ₹999" },
              { icon: "✦", label: "Easy Returns", sub: "7-day return policy" },
              { icon: "✦", label: "Secure Payment", sub: "UPI, Cards & COD" },
              { icon: "✦", label: "The Swadesh Promise", sub: "Handpicked & quality-checked" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <span className="text-accent text-lg">{item.icon}</span>
                <p className="text-title-sm text-on-surface">{item.label}</p>
                <p className="text-body-sm text-on-surface-variant">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterBlock />
    </div>
  )
}
