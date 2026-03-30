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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageStr, sort } = await searchParams

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const page = Math.max(1, parseInt(pageStr ?? "1", 10))
  const { products, total } = await getProductsByCategory(category.id, {
    page,
    sort: (sort as "newest" | "price_asc" | "price_desc" | "popular") ?? "newest",
  })

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm text-on-surface">{category.name}</h1>
        {category.nameHi && (
          <p className="text-body-lg text-on-surface-variant text-hindi mt-1">
            {category.nameHi}
          </p>
        )}
        {category.description && (
          <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">
            {category.description}
          </p>
        )}
        <p className="text-label-md text-on-surface-variant mt-3">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Sort bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(["newest", "price_asc", "price_desc", "popular"] as const).map((s) => (
            <a
              key={s}
              href={`/category/${slug}?sort=${s}`}
              className={`px-3 py-1.5 rounded-full text-label-sm transition-colors ${
                (sort ?? "newest") === s
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {{ newest: "Newest", price_asc: "Price ↑", price_desc: "Price ↓", popular: "Popular" }[s]}
            </a>
          ))}
        </div>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <ProductGrid products={products} columns={4} />
      ) : (
        <div className="text-center py-20">
          <p className="text-headline-sm text-on-surface-variant">No products found</p>
          <p className="text-body-md text-on-surface-variant mt-2">
            Check back soon for new arrivals!
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/category/${slug}?page=${p}&sort=${sort ?? "newest"}`}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-body-md transition-colors ${
                p === page
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
