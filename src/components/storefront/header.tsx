"use client"

import Link from "next/link"
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import * as React from "react"

export function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main bar */}
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 -ml-2 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-headline-md text-primary tracking-tight">
            Swadesh
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-8">
            <Link href="/category/kurtas" className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              Kurtas
            </Link>
            <Link href="/category/abayas" className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              Abayas
            </Link>
            <Link href="/category/pakistani" className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              Pakistani
            </Link>
            <Link href="/category/trending" className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              Trending
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
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
              className="hidden sm:flex p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="sm:hidden pb-4 flex flex-col gap-2">
            {["Kurtas", "Abayas", "Pakistani", "Trending"].map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="px-3 py-2.5 rounded-xl text-body-lg text-on-surface hover:bg-surface-container transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <Link
              href="/account"
              className="px-3 py-2.5 rounded-xl text-body-lg text-on-surface hover:bg-surface-container transition-colors"
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
