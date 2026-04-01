import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Noto_Sans_Devanagari, Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hindi",
  display: "swap",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: "Swadesh — Women's Ethnic Wear",
    template: "%s | Swadesh",
  },
  description:
    "Shop premium Indian ethnic wear — abayas, kurtas, Pakistani dresses & trending fashion. Free shipping across India.",
  keywords: [
    "ethnic wear",
    "women fashion",
    "kurta",
    "abaya",
    "Pakistani dress",
    "Indian fashion",
    "online shopping India",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://swadesh.store"),
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Swadesh",
  },
  twitter: {
    card: "summary_large_image",
    site: "@SwadeshStore",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2D5F3F",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} ${beVietnam.variable} ${notoDevanagari.variable}`}
    >
      <body className="min-h-dvh flex flex-col bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
