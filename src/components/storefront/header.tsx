"use client"

import Link from "next/link"
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import * as React from "react"
import type { Category } from "@/lib/actions/categories"

export function Header({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [collectionsOpen, setCollectionsOpen] = React.useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)

  const firstCategory = categories[0]

  return (
    <header className="sticky top-0 z-40 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main bar */}
        <div className="flex items-center justify-between h-16">
          {/* Mobile: hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 -ml-2 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo — centered on mobile, left on desktop */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 text-serif text-[1.4rem] font-semibold tracking-widest uppercase text-on-surface"
          >
            Swadesh
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {/* Collections with dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button className="flex items-center gap-1 text-body-md text-on-surface-variant hover:text-on-surface transition-colors py-1">
                Collections
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              {collectionsOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-lg py-2 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2.5 text-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/category/trending" className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              New Arrivals
            </Link>
            <Link href="/category/sarees" className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              Heritage
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <Link
              href="/search"
              className="p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors hidden md:flex"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary text-on-primary text-[10px] font-medium rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary text-on-primary text-[10px] font-medium rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className="hidden md:flex p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile menu slide-down */}
        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 border-t border-outline-variant/20 pt-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-3 py-3 rounded-xl text-body-lg text-on-surface hover:bg-surface-container transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <div className="my-1 border-t border-outline-variant/20" />
            <Link
              href="/orders"
              className="px-3 py-3 rounded-xl text-body-lg text-on-surface hover:bg-surface-container transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              My Orders
            </Link>
            <Link
              href="/account"
              className="px-3 py-3 rounded-xl text-body-lg text-on-surface hover:bg-surface-container transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              My Account
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
