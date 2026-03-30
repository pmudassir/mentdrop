import { getCategories } from "@/lib/actions/categories"
import { ProductForm } from "@/components/admin/product-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function NewProductPage() {
  const categories = await getCategories()

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
        <h1 className="text-headline-lg text-on-surface">New Product</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Add a new product to your catalogue.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
