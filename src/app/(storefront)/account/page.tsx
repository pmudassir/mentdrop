import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, Heart, User, MapPin, ChevronRight, MessageCircle } from "lucide-react"
import { getSession } from "@/lib/auth/session"
import { getFeaturedProducts } from "@/lib/actions/products"
import { ProductCard } from "@/components/storefront/product-card"

export default async function AccountPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const curations = await getFeaturedProducts(4).catch(() => [])

  const firstName = session.phone.slice(-4)
  const displayName = `Member ${firstName}`

  const menuItems = [
    { href: "/orders", icon: Package, label: "Orders", desc: "Track and manage your orders" },
    { href: "/account/profile", icon: User, label: "Profile", desc: "Manage your personal details" },
    { href: "/account/addresses", icon: MapPin, label: "Addresses", desc: "Saved delivery addresses" },
    { href: "/wishlist", icon: Heart, label: "Wishlist", desc: "Your saved pieces" },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-serif font-semibold text-on-surface mb-1" style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)" }}>
          Welcome back, {displayName}
        </h1>
        <p className="text-body-md text-on-surface-variant">Welcome back to your atelier.</p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-primary rounded-2xl p-4">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-on-primary/60 mb-2">Status</p>
          <p className="text-serif text-2xl font-semibold text-on-primary leading-none">Gold</p>
          <p className="text-label-sm text-on-primary/70 mt-1">Member</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-on-surface-variant/50 mb-2">Loyalty Points</p>
          <p className="text-serif text-2xl font-semibold text-on-surface leading-none">1,250</p>
          <p className="text-label-sm text-on-surface-variant/60 mt-1">Heritage Premium</p>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-surface-container-low rounded-2xl overflow-hidden mb-8 divide-y divide-outline-variant/10">
        {menuItems.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary-container transition-colors">
              <Icon className="w-4.5 h-4.5 text-on-surface-variant group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-title-sm text-on-surface">{label}</p>
              <p className="text-body-sm text-on-surface-variant/70">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant/40" />
          </Link>
        ))}
      </div>

      {/* Heritage Curations */}
      {curations.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-serif text-xl font-semibold text-on-surface">Heritage Curations</h2>
            <Link href="/category/trending" className="text-label-sm text-primary hover:underline underline-offset-2">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {curations.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Support + Sign out */}
      <div className="bg-surface-container-low rounded-2xl p-5 mb-4">
        <h2 className="text-title-sm text-on-surface mb-1">Need Assistance?</h2>
        <p className="text-body-sm text-on-surface-variant mb-4">
          Our atelier team is available to help you with sizing, styling, and orders.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4A574] hover:bg-[#C49060] text-white text-label-md transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Contact Support
        </Link>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-5">
        <p className="text-body-sm text-on-surface-variant mb-3">
          Signed in as <strong className="text-on-surface">{session.phone}</strong>
        </p>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="text-label-md text-error hover:underline underline-offset-2"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
