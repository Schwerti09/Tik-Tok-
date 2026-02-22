import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  LayoutDashboard,
  TrendingUp,
  Lightbulb,
  Video,
  Scissors,
  Calendar,
  BarChart2,
  Users,
  X,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trendradar',   icon: TrendingUp,      label: 'TrendRadar' },
  { to: '/idealab',      icon: Lightbulb,       label: 'IdeaLab' },
  { to: '/quickcapture', icon: Video,           label: 'QuickCapture' },
  { to: '/clipforge',    icon: Scissors,        label: 'ClipForge' },
  { to: '/scheduler',    icon: Calendar,        label: 'SmartScheduler' },
  { to: '/analytics',    icon: BarChart2,       label: 'Analytics+' },
  { to: '/community',    icon: Users,           label: 'CommunityHub' },
];

function NavItems({ onClose }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-brand-600 to-accent-500 text-white shadow-pink'
                : 'text-brand-700 hover:bg-brand-50 hover:text-brand-900'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-brand-100">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="text-xl font-bold gradient-text">TikFlow</span>
      </div>

      <NavItems onClose={onClose} />

      {/* Footer */}
      <div className="px-5 py-4 border-t border-brand-100">
        <p className="text-xs text-brand-400 text-center">© 2025 TikFlow</p>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile sidebar – Headless UI Dialog */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm" />
          </Transition.Child>

          {/* Slide-in panel */}
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col w-72 max-w-xs bg-white shadow-glow">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    aria-label="Sidebar schließen"
                  >
                    <X size={20} />
                  </button>
                </div>
                <SidebarContent onClose={onClose} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop sidebar – always visible */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-brand-100 shadow-glass flex-shrink-0">
        <SidebarContent onClose={() => {}} />
      </aside>
    </>
  );
}
