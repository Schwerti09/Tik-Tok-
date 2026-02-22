import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Lightbulb, Calendar, Users, Video, Scissors, BarChart3, ArrowRight, Zap, Star, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';

const recentActivity = [
  { icon: TrendingUp, text: 'Neuer Trend erkannt: #darkacademia wächst 34%',  time: 'vor 5 Min.',  color: 'text-violet-400' },
  { icon: Lightbulb,  text: '3 neue Ideen für "Fitness Motivation" generiert', time: 'vor 20 Min.', color: 'text-pink-400' },
  { icon: Calendar,   text: 'Post für Instagram erfolgreich eingeplant',       time: 'vor 1 Std.',  color: 'text-blue-400' },
  { icon: Star,       text: 'Dein Video erreichte 10K Views – Glückwunsch!',  time: 'vor 2 Std.',  color: 'text-yellow-400' },
  { icon: Users,      text: 'Neues Community-Mitglied: @max_creates',          time: 'vor 3 Std.',  color: 'text-green-400' },
];

const quickActions = [
  { to: '/trendradar',   icon: TrendingUp, label: 'Trends analysieren', color: 'from-violet-600 to-violet-700' },
  { to: '/idealab',      icon: Lightbulb,  label: 'Idee generieren',    color: 'from-pink-600 to-pink-700' },
  { to: '/quickcapture', icon: Video,      label: 'Video aufnehmen',    color: 'from-blue-600 to-blue-700' },
  { to: '/clipforge',    icon: Scissors,   label: 'Clip bearbeiten',    color: 'from-cyan-600 to-cyan-700' },
  { to: '/scheduler',    icon: Calendar,   label: 'Post planen',        color: 'from-green-600 to-green-700' },
  { to: '/analytics',    icon: BarChart3,  label: 'Analytics öffnen',   color: 'from-orange-600 to-orange-700' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/50 to-pink-900/30 border border-violet-500/20 p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-pink-600/10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-sm text-violet-300 font-medium">Creator Betriebssystem</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black gradient-text leading-tight">
            TikFlow – Das Creator-Betriebssystem
          </h1>
          <p className="text-gray-300 mt-3 max-w-xl">
            Alles was du als Content Creator brauchst: Trends, Ideen, Aufnahme, Planung und Analytics – alles an einem Ort.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => navigate('/trendradar')} className="btn-primary flex items-center gap-2">
              <TrendingUp size={16} /> Trends entdecken <ArrowRight size={14} />
            </button>
            <button onClick={() => navigate('/idealab')} className="btn-secondary flex items-center gap-2">
              <Lightbulb size={16} /> Idee generieren
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Aktive Trends"       value="247"   change="+12"  color="violet" />
        <StatCard icon={Lightbulb}  label="Ideen generiert"     value="1.2K"  change="+38"  color="pink"   />
        <StatCard icon={Calendar}   label="Videos geplant"      value="14"    change="+3"   color="blue"   />
        <StatCard icon={Users}      label="Community Mitglieder" value="8.4K" change="+124" color="green"  />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Schnellzugriff</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map(({ to, icon: Icon, label, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="glass-card p-4 text-center hover:bg-white/10 transition-all duration-200 group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-xs text-gray-300 font-medium leading-tight">{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Letzte Aktivitäten</h2>
          <div className="glass-card divide-y divide-white/5">
            {recentActivity.map(({ icon: Icon, text, time, color }, i) => (
              <div key={i} className="flex items-start gap-3 p-4 hover:bg-white/5 transition-all">
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 leading-snug">{text}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={11} className="text-gray-500" />
                    <span className="text-xs text-gray-500">{time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Preview */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Diese Woche</h2>
          <div className="glass-card p-5 space-y-4">
            {[
              { label: 'Views',      value: '42.8K', pct: 78, color: 'bg-violet-500' },
              { label: 'Likes',      value: '3.2K',  pct: 62, color: 'bg-pink-500' },
              { label: 'Follower+',  value: '+847',  pct: 45, color: 'bg-blue-500' },
              { label: 'Einnahmen',  value: '€124',  pct: 33, color: 'bg-green-500' },
            ].map(({ label, value, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className={`${color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
