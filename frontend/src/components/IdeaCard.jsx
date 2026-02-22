import React from 'react';
import { Lightbulb, Hash, Music } from 'lucide-react';

export default function IdeaCard({ idea }) {
  if (!idea) return null;
  const { title, hook, storyboard = [], recommendedSounds = [], recommendedHashtags = [], estimatedViews } = idea;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {estimatedViews && (
            <p className="text-sm text-violet-400 mt-1">~{estimatedViews.toLocaleString('de-DE')} geschätzte Views</p>
          )}
        </div>
        <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/20">
          <Lightbulb size={20} className="text-violet-400" />
        </div>
      </div>

      {hook && (
        <div className="bg-gradient-to-r from-violet-600/10 to-pink-600/10 border border-violet-500/20 rounded-xl p-4">
          <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-1">Hook (erste 3 Sekunden)</p>
          <p className="text-white text-sm">{hook}</p>
        </div>
      )}

      {storyboard.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Storyboard</p>
          <div className="space-y-2">
            {storyboard.map((scene, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-xs text-violet-400 font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-300 leading-relaxed">{scene}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {recommendedSounds.slice(0, 3).map((sound, i) => (
          <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-600/20 border border-pink-500/20 text-xs text-pink-300">
            <Music size={10} /> {sound}
          </span>
        ))}
        {recommendedHashtags.slice(0, 5).map((tag, i) => (
          <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/20 border border-violet-500/20 text-xs text-violet-300">
            <Hash size={10} /> {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
