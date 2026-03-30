"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

const BOTTOM_NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "More", href: "/admin/categories", icon: MoreHorizontal },
]

export function AdminBottomNav() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-low flex items-stretch h-16">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const active = isActive(item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors",
              active
                ? "text-primary"
                : "text-on-surface-variant"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-label-sm">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
