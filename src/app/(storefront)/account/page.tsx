import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, Heart, User } from "lucide-react"
import { getSession } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const quickLinks = [
    {
      href: "/orders",
      icon: Package,
      label: "My Orders",
      description: "Track and manage your orders",
    },
    {
      href: "/wishlist",
      icon: Heart,
      label: "Wishlist",
      description: "Products you have saved",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-display-sm text-on-surface mb-8">My Account</h1>

      {/* Profile Card */}
      <div className="bg-surface-container-low rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-on-primary-container" />
          </div>
          <div>
            <p className="text-headline-sm text-on-surface">My Account</p>
            <p className="text-body-md text-on-surface-variant mt-0.5">
              {session.phone}
            </p>
            <p className="text-label-sm text-primary mt-1 capitalize">{session.role}</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {quickLinks.map(({ href, icon: Icon, label, description }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 bg-surface-container-low rounded-2xl p-5 hover:bg-surface-container transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary-container transition-colors">
              <Icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-title-sm text-on-surface">{label}</p>
              <p className="text-body-sm text-on-surface-variant mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Sign Out */}
      <div className="bg-surface-container-low rounded-2xl p-6">
        <h2 className="text-title-sm text-on-surface mb-1">Session</h2>
        <p className="text-body-sm text-on-surface-variant mb-4">
          You are signed in on this device.
        </p>
        <form action="/api/auth/logout" method="POST">
          <Button variant="outline" size="md" type="submit">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}
