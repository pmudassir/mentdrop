import { notFound } from "next/navigation"
import { getProductAdmin } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import { ProductForm } from "@/components/admin/product-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    getProductAdmin(id),
    getCategories(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Products
        </Link>
      </div>

      <div>
        <h1 className="text-headline-lg text-on-surface">Edit Product</h1>
        <p className="text-body-md text-on-surface-variant mt-1 truncate max-w-xl">
          {product.name}
        </p>
      </div>

      <ProductForm categories={categories} product={product} />
    </div>
  )
}
