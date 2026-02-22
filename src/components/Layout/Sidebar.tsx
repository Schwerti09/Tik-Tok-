import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  Upload,
  BarChart2,
  TrendingUp,
  Lightbulb,
  Calendar,
  Users,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/trends', icon: TrendingUp, label: 'Trends' },
  { to: '/ideas', icon: Lightbulb, label: 'AI Ideas' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-neutral-950 border-r border-neutral-800 flex flex-col transition-all duration-300 z-40',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-neutral-800">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-bold text-white text-lg gradient-text whitespace-nowrap">
            CreatorStudio
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive =
            to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'nav-item',
                isActive && 'active',
                !sidebarOpen && 'justify-center px-2'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-4 border-t border-neutral-800">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </aside>
  )
}
