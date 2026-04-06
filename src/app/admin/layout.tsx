import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { AdminSidebar } from "./sidebar"
import { AdminBottomNav } from "./bottom-nav"
import { AdminCommandPalette } from "@/components/admin/command-palette"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <AdminBottomNav />

      {/* Command palette — ⌘K */}
      <AdminCommandPalette />
    </div>
  )
}
