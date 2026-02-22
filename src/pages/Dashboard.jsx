import { Video, Eye, TrendingUp, Lightbulb, ArrowUpRight, Play, Clock } from 'lucide-react'

const colorClasses = {
  pink: { bg: 'bg-pink-600/20', text: 'text-pink-400' },
  violet: { bg: 'bg-violet-600/20', text: 'text-violet-400' },
  blue: { bg: 'bg-blue-600/20', text: 'text-blue-400' },
  amber: { bg: 'bg-amber-600/20', text: 'text-amber-400' },
}

const stats = [
  { icon: Video, label: 'Clips diesen Monat', value: '12', max: '50', change: '+3', color: 'pink' },
  { icon: Eye, label: 'Gesamte Views', value: '48.2K', change: '+12%', color: 'violet' },
  { icon: TrendingUp, label: 'Trends erkannt', value: '24', change: '+8', color: 'blue' },
  { icon: Lightbulb, label: 'Gespeicherte Ideen', value: '31', change: '+5', color: 'amber' },
]

const recentClips = [
  { id: 1, title: 'Morning Routine 2025', status: 'published', views: '12.4K', date: '20. Feb' },
  { id: 2, title: 'KI Tools für Creator', status: 'scheduled', views: '–', date: '22. Feb' },
  { id: 3, title: 'Produktivitäts-Hacks', status: 'processing', views: '–', date: '21. Feb' },
  { id: 4, title: '5 Fehler vermeiden', status: 'draft', views: '–', date: '19. Feb' },
]

const trends = [
  { tag: '#AItools', score: 98, growth: '+245%' },
  { tag: '#morningroutine', score: 87, growth: '+120%' },
  { tag: '#productivity2025', score: 82, growth: '+89%' },
  { tag: '#howtoedit', score: 76, growth: '+67%' },
]

const statusColors = {
  published: 'bg-green-600/20 text-green-400',
  scheduled: 'bg-blue-600/20 text-blue-400',
  processing: 'bg-amber-600/20 text-amber-400',
  draft: 'bg-gray-600/20 text-gray-400',
}

const statusLabels = {
  published: 'Veröffentlicht',
  scheduled: 'Geplant',
  processing: 'Verarbeitung',
  draft: 'Entwurf',
}

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Willkommen zurück! Hier ist deine Übersicht.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, change, color }) => (
          <div key={label} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className={`w-10 h-10 rounded-xl ${colorClasses[color].bg} flex items-center justify-center mb-4`}>
              <Icon size={20} className={colorClasses[color].text} />
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-gray-400 text-sm mb-2">{label}</div>
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <ArrowUpRight size={12} />
              {change}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-medium">Monatliches Kontingent</div>
            <div className="text-gray-400 text-sm">12 von 50 Clips verwendet</div>
          </div>
          <span className="text-sm text-gray-400">24%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="bg-pink-600 h-2 rounded-full" style={{ width: '24%' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Letzte Clips</h2>
            <button className="text-pink-400 text-sm hover:underline">Alle ansehen</button>
          </div>
          <div className="space-y-4">
            {recentClips.map((clip) => (
              <div key={clip.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Play size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{clip.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[clip.status]}`}>
                      {statusLabels[clip.status]}
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock size={10} /> {clip.date}
                    </span>
                  </div>
                </div>
                {clip.views !== '–' && (
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <Eye size={12} /> {clip.views}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Aktuelle Trends</h2>
            <button className="text-pink-400 text-sm hover:underline">TrendRadar öffnen</button>
          </div>
          <div className="space-y-4">
            {trends.map((trend, i) => (
              <div key={trend.tag} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-medium flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{trend.tag}</div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                    <div className="bg-pink-600 h-1.5 rounded-full" style={{ width: `${trend.score}%` }} />
                  </div>
                </div>
                <div className="text-green-400 text-xs font-medium">{trend.growth}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
