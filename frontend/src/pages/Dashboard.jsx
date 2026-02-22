import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { formatNumber } from '../utils/helpers.js';

const stats = [
  { label: 'Total Views', value: 2_840_000, change: '+18.4%', icon: '👁️', color: 'from-blue-600 to-blue-400' },
  { label: 'Followers', value: 124_500, change: '+5.2%', icon: '❤️', color: 'from-primary to-pink-400' },
  { label: 'Engagement Rate', value: '8.7%', change: '+1.1%', icon: '📈', color: 'from-secondary to-purple-400', raw: true },
  { label: 'Scheduled Posts', value: 12, change: '3 today', icon: '📅', color: 'from-green-600 to-green-400', raw: true },
];

const recentActivity = [
  { text: 'Your video "Morning Routine" reached 50K views', time: '2 hours ago', icon: '🎉' },
  { text: 'New follower milestone: 120K!', time: '5 hours ago', icon: '🏆' },
  { text: 'Scheduled post published to TikTok', time: '8 hours ago', icon: '✅' },
  { text: 'AI idea generated for #FoodTok niche', time: '1 day ago', icon: '💡' },
  { text: 'ClipForge processed 3 videos', time: '2 days ago', icon: '✂️' },
];

const quickActions = [
  { label: 'Find Trends', to: '/trend-radar', icon: '📡', desc: 'Discover what\'s hot' },
  { label: 'Generate Idea', to: '/idea-lab', icon: '💡', desc: 'AI-powered concepts' },
  { label: 'Record Now', to: '/quick-capture', icon: '🎥', desc: 'Start capturing' },
  { label: 'Edit Clip', to: '/clip-forge', icon: '✂️', desc: 'Forge your content' },
  { label: 'Schedule Post', to: '/smart-scheduler', icon: '📅', desc: 'Plan your feed' },
  { label: 'View Analytics', to: '/analytics', icon: '📊', desc: 'Track performance' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'Creator';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent border border-primary/20 p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Good {getGreeting()}, {name}! 👋
        </h1>
        <p className="text-muted">Here's what's happening with your content today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-green-900/30 text-green-400`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stat.raw ? stat.value : formatNumber(stat.value)}
              </p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
            <div className={`h-1 rounded-full bg-gradient-to-r ${stat.color}`} />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-hover border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-center group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{action.icon}</span>
                <p className="text-sm font-semibold text-white">{action.label}</p>
                <p className="text-xs text-muted">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm text-gray-300">{item.text}</p>
                  <p className="text-xs text-muted mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Performance Overview</h2>
          <span className="text-xs text-muted bg-surface-hover px-3 py-1 rounded-full border border-border">Last 30 days</span>
        </div>
        <div className="h-48 flex flex-col items-center justify-center rounded-xl bg-surface-hover border border-dashed border-border">
          <span className="text-4xl mb-2">📊</span>
          <p className="text-muted text-sm font-medium">Interactive Charts – Coming Soon</p>
          <p className="text-xs text-muted mt-1">Connect your analytics to enable this feature</p>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
