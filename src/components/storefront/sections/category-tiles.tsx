import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/actions/categories"

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  return (
    <section className="py-20 sm:py-28">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-10">
        <p className="text-catalog text-on-surface-variant/50 mb-2">The Atelier</p>
        <h2 className="text-serif text-3xl sm:text-4xl font-semibold text-on-surface">
          Shop by Collection
        </h2>
      </div>

      {/* Scroll strip — left-aligned, bleeds slightly right */}
      <div
        className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth px-5 sm:px-8 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative flex-shrink-0 overflow-hidden rounded-2xl bg-surface-container"
            style={{ width: "clamp(200px, 28vw, 320px)", aspectRatio: "3/4" }}
          >
            {cat.imageUrl ? (
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
                sizes="320px"
              />
            ) : (
              <div className="absolute inset-0 bg-primary-container/30" />
            )}

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
              <p className="text-serif text-white font-medium text-lg leading-tight">
                {cat.name}
              </p>
              {/* "Explore" — always visible on mobile, hover-reveal on desktop */}
              <p className="text-catalog text-white/55 mt-1 transition-all duration-300"
                style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}>
                <span className="md:opacity-0 md:translate-y-1 md:inline-block group-hover:md:opacity-100 group-hover:md:translate-y-0 transition-all duration-300">
                  Explore →
                </span>
              </p>
            </div>
          </Link>
        ))}

        {/* Trailing spacer so last card isn't flush against edge */}
        <div className="flex-shrink-0 w-1" />
      </div>

    </section>
  )
}
