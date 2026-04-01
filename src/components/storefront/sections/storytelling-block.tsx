import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StorytellingBlockProps {
  imageSeed?: string
  eyebrow?: string
  title: string
  body: string
  ctaLabel?: string
  ctaHref?: string
  reverse?: boolean
}

export function StorytellingBlock({
  imageSeed = "heritage-story",
  eyebrow = "The Atelier Story",
  title,
  body,
  ctaLabel = "Discover More",
  ctaHref = "/",
  reverse = false,
}: StorytellingBlockProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}>
        {/* Image */}
        <div className="relative w-full md:w-1/2 aspect-[4/5] rounded-2xl overflow-hidden">
          <Image
            src={`https://picsum.photos/seed/${imageSeed}/700/875`}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A2A]/20 to-transparent" />
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2 max-w-lg">
          {eyebrow && (
            <p className="text-label-md tracking-[0.18em] uppercase text-accent mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-serif font-semibold text-on-surface mb-5 leading-tight" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>
            {title}
          </h2>
          <p className="text-body-lg text-on-surface-variant leading-relaxed mb-8">
            {body}
          </p>
          <Button asChild variant="outline" size="lg" className="rounded-full ghost-border">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
