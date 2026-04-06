import Link from "next/link"
import { Globe, Share2, Play } from "lucide-react"

const COLLECTIONS = [
  { label: "Kurtas", href: "/category/kurtas" },
  { label: "Abayas", href: "/category/abayas" },
  { label: "Pakistani Dresses", href: "/category/pakistani" },
  { label: "Sarees", href: "/category/sarees" },
  { label: "Suit Sets", href: "/category/suits" },
  { label: "New Arrivals", href: "/category/trending" },
]

const EXPERIENCE = [
  { label: "Track Order", href: "/orders" },
  { label: "My Account", href: "/account" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Returns & Exchanges", href: "#" },
  { label: "Contact Us", href: "#" },
]

const LEGAL = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Shipping Policy", href: "#" },
  { label: "Refund Policy", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface">

      {/* ── Brand Statement ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10 border-b border-inverse-on-surface/10">
        <p
          className="text-serif italic font-light text-inverse-on-surface/70 leading-[1.15] max-w-4xl"
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)" }}
        >
          &ldquo;Swadesh is a tribute to the weavers, embroiderers, and craftspeople
          of India — whose hands carry centuries of artistry into every thread.&rdquo;
        </p>
      </div>

      {/* ── Links grid ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
            <div>
              <h3 className="text-serif text-3xl font-semibold tracking-[0.12em] uppercase text-inverse-on-surface mb-3">
                Swadesh
              </h3>
              <p className="text-body-sm text-inverse-on-surface/50 leading-relaxed max-w-xs">
                Premium Indian ethnic wear for the modern woman.<br />
                Crafted with heritage, worn with pride.
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Globe, label: "Instagram" },
                { Icon: Share2, label: "Facebook" },
                { Icon: Play, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-inverse-on-surface/15 flex items-center justify-center text-inverse-on-surface/50 hover:text-inverse-on-surface hover:border-inverse-on-surface/40 transition-all duration-300"
                  style={{ transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)" }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-catalog text-inverse-on-surface/40 mb-5">Collections</h4>
            <ul className="flex flex-col gap-2.5">
              {COLLECTIONS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-catalog text-inverse-on-surface/40 mb-5">Experience</h4>
            <ul className="flex flex-col gap-2.5">
              {EXPERIENCE.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-catalog text-inverse-on-surface/40 mb-5">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              {LEGAL.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment accepted */}
            <div className="mt-8">
              <p className="text-catalog text-inverse-on-surface/30 mb-3">We Accept</p>
              <div className="flex flex-wrap gap-2">
                {["UPI", "Visa", "MC", "RuPay", "COD"].map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-md border border-inverse-on-surface/15 text-[10px] font-medium text-inverse-on-surface/40 tracking-wide"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-inverse-on-surface/10 pt-6">
        <p className="text-body-sm text-inverse-on-surface/30">
          &copy; {new Date().getFullYear()} Swadesh. All rights reserved.
        </p>
        <p className="text-catalog text-inverse-on-surface/25">
          Crafted with love in India
        </p>
      </div>
    </footer>
  )
}
