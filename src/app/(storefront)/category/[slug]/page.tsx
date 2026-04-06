import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/lib/actions/categories"
import { getProductsByCategory } from "@/lib/actions/products"
import { ProductGrid } from "@/components/storefront/product-grid"

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Category Not Found" }
  return {
    title: category.name,
    description: category.description ?? `Shop ${category.name} at Swadesh`,
  }
}

const SORT_LABELS: Record<string, string> = {
  newest: "Newest",
  price_asc: "Price ↑",
  price_desc: "Price ↓",
  popular: "Popular",
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageStr, sort } = await searchParams

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const page = Math.max(1, parseInt(pageStr ?? "1", 10))
  const activeSort = (sort as "newest" | "price_asc" | "price_desc" | "popular") ?? "newest"
  const { products, total } = await getProductsByCategory(category.id, { page, sort: activeSort })

  const totalPages = Math.ceil(total / 20)

  // Use category image or a fallback editorial picsum
  const editorialImage = category.imageUrl ?? `https://picsum.photos/seed/${slug}-editorial/600/900`

  return (
    <div>
      {/* ── Desktop: Split layout. Mobile: stacked ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant/60 py-4 sm:py-5">
          <Link href="/" className="hover:text-on-surface transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface">{category.name}</span>
        </nav>

        <div className="flex gap-10 lg:gap-14 pb-24">

          {/* ── Left: Sticky editorial panel (hidden on mobile) ── */}
          <aside className="hidden lg:flex flex-col w-[300px] xl:w-[340px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Editorial image */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container"
                style={{ aspectRatio: "2/3" }}>
                <Image
                  src={editorialImage}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="340px"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-catalog text-white/60 mb-1">{total} pieces</p>
                  <h1 className="text-serif text-2xl font-semibold text-white leading-tight">
                    {category.name}
                  </h1>
                </div>
              </div>

              {/* Description */}
              {category.description && (
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {category.description}
                </p>
              )}

              {/* Sort */}
              <div>
                <p className="text-catalog text-on-surface-variant/50 mb-3">Sort by</p>
                <div className="flex flex-col gap-1">
                  {(["newest", "price_asc", "price_desc", "popular"] as const).map((s) => (
                    <Link
                      key={s}
                      href={`/category/${slug}?sort=${s}`}
                      className={`px-4 py-2.5 rounded-xl text-body-sm transition-colors ${
                        activeSort === s
                          ? "bg-primary text-on-primary font-medium"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {SORT_LABELS[s]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Right: Product grid ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile header */}
            <div className="lg:hidden mb-6">
              <h1 className="text-serif font-semibold text-on-surface mb-1"
                style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}>
                {category.name}
              </h1>
              <p className="text-body-sm text-on-surface-variant mb-4">{total} pieces</p>
              {/* Mobile sort chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                {(["newest", "price_asc", "price_desc", "popular"] as const).map((s) => (
                  <Link
                    key={s}
                    href={`/category/${slug}?sort=${s}`}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-label-sm font-medium whitespace-nowrap transition-colors ${
                      activeSort === s
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {SORT_LABELS[s]}
                  </Link>
                ))}
              </div>
            </div>

            {products.length > 0 ? (
              <>
                <ProductGrid products={products} columns={3} />

                {totalPages > 1 && (
                  <div className="mt-14 text-center">
                    {page < totalPages ? (
                      <Link
                        href={`/category/${slug}?page=${page + 1}&sort=${activeSort}`}
                        className="inline-block px-10 py-3.5 rounded-full border border-on-surface/20 text-body-md text-on-surface hover:bg-surface-container transition-colors"
                        style={{ transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)" }}
                      >
                        Load More
                      </Link>
                    ) : (
                      <p className="text-body-md text-on-surface-variant">You&apos;ve seen all pieces</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <p className="text-serif text-2xl text-on-surface-variant mb-3">No pieces found</p>
                <p className="text-body-md text-on-surface-variant mb-6">
                  Check back soon — new collections arrive every week.
                </p>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 rounded-full bg-primary text-on-primary text-body-md"
                >
                  Explore All Collections
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
