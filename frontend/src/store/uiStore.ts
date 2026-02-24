import { create } from 'zustand'

// Typen für globalen UI-State
interface UiState {
  sidebarOpen: boolean
  modalOpen: boolean
  modalContent: React.ReactNode | null
  // Aktionen
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: true,
  modalOpen: false,
  modalContent: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),
}))
