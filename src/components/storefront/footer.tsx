import Link from "next/link"
import { Globe, Share2, Play } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-serif text-2xl font-semibold tracking-widest uppercase mb-3 text-inverse-on-surface">
              Swadesh
            </h3>
            <p className="text-body-sm text-inverse-on-surface/60 leading-relaxed max-w-xs">
              Premium Indian ethnic wear for the modern woman. Crafted with heritage, worn with pride.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a href="#" aria-label="Instagram" className="text-inverse-on-surface/50 hover:text-inverse-on-surface transition-colors">
                <Globe className="w-4.5 h-4.5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-inverse-on-surface/50 hover:text-inverse-on-surface transition-colors">
                <Share2 className="w-4.5 h-4.5" />
              </a>
              <a href="#" aria-label="YouTube" className="text-inverse-on-surface/50 hover:text-inverse-on-surface transition-colors">
                <Play className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-label-md uppercase tracking-widest text-inverse-on-surface/50 mb-4">Collections</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Kurtas", href: "/category/kurtas" },
                { label: "Abayas", href: "/category/abayas" },
                { label: "Pakistani Dresses", href: "/category/pakistani" },
                { label: "Sarees", href: "/category/sarees" },
                { label: "Suit Sets", href: "/category/suits" },
                { label: "New Arrivals", href: "/category/trending" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-label-md uppercase tracking-widest text-inverse-on-surface/50 mb-4">Experience</h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/orders" className="text-body-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-body-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-body-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <span className="text-body-sm text-inverse-on-surface/70">Returns & Exchanges</span>
              </li>
              <li>
                <span className="text-body-sm text-inverse-on-surface/70">Contact Us</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-label-md uppercase tracking-widest text-inverse-on-surface/50 mb-4">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              <li><span className="text-body-sm text-inverse-on-surface/70">Privacy Policy</span></li>
              <li><span className="text-body-sm text-inverse-on-surface/70">Terms of Service</span></li>
              <li><span className="text-body-sm text-inverse-on-surface/70">Shipping Policy</span></li>
              <li><span className="text-body-sm text-inverse-on-surface/70">Refund Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-inverse-on-surface/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-body-sm text-inverse-on-surface/40">
            &copy; {new Date().getFullYear()} Swadesh. All rights reserved.
          </p>
          <p className="text-label-sm text-inverse-on-surface/30 uppercase tracking-widest">
            Crafted with love in India
          </p>
        </div>
      </div>
    </footer>
  )
}
