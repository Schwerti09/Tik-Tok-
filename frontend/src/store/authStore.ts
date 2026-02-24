import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Typen für den Auth-State
interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  // Aktionen
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      loading: true,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),

      // Benutzer anmelden
      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        set({ user: data.user, session: data.session })
      },

      // Neuen Benutzer registrieren
      signup: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user) set({ user: data.user, session: data.session })
      },

      // Abmelden
      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null })
      },

      // Session beim App-Start wiederherstellen
      initialize: async () => {
        set({ loading: true })
        const { data } = await supabase.auth.getSession()
        set({
          user: data.session?.user ?? null,
          session: data.session,
          loading: false,
        })

        // Auf Auth-Änderungen hören
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ user: session?.user ?? null, session })
        })
      },
    }),
    {
      name: 'tikflow-auth',
      // Nur den User und die Session in localStorage speichern
      partialize: (state) => ({ user: state.user, session: state.session }),
    },
  ),
)
