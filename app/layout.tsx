import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Geist_Mono, Playfair_Display, Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Playfair_Display as V0_Font_Playfair_Display } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _playfairDisplay = V0_Font_Playfair_Display({ subsets: ['latin'], weight: ["400","500","600","700","800","900"] })

const _playfair = Playfair_Display({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "АбсолютПрофРемонт - Профессиональный ремонт и строительство в Новосибирске",
  description:
    "Качественный ремонт квартир, дизайн интерьера, коммерческие помещения. Более 10 лет опыта. Гарантия 3 года.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "public/favicon.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "public/favicon.ico",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "favicon.ico",
        type: "image/ico",
      },
    ],
    apple: "public/favicon-32x32.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
