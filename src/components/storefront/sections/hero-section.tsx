import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: "580px" }}>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://picsum.photos/seed/ethnic-fashion/900/1200')",
          transform: "scale(1.04)",
        }}
      />

      {/* Warm tint overlay — gives forest-green brand warmth */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(30,50,35,0.35) 0%, transparent 50%)" }} />

      {/* Bottom gradient — for text legibility */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,18,12,0.88) 0%, rgba(10,18,12,0.55) 28%, transparent 58%)" }} />

      {/* ── Top labels ── */}
      <div className="absolute top-6 left-5 sm:top-8 sm:left-8 flex items-center gap-3">
        <span className="text-catalog text-white/65 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full tracking-[0.14em]">
          New Season · 2026
        </span>
      </div>

      {/* ── Main content — bottom of image ── */}
      <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-10 pb-14 sm:pb-16">

        {/* Thin separator */}
        <div className="w-10 h-px bg-white/30 mb-6" />

        {/* Eyebrow */}
        <p className="text-catalog text-white/50 mb-3 tracking-[0.18em]">
          The Atelier · Heritage Collection
        </p>

        {/* Headline */}
        <h1
          className="text-serif font-semibold text-white leading-[1.0] mb-7"
          style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)" }}
        >
          The Silk{" "}
          <br className="hidden sm:block" />
          <em className="not-italic" style={{ color: "var(--color-accent)" }}>
            Manuscript
          </em>
        </h1>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/category/trending"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-[#1B3A2A] text-body-sm font-semibold tracking-wide transition-all duration-300 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
          >
            Explore Collection
          </Link>
          <Link
            href="/category/sarees"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white text-body-sm font-medium tracking-wide backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/60"
            style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
          >
            Heritage Sarees
          </Link>
        </div>
      </div>

      {/* ── Scroll indicator — bottom center ── */}
      <div className="absolute bottom-8 right-6 sm:right-10 flex flex-col items-center gap-2 text-white/40">
        <div className="w-px h-10 bg-white/20 relative overflow-hidden rounded-full">
          <div
            className="absolute top-0 w-full bg-white/60 rounded-full"
            style={{ height: "40%", animation: "scroll-line 1.8s cubic-bezier(0.33,1,0.68,1) infinite" }}
          />
        </div>
        <span className="text-catalog text-[9px] tracking-[0.16em]">Scroll</span>
      </div>

    </section>
  )
}
