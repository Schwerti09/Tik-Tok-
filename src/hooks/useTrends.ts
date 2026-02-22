import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Trend, Platform } from '@/types'

export const useTrends = (platform: Platform = 'all', limit = 20) => {
  return useQuery({
    queryKey: ['trends', platform, limit],
    queryFn: async (): Promise<Trend[]> => {
      let query = supabase
        .from('trends')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit)

      if (platform !== 'all') {
        query = query.eq('platform', platform)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

export const useTrendsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['trends', 'category', category],
    queryFn: async (): Promise<Trend[]> => {
      const { data, error } = await supabase
        .from('trends')
        .select('*')
        .eq('category', category)
        .order('score', { ascending: false })
        .limit(10)

      if (error) throw error
      return data ?? []
    },
    enabled: !!category,
  })
}
