import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { UsageCard } from '@/components/dashboard/UsageCard'

// Dashboard-Übersichtsseite
const Dashboard: React.FC = () => {
  const { user } = useAuthStore()

  const quickActions = [
    { to: '/clipforge', icon: '🎬', title: 'ClipForge', desc: 'Video hochladen & schneiden' },
    { to: '/trends',   icon: '📈', title: 'TrendRadar', desc: 'Aktuelle Trends ansehen' },
    { to: '/ideas',    icon: '💡', title: 'Ideen generieren', desc: 'KI-Skript erstellen' },
    { to: '/schedule', icon: '📅', title: 'Scheduler', desc: 'Post planen' },
  ]

  return (
    <div className="space-y-8">
      {/* Begrüßung */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">
          Willkommen zurück{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
        </h1>
        <p className="text-gray-400 mt-1">Hier ist deine heutige Übersicht.</p>
      </div>

      {/* Nutzungskontingente */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UsageCard label="Videos diesen Monat" used={3} total={10} />
        <UsageCard label="KI-Ideen generiert" used={12} total={50} />
        <UsageCard label="Geplante Posts" used={5} total={20} />
        <UsageCard label="Speicherplatz" used={230} total={500} unit=" MB" />
      </div>

      {/* Schnellzugriff */}
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Schnellzugriff</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <Card className="hover:border-brand-600 hover:bg-brand-600/5 transition-colors cursor-pointer h-full">
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-semibold text-gray-200 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Hinweis auf fehlende Konfiguration */}
      <Card className="border-yellow-700/50 bg-yellow-900/10">
        <div className="flex items-start gap-3">
          <span className="text-yellow-400 text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-yellow-300 font-medium text-sm">Supabase-Konfiguration prüfen</p>
            <p className="text-yellow-400/70 text-xs mt-0.5">
              Stelle sicher, dass die Umgebungsvariablen VITE_SUPABASE_URL und
              VITE_SUPABASE_ANON_KEY gesetzt sind.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
