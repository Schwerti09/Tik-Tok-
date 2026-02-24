import React from 'react'
import { NavLink } from 'react-router-dom'
import { useUiStore } from '@/store/uiStore'

// Navigationselemente für die Sidebar
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/clipforge', label: 'ClipForge', icon: '🎬' },
  { to: '/trends', label: 'TrendRadar', icon: '📈' },
  { to: '/ideas', label: 'Ideen', icon: '💡' },
  { to: '/schedule', label: 'Scheduler', icon: '📅' },
  { to: '/analytics', label: 'Analytics', icon: '📊' },
  { to: '/community', label: 'Community', icon: '🤝' },
  { to: '/pricing', label: 'Pricing', icon: '💳' },
]

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useUiStore()

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col bg-gray-900 border-r border-gray-800
        transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-16'}`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-800 flex-shrink-0">
        <span className="text-2xl">⚡</span>
        {sidebarOpen && (
          <span className="ml-3 font-bold text-lg text-brand-400 truncate">TikFlow</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Hauptnavigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 my-0.5 rounded-lg text-sm font-medium
               transition-colors duration-150
               ${isActive
                 ? 'bg-brand-600/20 text-brand-400'
                 : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`
            }
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {sidebarOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
