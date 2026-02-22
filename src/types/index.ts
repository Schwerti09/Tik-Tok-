export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_tier: 'free' | 'pro' | 'enterprise'
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  platform: Platform
  created_at: string
}

export interface Video {
  id: string
  user_id: string
  project_id: string | null
  title: string
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  status: VideoStatus
  platform: Platform
  published_at: string | null
  created_at: string
}

export interface Trend {
  id: string
  platform: Platform
  keyword: string
  score: number
  category: string
  created_at: string
}

export interface Idea {
  id: string
  user_id: string
  title: string
  description: string
  platform: Platform
  tags: string[]
  ai_generated: boolean
  created_at: string
}

export interface Schedule {
  id: string
  user_id: string
  video_id: string
  scheduled_at: string
  platform: Platform
  status: ScheduleStatus
  created_at: string
  video?: Video
}

export interface Analytics {
  id: string
  video_id: string
  views: number
  likes: number
  comments: number
  shares: number
  watch_time: number
  virality_score: number
  emotion_data: EmotionData | null
  recorded_at: string
  video?: Video
}

export interface CommunityPost {
  id: string
  user_id: string
  content: string
  likes: number
  comments_count: number
  created_at: string
  user?: User
}

export interface EmotionData {
  joy: number
  sadness: number
  anger: number
  fear: number
  surprise: number
  disgust: number
}

export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'all'
export type VideoStatus = 'draft' | 'processing' | 'published' | 'scheduled' | 'failed'
export type ScheduleStatus = 'pending' | 'published' | 'failed' | 'cancelled'

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}

export interface AnalyticsSummary {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  avgWatchTime: number
  avgViralityScore: number
  chartData: ChartDataPoint[]
}

export interface ChartDataPoint {
  date: string
  views: number
  likes: number
  shares: number
  comments: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
}
