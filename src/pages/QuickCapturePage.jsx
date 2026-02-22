import { useState, useRef } from 'react'
import { Video, Upload, Play, Square, RotateCcw, ChevronUp, ChevronDown, FileVideo, Mic, MicOff } from 'lucide-react'

export default function QuickCapturePage() {
  const [recording, setRecording] = useState(false)
  const [teleprompterActive, setTeleprompterActive] = useState(false)
  const [script, setScript] = useState('Hallo und willkommen zu meinem Video! Heute zeige ich euch...\n\nSchreibe hier dein Skript rein. Der Teleprompter scrollt automatisch während du aufnimmst.\n\nVergiss nicht, natürlich zu sprechen und direkten Augenkontakt zur Kamera zu halten.')
  const [speed, setSpeed] = useState(3)
  const [muted, setMuted] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const fileRef = useRef()

  const handleFilesDrop = (files) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('video/'))
    setUploadedFiles(prev => [...prev, ...arr.map(f => ({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + ' MB' }))])
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">QuickCapture</h1>
        <p className="text-gray-400 mt-1">Aufnehmen, skripten und hochladen – alles an einem Ort</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="aspect-video bg-gray-950 flex flex-col items-center justify-center relative">
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <Video size={40} className="text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm mb-6">Kamera noch nicht aktiviert</p>
              {recording && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-medium">REC</span>
                </div>
              )}
            </div>
            <div className="p-4 flex items-center gap-3 border-t border-gray-800">
              <button
                onClick={() => setRecording(!recording)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${recording ? 'bg-red-600 hover:bg-red-700' : 'bg-pink-600 hover:bg-pink-700'}`}
              >
                {recording ? <Square size={16} /> : <Play size={16} />}
                {recording ? 'Stoppen' : 'Aufnahme starten'}
              </button>
              <button
                onClick={() => setMuted(!muted)}
                className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
              >
                {muted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300">
                <RotateCcw size={18} />
              </button>
              <span className="ml-auto text-gray-400 text-sm font-mono">{recording ? '00:00:15' : '00:00:00'}</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Upload size={16} className="text-pink-400" /> Video hochladen</h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFilesDrop(e.dataTransfer.files) }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragging ? 'border-pink-500 bg-pink-600/10' : 'border-gray-700 hover:border-gray-600'}`}
            >
              <FileVideo size={32} className="mx-auto mb-3 text-gray-500" />
              <p className="text-gray-400 text-sm">Video hierher ziehen oder <span className="text-pink-400">klicken zum Auswählen</span></p>
              <p className="text-gray-600 text-xs mt-1">MP4, MOV, AVI – max. 2GB</p>
              <input ref={fileRef} type="file" accept="video/*" multiple className="hidden" onChange={(e) => handleFilesDrop(e.target.files)} />
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
                    <FileVideo size={16} className="text-pink-400" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{f.name}</div>
                      <div className="text-xs text-gray-500">{f.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><Play size={16} className="text-pink-400" /> Teleprompter</h2>
            <button
              onClick={() => setTeleprompterActive(!teleprompterActive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${teleprompterActive ? 'bg-red-600 hover:bg-red-700' : 'bg-pink-600 hover:bg-pink-700'}`}
            >
              {teleprompterActive ? 'Stoppen' : 'Starten'}
            </button>
          </div>
          <div className={`flex-1 rounded-xl p-4 mb-4 font-mono text-sm leading-relaxed overflow-hidden ${teleprompterActive ? 'bg-black text-white text-lg' : 'bg-gray-800 text-gray-300'}`}>
            {teleprompterActive ? (
              <div className="animate-none whitespace-pre-wrap">{script}</div>
            ) : (
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-full bg-transparent text-gray-300 resize-none focus:outline-none min-h-48"
                placeholder="Skript hier eingeben..."
              />
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2 flex items-center justify-between">
              <span>Scrollgeschwindigkeit</span>
              <span className="text-pink-400">{speed}</span>
            </label>
            <div className="flex items-center gap-2">
              <ChevronDown size={16} className="text-gray-400" />
              <input
                type="range"
                min="1"
                max="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="flex-1 accent-pink-500"
              />
              <ChevronUp size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
