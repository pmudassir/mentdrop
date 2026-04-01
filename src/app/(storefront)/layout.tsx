import { Header } from "@/components/storefront/header"
import { Footer } from "@/components/storefront/footer"
import { BottomNav } from "@/components/storefront/bottom-nav"
import { Toaster } from "@/components/ui/toaster"
import { getRootCategories } from "@/lib/actions/categories"

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getRootCategories()
  const firstCategorySlug = categories[0]?.slug ?? "kurtas"

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav firstCategorySlug={firstCategorySlug} />
      <Toaster />
    </>
  )
}
