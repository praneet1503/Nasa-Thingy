'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode, useState } from 'react'

const NAV_ITEMS = [
  { href: '/global-launch-intelligence/dashboard', label: 'Command Center', icon: '🛰️' },
  { href: '/global-launch-intelligence/launch-velocity', label: 'Launch Velocity', icon: '🚀' },
  { href: '/global-launch-intelligence/agency-dominance', label: 'Agency Dominance', icon: '🏆' },
  { href: '/global-launch-intelligence/orbital-intelligence', label: 'Orbital Intel', icon: '🌍' },
  { href: '/global-launch-intelligence/mission-classification', label: 'Mission Class', icon: '🗂️' },
  { href: '/global-launch-intelligence/astronaut-activity', label: 'Astronaut Ops', icon: '👩‍🚀' },
  { href: '/global-launch-intelligence/station-traffic', label: 'Station Traffic', icon: '🛰️' },
  { href: '/global-launch-intelligence/geopolitical-map', label: 'Geo Map', icon: '🗺️' },
]

export default function IntelligenceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <nav className={`intel-sidebar ${collapsed ? 'intel-sidebar-collapsed' : ''}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-left px-3 py-2 text-xs font-display text-inkmute hover:text-navy transition-colors"
          >
            {collapsed ? '▸' : '▾ Sections'}
          </button>

          {!collapsed && NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`intel-nav-item ${isActive ? 'intel-nav-active' : ''}`}
              >
                <span className="text-xs w-4 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <main
          className="flex-1 p-4 md:p-6 overflow-auto"
          style={{ marginLeft: collapsed ? 52 : 220 }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
