import { notFound } from "next/navigation"
import { getProductBySlug, getRelatedProducts } from "@/lib/actions/products"
import { getProductReviews } from "@/lib/actions/reviews"
import { ProductDetail } from "@/components/storefront/product-detail"
import { ProductGrid } from "@/components/storefront/product-grid"

export const revalidate = 30

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Product Not Found" }
  return {
    title: product.name,
    description: product.description ?? `Shop ${product.name} at Swadesh`,
    openGraph: {
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [{ reviews }, related] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.id, product.categoryId),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <ProductDetail product={product} reviews={reviews} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-headline-md text-on-surface mb-6">You May Also Like</h2>
          <ProductGrid products={related} columns={4} />
        </section>
      )}
    </div>
  )
}
