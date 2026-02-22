import { useState } from 'react'
import { Lightbulb, Wand2, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'

const mockIdeas = [
  {
    id: 1,
    title: '5 KI-Tools die deinen Workflow 10x schneller machen',
    hook: '"Ich spare täglich 3 Stunden mit diesen Tools – hier ist wie:"',
    outline: ['Problem: Zeitverschwendung bei repetitiven Aufgaben', 'Tool 1: Notion AI für Notizen', 'Tool 2: ChatGPT für Texte', 'Tool 3: Midjourney für Bilder', 'CTA: Link in Bio für die vollständige Liste'],
  },
  {
    id: 2,
    title: 'Meine ehrliche Morning Routine als Creator',
    hook: '"Ich bin kein 5 AM Mensch – aber das mache ich stattdessen:"',
    outline: ['Authentischer Start: kein perfekter Wake-up', 'Was wirklich funktioniert: 3 Dinge', 'Mein Geheimnis für kreative Energy', 'Realistische Erwartungen setzen'],
  },
]

export default function IdeaLabPage() {
  const [topic, setTopic] = useState('')
  const [format, setFormat] = useState('short')
  const [tone, setTone] = useState('lehrreich')
  const [generating, setGenerating] = useState(false)
  const [ideas, setIdeas] = useState([])
  const [saved, setSaved] = useState(mockIdeas)
  const [savedIds, setSavedIds] = useState(new Set())

  const handleGenerate = () => {
    if (!topic.trim()) return
    setGenerating(true)
    setTimeout(() => {
      setIdeas([
        {
          id: crypto.randomUUID(),
          title: `${topic}: Der ultimative Guide für 2025`,
          hook: `"Niemand redet darüber, aber ${topic} verändert gerade alles:"`,
          outline: ['Überraschender Einstieg mit Statistik', 'Problem-Agitation: Warum das wichtig ist', 'Deine Lösung in 3 Schritten', 'Social Proof / Ergebnis', 'CTA: Folge für mehr'],
        },
        {
          id: crypto.randomUUID(),
          title: `Ich habe ${topic} 30 Tage ausprobiert – das Ergebnis`,
          hook: `"30 Tage ${topic} – war es das wert? Meine ehrliche Meinung:"`,
          outline: ['Ausgangssituation', 'Die Regeln meines Experiments', 'Woche 1-2: Erste Erkenntnisse', 'Woche 3-4: Das Überraschende', 'Fazit und Empfehlung'],
        },
      ])
      setGenerating(false)
    }, 1500)
  }

  const toggleSave = (idea) => {
    if (savedIds.has(idea.id)) {
      setSavedIds(prev => { const s = new Set(prev); s.delete(idea.id); return s })
      setSaved(prev => prev.filter(i => i.id !== idea.id))
    } else {
      setSavedIds(prev => new Set([...prev, idea.id]))
      setSaved(prev => [idea, ...prev])
    }
  }

  const IdeaCard = ({ idea, showSave = true }) => (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-semibold text-lg leading-tight">{idea.title}</h3>
        {showSave && (
          <button onClick={() => toggleSave(idea)} className="text-gray-400 hover:text-pink-400 flex-shrink-0 transition-colors">
            {savedIds.has(idea.id) ? <BookmarkCheck size={20} className="text-pink-400" /> : <Bookmark size={20} />}
          </button>
        )}
      </div>
      <div className="bg-gray-800 rounded-xl p-4 mb-4">
        <div className="text-xs text-gray-400 mb-1 font-medium">HOOK</div>
        <div className="text-gray-200 text-sm italic">{idea.hook}</div>
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-2 font-medium">GLIEDERUNG</div>
        <ol className="space-y-1">
          {idea.outline.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-pink-500 font-medium text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">IdeaLab</h1>
        <p className="text-gray-400 mt-1">KI-gestützte Ideen für deinen nächsten Viral-Hit</p>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
        <h2 className="font-semibold text-lg mb-6">Idee generieren</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-1">
            <label className="block text-sm text-gray-400 mb-2">Thema</label>
            <input
              type="text"
              placeholder="z.B. Produktivität, KI-Tools..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
            >
              <option value="short">Short-Form (15-60s)</option>
              <option value="long">Long-Form (3-10 Min)</option>
              <option value="story">Story</option>
              <option value="tutorial">Tutorial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Tonalität</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
            >
              <option value="lustig">Lustig</option>
              <option value="inspirierend">Inspirierend</option>
              <option value="lehrreich">Lehrreich</option>
              <option value="emotional">Emotional</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating || !topic.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
          {generating ? 'Generiere Ideen...' : 'Ideen generieren'}
        </button>
      </div>

      {ideas.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Wand2 size={18} className="text-pink-400" />
            Generierte Ideen
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ideas.map(idea => <IdeaCard key={idea.id} idea={idea} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Bookmark size={18} className="text-pink-400" />
          Gespeicherte Ideen ({saved.length})
        </h2>
        {saved.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Lightbulb size={32} className="mx-auto mb-3 opacity-40" />
            Noch keine gespeicherten Ideen
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {saved.map(idea => <IdeaCard key={idea.id} idea={idea} showSave={false} />)}
          </div>
        )}
      </div>
    </div>
  )
}
