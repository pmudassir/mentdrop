import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-surface-container-high mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-headline-sm text-primary mb-3">Swadesh</h3>
            <p className="text-body-sm text-on-surface-variant">
              Premium Indian ethnic wear for the modern woman.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-title-sm text-on-surface mb-3">Shop</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/category/kurtas" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Kurtas</Link></li>
              <li><Link href="/category/abayas" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Abayas</Link></li>
              <li><Link href="/category/pakistani" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Pakistani</Link></li>
              <li><Link href="/category/trending" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Trending</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-title-sm text-on-surface mb-3">Help</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/orders" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/account" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">My Account</Link></li>
              <li><span className="text-body-sm text-on-surface-variant">Returns & Refunds</span></li>
              <li><span className="text-body-sm text-on-surface-variant">Contact Us</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-title-sm text-on-surface mb-3">Legal</h4>
            <ul className="flex flex-col gap-2">
              <li><span className="text-body-sm text-on-surface-variant">Privacy Policy</span></li>
              <li><span className="text-body-sm text-on-surface-variant">Terms of Service</span></li>
              <li><span className="text-body-sm text-on-surface-variant">Shipping Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 text-center">
          <p className="text-body-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} Swadesh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
