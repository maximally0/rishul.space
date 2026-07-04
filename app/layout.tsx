import { Anton, IBM_Plex_Mono } from "next/font/google"
import { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
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

export const metadata: Metadata = {
  title: "HACK47 OS | Delhi's First Hacker House",
  description: "A 30-day residency for 16 builders who care more about their Git history than their sleep schedule. Join the chaos in South Delhi.",
  openGraph: {
    title: "HACK47 OS",
    description: "Delhi's First Hacker House. Residency for extreme builders.",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HACK47 OS",
    description: "Join the hacker house in Delhi.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
      className={cn("antialiased", fontMono.variable, anton.variable)}
    >
      <body className="bg-black">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
