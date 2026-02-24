import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

// Stabile Referenz auf initialize (außerhalb des Hooks, da der Store-Selector stabil ist)
const { initialize } = useAuthStore.getState()

// Hook für Auth-Zugriff und Initialisierung
export function useAuth() {
  const { user, session, loading, login, signup, logout } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  return { user, session, loading, login, signup, logout }
}
