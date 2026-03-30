import { Header } from "@/components/storefront/header"
import { Footer } from "@/components/storefront/footer"
import { Toaster } from "@/components/ui/toaster"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </>
  )
}
