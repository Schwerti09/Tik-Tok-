import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Bookmark, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IdeaCard({ hook, storyboard, sounds, hashtags, onSave }) {
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${hook}\n\n${storyboard}`);
    toast.success('Idea kopiert!');
  };

  return (
    <div className="glass-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lightbulb size={16} className="text-brand-600" />
        </div>
        <p className="flex-1 font-semibold text-gray-800 text-sm leading-relaxed">{hook}</p>
      </div>

      {/* Expandable storyboard */}
      {storyboard && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-brand-500 hover:text-brand-700 font-medium transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Weniger anzeigen' : 'Storyboard anzeigen'}
          </button>
          {expanded && (
            <p className="mt-2 text-sm text-gray-600 leading-relaxed border-l-2 border-brand-200 pl-3">
              {storyboard}
            </p>
          )}
        </>
      )}

      {/* Tags */}
      {hashtags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hashtags.map((tag) => (
            <span key={tag} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <button onClick={handleCopy} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
          <Copy size={13} /> Kopieren
        </button>
        {onSave && (
          <button onClick={onSave} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
            <Bookmark size={13} /> Speichern
          </button>
        )}
      </div>
    </div>
  );
}
