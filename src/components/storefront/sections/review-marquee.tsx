const QUOTES = [
  { text: "The embroidery on my kurta is absolutely breathtaking — heirloom quality.", author: "Ananya S." },
  { text: "Ordered for my sister's wedding. The fit was perfect and the colour matched exactly.", author: "Priya M." },
  { text: "You can feel the difference between this and cheaper alternatives. A wardrobe staple.", author: "Riya T." },
  { text: "Photos don't do justice to how beautiful this is in person. Will order again.", author: "Sana A." },
  { text: "My mother-in-law complimented me — she's been wearing sarees for 50 years. That says it all.", author: "Kavya P." },
  { text: "This is my fourth order from Swadesh. The quality is consistently exceptional.", author: "Aisha M." },
  { text: "The craftsmanship is incredible. Fast delivery and beautiful packaging too.", author: "Fatima B." },
  { text: "Fell in love with it the moment I opened the box. Five stars easily.", author: "Meena R." },
]

function QuoteItem({ text, author }: { text: string; author: string }) {
  return (
    <div className="flex items-center gap-4 mx-8 flex-shrink-0">
      <span className="text-accent text-xs">★★★★★</span>
      <p className="text-body-sm text-on-surface-variant whitespace-nowrap">
        &ldquo;{text}&rdquo;
      </p>
      <span className="text-catalog text-on-surface-variant/40 whitespace-nowrap">— {author}</span>
      <span className="text-on-surface-variant/20 text-lg ml-4">✦</span>
    </div>
  )
}

export function ReviewMarquee() {
  // Duplicate quotes for seamless loop
  const doubled = [...QUOTES, ...QUOTES]

  return (
    <section className="bg-surface-container py-5 overflow-hidden border-y border-outline-variant/20">
      <div className="animate-marquee">
        {doubled.map((q, i) => (
          <QuoteItem key={i} text={q.text} author={q.author} />
        ))}
      </div>
    </section>
  )
}
