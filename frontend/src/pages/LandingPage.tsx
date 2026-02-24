import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

// Landing-Page für nicht angemeldete Benutzer
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-brand-950">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="font-bold text-xl text-white">TikFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="sm">Anmelden</Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button variant="primary" size="sm">Kostenlos starten</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 py-24 text-center">
        <span className="inline-block bg-brand-600/20 text-brand-400 text-xs font-semibold
          px-3 py-1 rounded-full uppercase tracking-wider mb-6">
          Creator-KI-Platform
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Erstelle viralen Content –{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
            automatisch
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          TikFlow nutzt KI, um deine Videos zu schneiden, Trends zu erkennen und
          den optimalen Veröffentlichungszeitpunkt zu finden.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth?tab=register">
            <Button variant="primary" size="lg">
              Jetzt starten – kostenlos
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="secondary" size="lg">
              Preise ansehen
            </Button>
          </Link>
        </div>

        {/* Feature-Karten */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {[
            { icon: '🎬', title: 'ClipForge', desc: 'KI schneidet automatisch die besten Clips aus deinen Roh-Aufnahmen.' },
            { icon: '📈', title: 'TrendRadar', desc: 'Echtzeit-Trends erkennen und als erster auf neue Sounds aufspringen.' },
            { icon: '💡', title: 'IdeaEngine', desc: 'Generiere vollständige Video-Skripte basierend auf aktuellen Trends.' },
          ].map((feat) => (
            <div key={feat.title} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 text-left">
              <div className="text-3xl mb-3">{feat.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-800/50 mt-12">
        © {new Date().getFullYear()} TikFlow – Alle Rechte vorbehalten
      </footer>
    </div>
  )
}

export default LandingPage
