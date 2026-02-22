import React, { useState } from 'react';
import { Users, MessageSquare, Plus, BookOpen, Video, Star, Send, Heart, Reply } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import toast from 'react-hot-toast';

const MOCK_THREADS = [
  {
    id: 1,
    author: '@max_creates',
    avatar: 'MC',
    title: 'Wie erhöht ihr eure Video-Retention?',
    content: 'Ich habe Probleme damit, Zuschauer länger als 15 Sekunden zu halten. Hat jemand Tipps?',
    likes: 24,
    replies: 8,
    createdAt: new Date(Date.now() - 3600000 * 2),
    tag: 'Strategie',
  },
  {
    id: 2,
    author: '@sarah_lifestyle',
    avatar: 'SL',
    title: 'TikTok vs Instagram Reels – wo starte ich?',
    content: 'Als Newcomer frage ich mich, welche Plattform 2024 noch das beste organische Wachstum bietet.',
    likes: 31,
    replies: 15,
    createdAt: new Date(Date.now() - 3600000 * 5),
    tag: 'Anfänger',
  },
  {
    id: 3,
    author: '@creator_tom',
    avatar: 'CT',
    title: 'Mein erstes virales Video – was ich gelernt habe',
    content: 'Nach 6 Monaten passierte es endlich! Hier sind meine Erkenntnisse für euch...',
    likes: 89,
    replies: 32,
    createdAt: new Date(Date.now() - 3600000 * 24),
    tag: 'Erfolg',
  },
];

const RESOURCES = [
  { icon: BookOpen, title: 'TikTok Algorithm Guide 2024',  type: 'PDF',   desc: 'Wie der Algorithmus wirklich funktioniert' },
  { icon: Video,    title: 'Hook-Formeln Masterclass',     type: 'Video', desc: '30 bewährte Hook-Formeln für mehr Views' },
  { icon: Star,     title: 'Hashtag Strategy Template',    type: 'PDF',   desc: 'Die optimale Hashtag-Strategie für jede Nische' },
];

const SESSIONS = [
  { mentor: '@profi_creator', topic: 'Content-Strategie aufbauen', date: new Date(Date.now() + 86400000 * 2), slots: 3 },
  { mentor: '@tikflow_team',  topic: 'TikTok Monetarisierung',     date: new Date(Date.now() + 86400000 * 5), slots: 5 },
];

const TAG_COLORS = {
  Strategie: 'bg-violet-600/20 text-violet-300 border-violet-500/20',
  Anfänger:  'bg-blue-600/20 text-blue-300 border-blue-500/20',
  Erfolg:    'bg-green-600/20 text-green-300 border-green-500/20',
};

export default function CommunityHub() {
  const [threads, setThreads] = useState(MOCK_THREADS);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newTitle,   setNewTitle]   = useState('');
  const [newContent, setNewContent] = useState('');
  const [activeTab,  setActiveTab]  = useState('threads');

  const handlePost = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Bitte Titel und Inhalt ausfüllen.');
      return;
    }
    const thread = {
      id: Date.now(),
      author: '@du',
      avatar: 'DU',
      title: newTitle,
      content: newContent,
      likes: 0,
      replies: 0,
      createdAt: new Date(),
      tag: 'Diskussion',
    };
    setThreads([thread, ...threads]);
    setNewTitle('');
    setNewContent('');
    setShowNewThread(false);
    toast.success('Beitrag veröffentlicht!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={20} className="text-green-400" />
            <h1 className="text-2xl font-bold text-white">Community Hub</h1>
          </div>
          <p className="text-gray-400 text-sm">Lerne, teile und wachse mit anderen Creatorn</p>
        </div>
        <button onClick={() => setShowNewThread(!showNewThread)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Beitrag erstellen
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {[
          { value: 'threads',   label: 'Diskussionen', icon: MessageSquare },
          { value: 'resources', label: 'Ressourcen',   icon: BookOpen },
          { value: 'mentoring', label: 'Mentoring',    icon: Star },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === value
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* New Thread Form */}
      {showNewThread && (
        <div className="glass-card p-5 space-y-4">
          <h2 className="text-base font-semibold text-white">Neuer Beitrag</h2>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Titel deines Beitrags..."
            className="input-field"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
            placeholder="Was möchtest du mit der Community teilen?"
            className="input-field resize-none"
          />
          <div className="flex gap-3">
            <button onClick={handlePost} className="btn-primary flex items-center gap-2 text-sm px-5">
              <Send size={14} /> Veröffentlichen
            </button>
            <button onClick={() => setShowNewThread(false)} className="btn-secondary text-sm px-4">Abbrechen</button>
          </div>
        </div>
      )}

      {/* Threads */}
      {activeTab === 'threads' && (
        <div className="space-y-3">
          {threads.map((thread) => (
            <div key={thread.id} className="glass-card p-5 hover:bg-white/10 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {thread.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-violet-400">{thread.author}</span>
                    {thread.tag && (
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${TAG_COLORS[thread.tag] || 'bg-white/10 text-gray-400 border-white/10'}`}>
                        {thread.tag}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {format(thread.createdAt, 'dd. MMM, HH:mm', { locale: de })}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-1">{thread.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{thread.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => {
                        setThreads(threads.map((t) => t.id === thread.id ? { ...t, likes: t.likes + 1 } : t));
                      }}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-400 transition-colors"
                    >
                      <Heart size={13} /> {thread.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-violet-400 transition-colors">
                      <Reply size={13} /> {thread.replies} Antworten
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources */}
      {activeTab === 'resources' && (
        <div className="grid sm:grid-cols-3 gap-4">
          {RESOURCES.map(({ icon: Icon, title, type, desc }, i) => (
            <div key={i} className="glass-card p-5 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon size={18} className="text-violet-400" />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-600/20 text-pink-300 border border-pink-500/20">{type}</span>
              <h3 className="text-white font-semibold text-sm mt-2 mb-1">{title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              <button className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Jetzt herunterladen →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mentoring */}
      {activeTab === 'mentoring' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Buche eine 1:1-Session mit erfahrenen Creatorn</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {SESSIONS.map((session, i) => (
              <div key={i} className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                    {session.mentor.slice(1, 3).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{session.mentor}</p>
                    <p className="text-xs text-gray-400">{session.topic}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {format(session.date, "dd. MMM yyyy, HH:mm 'Uhr'", { locale: de })}
                  </span>
                  <span className="text-green-400">{session.slots} freie Plätze</span>
                </div>
                <button
                  onClick={() => toast.success(`Session bei ${session.mentor} gebucht!`)}
                  className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2"
                >
                  <Star size={14} /> Session buchen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
