"use client"

import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const { items } = useRecentlyViewed()
  const visible = items.filter((i) => i.slug !== excludeSlug).slice(0, 6)

  if (!visible.length) return null

  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-catalog text-on-surface-variant/50 mb-2">Continue Browsing</p>
          <h2 className="text-serif text-3xl font-semibold text-on-surface">Recently Viewed</h2>
        </div>
        <div
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {visible.map((item) => (
            <Link
              key={item.slug}
              href={`/products/${item.slug}`}
              className="snap-start flex-shrink-0 group"
              style={{ width: "clamp(160px, 30vw, 220px)" }}
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container mb-2.5">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="220px"
                />
              </div>
              <p className="text-[0.85rem] font-medium text-on-surface truncate leading-snug">
                {item.name}
              </p>
              <p className="text-sm font-semibold text-gold mt-0.5">{formatPrice(item.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
