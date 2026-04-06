import { cn } from "@/lib/utils"

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-surface-container animate-pulse rounded-lg",
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="block">
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container mb-3">
        <Shimmer className="absolute inset-0 rounded-none" />
      </div>
      {/* Info */}
      <div className="px-0.5 space-y-2">
        <Shimmer className="h-3 w-16 rounded-full" />
        <Shimmer className="h-4 w-3/4 rounded-md" />
        <Shimmer className="h-4 w-1/3 rounded-md" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8, columns = 4 }: { count?: number; columns?: 2 | 3 | 4 }) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  }[columns]

  return (
    <div className={`grid ${gridCols} gap-4 sm:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
