"use client"

import { useEffect, useState } from "react"

const KEY = "swadesh_recently_viewed"
const MAX = 8

export type RecentlyViewedItem = {
  slug: string
  name: string
  image: string
  price: number
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch { /* noop */ }
  }, [])

  function addItem(item: RecentlyViewedItem) {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.slug !== item.slug)
      const next = [item, ...filtered].slice(0, MAX)
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* noop */ }
      return next
    })
  }

  return { items, addItem }
}
