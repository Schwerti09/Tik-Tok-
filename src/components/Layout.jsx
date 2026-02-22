import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Lightbulb, Video,
  Scissors, Calendar, BarChart2, Users, Settings,
  ShieldCheck, LogOut
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trends', icon: TrendingUp, label: 'TrendRadar' },
  { to: '/ideas', icon: Lightbulb, label: 'IdeaLab' },
  { to: '/capture', icon: Video, label: 'QuickCapture' },
  { to: '/clipforge', icon: Scissors, label: 'ClipForge' },
  { to: '/scheduler', icon: Calendar, label: 'Scheduler' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/admin', icon: ShieldCheck, label: 'Admin' },
]

export default function Layout() {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            TikForge
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white w-full transition-colors"
          >
            <LogOut size={18} />
            Abmelden
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
