import React, { useState } from 'react';
import { MessageCircle, Heart, UserPlus, Search } from 'lucide-react';
import Modal from '../components/Modal';

const mockComments = [
  { id: 1, user: 'beauty_lover_99', text: 'Deine Skincare-Routine hat mein Leben verändert! 💜', likes: 42 },
  { id: 2, user: 'fashion_vibes_',  text: 'Bitte mehr Fashion-Content! ✨',                      likes: 28 },
  { id: 3, user: 'morning.routine', text: 'Welches Serum benutzt du? Sieht super aus 🌸',         likes: 17 },
  { id: 4, user: 'aestheticcreator',text: 'Follow zurück? Dein Content ist amazing 💕',           likes: 9  },
];

export default function CommunityHub() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold gradient-text">CommunityHub</h2>
        <p className="text-sm text-gray-500 mt-0.5">Interagiere mit deiner Community</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input type="text" placeholder="Kommentare durchsuchen …" className="input-field pl-9" />
      </div>

      {/* Comments */}
      <div className="space-y-3">
        {mockComments.map((c) => (
          <div key={c.id} className="glass-card p-4 flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-300 to-accent-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {c.user[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-brand-600">@{c.user}</p>
              <p className="text-sm text-gray-700 mt-0.5">{c.text}</p>
              <div className="flex items-center gap-3 mt-2">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-accent-500 transition-colors">
                  <Heart size={13} /> {c.likes}
                </button>
                <button
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-600 transition-colors"
                  onClick={() => setSelected(c)}
                >
                  <MessageCircle size={13} /> Antworten
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-600 transition-colors">
                  <UserPlus size={13} /> Folgen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Antwort an @${selected?.user}`}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600 bg-brand-50 rounded-xl p-3 italic">"{selected?.text}"</p>
          <textarea
            rows={3}
            placeholder="Deine Antwort …"
            className="input-field resize-none"
          />
          <div className="flex gap-3 justify-end">
            <button className="btn-secondary text-sm" onClick={() => setSelected(null)}>Abbrechen</button>
            <button className="btn-primary text-sm" onClick={() => setSelected(null)}>Senden</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
