import { create } from 'zustand'
import type { Platform } from '@/types'

interface AppState {
  sidebarOpen: boolean
  selectedPlatform: Platform
  notifications: Notification[]
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSelectedPlatform: (platform: Platform) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  selectedPlatform: 'all',
  notifications: [],

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

  addNotification: (notification) => {
    const id = crypto.randomUUID()
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }))
    const duration = notification.duration ?? 4000
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    }, duration)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },
}))
