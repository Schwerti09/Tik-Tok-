import React from 'react';
import { Scissors, Wand2, Music, Type } from 'lucide-react';

const tools = [
  { icon: Scissors, label: 'Schneiden',    desc: 'Video-Clips trimmen & zusammenfügen' },
  { icon: Wand2,    label: 'Effekte',      desc: 'Filter, Übergänge und visuelle Effekte' },
  { icon: Music,    label: 'Soundtrack',   desc: 'Trendige Sounds hinzufügen' },
  { icon: Type,     label: 'Text & Caption', desc: 'Untertitel und Overlays einfügen' },
];

export default function ClipForge() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold gradient-text">ClipForge</h2>
        <p className="text-sm text-gray-500 mt-0.5">Bearbeite deine Videos direkt im Browser</p>
      </div>

      {/* Editor placeholder */}
      <div className="glass-card p-6 flex items-center justify-center min-h-48 border-2 border-dashed border-brand-200">
        <p className="text-gray-400 text-sm text-center">
          Lade ein Video hoch, um den Editor zu starten.
        </p>
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tools.map(({ icon: Icon, label, desc }) => (
          <button
            key={label}
            className="glass-card p-4 flex flex-col items-center gap-2 text-center hover:shadow-glow transition-shadow group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center group-hover:from-brand-200 group-hover:to-accent-200 transition-colors">
              <Icon size={18} className="text-brand-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-xs text-gray-400 hidden sm:block">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
