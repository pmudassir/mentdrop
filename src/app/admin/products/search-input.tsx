"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useCallback } from "react"
import { Search } from "lucide-react"

export function SearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("q", value)
      } else {
        params.delete("q")
      }
      params.delete("page")
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
      <input
        type="search"
        defaultValue={defaultValue}
        placeholder="Search products…"
        onChange={(e) => handleChange(e.target.value)}
        className="h-11 pl-9 pr-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary w-full sm:w-72"
      />
    </div>
  )
}
