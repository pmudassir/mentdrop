import { getCategories } from "@/lib/actions/categories"
import { CategoryActions } from "./category-actions"
import { AddCategoryForm } from "./add-category-form"
import type { Category } from "@/lib/actions/categories"

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))
  const roots = categories.filter((c) => !c.parentId)
  const children = categories.filter((c) => !!c.parentId)
  const sorted: Category[] = [
    ...roots,
    ...children,
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-headline-lg text-on-surface">Categories</h1>
        <p className="text-body-sm text-on-surface-variant mt-0.5">
          {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
        </p>
      </div>

      {/* Add form */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-md p-6">
        <h2 className="text-title-md text-on-surface mb-4">Add Category</h2>
        <AddCategoryForm categories={roots} />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container">
                {["Name", "Slug", "Parent", "Active", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-on-surface-variant text-body-md"
                  >
                    No categories yet. Add one above.
                  </td>
                </tr>
              ) : (
                sorted.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-surface-container transition-colors"
                  >
                    <td className="px-6 py-3.5 text-body-sm font-medium text-on-surface">
                      {cat.parentId && (
                        <span className="text-on-surface-variant mr-1">↳</span>
                      )}
                      {cat.name}
                    </td>

                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant font-mono">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {cat.parentId ? (categoryMap[cat.parentId] ?? "—") : "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={
                          cat.isActive
                            ? "text-success text-body-sm"
                            : "text-on-surface-variant text-body-sm"
                        }
                      >
                        {cat.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <CategoryActions category={cat} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
