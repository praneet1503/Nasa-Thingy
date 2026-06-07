import type { Metadata } from 'next'
import { Fredoka, Nunito, Caveat } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import SkyBackdrop from '../components/brand/SkyBackdrop'
import TopNav from '../components/TopNav'
import Mascot from '../components/brand/Mascot'
import { Analytics } from '@vercel/analytics/react'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-fredoka', display: 'swap' })
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-nunito', display: 'swap' })
const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-caveat', display: 'swap' })

export const metadata: Metadata = {
  title: 'Nasapedia',
  description: 'Your friendly guide to everything space',
  openGraph: {
    title: 'Nasapedia',
    description: 'Your friendly guide to everything space',
    images: [{ url: '/nasapedia-logo.webp', width: 1600, height: 900, alt: 'Nasapedia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nasapedia',
    description: 'Your friendly guide to everything space',
    images: ['/nasapedia-logo.webp'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} ${caveat.variable}`}>
      <body className="min-h-screen bg-cream text-navy antialiased font-body">
        <SkyBackdrop />
        <TopNav />
        <Providers>
          <div className="relative z-10 pt-16 pb-14">{children}</div>
          <Analytics />
        </Providers>
        <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2 px-4 bg-cream-raised/85 backdrop-blur-sm border-t border-[#ece3cf] text-xs text-inkmute">
          <Mascot size={22} expression="wave" aria-hidden />
          <span className="font-hand text-[15px] text-corn">made with love of space &amp; data</span>
          <span aria-hidden>·</span>
          <span>by praneet ·{' '}
            <a href="https://github.com/praneet1503/Nasapedia" className="font-bold text-corn-dim underline underline-offset-2 hover:text-navy transition-colors">open source</a>
          </span>
        </footer>
      </body>
    </html>
  )
}
