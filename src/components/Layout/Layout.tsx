import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const NotificationIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const NotificationColors = {
  success: 'bg-green-500/10 border-green-500/30 text-green-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
}

export const Layout: React.FC = () => {
  const { sidebarOpen, notifications, removeNotification } = useAppStore()

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />

      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((notification) => {
          const Icon = NotificationIcons[notification.type]
          return (
            <div
              key={notification.id}
              className={cn(
                'flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md pointer-events-auto',
                'animate-in slide-in-from-right-5 fade-in duration-200',
                NotificationColors[notification.type]
              )}
            >
              <Icon size={18} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm flex-1">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
