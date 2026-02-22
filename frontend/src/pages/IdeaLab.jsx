import React, { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import IdeaCard from '../components/IdeaCard';
import toast from 'react-hot-toast';

const mockIdeas = [
  {
    hook: '5 Skincare-Tipps, die dein Leben verändern 🌸',
    storyboard: 'Szene 1: Close-up auf Hautpflege-Produkte. Szene 2: Vorher/Nachher-Vergleich. Szene 3: Testimonial.',
    sounds: ['Trending sound 1'],
    hashtags: ['#Skincare', '#BeautyTips', '#FYP', '#Glow'],
  },
  {
    hook: 'Das GRWM, das du schon immer wolltest ✨',
    storyboard: 'Szene 1: Aufstehen mit ästhetischem Licht. Szene 2: Morgenroutine im Zeitraffer. Szene 3: Final Look.',
    sounds: ['Trending sound 2'],
    hashtags: ['#GRWM', '#MorningRoutine', '#Aesthetic'],
  },
  {
    hook: 'POV: Du findest endlich deine Signature-Farbe 💜',
    storyboard: 'Szene 1: Garderobe-Check. Szene 2: Farbpaletten-Reveal. Szene 3: Outfit-Inspo.',
    sounds: ['Trending sound 3'],
    hashtags: ['#Fashion', '#ColorPalette', '#StyleInspo'],
  },
];

export default function IdeaLab() {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error('Bitte gib ein Thema ein!');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setIdeas(mockIdeas);
    setLoading(false);
    toast.success('Ideen generiert!');
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold gradient-text">IdeaLab</h2>
        <p className="text-sm text-gray-500 mt-0.5">KI-gestützte Videokonzepte für deine Nische</p>
      </div>

      {/* Input */}
      <div className="glass-card p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Thema / Nische</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate()}
            placeholder="z.B. Skincare, Fashion, Fitness …"
            className="input-field"
          />
          <button
            onClick={generate}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 sm:flex-shrink-0"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'Generiere …' : 'Ideen generieren'}
          </button>
        </div>
      </div>

      {/* Ideas grid */}
      {ideas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ideas.map((idea, i) => (
            <IdeaCard
              key={i}
              {...idea}
              onSave={() => toast.success('Idee gespeichert!')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
