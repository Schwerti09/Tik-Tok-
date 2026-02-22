import React, { useState } from 'react';
import { Eye, Heart, Users, TrendingUp, Sparkles, Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';

const stats = [
  { label: 'Videoaufrufe (7 Tage)',  value: '124.8K', trend: 12.4, trendLabel: ' vs. letzte Woche', icon: Eye,       color: 'brand'  },
  { label: 'Neue Follower',           value: '2.341',  trend: 8.1,  trendLabel: ' vs. letzte Woche', icon: Users,     color: 'accent' },
  { label: 'Likes gesamt',            value: '18.9K',  trend: -2.3, trendLabel: ' vs. letzte Woche', icon: Heart,     color: 'brand'  },
  { label: 'Engagement-Rate',         value: '5.2 %',  trend: 0.4,  trendLabel: ' vs. letzte Woche', icon: TrendingUp,color: 'accent' },
];

const quickActions = [
  { label: 'Neues Video',   icon: Plus,      color: 'btn-primary' },
  { label: 'Trend finden',  icon: TrendingUp,color: 'btn-secondary' },
  { label: 'Idee generieren',icon: Sparkles, color: 'btn-secondary' },
];

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 p-5 sm:p-6 text-white">
        <h2 className="text-xl sm:text-2xl font-bold">Willkommen zurück! ✨</h2>
        <p className="mt-1 text-brand-100 text-sm sm:text-base">
          Dein Creator-Dashboard zeigt dir alles auf einen Blick.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all"
        >
          <Sparkles size={16} /> Schnellstart
        </button>
      </div>

      {/* Stats grid – 1 col mobile, 2 sm, 4 lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Schnellaktionen</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, icon: Icon, color }) => (
            <button key={label} className={`${color} flex items-center gap-2 text-sm`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick-start modal – Headless UI Dialog */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schnellstart – Was möchtest du tun?"
      >
        <div className="space-y-3">
          {quickActions.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setModalOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-brand-100 hover:bg-brand-50 text-brand-700 font-medium transition-colors text-sm"
            >
              <Icon size={16} className="text-brand-500" /> {label}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
