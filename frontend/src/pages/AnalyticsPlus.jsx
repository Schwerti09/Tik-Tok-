import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api.js';
import { formatNumber, formatDate } from '../utils/helpers.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const MOCK_KPI = [
  { label: 'Total Views', value: 2_840_000, prev: 2_400_000, icon: '👁️' },
  { label: 'Link Clicks', value: 84_200, prev: 70_000, icon: '🔗' },
  { label: 'Conversions', value: 3_120, prev: 2_800, icon: '💰' },
  { label: 'Revenue (UTM)', value: '$12,480', prev: '$10,200', icon: '💵', raw: true },
];

const MOCK_POSTS = [
  { title: 'Morning Routine 2024', platform: 'TikTok', views: 520000, clicks: 14200, ctr: '2.73%', date: '2024-01-15' },
  { title: 'Productivity System Deep Dive', platform: 'YouTube', views: 210000, clicks: 9800, ctr: '4.67%', date: '2024-01-12' },
  { title: 'OOTD – Minimal Winter Fit', platform: 'Instagram', views: 180000, clicks: 6200, ctr: '3.44%', date: '2024-01-10' },
  { title: 'Coffee Shop Study Vlog', platform: 'TikTok', views: 340000, clicks: 8900, ctr: '2.62%', date: '2024-01-08' },
  { title: 'How I Plan My Week', platform: 'Instagram', views: 95000, clicks: 5100, ctr: '5.37%', date: '2024-01-05' },
];

const SUGGESTIONS = [
  { icon: '🎯', text: 'Post between 6–9 PM on weekdays for 40% more reach on TikTok.' },
  { icon: '🎵', text: 'Your top-performing videos use trending audio — keep using sounds under 10K plays.' },
  { icon: '📝', text: 'Captions with a clear CTA ("Link in bio") drive 3x more clicks.' },
  { icon: '🔁', text: 'Repurpose your top YouTube video as a TikTok — it has high CTR potential.' },
];

function pctChange(curr, prev) {
  const change = ((curr - prev) / prev) * 100;
  return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
}

export default function AnalyticsPlus() {
  const [range, setRange] = useState('30d');
  const [kpi, setKpi] = useState(MOCK_KPI);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const end = new Date().toISOString().split('T')[0];
      const start = new Date(Date.now() - (range === '7d' ? 7 : range === '30d' ? 30 : 90) * 86400000).toISOString().split('T')[0];
      const res = await analyticsAPI.getAnalytics(start, end);
      if (res.data?.kpi) setKpi(res.data.kpi);
      if (res.data?.posts) setPosts(res.data.posts);
    } catch {
      setKpi(MOCK_KPI);
      setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [range]);

  const platformBadge = (p) => {
    if (p === 'TikTok') return 'bg-pink-900/40 text-pink-400';
    if (p === 'Instagram') return 'bg-purple-900/40 text-purple-400';
    return 'bg-red-900/40 text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">📊 Analytics+</h1>
          <p className="text-muted mt-1">Track your content performance across all platforms.</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                range === r ? 'bg-primary text-white' : 'bg-surface-hover text-muted border border-border hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Loading analytics..." /></div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpi.map((k) => (
              <div key={k.label} className="card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{k.icon}</span>
                  {!k.raw && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-900/30 text-green-400">
                      {pctChange(k.value, k.prev)}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-white">
                  {k.raw ? k.value : formatNumber(k.value)}
                </p>
                <p className="text-sm text-muted">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Posts Table */}
          <div className="card overflow-x-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Top Posts Performance</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3 text-muted font-medium">Post</th>
                  <th className="pb-3 text-muted font-medium">Platform</th>
                  <th className="pb-3 text-muted font-medium text-right">Views</th>
                  <th className="pb-3 text-muted font-medium text-right">Clicks</th>
                  <th className="pb-3 text-muted font-medium text-right">CTR</th>
                  <th className="pb-3 text-muted font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post, i) => (
                  <tr key={i} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3 text-white font-medium max-w-xs truncate pr-4">{post.title}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${platformBadge(post.platform)}`}>
                        {post.platform}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-300">{formatNumber(post.views)}</td>
                    <td className="py-3 text-right text-gray-300">{formatNumber(post.clicks)}</td>
                    <td className="py-3 text-right text-green-400 font-medium">{post.ctr}</td>
                    <td className="py-3 text-right text-muted">{formatDate(post.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Optimization Suggestions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">🤖 AI Optimization Suggestions</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {SUGGESTIONS.map((s, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-surface-hover border border-border">
                  <span className="text-2xl flex-shrink-0">{s.icon}</span>
                  <p className="text-sm text-gray-300">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
