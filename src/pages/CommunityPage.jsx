import { useState } from 'react'
import { MessageSquare, Heart, Plus, X, Search, Pin } from 'lucide-react'

const threads = [
  { id: 1, category: 'Allgemein', title: 'Willkommen in der TikForge Community! 👋', author: 'Admin', authorColor: 'pink', replies: 45, likes: 120, pinned: true, date: '15. Feb', preview: 'Hier ist der Ort zum Vernetzen, Lernen und gemeinsam wachsen...' },
  { id: 2, category: 'Tipps & Tricks', title: 'Meine Top 5 Hooks die immer funktionieren', author: 'CreatorMax', authorColor: 'violet', replies: 32, likes: 89, pinned: false, date: '20. Feb', preview: 'Nach 200+ Videos habe ich die Hooks gefunden die wirklich performen...' },
  { id: 3, category: 'Collab', title: 'Suche Creator für gemeinsames Projekt – Tech Nische', author: 'TechTok_Lisa', authorColor: 'blue', replies: 14, likes: 34, pinned: false, date: '21. Feb', preview: 'Ich suche 2-3 Creator aus der Tech/Productivity Nische für ein Collab-Video...' },
  { id: 4, category: 'Feedback', title: 'Feature-Wunsch: Automatische Hashtag-Vorschläge', author: 'ContentKing', authorColor: 'amber', replies: 28, likes: 67, pinned: false, date: '22. Feb', preview: 'Wäre super wenn TikForge beim Veröffentlichen automatisch passende Hashtags...' },
  { id: 5, category: 'Tipps & Tricks', title: 'CapCut vs. ClipForge – ein ehrlicher Vergleich', author: 'EditorPro', authorColor: 'green', replies: 19, likes: 45, pinned: false, date: '21. Feb', preview: 'Ich habe beide Tools intensiv getestet. Hier mein detaillierter Vergleich...' },
  { id: 6, category: 'Allgemein', title: 'Wer hat mit TikTok schon Geld verdient? Share your story!', author: 'MoneyMaker99', authorColor: 'pink', replies: 53, likes: 134, pinned: false, date: '19. Feb', preview: 'Mich interessiert wie ihr eure ersten Einnahmen gemacht habt...' },
]

const categories = ['Alle', 'Allgemein', 'Tipps & Tricks', 'Collab', 'Feedback']
const authorColors = { pink: 'bg-pink-600', violet: 'bg-violet-600', blue: 'bg-blue-600', amber: 'bg-amber-500', green: 'bg-green-600' }

export default function CommunityPage() {
  const [category, setCategory] = useState('Alle')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newThread, setNewThread] = useState({ title: '', category: 'Allgemein', content: '' })

  const filtered = threads.filter(t =>
    (category === 'Alle' || t.category === category) &&
    t.title.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-gray-400 mt-1">Lerne, vernetze dich und wachse gemeinsam</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-medium transition-colors"
        >
          <Plus size={18} />
          Neuer Beitrag
        </button>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Beiträge suchen..."
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

      <div className="space-y-3">
        {filtered.map((thread) => (
          <div key={thread.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full ${authorColors[thread.authorColor] || 'bg-gray-700'} flex items-center justify-center flex-shrink-0 text-sm font-bold`}>
                {thread.author[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {thread.pinned && (
                    <span className="flex items-center gap-1 text-xs text-pink-400 bg-pink-600/20 px-2 py-0.5 rounded-full">
                      <Pin size={10} /> Angepinnt
                    </span>
                  )}
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{thread.category}</span>
                </div>
                <h3 className="font-semibold text-base mb-1 truncate">{thread.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-1 mb-3">{thread.preview}</p>
                <div className="flex items-center gap-4 text-gray-500 text-xs">
                  <span className="font-medium text-gray-400">{thread.author}</span>
                  <span>{thread.date}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12} /> {thread.replies}</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {thread.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Neuen Beitrag erstellen</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Kategorie</label>
                <select
                  value={newThread.category}
                  onChange={(e) => setNewThread(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
                >
                  {categories.filter(c => c !== 'Alle').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Titel</label>
                <input
                  type="text"
                  value={newThread.title}
                  onChange={(e) => setNewThread(p => ({ ...p, title: e.target.value }))}
                  placeholder="Titel deines Beitrags..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Inhalt</label>
                <textarea
                  value={newThread.content}
                  onChange={(e) => setNewThread(p => ({ ...p, content: e.target.value }))}
                  placeholder="Was möchtest du mitteilen?"
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                />
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-medium transition-colors"
              >
                Beitrag veröffentlichen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
