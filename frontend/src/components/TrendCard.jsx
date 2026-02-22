import React from 'react';
import { TrendingUp, Hash, Music } from 'lucide-react';

export default function TrendCard({ type = 'hashtag', name, score, change }) {
  const icons = { hashtag: Hash, sound: Music, topic: TrendingUp };
  const Icon = icons[type] ?? Hash;

  return (
    <div className="glass-card p-4 flex items-center gap-3 hover:shadow-glow transition-shadow">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-brand-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-800 truncate">{name}</p>
        <p className="text-xs text-gray-500 mt-0.5">Score: {score}</p>
      </div>
      {change !== undefined && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          change >= 0
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-rose-50 text-rose-500'
        }`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
  );
}
