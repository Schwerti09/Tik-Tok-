import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Instagram, Youtube, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ScheduleCard from '../components/ScheduleCard';
import VideoUpload from '../components/VideoUpload';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { de } from 'date-fns/locale';

const BEST_TIMES = {
  tiktok:    ['18:00', '19:00', '20:00', '21:00'],
  instagram: ['11:00', '14:00', '17:00', '19:00'],
  youtube:   ['15:00', '16:00', '17:00', '18:00'],
};

const MOCK_POSTS = [
  { id: 1, platform: 'tiktok',    caption: '#MorningRoutine – So starte ich meinen Tag! 🌅 #fyp #motivation',         scheduledAt: new Date(Date.now() + 86400000).toISOString() },
  { id: 2, platform: 'instagram', caption: 'Produktiver Montagmorgen ✨ Kaffee, Ziele, Action! #contentcreator #reels', scheduledAt: new Date(Date.now() + 172800000).toISOString() },
  { id: 3, platform: 'youtube',   caption: '5 Hacks für mehr Produktivität – Shorts',                                  scheduledAt: new Date(Date.now() + 259200000).toISOString() },
];

export default function SmartScheduler() {
  const [posts, setPosts]             = useState(MOCK_POSTS);
  const [showForm, setShowForm]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [form, setForm] = useState({
    platform: 'tiktok',
    caption: '',
    scheduledDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
    scheduledTime: '19:00',
    file: null,
  });

  useEffect(() => {
    api.get('/scheduler').then(({ data }) => {
      if (data?.posts?.length) setPosts(data.posts);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.caption.trim()) { toast.error('Bitte Beschriftung eingeben.'); return; }
    setLoading(true);
    const payload = {
      platform: form.platform,
      caption:  form.caption,
      scheduledAt: new Date(`${form.scheduledDate}T${form.scheduledTime}`).toISOString(),
    };
    try {
      const { data } = await api.post('/scheduler', payload);
      setPosts((p) => [data.post || { ...payload, id: Date.now() }, ...p]);
    } catch {
      setPosts((p) => [{ ...payload, id: Date.now() }, ...p]);
    }
    toast.success('Post erfolgreich geplant!');
    setShowForm(false);
    setForm((f) => ({ ...f, caption: '' }));
    setLoading(false);
  };

  const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const scheduledDays = posts.map((p) => new Date(p.scheduledAt));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={20} className="text-green-400" />
            <h1 className="text-2xl font-bold text-white">Smart Scheduler</h1>
          </div>
          <p className="text-gray-400 text-sm">Plane deine Posts für maximale Reichweite</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Neuen Post planen
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              {format(currentMonth, 'MMMM yyyy', { locale: de })}
            </h2>
            <div className="flex gap-1">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Mo','Di','Mi','Do','Fr','Sa','So'].map((d) => (
              <div key={d} className="text-xs text-gray-500 py-1">{d}</div>
            ))}
            {Array(((startOfMonth(currentMonth).getDay() + 6) % 7)).fill(null).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {daysInMonth.map((day) => {
              const hasPost = scheduledDays.some((d) => isSameDay(d, day));
              const today   = isToday(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`text-xs py-1.5 rounded-lg relative cursor-pointer transition-all ${
                    today    ? 'bg-violet-600 text-white font-bold' :
                    hasPost  ? 'bg-pink-600/30 text-pink-300 border border-pink-500/30' :
                               'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {format(day, 'd')}
                  {hasPost && !today && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full" />}
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Heute</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500" /> Geplant</span>
          </div>
        </div>

        {/* Form + List */}
        <div className="lg:col-span-2 space-y-4">
          {/* New Post Form */}
          {showForm && (
            <div className="glass-card p-5 space-y-4">
              <h2 className="text-base font-semibold text-white">Neuen Post erstellen</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Platform */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Plattform</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'tiktok',    label: 'TikTok',    icon: () => <span className="font-bold text-xs">TT</span> },
                      { value: 'instagram', label: 'Instagram', icon: Instagram },
                      { value: 'youtube',   label: 'YouTube',   icon: Youtube },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, platform: value }))}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all ${
                          form.platform === value
                            ? 'bg-violet-600/30 border-violet-500/50 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-violet-500/30'
                        }`}
                      >
                        <Icon size={15} /> {label}
                      </button>
                    ))}
                  </div>
                </div>

                <VideoUpload onFileSelect={(f) => setForm((prev) => ({ ...prev, file: f }))} />

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Beschriftung & Hashtags</label>
                  <textarea
                    rows={3}
                    value={form.caption}
                    onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                    placeholder="Dein Caption Text #hashtag #viral..."
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Datum</label>
                    <input
                      type="date"
                      value={form.scheduledDate}
                      onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Uhrzeit</label>
                    <select
                      value={form.scheduledTime}
                      onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
                      className="input-field"
                    >
                      {(BEST_TIMES[form.platform] || BEST_TIMES.tiktok).map((t) => (
                        <option key={t} value={t}>{t} Uhr ⭐ Beste Zeit</option>
                      ))}
                      {['08:00','09:00','10:00','12:00','13:00','14:00','22:00','23:00'].map((t) => (
                        <option key={t} value={t}>{t} Uhr</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Best times hint */}
                <div className="flex items-start gap-2 p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl">
                  <Clock size={15} className="text-violet-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-violet-300">
                    Beste Zeiten für <span className="font-semibold capitalize">{form.platform}</span>:{' '}
                    {BEST_TIMES[form.platform]?.join(', ')} Uhr
                  </p>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Plane...</> : <><Calendar size={15} /> Post planen</>}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary px-4">Abbrechen</button>
                </div>
              </form>
            </div>
          )}

          {/* Scheduled Posts */}
          <div>
            <h2 className="text-base font-semibold text-white mb-3">Geplante Posts ({posts.length})</h2>
            <div className="space-y-2">
              {posts.map((post) => <ScheduleCard key={post.id} post={post} />)}
              {posts.length === 0 && (
                <div className="glass-card p-8 text-center">
                  <Calendar size={24} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Noch keine Posts geplant</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
