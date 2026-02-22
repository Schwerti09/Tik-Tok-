import React from 'react';
import { TrendingUp, Hash, Play } from 'lucide-react';

export default function TrendCard({ type, name, metric, subMetric, growth }) {
  const icons = { sound: Play, hashtag: Hash, aesthetic: TrendingUp };
  const Icon = icons[type] || TrendingUp;

  return (
    <div className="glass-card p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-pink-600/30 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon size={18} className="text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate">{subMetric}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-white">{metric}</p>
          {growth && (
            <p className="text-xs text-green-400">+{growth}%</p>
          )}
        </div>
      </div>
    </div>
  );
}
