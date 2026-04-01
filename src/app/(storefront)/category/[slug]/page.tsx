import Link from "next/link"
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
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  popular: "Most Popular",
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

  return (
    <div>
      {/* Breadcrumb + Hero */}
      <div className="bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant/60 mb-5">
            <Link href="/" className="hover:text-on-surface transition-colors">Home</Link>
            <span>/</span>
            <span className="text-on-surface-variant">Collections</span>
            <span>/</span>
            <span className="text-on-surface">{category.name}</span>
          </nav>

          {/* Category header */}
          <h1 className="text-serif font-semibold text-on-surface mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            {category.name}
          </h1>
          {category.nameHi && (
            <p className="text-hindi text-on-surface-variant/60 text-sm mb-2">{category.nameHi}</p>
          )}
          {category.description && (
            <p className="text-body-md text-on-surface-variant max-w-xl leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter / Sort bar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <p className="text-label-md text-on-surface-variant">
            {total} {total === 1 ? "piece" : "pieces"}
          </p>

          {/* Mobile: horizontal scroll chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {(["newest", "price_asc", "price_desc", "popular"] as const).map((s) => (
              <Link
                key={s}
                href={`/category/${slug}?sort=${s}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-label-sm font-medium transition-colors whitespace-nowrap ${
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

        {/* Product grid */}
        {products.length > 0 ? (
          <>
            <ProductGrid products={products} columns={4} />

            {/* Load More / Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 text-center">
                {page < totalPages ? (
                  <Link
                    href={`/category/${slug}?page=${page + 1}&sort=${activeSort}`}
                    className="inline-block px-10 py-3.5 rounded-full border border-on-surface/20 text-body-md text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Load More Creations
                  </Link>
                ) : (
                  <p className="text-body-md text-on-surface-variant">You've seen all pieces</p>
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
  )
}
