import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[85svh] md:min-h-[90svh] flex items-end overflow-hidden bg-[#1B3A2A]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://picsum.photos/seed/heritage-hero/1400/900')" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E0F]/90 via-[#0A1E0F]/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24 w-full">
        <p className="text-label-md tracking-[0.2em] uppercase text-white/60 mb-4">
          New Collection · 2026
        </p>
        <h1 className="text-serif font-semibold text-white leading-[1.08] mb-5" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
          The Silk<br />
          <span className="italic text-[#D4A574]">Manuscript</span>
        </h1>
        <p className="text-body-lg text-white/70 mb-8 max-w-md leading-relaxed">
          Handpicked ethnic wear that celebrates the artistry of Indian craftsmanship. From everyday kurtas to heirloom sarees.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild className="bg-[#D4A574] hover:bg-[#C49060] text-white shadow-lg rounded-full">
            <Link href="/category/trending">Explore Collection</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="border-white/30 text-white hover:bg-white/10 rounded-full">
            <Link href="/category/sarees">Heritage Sarees</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
