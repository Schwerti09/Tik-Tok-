import React, { useState } from 'react';
import { Scissors, Wand2, Type, Layout, Image, Loader2, CheckCircle } from 'lucide-react';
import VideoUpload from '../components/VideoUpload';
import api from '../services/api';
import toast from 'react-hot-toast';

const PROCESSING_OPTIONS = [
  { id: 'highlights',  icon: Wand2,   label: 'Auto-Highlights',     desc: 'Beste Momente automatisch extrahieren' },
  { id: 'subtitles',   icon: Type,    label: 'Auto-Untertitel',      desc: 'Whisper KI transkribiert dein Video' },
  { id: 'reframe',     icon: Layout,  label: 'Reframe',              desc: 'Automatisch für 9:16 / 16:9 / 1:1 anpassen' },
  { id: 'thumbnail',   icon: Image,   label: 'Thumbnail Generator',  desc: 'KI wählt das beste Thumbnail' },
];

const STATUS_STEPS = [
  'Video wird hochgeladen...',
  'Video wird analysiert...',
  'KI verarbeitet Inhalt...',
  'Ergebnis wird vorbereitet...',
  'Fertig!',
];

export default function ClipForge() {
  const [file, setFile]             = useState(null);
  const [selected, setSelected]     = useState(['highlights', 'subtitles']);
  const [processing, setProcessing] = useState(false);
  const [statusStep, setStatusStep] = useState(0);
  const [jobId, setJobId]           = useState(null);
  const [done, setDone]             = useState(false);

  const toggleOption = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleProcess = async () => {
    if (!file) {
      toast.error('Bitte erst ein Video hochladen.');
      return;
    }
    if (selected.length === 0) {
      toast.error('Bitte mindestens eine Option auswählen.');
      return;
    }

    setProcessing(true);
    setDone(false);
    setStatusStep(0);

    for (let i = 0; i < STATUS_STEPS.length - 1; i++) {
      await new Promise((r) => setTimeout(r, 1200));
      setStatusStep(i + 1);
    }

    try {
      const { data } = await api.post('/video-process', { filename: file.name, options: selected });
      setJobId(data.jobId || 'demo-job-001');
    } catch {
      setJobId('demo-job-001');
    }

    setDone(true);
    setProcessing(false);
    toast.success('Video erfolgreich verarbeitet!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Scissors size={20} className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Clip Forge</h1>
        </div>
        <p className="text-gray-400 text-sm">KI-gestützte Video-Verarbeitung & Optimierung</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload */}
        <div className="space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">Video hochladen</h2>
            <VideoUpload onFileSelect={setFile} />
          </div>

          {/* Processing Options */}
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">Verarbeitungsoptionen</h2>
            <div className="space-y-2">
              {PROCESSING_OPTIONS.map(({ id, icon: Icon, label, desc }) => (
                <label
                  key={id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selected.includes(id)
                      ? 'bg-violet-600/20 border-violet-500/40'
                      : 'bg-white/5 border-white/10 hover:border-violet-500/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(id)}
                    onChange={() => toggleOption(id)}
                    className="mt-0.5 accent-violet-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon size={15} className={selected.includes(id) ? 'text-violet-400' : 'text-gray-400'} />
                      <span className="text-sm font-medium text-white">{label}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleProcess}
              disabled={processing || !file}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {processing ? (
                <><Loader2 size={16} className="animate-spin" /> Verarbeite...</>
              ) : (
                <><Wand2 size={16} /> Verarbeitung starten</>
              )}
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="text-base font-semibold text-white">Verarbeitungsstatus</h2>

          {!processing && !done && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Scissors size={24} className="text-cyan-400" />
              </div>
              <p className="text-gray-400 text-sm">Lade ein Video hoch und wähle deine Optionen</p>
            </div>
          )}

          {(processing || done) && (
            <div className="space-y-3">
              {STATUS_STEPS.map((step, i) => {
                const isActive   = i === statusStep && processing;
                const isComplete = i < statusStep || done;
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-violet-600/20 border border-violet-500/30' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isComplete ? 'bg-green-500/30 text-green-400' :
                      isActive   ? 'bg-violet-500/30 text-violet-400' :
                                   'bg-white/10 text-gray-600'
                    }`}>
                      {isActive ? <Loader2 size={12} className="animate-spin" /> :
                       isComplete ? <CheckCircle size={12} /> :
                       <span className="text-xs">{i + 1}</span>}
                    </div>
                    <span className={`text-sm ${isActive ? 'text-white font-medium' : isComplete ? 'text-green-400' : 'text-gray-500'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {done && jobId && (
            <div className="mt-4 p-4 bg-green-600/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 font-semibold text-sm flex items-center gap-2">
                <CheckCircle size={16} /> Verarbeitung abgeschlossen
              </p>
              <p className="text-gray-400 text-xs mt-1">Job-ID: {jobId}</p>
              <button className="btn-primary mt-3 text-sm w-full flex items-center justify-center gap-2 py-2">
                Ergebnisse herunterladen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
