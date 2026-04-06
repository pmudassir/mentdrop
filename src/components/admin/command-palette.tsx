"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Ticket,
  Truck,
  BarChart3,
  Settings,
  Plus,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

const COMMANDS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, group: "Navigate" },
  { label: "Products", href: "/admin/products", icon: Package, group: "Navigate" },
  { label: "Categories", href: "/admin/categories", icon: Tag, group: "Navigate" },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, group: "Navigate" },
  { label: "Customers", href: "/admin/customers", icon: Users, group: "Navigate" },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket, group: "Navigate" },
  { label: "Suppliers", href: "/admin/suppliers", icon: Truck, group: "Navigate" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, group: "Navigate" },
  { label: "Settings", href: "/admin/settings", icon: Settings, group: "Navigate" },
  { label: "Add Product", href: "/admin/products/new", icon: Plus, group: "Create" },
]

export function AdminCommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [selected, setSelected] = React.useState(0)
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS

  // Keyboard shortcut: ⌘K / Ctrl+K
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
        setQuery("")
        setSelected(0)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Focus input when opened
  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Arrow navigation
  function onKeyDownInner(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === "Enter" && filtered[selected]) {
      navigate(filtered[selected].href)
    }
  }

  function navigate(href: string) {
    router.push(href)
    setOpen(false)
    setQuery("")
    setSelected(0)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-highest text-body-sm transition-colors"
        aria-label="Open command palette"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search...</span>
        <kbd className="ml-2 text-[10px] font-medium bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant">
          ⌘K
        </kbd>
      </button>
    )
  }

  // Group the filtered commands
  const groups = filtered.reduce<Record<string, typeof COMMANDS>>((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = []
    acc[cmd.group].push(cmd)
    return acc
  }, {})

  let globalIdx = 0

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg rounded-2xl bg-surface shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDownInner}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-outline-variant/20">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none"
          />
          <kbd className="text-[10px] text-on-surface-variant/50 font-medium bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30">
            ESC
          </kbd>
        </div>

        {/* Commands list */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-body-sm text-on-surface-variant">
              No commands found
            </p>
          ) : (
            Object.entries(groups).map(([group, cmds]) => (
              <div key={group}>
                <p className="px-4 pt-3 pb-1 text-catalog text-on-surface-variant/40">{group}</p>
                {cmds.map((cmd) => {
                  const idx = globalIdx++
                  return (
                    <button
                      key={cmd.href}
                      onClick={() => navigate(cmd.href)}
                      onMouseEnter={() => setSelected(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        selected === idx
                          ? "bg-primary-container text-on-primary-container"
                          : "text-on-surface hover:bg-surface-container"
                      )}
                    >
                      <cmd.icon className="w-4 h-4 shrink-0 text-on-surface-variant" />
                      <span className="text-body-sm">{cmd.label}</span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
