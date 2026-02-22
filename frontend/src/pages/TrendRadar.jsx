import React, { useState, useEffect } from 'react';
import { trendRadarAPI } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const MOCK_TRENDS = [
  { id: '1', name: '#MorningRoutine', category: 'Lifestyle', growth: '+234%', platform: 'tiktok', hashtags: ['#morning', '#routine', '#wellness'], sounds: ['Lo-fi Beats Vol.3'] },
  { id: '2', name: 'Get Ready With Me', category: 'Beauty', growth: '+187%', platform: 'tiktok', hashtags: ['#grwm', '#beauty', '#makeup'], sounds: ['Trending Audio 2024'] },
  { id: '3', name: '#FoodTok', category: 'Food', growth: '+156%', platform: 'tiktok', hashtags: ['#foodtok', '#recipe', '#cooking'], sounds: ['Kitchen Vibes'] },
  { id: '4', name: 'POV Aesthetic', category: 'Aesthetic', growth: '+143%', platform: 'instagram', hashtags: ['#pov', '#aesthetic', '#vibes'], sounds: ['Dreamy Pop'] },
  { id: '5', name: '#StudyWithMe', category: 'Education', growth: '+128%', platform: 'youtube', hashtags: ['#study', '#focus', '#lofi'], sounds: ['Study Lofi Mix'] },
  { id: '6', name: 'Day in My Life', category: 'Vlog', growth: '+112%', platform: 'tiktok', hashtags: ['#dayinmylife', '#vlog', '#lifestyle'], sounds: ['Upbeat Indie'] },
  { id: '7', name: '#WorkoutCheck', category: 'Fitness', growth: '+98%', platform: 'instagram', hashtags: ['#workout', '#gym', '#fitness'], sounds: ['Gym Motivation Beat'] },
  { id: '8', name: 'Outfit of the Day', category: 'Fashion', growth: '+91%', platform: 'tiktok', hashtags: ['#ootd', '#fashion', '#style'], sounds: ['Trendy Pop 2024'] },
];

const CATEGORY_COLORS = {
  Lifestyle: 'bg-blue-900/40 text-blue-400',
  Beauty: 'bg-pink-900/40 text-pink-400',
  Food: 'bg-orange-900/40 text-orange-400',
  Aesthetic: 'bg-purple-900/40 text-purple-400',
  Education: 'bg-green-900/40 text-green-400',
  Vlog: 'bg-yellow-900/40 text-yellow-400',
  Fitness: 'bg-red-900/40 text-red-400',
  Fashion: 'bg-fuchsia-900/40 text-fuchsia-400',
};

export default function TrendRadar() {
  const [platform, setPlatform] = useState('all');
  const [timeframe, setTimeframe] = useState('24h');
  const [trends, setTrends] = useState(MOCK_TRENDS);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await trendRadarAPI.getTrends(platform, timeframe);
      if (res.data?.trends?.length) setTrends(res.data.trends);
    } catch {
      // Use mock data on error
      setTrends(MOCK_TRENDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrends(); }, [platform, timeframe]);

  const filtered = platform === 'all' ? trends : trends.filter((t) => t.platform === platform);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">📡 TrendRadar</h1>
        <p className="text-muted mt-1">Discover trending sounds, hashtags, and content styles in real time.</p>
      </div>

      {/* Filter Bar */}
      <div className="card flex flex-wrap gap-4 items-center">
        <div>
          <span className="label">Platform</span>
          <div className="flex gap-2 mt-1">
            {['all', 'tiktok', 'instagram', 'youtube'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  platform === p
                    ? 'bg-primary text-white'
                    : 'bg-surface-hover text-muted hover:text-white border border-border'
                }`}
              >
                {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="label">Timeframe</span>
          <div className="flex gap-2 mt-1">
            {['24h', '7d', '30d'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === t
                    ? 'bg-secondary text-white'
                    : 'bg-surface-hover text-muted hover:text-white border border-border'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={fetchTrends}
          className="btn-primary mt-5 flex items-center gap-2"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : '🔄'} Refresh
        </button>
      </div>

      {/* Trends Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Scanning trends..." /></div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((trend) => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>
      )}
    </div>
  );
}

function TrendCard({ trend }) {
  const categoryClass = CATEGORY_COLORS[trend.category] || 'bg-gray-800 text-gray-400';
  return (
    <div className="card hover:border-primary/40 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg group-hover:text-primary transition-colors">
            {trend.name}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryClass}`}>
            {trend.category}
          </span>
        </div>
        <div className="text-right">
          <span className="text-green-400 font-bold text-lg">{trend.growth}</span>
          <p className="text-xs text-muted capitalize">{trend.platform}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <p className="text-xs text-muted mb-1 font-medium">Hashtags</p>
          <div className="flex flex-wrap gap-1">
            {trend.hashtags.map((h) => (
              <span key={h} className="text-xs bg-surface-hover border border-border px-2 py-0.5 rounded-full text-gray-300">
                {h}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted mb-1 font-medium">Trending Sound</p>
          <p className="text-sm text-gray-300">🎵 {trend.sounds[0]}</p>
        </div>
      </div>

      <a
        href="/idea-lab"
        className="w-full btn-primary text-sm text-center block py-2"
      >
        💡 Use in IdeaLab
      </a>
    </div>
  );
}
