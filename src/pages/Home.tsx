import React from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Upload,
  BarChart2,
  Lightbulb,
  Play,
  Eye,
  Heart,
  Share2,
  ArrowUpRight,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useVideos } from '@/hooks/useVideos'
import { useAnalyticsSummary } from '@/hooks/useAnalytics'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const StatCard: React.FC<{
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  color: string
}> = ({ label, value, icon, trend, color }) => (
  <div className="card p-5 flex items-start gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-neutral-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold mt-0.5">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {trend !== undefined && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <ArrowUpRight size={12} className={trend < 0 ? 'rotate-180' : ''} />
          {Math.abs(trend)}% from last week
        </p>
      )}
    </div>
  </div>
)

export const Home: React.FC = () => {
  const { user } = useAuthStore()
  const { data: videos, isLoading: videosLoading } = useVideos()
  const summary = useAnalyticsSummary()

  const recentVideos = videos?.slice(0, 4) ?? []

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Creator'} 👋
          </h1>
          <p className="text-neutral-400 mt-1">
            Here's what's happening with your content today.
          </p>
        </div>
        <Link to="/upload">
          <Button leftIcon={<Upload size={16} />}>Upload Video</Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Views"
          value={summary.totalViews}
          icon={<Eye size={18} className="text-blue-400" />}
          color="bg-blue-500/10"
          trend={12}
        />
        <StatCard
          label="Total Likes"
          value={summary.totalLikes}
          icon={<Heart size={18} className="text-pink-400" />}
          color="bg-pink-500/10"
          trend={8}
        />
        <StatCard
          label="Total Shares"
          value={summary.totalShares}
          icon={<Share2 size={18} className="text-purple-400" />}
          color="bg-purple-500/10"
          trend={-3}
        />
        <StatCard
          label="Videos Published"
          value={videos?.filter((v) => v.status === 'published').length ?? 0}
          icon={<Play size={18} className="text-green-400" />}
          color="bg-green-500/10"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            to: '/trends',
            icon: TrendingUp,
            title: 'Explore Trends',
            desc: 'Discover what\'s trending on TikTok, Instagram, and YouTube',
            color: 'from-orange-500/20 to-yellow-500/10 border-orange-500/20',
            iconColor: 'text-orange-400',
          },
          {
            to: '/ideas',
            icon: Lightbulb,
            title: 'Generate Ideas',
            desc: 'Use AI to generate viral content ideas for your niche',
            color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/20',
            iconColor: 'text-cyan-400',
          },
          {
            to: '/analytics',
            icon: BarChart2,
            title: 'View Analytics',
            desc: 'Track performance metrics and virality scores',
            color: 'from-purple-500/20 to-pink-500/10 border-purple-500/20',
            iconColor: 'text-purple-400',
          },
        ].map(({ to, icon: Icon, title, desc, color, iconColor }) => (
          <Link key={to} to={to}>
            <div
              className={`card bg-gradient-to-br ${color} border p-5 hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <Icon size={24} className={`${iconColor} mb-3`} />
              <h3 className="text-white font-semibold mb-1">{title}</h3>
              <p className="text-neutral-400 text-sm">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent videos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Videos</h2>
          <Link to="/upload" className="text-pink-400 hover:text-pink-300 text-sm transition-colors">
            View all →
          </Link>
        </div>

        {videosLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : recentVideos.length === 0 ? (
          <div className="card p-12 text-center">
            <Play size={40} className="text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 font-medium">No videos yet</p>
            <p className="text-neutral-600 text-sm mt-1 mb-4">
              Upload your first video to get started
            </p>
            <Link to="/upload">
              <Button size="sm">Upload Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentVideos.map((video) => (
              <div key={video.id} className="card overflow-hidden group cursor-pointer hover:border-neutral-700 transition-colors">
                <div className="aspect-video bg-neutral-800 relative overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play size={32} className="text-neutral-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        video.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : video.status === 'draft'
                          ? 'bg-neutral-700 text-neutral-300'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {video.status}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-medium truncate">{video.title}</p>
                  <p className="text-neutral-500 text-xs mt-1 capitalize">{video.platform}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
