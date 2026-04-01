export function MakingOfBlock({ productName }: { productName: string }) {
  return (
    <section className="bg-inverse-surface py-14 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-label-md tracking-[0.18em] uppercase text-inverse-on-surface/40 mb-4">
          The Atelier
        </p>
        <h2 className="text-serif text-3xl sm:text-4xl font-semibold text-inverse-on-surface mb-6 leading-tight">
          The Making of an Icon
        </h2>
        <p className="text-body-lg text-inverse-on-surface/60 leading-relaxed mb-4">
          Each {productName.toLowerCase()} in our collection is sourced directly from master weavers and embroiderers
          who have honed their craft over generations. We visit workshops in Lucknow, Varanasi, Jaipur, and Kolkata
          to ensure every piece meets our standard of artisanal excellence.
        </p>
        <p className="text-body-lg text-inverse-on-surface/60 leading-relaxed">
          When you choose Swadesh, you support a living heritage — and the families who keep it alive.
        </p>
      </div>
    </section>
  )
}
