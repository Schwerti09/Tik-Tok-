import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Menu as MenuIcon, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';

const pageTitles = {
  '/dashboard':    'Dashboard',
  '/trendradar':   'TrendRadar',
  '/idealab':      'IdeaLab',
  '/quickcapture': 'QuickCapture',
  '/clipforge':    'ClipForge',
  '/scheduler':    'SmartScheduler',
  '/analytics':    'Analytics+',
  '/community':    'CommunityHub',
};

const userMenuItems = [
  { icon: User,     label: 'Mein Profil' },
  { icon: Settings, label: 'Einstellungen' },
  { icon: LogOut,   label: 'Abmelden' },
];

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'TikFlow';

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-brand-100 px-4 md:px-6 h-16 flex items-center justify-between flex-shrink-0">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-brand-600 hover:bg-brand-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
          aria-label="Navigation öffnen"
        >
          <MenuIcon size={22} />
        </button>
        <h1 className="text-lg font-bold gradient-text">{title}</h1>
      </div>

      {/* Right: notification bell + user dropdown (Headless UI Menu) */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-xl text-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
          aria-label="Benachrichtigungen"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
        </button>

        {/* User dropdown – Headless UI Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-brand-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
              T
            </div>
            <span className="hidden sm:block text-sm font-medium text-brand-700">TikFlow User</span>
            <ChevronDown size={16} className="text-brand-400" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-glass border border-brand-100 focus:outline-none z-50 py-1">
              {userMenuItems.map(({ icon: Icon, label }) => (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        active ? 'bg-brand-50 text-brand-700' : 'text-gray-600'
                      }`}
                    >
                      <Icon size={16} className={active ? 'text-brand-500' : 'text-gray-400'} />
                      {label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
