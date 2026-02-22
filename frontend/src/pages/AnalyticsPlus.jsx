import React from 'react';
import { Eye, Heart, Users, BarChart2 } from 'lucide-react';
import StatCard from '../components/StatCard';

const stats = [
  { label: 'Videoaufrufe (30 Tage)', value: '481.2K', trend: 22,   icon: Eye,        color: 'brand'  },
  { label: 'Follower-Wachstum',      value: '+8.4K',  trend: 14.5, icon: Users,      color: 'accent' },
  { label: 'Avg. Watch Time',        value: '18.3 s', trend: 6.1,  icon: BarChart2,  color: 'brand'  },
  { label: 'Engagement-Rate',        value: '5.8 %',  trend: 0.9,  icon: Heart,      color: 'accent' },
];

const topVideos = [
  { title: 'Skincare Routine für Anfänger', views: '124K', likes: '9.2K' },
  { title: 'GRWM Morning Aesthetic',        views: '98K',  likes: '7.8K' },
  { title: 'Fashion Haul Sommer 2025',      views: '76K',  likes: '5.4K' },
  { title: 'Produktive Morgenroutine',      views: '64K',  likes: '4.9K' },
];

export default function AnalyticsPlus() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold gradient-text">Analytics+</h2>
        <p className="text-sm text-gray-500 mt-0.5">Performance-Überblick der letzten 30 Tage</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Top videos */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Top Videos</h3>
        <div className="divide-y divide-brand-50">
          {topVideos.map((v, i) => (
            <div key={v.title} className="py-3 flex items-center gap-3">
              <span className="text-sm font-bold text-brand-300 w-5 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{v.title}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                <span className="flex items-center gap-1"><Eye size={12} /> {v.views}</span>
                <span className="flex items-center gap-1"><Heart size={12} /> {v.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
