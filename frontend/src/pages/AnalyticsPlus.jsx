import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Heart, Users, DollarSign, TrendingUp, Link2, Copy, Lightbulb } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const MOCK_ANALYTICS = {
  totalViews:      1248000,
  totalLikes:      89400,
  totalFollowers:  34200,
  estimatedRevenue: 1847.50,
  topPosts: [
    { title: '5-Minuten Morgen-Routine', views: 245000, likes: 18200, platform: 'tiktok' },
    { title: 'Produktivitäts-Hack #3',   views: 187000, likes: 14100, platform: 'instagram' },
    { title: 'Warum du früher aufstehen solltest', views: 156000, likes: 12400, platform: 'youtube' },
    { title: 'Mein Work-From-Home Setup', views: 134000, likes: 9800,  platform: 'tiktok' },
  ],
  suggestions: [
    'Poste öfter zwischen 18–21 Uhr für +23% mehr Reichweite',
    'Nutze mehr Duett-Features auf TikTok – dein Engagement steigt um 34%',
    'Längere Untertitel führen zu +18% mehr Engagement bei deiner Zielgruppe',
    'Antworte auf die ersten 20 Kommentare innerhalb der ersten Stunde',
  ],
};

function formatNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function AnalyticsPlus() {
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS);
  const [utmBase,   setUtmBase]   = useState('https://meinprofil.link/bio');
  const [utmCampaign, setUtmCampaign] = useState('tiktok-bio');
  const [utmLink,   setUtmLink]   = useState('');

  useEffect(() => {
    api.get('/analytics').then(({ data }) => setAnalytics(data)).catch(() => {});
  }, []);

  const buildUtm = () => {
    const url = new URL(utmBase.startsWith('http') ? utmBase : `https://${utmBase}`);
    url.searchParams.set('utm_source', 'tiktok');
    url.searchParams.set('utm_medium', 'bio');
    url.searchParams.set('utm_campaign', utmCampaign);
    setUtmLink(url.toString());
  };

  const copyUtm = () => {
    navigator.clipboard.writeText(utmLink);
    toast.success('Link kopiert!');
  };

  const stats = [
    { icon: Eye,        label: 'Gesamte Views',    value: formatNum(analytics.totalViews),      color: 'violet' },
    { icon: Heart,      label: 'Gesamte Likes',    value: formatNum(analytics.totalLikes),      color: 'pink' },
    { icon: Users,      label: 'Follower',         value: formatNum(analytics.totalFollowers),  color: 'blue' },
    { icon: DollarSign, label: 'Geschätzte Einnahmen', value: `€${analytics.estimatedRevenue?.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`, color: 'green' },
  ];

  const colorMap = { violet: 'text-violet-400 bg-violet-600/20 border-violet-500/20', pink: 'text-pink-400 bg-pink-600/20 border-pink-500/20', blue: 'text-blue-400 bg-blue-600/20 border-blue-500/20', green: 'text-green-400 bg-green-600/20 border-green-500/20' };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={20} className="text-orange-400" />
          <h1 className="text-2xl font-bold text-white">Analytics+</h1>
        </div>
        <p className="text-gray-400 text-sm">Performance-Übersicht & Optimierungsempfehlungen</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`glass-card p-5 border ${colorMap[color]}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
              </div>
              <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Posts */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-400" />
            <h2 className="text-base font-semibold text-white">Top Posts</h2>
          </div>
          <div className="space-y-3">
            {analytics.topPosts?.map((post, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all">
                <span className="text-lg font-black text-gray-600 w-6 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={10} /> {formatNum(post.views)}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Heart size={10} /> {formatNum(post.likes)}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10 capitalize">{post.platform}</span>
                  </div>
                </div>
                <div className="w-20">
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-pink-500 h-1.5 rounded-full"
                      style={{ width: `${(post.views / analytics.topPosts[0].views) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UTM Builder + Suggestions */}
        <div className="space-y-4">
          {/* UTM Builder */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-pink-400" />
              <h2 className="text-base font-semibold text-white">UTM-Link Builder</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Basis-URL</label>
                <input value={utmBase} onChange={(e) => setUtmBase(e.target.value)} className="input-field text-sm" placeholder="https://deine-website.de" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Kampagne</label>
                <input value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} className="input-field text-sm" placeholder="tiktok-bio" />
              </div>
              <button onClick={buildUtm} className="btn-primary text-sm w-full flex items-center justify-center gap-2 py-2">
                <Link2 size={14} /> UTM-Link generieren
              </button>
              {utmLink && (
                <div className="flex gap-2">
                  <input value={utmLink} readOnly className="input-field text-xs flex-1" />
                  <button onClick={copyUtm} className="btn-secondary px-3 flex-shrink-0">
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-yellow-400" />
              <h2 className="text-base font-semibold text-white">KI-Empfehlungen</h2>
            </div>
            <div className="space-y-2">
              {analytics.suggestions?.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 bg-yellow-600/5 border border-yellow-500/10 rounded-xl">
                  <span className="text-yellow-400 mt-0.5 flex-shrink-0">💡</span>
                  <p className="text-sm text-gray-300">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
