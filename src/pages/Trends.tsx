import React, { useState } from 'react'
import { TrendingUp, Flame, Hash } from 'lucide-react'
import { useTrends } from '@/hooks/useTrends'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Platform } from '@/types'

const platformColors: Record<string, string> = {
  tiktok: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  instagram: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  youtube: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export const Trends: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('all')
  const { data: trends, isLoading } = useTrends(selectedPlatform, 30)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Trending Now</h1>
          <p className="text-neutral-400 mt-1">Discover what's going viral across platforms</p>
        </div>

        {/* Platform filter */}
        <div className="flex gap-2 bg-neutral-900 p-1 rounded-xl">
          {(['all', 'tiktok', 'instagram', 'youtube'] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                selectedPlatform === p
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : !trends || trends.length === 0 ? (
        <div className="card p-12 text-center">
          <TrendingUp size={40} className="text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 font-medium">No trends data available</p>
          <p className="text-neutral-600 text-sm mt-1">
            Trends are refreshed every 15 minutes
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.map((trend, idx) => (
            <div
              key={trend.id}
              className="card p-5 hover:border-neutral-700 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-400 flex-shrink-0">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                        platformColors[trend.platform] ?? 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {trend.platform}
                    </span>
                    <span className="text-xs text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded-full capitalize">
                      {trend.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Hash size={14} className="text-pink-400 flex-shrink-0" />
                    <p className="text-white font-semibold truncate group-hover:text-pink-300 transition-colors">
                      {trend.keyword}
                    </p>
                  </div>

                  {/* Score bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-neutral-800 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-cyan-400 h-1.5 rounded-full"
                        style={{ width: `${Math.min(trend.score, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-orange-400 font-medium">
                      <Flame size={12} />
                      {trend.score.toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
