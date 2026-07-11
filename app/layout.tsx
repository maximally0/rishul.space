import { Anton, IBM_Plex_Mono, Syne } from "next/font/google"
import { Metadata } from "next"

import "./globals.css"
import { cn } from "@/lib/utils";

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
})

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://rishul.space"),
  title: {
    default: "rishul.space",
    template: "%s | rishul.space",
  },
  description: "i do business with pleasure. founder @ collision, devil @ hack47. 18, chandigarh. building things, meeting cool people, figuring it out.",
  keywords: ["Rishul Chanana", "rishul.space", "founder", "Collision", "Hack47", "builder", "India", "startups", "vibes"],
  authors: [{ name: "Rishul Chanana" }],
  creator: "Rishul Chanana",
  publisher: "Rishul Chanana",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rishul.space",
    siteName: "rishul.space",
    title: "rishul.space — i do business with pleasure",
    description: "founder @ collision. devil @ hack47. 18, chandigarh. building things, vibing, and figuring it out along the way.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rishul Chanana — rishul.space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "rishul.space",
    description: "i do business with pleasure. founder @ collision. devil @ hack47. vibing and building.",
    images: ["/og-image.png"],
    creator: "@rishhul",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, anton.variable, syne.variable)}
    >
      <body className="bg-black">
        {children}
      </body>
    </html>
  )
}
