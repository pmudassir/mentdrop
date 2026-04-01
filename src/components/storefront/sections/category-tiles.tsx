import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/actions/categories"

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-label-md tracking-[0.18em] uppercase text-on-surface-variant/50 mb-1">
            The Atelier
          </p>
          <h2 className="text-serif text-3xl sm:text-4xl font-semibold text-on-surface">
            Shop by Collection
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative overflow-hidden rounded-xl bg-surface-container"
            style={{ aspectRatio: i < 2 ? "3/4" : "3/4" }}
          >
            {cat.imageUrl ? (
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-107"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
            ) : (
              <div className="absolute inset-0 bg-primary-container/30" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {/* Labels */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-serif text-white font-medium text-base leading-tight">
                {cat.name}
              </p>
              {cat.nameHi && (
                <p className="text-hindi text-white/60 text-xs mt-0.5">{cat.nameHi}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
