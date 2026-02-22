import React, { useState } from 'react';
import { TrendingUp, Play, Hash, Sparkles, RefreshCw, Filter } from 'lucide-react';
import TrendCard from '../components/TrendCard';
import { useTrends } from '../hooks/useTrends';
import toast from 'react-hot-toast';

const PLATFORMS = [
  { value: 'all',       label: 'Alle Plattformen' },
  { value: 'tiktok',    label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube',   label: 'YouTube' },
];

export default function TrendRadar() {
  const [activePlatform, setActivePlatform] = useState('all');
  const { trends, loading, refetch } = useTrends();

  const handleAnalyze = async () => {
    toast.loading('Trends werden analysiert...', { id: 'trends' });
    await refetch(activePlatform);
    toast.success('Trend-Analyse abgeschlossen!', { id: 'trends' });
  };

  const filter = (items) =>
    activePlatform === 'all' ? items : items.filter((i) => i.platform === activePlatform);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={20} className="text-violet-400" />
            <h1 className="text-2xl font-bold text-white">Trend Radar</h1>
          </div>
          <p className="text-gray-400 text-sm">Echtzeit-Trends auf TikTok, Instagram & YouTube</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <Filter size={14} className="text-gray-400 ml-2" />
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                onClick={() => setActivePlatform(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activePlatform === p.value
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={handleAnalyze} disabled={loading} className="btn-primary flex items-center gap-2 text-sm">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Analysieren
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trending Sounds */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-600/30 flex items-center justify-center">
              <Play size={14} className="text-pink-400" />
            </div>
            <h2 className="text-base font-bold text-white">Trending Sounds</h2>
          </div>
          <div className="space-y-2">
            {filter(trends.sounds || []).map((sound) => (
              <TrendCard
                key={sound.id}
                type="sound"
                name={sound.name}
                metric={sound.plays}
                subMetric="Plays"
                growth={sound.growth}
              />
            ))}
            {filter(trends.sounds || []).length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">Keine Sounds für diese Plattform</p>
            )}
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600/30 flex items-center justify-center">
              <Hash size={14} className="text-violet-400" />
            </div>
            <h2 className="text-base font-bold text-white">Trending Hashtags</h2>
          </div>
          <div className="space-y-2">
            {filter(trends.hashtags || []).map((tag) => (
              <TrendCard
                key={tag.id}
                type="hashtag"
                name={`#${tag.name}`}
                metric={tag.posts}
                subMetric={`${tag.engagement} Engagement`}
              />
            ))}
          </div>
        </div>

        {/* Trending Aesthetics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center">
              <Sparkles size={14} className="text-blue-400" />
            </div>
            <h2 className="text-base font-bold text-white">Trending Aesthetics</h2>
          </div>
          <div className="space-y-2">
            {filter(trends.aesthetics || []).map((ae) => (
              <div key={ae.id} className="glass-card p-4 hover:bg-white/10 transition-all">
                <p className="text-sm font-semibold text-white">{ae.name}</p>
                <p className="text-xs text-gray-400 mt-1">{ae.description}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-blue-600/20 border border-blue-500/20 text-xs text-blue-300 capitalize">
                  {ae.platform}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Score Banner */}
      <div className="glass-card p-5 bg-gradient-to-r from-violet-900/30 to-pink-900/20 border-violet-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold">🔥 Heißester Trend heute</h3>
            <p className="text-gray-300 text-sm mt-1">
              <span className="text-violet-400 font-semibold">#darkacademia</span> explodiert gerade mit +89% Wachstum –
              erstelle jetzt einen Trend-Video!
            </p>
          </div>
          <button className="btn-primary text-sm whitespace-nowrap flex items-center gap-2">
            <Sparkles size={14} /> Idee generieren
          </button>
        </div>
      </div>
    </div>
  );
}
