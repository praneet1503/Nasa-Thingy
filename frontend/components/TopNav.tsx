'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Mascot from './brand/Mascot'

const NAV_ITEMS = [
  { href: '/projects', label: 'Missions', match: (p: string) => p === '/projects' || p.startsWith('/project/') },
  { href: '/feed', label: 'Feed', match: (p: string) => p.startsWith('/feed') },
  { href: '/global-launch-intelligence/dashboard', label: 'Command Center', match: (p: string) => p.startsWith('/global-launch-intelligence') },
  { href: '/aurora-tracker', label: 'Aurora', match: (p: string) => p.startsWith('/aurora-tracker') },
  { href: '/iss-tracker', label: 'ISS', match: (p: string) => p.startsWith('/iss-tracker') },
  { href: '/space-news', label: 'News', match: (p: string) => p.startsWith('/space-news') },
  { href: '/space-blogs', label: 'Blogs', match: (p: string) => p.startsWith('/space-blogs') },
]

export default function TopNav() {
  const pathname = usePathname()
  return (
    <header className="global-topbar">
      <Link href="/projects" className="global-topbar-brand">
        <Mascot size={34} expression="read" aria-hidden />
        <span className="global-topbar-wordmark">Nasa<span className="pedia">pedia</span></span>
      </Link>
      <nav className="global-topbar-links" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match(pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`global-topbar-link ${isActive ? 'global-topbar-link-active' : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
