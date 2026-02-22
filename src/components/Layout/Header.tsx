import React from 'react'
import { Bell, Search, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'

export const Header: React.FC = () => {
  const { user, signOut } = useAuthStore()
  const { addNotification } = useAppStore()

  const handleSignOut = async () => {
    await signOut()
    addNotification({ type: 'success', message: 'Signed out successfully' })
  }

  return (
    <header className="h-16 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 w-80 focus-within:border-pink-500/50 transition-colors">
        <Search size={16} className="text-neutral-500" />
        <input
          type="text"
          placeholder="Search videos, trends, ideas..."
          className="bg-transparent text-sm text-white placeholder-neutral-500 outline-none flex-1"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Platform selector */}
        <select className="bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 rounded-lg px-3 py-1.5 outline-none focus:border-pink-500/50">
          <option value="all">All Platforms</option>
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
        </select>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name || user.email}
              className="w-8 h-8 rounded-full object-cover border border-neutral-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
          )}
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white leading-tight">
              {user?.full_name || 'Creator'}
            </p>
            <p className="text-xs text-neutral-500 capitalize leading-tight">
              {user?.subscription_tier || 'free'} plan
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
