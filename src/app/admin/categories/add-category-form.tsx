"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createCategory } from "@/lib/actions/categories"
import type { Category } from "@/lib/actions/categories"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface AddCategoryFormProps {
  categories: Category[]
}

export function AddCategoryForm({ categories }: AddCategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")

  const [slug, setSlug] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [parentId, setParentId] = useState("")
  const [sortOrder, setSortOrder] = useState("0")

  function handleNameChange(value: string) {
    setName(value)
    if (!slugEdited) {
      setSlug(slugify(value))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await createCategory({
        name: name.trim(),
        nameHi: null,
        slug: slug.trim(),
        parentId: parentId ? Number(parentId) : null,
        sortOrder: parseInt(sortOrder, 10) || 0,
        isActive: true,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      setName("")
      setSlug("")
      setSlugEdited(false)
      setParentId("")
      setSortOrder("0")
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-error-container px-4 py-3">
          <AlertCircle className="w-5 h-5 text-on-error-container shrink-0 mt-0.5" />
          <p className="text-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="cat-name">
            Name <span className="text-error">*</span>
          </label>
          <input
            id="cat-name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Kurtas"
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
          />
        </div>


        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="cat-slug">
            Slug <span className="text-error">*</span>
          </label>
          <input
            id="cat-slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugEdited(true)
            }}
            placeholder="kurtas"
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary font-mono text-body-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="cat-parent">
            Parent Category
          </label>
          <select
            id="cat-parent"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface focus:outline-2 focus:outline-primary"
          >
            <option value="">— Root category —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="cat-sort">
            Sort Order
          </label>
          <input
            id="cat-sort"
            type="number"
            min="0"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface focus:outline-2 focus:outline-primary"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="md" disabled={isPending}>
          {isPending ? "Adding…" : "Add Category"}
        </Button>
      </div>
    </form>
  )
}
