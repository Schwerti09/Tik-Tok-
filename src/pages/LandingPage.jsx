import { useNavigate } from 'react-router-dom'
import { TrendingUp, Lightbulb, Video, Scissors, Calendar, BarChart2, Check, Zap, Star, Building2 } from 'lucide-react'

const features = [
  { icon: TrendingUp, title: 'TrendRadar', desc: 'Entdecke virale Trends bevor sie groß werden.' },
  { icon: Lightbulb, title: 'IdeaLab', desc: 'KI-gestützte Ideen für deinen nächsten Viral-Hit.' },
  { icon: Video, title: 'QuickCapture', desc: 'Direkt aufnehmen mit Teleprompter & Webcam.' },
  { icon: Scissors, title: 'ClipForge', desc: 'Automatisches Schneiden & Bearbeiten deiner Videos.' },
  { icon: Calendar, title: 'Scheduler', desc: 'Plane und automatisiere deine Veröffentlichungen.' },
  { icon: BarChart2, title: 'Analytics', desc: 'Tiefe Einblicke in deine Performance & Sales.' },
]

const plans = [
  {
    icon: Zap,
    name: 'Free',
    price: '0€',
    period: '/Monat',
    features: ['5 Clips/Monat', 'TrendRadar (Basis)', 'IdeaLab (3 Ideen/Tag)', 'Community-Zugang'],
    cta: 'Jetzt starten',
    highlight: false,
  },
  {
    icon: Star,
    name: 'Pro',
    price: '29€',
    period: '/Monat',
    features: ['50 Clips/Monat', 'TrendRadar (Vollzugang)', 'Unbegrenzte Ideen', 'QuickCapture & ClipForge', 'Scheduler', 'Analytics'],
    cta: 'Pro wählen',
    highlight: true,
  },
  {
    icon: Building2,
    name: 'Business',
    price: '99€',
    period: '/Monat',
    features: ['Unbegrenzte Clips', 'Alle Pro-Features', 'Team-Verwaltung', 'Prioritäts-Support', 'Custom Branding', 'API-Zugang'],
    cta: 'Business wählen',
    highlight: false,
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">TikForge</span>
        <div className="flex gap-4">
          <button onClick={() => navigate('/auth')} className="text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">Anmelden</button>
          <button onClick={() => navigate('/auth')} className="text-sm px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 font-medium transition-colors">Kostenlos starten</button>
        </div>
      </nav>

      <section className="text-center py-24 px-4">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-pink-600/20 text-pink-400 text-xs font-medium border border-pink-600/30">
          🚀 KI-gestützte Content-Erstellung
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Dein KI-gestütztes<br />TikTok Studio
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Von der Trend-Erkennung bis zur automatischen Clip-Erstellung – alles in einer Plattform.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => navigate('/auth')} className="px-8 py-4 rounded-xl bg-pink-600 hover:bg-pink-700 font-semibold text-lg transition-colors shadow-lg shadow-pink-600/30">
            Kostenlos starten
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-8 py-4 rounded-xl border border-gray-700 hover:bg-gray-800 font-semibold text-lg transition-colors">
            Demo ansehen
          </button>
        </div>
      </section>

      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Alles was du brauchst</h2>
        <p className="text-gray-400 text-center mb-12">Eine vollständige Suite für TikTok-Creator</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-pink-600/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 flex items-center justify-center mb-4">
                <Icon size={20} className="text-pink-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Transparente Preise</h2>
        <p className="text-gray-400 text-center mb-12">Wähle den Plan der zu dir passt</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(({ icon: Icon, name, price, period, features, cta, highlight }) => (
            <div key={name} className={`p-8 rounded-2xl border ${highlight ? 'border-pink-500 bg-pink-600/10' : 'border-gray-800 bg-gray-900'} relative`}>
              {highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-pink-600 rounded-full text-xs font-medium">Beliebtester Plan</div>}
              <Icon size={24} className={highlight ? 'text-pink-400 mb-4' : 'text-gray-400 mb-4'} />
              <h3 className="text-xl font-bold mb-1">{name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{price}</span>
                <span className="text-gray-400">{period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={16} className="text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/auth')}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${highlight ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                {cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-8 text-center text-gray-500 text-sm">
        <p>© 2025 TikForge. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  )
}
