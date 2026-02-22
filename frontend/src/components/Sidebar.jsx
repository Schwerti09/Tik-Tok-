import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/trend-radar', label: 'TrendRadar', icon: '📡' },
  { to: '/idea-lab', label: 'IdeaLab', icon: '💡' },
  { to: '/quick-capture', label: 'QuickCapture', icon: '🎥' },
  { to: '/clip-forge', label: 'ClipForge', icon: '✂️' },
  { to: '/smart-scheduler', label: 'SmartScheduler', icon: '📅' },
  { to: '/analytics', label: 'Analytics+', icon: '📊' },
  { to: '/community', label: 'Community Hub', icon: '🌐' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-60 bg-surface border-r border-border z-40 flex flex-col py-4 transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                ${isActive
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30'
                  : 'text-muted hover:text-white hover:bg-surface-hover'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <span className="text-lg">⚡</span>
            <div>
              <p className="text-xs font-semibold text-white">Pro Plan</p>
              <p className="text-xs text-muted">Unlimited videos</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
