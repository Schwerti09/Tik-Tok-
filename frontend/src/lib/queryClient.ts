import { QueryClient } from '@tanstack/react-query'

// Globaler QueryClient für TanStack Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 Minuten Cache
      staleTime: 1000 * 60 * 5,
      // Maximal 2 Wiederholungsversuche bei Fehler
      retry: 2,
    },
  },
})
