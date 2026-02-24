import React from 'react'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'

export const Header: React.FC = () => {
  const { toggleSidebar } = useUiStore()
  const { user, logout } = useAuthStore()

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-16 flex items-center justify-between
      px-4 bg-gray-950/90 backdrop-blur border-b border-gray-800">
      {/* Sidebar-Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800
          transition-colors"
        aria-label="Sidebar ein-/ausblenden"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Rechte Seite: Benutzer + Abmelden */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-400 hidden sm:block truncate max-w-xs">
            {user.email}
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={() => void logout()}>
          Abmelden
        </Button>
      </div>
    </header>
  )
}
