import Link from "next/link"
import { getProductsAdmin } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchInput } from "./search-input"
import { formatPrice } from "@/lib/utils"
import { Plus, Pencil } from "lucide-react"

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.q ?? ""
  const page = Number(params.page ?? 1)

  const [{ products, total }, categories] = await Promise.all([
    getProductsAdmin({ page, limit: 20, search }),
    getCategories(),
  ])

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">Products</h1>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            {total} product{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button asChild size="md">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Search */}
      <SearchInput defaultValue={search} />

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container">
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Name
                </th>
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Category
                </th>
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Price
                </th>
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Status
                </th>
                <th className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-on-surface-variant text-body-md"
                  >
                    {search ? `No products match "${search}".` : "No products yet."}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-surface-container transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div>
                        <p className="text-body-sm font-medium text-on-surface">
                          {product.name}
                        </p>
                        {product.nameHi && (
                          <p className="text-xs text-on-surface-variant text-hindi">
                            {product.nameHi}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {product.categoryId ? (categoryMap[product.categoryId] ?? "—") : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface">
                      <div className="flex flex-col gap-0.5">
                        {product.salePrice ? (
                          <>
                            <span className="font-medium">{formatPrice(product.salePrice)}</span>
                            <span className="text-on-surface-variant line-through text-xs">
                              {formatPrice(product.basePrice)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium">{formatPrice(product.basePrice)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant={product.isActive ? "success" : "error"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {product.isFeatured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="px-6 py-4 flex items-center justify-between gap-4 bg-surface-container">
            <p className="text-body-sm text-on-surface-variant">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/admin/products?${search ? `q=${search}&` : ""}page=${page - 1}`}>
                    Previous
                  </Link>
                </Button>
              )}
              {page * 20 < total && (
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/admin/products?${search ? `q=${search}&` : ""}page=${page + 1}`}>
                    Next
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
