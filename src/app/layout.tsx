import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '../styles/app.css'

export const metadata: Metadata = {
  title: 'Rang Rani — Jewelry',
  description: 'Bangles and bracelets from Lahore. Beaded, kundan, charm, and bridal styles.',
  metadataBase: new URL('http://localhost:5173'),
  openGraph: {
    title: 'Rang Rani — Bangles & bracelets from Lahore',
    description: 'Moti for Tuesday, kundan for shine, a bridal stack for the shaadi week.',
    url: 'http://localhost:5173',
    siteName: 'Rang Rani',
    type: 'website',
    images: [
      {
        url: '/images/og-share.jpg',
        width: 1200,
        height: 627,
        alt: 'Gold bangles from the Rang Rani studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rang Rani — Bangles & bracelets from Lahore',
    description: 'Bangles and bracelets from Lahore. Beaded, kundan, charm, and bridal styles.',
    images: ['/images/og-share.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
