import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, trend, trendLabel, icon: Icon, color = 'brand' }) {
  const colorMap = {
    brand:  { bg: 'bg-brand-50',  text: 'text-brand-600',  icon: 'text-brand-500' },
    accent: { bg: 'bg-accent-50', text: 'text-accent-600', icon: 'text-accent-500' },
  };
  const c = colorMap[color] ?? colorMap.brand;
  const isPositive = trend >= 0;

  return (
    <div className="glass-card p-4 sm:p-5 flex items-start gap-4">
      {Icon && (
        <div className={`${c.bg} p-3 rounded-xl flex-shrink-0`}>
          <Icon size={20} className={c.icon} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{label}</p>
        <p className={`text-xl sm:text-2xl font-bold ${c.text} mt-0.5`}>{value}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{isPositive ? '+' : ''}{trend}%</span>
            {trendLabel && <span className="text-gray-400 font-normal">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
