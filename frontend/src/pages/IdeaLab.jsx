import React, { useState } from 'react';
import { Lightbulb, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';
import IdeaCard from '../components/IdeaCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const NICHES = ['Fitness', 'Lifestyle', 'Business', 'Kochen', 'Reisen', 'Beauty', 'Gaming', 'Bildung', 'Unterhaltung', 'Mode'];
const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts'];
const STYLES = ['Unterhaltsam & lustig', 'Informativ & lehrreich', 'Inspirierend', 'Storytelling', 'Tutorial', 'Behind the Scenes'];

const MOCK_IDEA = {
  title: 'Der 5-Minuten Morgen-Routine Hack',
  hook: '„Ich habe 30 Tage lang diese Morgen-Routine gemacht – hier ist was passiert ist..." (Direktblick in Kamera, dramatische Musik)',
  storyboard: [
    'Szene 1 (0–3s): Schneller Überblick – zeige vorher/nachher Bild, erstelle Neugier',
    'Szene 2 (3–15s): Das Problem – Morgens gehetzt, keine Energie, kein Plan',
    'Szene 3 (15–35s): Die 5-Schritte-Routine im Zeitraffer zeigen',
    'Szene 4 (35–50s): Ergebnis nach 30 Tagen – Energie, Fokus, Produktivität',
    'Szene 5 (50–60s): Call-to-Action – „Folge mir für Teil 2" + Routine-PDF anbieten',
  ],
  recommendedSounds: ['Motivational Beat – TikTok', 'Morning Vibes', 'Cinematic Rise'],
  recommendedHashtags: ['morningroutine', 'productivity', 'selfimprovement', 'lifehack', 'motivation', 'fyp'],
  estimatedViews: 45000,
};

export default function IdeaLab() {
  const [niche, setNiche]       = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [style, setStyle]       = useState('Unterhaltsam & lustig');
  const [loading, setLoading]   = useState(false);
  const [idea, setIdea]         = useState(null);

  const handleGenerate = async () => {
    if (!niche.trim()) {
      toast.error('Bitte gib eine Nische oder ein Thema ein.');
      return;
    }
    setLoading(true);
    toast.loading('KI generiert deine Idee...', { id: 'idea' });
    try {
      const { data } = await api.post('/ideagen', { niche, platform, style });
      setIdea(data);
      toast.success('Idee erfolgreich generiert!', { id: 'idea' });
    } catch {
      setIdea(MOCK_IDEA);
      toast.success('Demo-Idee generiert!', { id: 'idea' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb size={20} className="text-pink-400" />
          <h1 className="text-2xl font-bold text-white">Idea Lab</h1>
        </div>
        <p className="text-gray-400 text-sm">KI-gestützte Video-Ideen für deinen Content</p>
      </div>

      {/* Form */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="text-base font-semibold text-white">Video-Konzept generieren</h2>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Nische / Thema *</label>
          <div className="flex gap-2">
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="z.B. Fitness, Kochen, Business..."
              className="input-field"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {NICHES.map((n) => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                  niche === n
                    ? 'bg-violet-600/40 border-violet-500/60 text-violet-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Plattform</label>
            <div className="relative">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="input-field appearance-none pr-9"
              >
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Video-Stil</label>
            <div className="relative">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="input-field appearance-none pr-9"
              >
                {STYLES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {loading
            ? <><RefreshCw size={16} className="animate-spin" /> Generiere...</>
            : <><Sparkles size={16} /> Idee generieren</>
          }
        </button>
      </div>

      {/* Generated Idea */}
      {idea && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Generiertes Konzept</h2>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              <RefreshCw size={14} /> Neu generieren
            </button>
          </div>
          <IdeaCard idea={idea} />
        </div>
      )}

      {/* Empty state */}
      {!idea && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Lightbulb size={28} className="text-violet-400" />
          </div>
          <p className="text-gray-400">Gib ein Thema ein und klicke auf „Idee generieren"</p>
          <p className="text-gray-500 text-sm mt-1">Die KI erstellt ein vollständiges Video-Konzept mit Hook, Storyboard und Hashtags</p>
        </div>
      )}
    </div>
  );
}
