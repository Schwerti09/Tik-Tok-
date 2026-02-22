import React from 'react';

export default function StatCard({ icon: Icon, label, value, change, color = 'violet' }) {
  const colorMap = {
    violet: 'from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400',
    pink:   'from-pink-600/20 to-pink-600/5 border-pink-500/20 text-pink-400',
    blue:   'from-blue-600/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    green:  'from-green-600/20 to-green-600/5 border-green-500/20 text-green-400',
  };
  const classes = colorMap[color] || colorMap.violet;

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${classes} border`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {change} diese Woche
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${classes}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
