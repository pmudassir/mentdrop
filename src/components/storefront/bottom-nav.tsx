"use client"

import Link from "next/link"
import { Home, LayoutGrid, Heart, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BottomNav({ firstCategorySlug }: { firstCategorySlug: string }) {
  const pathname = usePathname()

  const NAV = [
    { label: "Home", href: "/", icon: Home },
    { label: "Collections", href: `/category/${firstCategorySlug}`, icon: LayoutGrid },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Account", href: "/account", icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-outline-variant/15 safe-area-bottom">
      <div className="flex items-stretch h-16">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith("/category") && label === "Collections")
            || (href !== "/" && href !== `/category/${firstCategorySlug}` && pathname.startsWith(href))
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
                active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "stroke-[2.2]")} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
