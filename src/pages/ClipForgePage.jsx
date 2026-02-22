import { useState } from 'react'
import { Upload, Scissors, CheckCircle, XCircle, Loader2, Play, Download, Trash2, Clock } from 'lucide-react'

const mockClips = [
  { id: 1, name: 'morning_routine_final.mp4', status: 'done', duration: '0:45', thumb: null, created: '20. Feb' },
  { id: 2, name: 'ai_tools_tutorial.mp4', status: 'done', duration: '1:12', thumb: null, created: '19. Feb' },
  { id: 3, name: 'productivity_hack.mp4', status: 'processing', duration: '–', progress: 67, thumb: null, created: '21. Feb' },
  { id: 4, name: 'raw_footage_v2.mp4', status: 'processing', duration: '–', progress: 23, thumb: null, created: '22. Feb' },
  { id: 5, name: 'failed_render.mp4', status: 'error', duration: '–', thumb: null, created: '18. Feb' },
]

const statusConfig = {
  done: { icon: CheckCircle, color: 'text-green-400', label: 'Fertig', bg: 'bg-green-600/20' },
  processing: { icon: Loader2, color: 'text-amber-400', label: 'Verarbeitung', bg: 'bg-amber-600/20' },
  error: { icon: XCircle, color: 'text-red-400', label: 'Fehler', bg: 'bg-red-600/20' },
}

const tabs = ['Alle', 'Verarbeitung', 'Fertig', 'Fehler']

export default function ClipForgePage() {
  const [activeTab, setActiveTab] = useState('Alle')
  const [dragging, setDragging] = useState(false)
  const [clips] = useState(mockClips)

  const filtered = clips.filter(c => {
    if (activeTab === 'Alle') return true
    if (activeTab === 'Verarbeitung') return c.status === 'processing'
    if (activeTab === 'Fertig') return c.status === 'done'
    if (activeTab === 'Fehler') return c.status === 'error'
    return true
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ClipForge</h1>
        <p className="text-gray-400 mt-1">Lade Videos hoch und lass die KI deine Clips erstellen</p>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false) }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragging ? 'border-pink-500 bg-pink-600/10' : 'border-gray-700 hover:border-gray-600 cursor-pointer'}`}
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-pink-400" />
          </div>
          <p className="text-white font-medium mb-1">Video hochladen</p>
          <p className="text-gray-400 text-sm mb-4">Ziehe dein Rohvideo hierher oder klicke zum Auswählen</p>
          <button className="px-6 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-sm font-medium transition-colors">
            Datei auswählen
          </button>
          <p className="text-gray-600 text-xs mt-4">MP4, MOV, AVI – max. 5GB</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? 'bg-pink-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'}`}
          >
            {tab}
            <span className="ml-2 text-xs opacity-70">
              {tab === 'Alle' ? clips.length : clips.filter(c =>
                (tab === 'Verarbeitung' && c.status === 'processing') ||
                (tab === 'Fertig' && c.status === 'done') ||
                (tab === 'Fehler' && c.status === 'error')
              ).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((clip) => {
          const { icon: StatusIcon, color, label, bg } = statusConfig[clip.status]
          return (
            <div key={clip.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="aspect-video bg-gray-950 flex items-center justify-center">
                {clip.status === 'done' ? (
                  <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Play size={24} className="text-white ml-1" />
                  </button>
                ) : (
                  <Scissors size={32} className="text-gray-700" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-sm font-medium truncate flex-1">{clip.name}</div>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${color} flex-shrink-0`}>
                    <StatusIcon size={10} className={clip.status === 'processing' ? 'animate-spin' : ''} />
                    {label}
                  </span>
                </div>
                {clip.status === 'processing' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Verarbeitung...</span><span>{clip.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="bg-pink-600 h-1.5 rounded-full transition-all" style={{ width: `${clip.progress}%` }} />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-500 text-xs">
                  <span className="flex items-center gap-1"><Clock size={10} /> {clip.created}</span>
                  {clip.duration !== '–' && <span>{clip.duration}</span>}
                  <div className="ml-auto flex gap-2">
                    {clip.status === 'done' && (
                      <button className="hover:text-white transition-colors"><Download size={14} /></button>
                    )}
                    <button className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
