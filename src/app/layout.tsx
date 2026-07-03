import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#FFD700',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  title: {
    default: 'Mutsembeki — Ministério Musical',
    template: '%s | Mutsembeki',
  },
  description: 'Música gospel que transforma vidas e glorifica a Deus. Ouça, baixe e seja abençoado pelas músicas de Mutsembeki.',
  keywords: ['mutsembeki', 'gospel', 'música cristã', 'louvor', 'adoração', 'moçambique'],
  authors: [{ name: 'Mutsembeki' }],
  creator: 'Mutsembeki',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://mutsembeki.com'),
  openGraph: {
    type: 'website',
    locale: 'pt_MZ',
    url: 'https://mutsembeki.com',
    siteName: 'Mutsembeki',
    title: 'Mutsembeki — Ministério Musical',
    description: 'Música gospel que transforma vidas e glorifica a Deus.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Mutsembeki' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mutsembeki — Ministério Musical',
    description: 'Música gospel que transforma vidas e glorifica a Deus.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
