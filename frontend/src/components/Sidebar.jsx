import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Lightbulb, Video,
  Scissors, Calendar, BarChart3, Users, X, Zap
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trendradar',   icon: TrendingUp,      label: 'Trend Radar' },
  { to: '/idealab',      icon: Lightbulb,       label: 'Idea Lab' },
  { to: '/quickcapture', icon: Video,           label: 'Quick Capture' },
  { to: '/clipforge',    icon: Scissors,        label: 'Clip Forge' },
  { to: '/scheduler',    icon: Calendar,        label: 'Smart Scheduler' },
  { to: '/analytics',    icon: BarChart3,       label: 'Analytics+' },
  { to: '/community',    icon: Users,           label: 'Community Hub' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 flex flex-col
          bg-gray-900 border-r border-white/10
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">TikFlow</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/30 to-pink-600/20 text-white border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
              CR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Creator</p>
              <p className="text-xs text-gray-400 truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
