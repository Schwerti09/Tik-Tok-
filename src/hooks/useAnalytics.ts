import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Analytics, AnalyticsSummary, ChartDataPoint } from '@/types'

export const useAnalytics = (videoId?: string) => {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['analytics', user?.id, videoId],
    queryFn: async (): Promise<Analytics[]> => {
      let query = supabase
        .from('analytics')
        .select('*, video:videos(*)')
        .order('recorded_at', { ascending: false })

      if (videoId) {
        query = query.eq('video_id', videoId)
      } else {
        // Get analytics for all user videos
        const { data: userVideos } = await supabase
          .from('videos')
          .select('id')
          .eq('user_id', user!.id)

        const videoIds = userVideos?.map((v) => v.id) ?? []
        if (videoIds.length === 0) return []
        query = query.in('video_id', videoIds)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!user?.id,
  })
}

export const useAnalyticsSummary = () => {
  const { data: analytics } = useAnalytics()

  const summary: AnalyticsSummary = {
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    avgWatchTime: 0,
    avgViralityScore: 0,
    chartData: [],
  }

  if (!analytics || analytics.length === 0) return summary

  analytics.forEach((a) => {
    summary.totalViews += a.views
    summary.totalLikes += a.likes
    summary.totalComments += a.comments
    summary.totalShares += a.shares
    summary.avgWatchTime += a.watch_time
    summary.avgViralityScore += a.virality_score
  })

  summary.avgWatchTime = summary.avgWatchTime / analytics.length
  summary.avgViralityScore = summary.avgViralityScore / analytics.length

  // Build chart data (last 30 days)
  const byDate = new Map<string, ChartDataPoint>()
  analytics.forEach((a) => {
    const date = new Date(a.recorded_at).toISOString().split('T')[0]
    const existing = byDate.get(date) ?? {
      date,
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
    }
    existing.views += a.views
    existing.likes += a.likes
    existing.shares += a.shares
    existing.comments += a.comments
    byDate.set(date, existing)
  })

  summary.chartData = Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  )

  return summary
}
