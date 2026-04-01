import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductBySlug, getRelatedProducts } from "@/lib/actions/products"
import { getProductReviews } from "@/lib/actions/reviews"
import { ProductDetail } from "@/components/storefront/product-detail"
import { MakingOfBlock } from "@/components/storefront/sections/making-of-block"
import { CompleteTheLook } from "@/components/storefront/sections/complete-the-look"

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
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-0">
        <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant/60">
          <Link href="/" className="hover:text-on-surface transition-colors">Home</Link>
          <span>/</span>
          <Link href="/" className="hover:text-on-surface transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-on-surface truncate max-w-[180px]">{product.name}</span>
        </nav>
      </div>

      {/* Product detail */}
      <ProductDetail product={product} reviews={reviews} />

      {/* The Making Of */}
      <MakingOfBlock productName={product.name} />

      {/* Complete the Look */}
      {related.length > 0 && <CompleteTheLook products={related} />}
    </div>
  )
}
