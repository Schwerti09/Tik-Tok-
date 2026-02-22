import { useState } from 'react'
import { Search, X, Lightbulb, ExternalLink } from 'lucide-react'

const trends = [
  { id: 1, tag: '#AItools', category: 'Technologie', score: 98, growth: '+245%', views: '2.4M', desc: 'KI-Tools für Alltag und Produktivität explodieren gerade auf TikTok. Creator zeigen praktische Anwendungen.', examples: ['Ich habe 5 KI-Tools getestet', 'ChatGPT vs. Gemini', 'KI schreibt meinen Tag'] },
  { id: 2, tag: '#morningroutine', category: 'Lifestyle', score: 87, growth: '+120%', views: '1.8M', desc: 'Morgenroutinen sind ein Dauerbrenner. Besonders 5-Minuten-Routinen und "productive morning" performen.', examples: ['5 AM Morning Routine', 'Realistic Morning Routine', 'My productive morning'] },
  { id: 3, tag: '#productivity2025', category: 'Business', score: 82, growth: '+89%', views: '1.2M', desc: 'Produktivitätstipps für 2025 – Systeme, Apps, und Methoden die wirklich funktionieren.', examples: ['My productivity system', '10 Produktivitäts-Apps', 'Wie ich 8h in 4h schaffe'] },
  { id: 4, tag: '#howtoedit', category: 'Creator', score: 76, growth: '+67%', views: '980K', desc: 'Videobearbeitung lernen ist im Trend. CapCut Tutorials und "before/after" edits performen stark.', examples: ['CapCut Tutorial 2025', 'Before & After Edit', 'My editing setup'] },
  { id: 5, tag: '#sidehustle', category: 'Business', score: 71, growth: '+54%', views: '870K', desc: 'Nebeneinkommen und passive Einkommensquellen sind sehr gefragt. Authentische Erfolgsgeschichten performen.', examples: ['Mein Side Hustle macht 5K', 'Top 5 Side Hustles 2025', 'Wie ich online Geld verdiene'] },
  { id: 6, tag: '#cleaningtok', category: 'Home', score: 65, growth: '+43%', views: '760K', desc: 'Aufräumen und Organisieren – satisfying cleaning videos und "organizing my room" Inhalte.', examples: ['Deep Clean with me', 'Organizing my whole room', 'Speed clean challenge'] },
]

const categories = ['Alle', 'Technologie', 'Lifestyle', 'Business', 'Creator', 'Home']

export default function TrendRadarPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Alle')
  const [selected, setSelected] = useState(null)

  const filtered = trends.filter(t =>
    (category === 'Alle' || t.category === category) &&
    t.tag.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">TrendRadar</h1>
        <p className="text-gray-400 mt-1">Entdecke virale Trends bevor sie groß werden</p>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Trends suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category === cat ? 'bg-pink-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((trend) => (
          <div
            key={trend.id}
            onClick={() => setSelected(trend)}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-6 cursor-pointer hover:border-pink-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-bold text-lg">{trend.tag}</div>
                <div className="text-gray-500 text-xs mt-1">{trend.category}</div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-medium text-sm">{trend.growth}</div>
                <div className="text-gray-500 text-xs">{trend.views} Views</div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Trend-Score</span>
                <span>{trend.score}/100</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-pink-600 to-violet-600"
                  style={{ width: `${trend.score}%` }}
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">{trend.desc}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-lg w-full">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selected.tag}</h2>
                <span className="text-gray-400 text-sm">{selected.category} · {selected.views} Views · {selected.growth}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Trend-Score</span><span>{selected.score}/100</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-pink-600 to-violet-600" style={{ width: `${selected.score}%` }} />
              </div>
            </div>
            <p className="text-gray-300 mb-6">{selected.desc}</p>
            <div className="mb-6">
              <h3 className="font-medium text-sm text-gray-400 mb-3">Beispiel-Videos</h3>
              <div className="space-y-2">
                {selected.examples.map((ex) => (
                  <div key={ex} className="flex items-center gap-2 text-sm text-gray-300">
                    <ExternalLink size={14} className="text-gray-500" />
                    {ex}
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-medium transition-colors flex items-center justify-center gap-2">
              <Lightbulb size={16} />
              Idee generieren
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
