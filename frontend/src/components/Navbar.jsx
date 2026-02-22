import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'TF';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Logo + Hamburger */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-muted hover:text-white transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm">TF</span>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">TikFlow</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-surface-hover">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative">
          <button
            className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-white truncate">
                  {user?.user_metadata?.full_name || 'Creator'}
                </p>
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-muted hover:text-white hover:bg-surface-hover transition-colors"
                onClick={() => { setDropdownOpen(false); logout(); }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
