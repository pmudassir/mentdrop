"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { searchProducts } from "@/lib/actions/products"
import { ProductGrid } from "@/components/storefront/product-grid"
import type { Product } from "@/lib/actions/products"

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""

  const [query, setQuery] = React.useState(initialQuery)
  const [results, setResults] = React.useState<Product[]>([])
  const [hasSearched, setHasSearched] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSearch = React.useCallback((q: string) => {
    startTransition(async () => {
      const data = await searchProducts(q)
      setResults(data)
      setHasSearched(true)
    })
  }, [])

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (initialQuery.trim()) runSearch(initialQuery)
  }, [initialQuery, runSearch])

  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }
    debounceRef.current = setTimeout(() => {
      router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false })
      runSearch(query)
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, router, runSearch])

  function handleClear() {
    setQuery("")
    setResults([])
    setHasSearched(false)
    router.replace("/search", { scroll: false })
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center gap-3 bg-surface-container-low rounded-full px-5 py-3 shadow-md">
          <Search className="w-5 h-5 text-on-surface-variant flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search for kurtas, sarees, abayas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-body-lg text-on-surface placeholder:text-outline focus:outline-none"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={handleClear}
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isPending && (
        <div className="text-center py-16">
          <p className="text-body-lg text-on-surface-variant">Searching...</p>
        </div>
      )}
      {!isPending && hasSearched && results.length > 0 && (
        <div>
          <p className="text-label-lg text-on-surface-variant mb-6">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>
          <ProductGrid products={results} columns={4} />
        </div>
      )}
      {!isPending && hasSearched && results.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-on-surface-variant" />
          </div>
          <h2 className="text-headline-sm text-on-surface mb-2">No results found</h2>
          <p className="text-body-md text-on-surface-variant">
            Try different keywords or browse our{" "}
            <a href="/" className="text-primary hover:underline">collections</a>.
          </p>
        </div>
      )}
      {!isPending && !hasSearched && (
        <div className="text-center py-20">
          <p className="text-body-lg text-on-surface-variant">Start typing to search for products</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <p className="text-body-lg text-on-surface-variant">Loading search...</p>
      </div>
    }>
      <SearchContent />
    </React.Suspense>
  )
}
