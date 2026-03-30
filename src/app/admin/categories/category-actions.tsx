"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteCategory } from "@/lib/actions/categories"
import type { Category } from "@/lib/actions/categories"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface CategoryActionsProps {
  category: Category
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Delete "${category.name}"? This will hide it from the store.`)) return
    startTransition(async () => {
      await deleteCategory(category.id)
      router.refresh()
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-error hover:bg-error-container hover:text-on-error-container"
    >
      <Trash2 className="w-4 h-4" />
      {isPending ? "Deleting…" : "Delete"}
    </Button>
  )
}
