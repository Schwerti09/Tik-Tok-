import React, { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Eye, Heart, Share2, MessageCircle, Clock, Zap } from 'lucide-react'
import { useAnalytics, useAnalyticsSummary } from '@/hooks/useAnalytics'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const COLORS = ['#ec4899', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b']

const MetricCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}> = ({ icon, label, value, color }) => (
  <div className="card p-4 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-neutral-400 text-xs">{label}</p>
      <p className="text-white font-bold text-xl">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  </div>
)

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'virality'>('overview')
  const { data: analytics, isLoading } = useAnalytics()
  const summary = useAnalyticsSummary()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Emotion data for pie chart (aggregate)
  const emotionData = analytics
    ?.filter((a) => a.emotion_data)
    .reduce(
      (acc, a) => {
        if (!a.emotion_data) return acc
        Object.entries(a.emotion_data).forEach(([key, val]) => {
          const existing = acc.find((e) => e.name === key)
          if (existing) existing.value += val
          else acc.push({ name: key, value: val })
        })
        return acc
      },
      [] as { name: string; value: number }[]
    ) ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-neutral-400 mt-1">Track your content performance</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          icon={<Eye size={18} className="text-blue-400" />}
          label="Total Views"
          value={summary.totalViews}
          color="bg-blue-500/10"
        />
        <MetricCard
          icon={<Heart size={18} className="text-pink-400" />}
          label="Total Likes"
          value={summary.totalLikes}
          color="bg-pink-500/10"
        />
        <MetricCard
          icon={<MessageCircle size={18} className="text-purple-400" />}
          label="Comments"
          value={summary.totalComments}
          color="bg-purple-500/10"
        />
        <MetricCard
          icon={<Share2 size={18} className="text-cyan-400" />}
          label="Shares"
          value={summary.totalShares}
          color="bg-cyan-500/10"
        />
        <MetricCard
          icon={<Clock size={18} className="text-yellow-400" />}
          label="Avg Watch Time"
          value={`${Math.round(summary.avgWatchTime)}s`}
          color="bg-yellow-500/10"
        />
        <MetricCard
          icon={<Zap size={18} className="text-green-400" />}
          label="Virality Score"
          value={summary.avgViralityScore.toFixed(1)}
          color="bg-green-500/10"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-neutral-900 p-1 rounded-xl w-fit">
        {(['overview', 'engagement', 'virality'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Charts */}
      {summary.chartData.length === 0 ? (
        <div className="card p-12 text-center">
          <Zap size={40} className="text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 font-medium">No analytics data yet</p>
          <p className="text-neutral-600 text-sm mt-1">
            Publish videos to start tracking performance
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views over time */}
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-white font-semibold mb-6">Views Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={summary.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="date" stroke="#525252" tick={{ fontSize: 12 }} />
                <YAxis stroke="#525252" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #262626',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement bar chart */}
          <div className="card p-6">
            <h3 className="text-white font-semibold mb-6">Engagement Breakdown</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={summary.chartData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="date" stroke="#525252" tick={{ fontSize: 11 }} />
                <YAxis stroke="#525252" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #262626',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="likes" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="shares" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Emotion distribution */}
          {emotionData.length > 0 && (
            <div className="card p-6">
              <h3 className="text-white font-semibold mb-6">Audience Emotions</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {emotionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111',
                      border: '1px solid #262626',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
