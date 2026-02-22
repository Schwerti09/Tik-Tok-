import React, { useState } from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const mockSchedule = [
  { id: 1, title: 'GRWM Morning Routine',  platform: 'TikTok',     date: '2025-02-24', time: '09:00' },
  { id: 2, title: 'Skincare Routine #2',    platform: 'Instagram',  date: '2025-02-25', time: '18:00' },
  { id: 3, title: 'Fashion Haul Unboxing',  platform: 'TikTok',     date: '2025-02-27', time: '12:00' },
];

const platformColors = {
  TikTok:    'bg-brand-100 text-brand-700',
  Instagram: 'bg-accent-100 text-accent-700',
  YouTube:   'bg-red-50 text-red-600',
};

export default function SmartScheduler() {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [schedule, setSchedule] = useState(mockSchedule);

  const addPost = () => {
    if (!title.trim()) { toast.error('Bitte einen Titel eingeben!'); return; }
    setSchedule([...schedule, { id: Date.now(), title, platform, date: '2025-03-01', time: '10:00' }]);
    toast.success('Post geplant!');
    setTitle('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold gradient-text">SmartScheduler</h2>
          <p className="text-sm text-gray-500 mt-0.5">Plane deine Posts für maximale Reichweite</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Neuer Post
        </button>
      </div>

      {/* Schedule list */}
      <div className="space-y-3">
        {schedule.map((post) => (
          <div key={post.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-brand-600" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{post.date} · {post.time}</span>
                </div>
              </div>
            </div>
            <span className={`self-start sm:self-auto text-xs font-medium px-3 py-1 rounded-full ${platformColors[post.platform] ?? 'bg-gray-100 text-gray-600'}`}>
              {post.platform}
            </span>
          </div>
        ))}
      </div>

      {/* New post modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Neuen Post planen">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video-Titel …"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plattform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="input-field"
            >
              <option>TikTok</option>
              <option>Instagram</option>
              <option>YouTube</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button className="btn-secondary text-sm" onClick={() => setModalOpen(false)}>Abbrechen</button>
            <button className="btn-primary text-sm" onClick={addPost}>Planen</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
