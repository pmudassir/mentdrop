import { Suspense } from "react"
import Link from "next/link"
import { getFeaturedProducts, getNewArrivals } from "@/lib/actions/products"
import { getRootCategories } from "@/lib/actions/categories"
import { ProductGrid } from "@/components/storefront/product-grid"
import { ProductGridSkeleton } from "@/components/storefront/product-card-skeleton"
import { HeroSection } from "@/components/storefront/sections/hero-section"
import { CategoryTiles } from "@/components/storefront/sections/category-tiles"
import { StorytellingBlock } from "@/components/storefront/sections/storytelling-block"
import { NewsletterBlock } from "@/components/storefront/sections/newsletter-block"
import { ReviewMarquee } from "@/components/storefront/sections/review-marquee"

export const revalidate = 60

// ── Async sub-components so each section can stream independently ──

async function FeaturedSection() {
  const featured = await getFeaturedProducts(8)
  if (!featured.length) return null
  return (
    <section className="bg-surface-container-low py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-catalog text-on-surface-variant/50 mb-2">Curated for You</p>
            <h2 className="text-serif text-3xl sm:text-4xl font-semibold text-on-surface">
              Heritage Best Sellers
            </h2>
          </div>
          <Link href="/category/kurtas" className="text-body-md text-primary hover:underline underline-offset-4 hidden sm:block">
            View All
          </Link>
        </div>
        <ProductGrid products={featured} columns={4} />
        <div className="mt-10 text-center sm:hidden">
          <Link href="/category/kurtas" className="inline-block px-8 py-3 rounded-full border border-on-surface/20 text-body-md text-on-surface hover:bg-surface-container transition-colors">
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}

async function NewArrivalsSection() {
  const newArrivals = await getNewArrivals(8)
  if (!newArrivals.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-catalog text-on-surface-variant/50 mb-2">Just In</p>
          <h2 className="text-serif text-3xl sm:text-4xl font-semibold text-on-surface">
            New Arrivals
          </h2>
        </div>
        <Link href="/category/trending" className="text-body-md text-primary hover:underline underline-offset-4 hidden sm:block">
          View All
        </Link>
      </div>
      <ProductGrid products={newArrivals} columns={4} />
      <div className="mt-12 text-center">
        <Link
          href="/category/trending"
          className="inline-block px-10 py-3.5 rounded-full border border-on-surface/20 text-body-md text-on-surface hover:bg-surface-container transition-colors"
          style={{ transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)" }}
        >
          Load More Creations
        </Link>
      </div>
    </section>
  )
}

async function CategorySection() {
  const categories = await getRootCategories()
  return <CategoryTiles categories={categories} />
}

// ── Skeleton wrappers ──

function FeaturedSkeleton() {
  return (
    <section className="bg-surface-container-low py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 space-y-2">
          <div className="h-3 w-24 bg-surface-container animate-pulse rounded-full" />
          <div className="h-8 w-56 bg-surface-container animate-pulse rounded-lg" />
        </div>
        <ProductGridSkeleton count={8} columns={4} />
      </div>
    </section>
  )
}

function NewArrivalsSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <div className="mb-10 space-y-2">
        <div className="h-3 w-16 bg-surface-container animate-pulse rounded-full" />
        <div className="h-8 w-44 bg-surface-container animate-pulse rounded-lg" />
      </div>
      <ProductGridSkeleton count={8} columns={4} />
    </section>
  )
}

export default async function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <Suspense fallback={<div className="py-20 sm:py-28" />}>
        <CategorySection />
      </Suspense>

      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>

      <ReviewMarquee />

      <StorytellingBlock
        imageSeed="heritage-loom"
        eyebrow="The Art of Living Heritage"
        title="Where Every Thread Tells a Story"
        body="Our artisans spend weeks hand-embroidering each piece, drawing from centuries-old patterns passed down through generations. When you wear Swadesh, you carry a legacy of craftsmanship from India's most celebrated weaving traditions."
        ctaLabel="Discover Our Story"
        ctaHref="/category/sarees"
      />

      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivalsSection />
      </Suspense>

      {/* Trust Banner */}
      <section className="bg-surface-container-low py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 text-center">
            {[
              { icon: "✦", label: "Free Shipping", sub: "On orders above ₹999" },
              { icon: "✦", label: "Easy Returns", sub: "7-day return policy" },
              { icon: "✦", label: "Secure Payment", sub: "UPI, Cards & COD" },
              { icon: "✦", label: "The Swadesh Promise", sub: "Handpicked & quality-checked" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <span className="text-accent text-xl">{item.icon}</span>
                <p className="text-title-sm text-on-surface">{item.label}</p>
                <p className="text-body-sm text-on-surface-variant">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterBlock />
    </div>
  )
}
