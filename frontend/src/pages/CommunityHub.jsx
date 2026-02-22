import React, { useState } from 'react';
import { formatDate } from '../utils/helpers.js';

const THREADS = [
  { id: '1', author: 'Sarah K.', avatar: 'SK', title: 'How do you deal with algorithm drops?', replies: 23, likes: 45, time: '2 hours ago', category: 'Strategy' },
  { id: '2', author: 'Marcus T.', avatar: 'MT', title: 'Best mic setup under $200 for voice-overs?', replies: 17, likes: 38, time: '5 hours ago', category: 'Gear' },
  { id: '3', author: 'Priya R.', avatar: 'PR', title: 'Tips for growing from 0 to 10K followers?', replies: 56, likes: 112, time: '1 day ago', category: 'Growth' },
  { id: '4', author: 'Jake L.', avatar: 'JL', title: 'ClipForge vs. CapCut – which do you prefer?', replies: 31, likes: 67, time: '2 days ago', category: 'Tools' },
];

const MENTORS = [
  { name: 'Alex Rivera', specialty: 'TikTok Monetization', rating: 4.9, sessions: 120, avatar: 'AR' },
  { name: 'Mia Chen', specialty: 'YouTube Growth', rating: 4.8, sessions: 85, avatar: 'MC' },
  { name: 'Jordan Fox', specialty: 'Brand Deals', rating: 4.7, sessions: 64, avatar: 'JF' },
];

const MEMBERS = [
  { name: 'Emma W.', followers: '540K', platform: 'TikTok', badge: '🏆' },
  { name: 'Liam B.', followers: '280K', platform: 'YouTube', badge: '⭐' },
  { name: 'Sofia N.', followers: '190K', platform: 'Instagram', badge: '🌟' },
  { name: 'Noah P.', followers: '95K', platform: 'TikTok', badge: '🚀' },
];

const CATEGORY_COLORS = {
  Strategy: 'bg-blue-900/40 text-blue-400',
  Gear: 'bg-orange-900/40 text-orange-400',
  Growth: 'bg-green-900/40 text-green-400',
  Tools: 'bg-purple-900/40 text-purple-400',
};

export default function CommunityHub() {
  const [threads, setThreads] = useState(THREADS);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('Strategy');
  const [posted, setPosted] = useState(false);

  const handlePost = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const newThread = {
      id: String(Date.now()),
      author: 'You',
      avatar: 'ME',
      title: question,
      replies: 0,
      likes: 0,
      time: 'Just now',
      category,
    };
    setThreads([newThread, ...threads]);
    setQuestion('');
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🌐 Community Hub</h1>
        <p className="text-muted mt-1">Connect with creators, share knowledge, and find mentors.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Forum Threads */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ask a Question */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">Ask the Community</h2>
            <form onSubmit={handlePost} className="space-y-3">
              <input
                type="text"
                className="input"
                placeholder="What's on your mind? Ask anything..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
              <div className="flex gap-3 items-center flex-wrap">
                <select
                  className="input w-auto flex-shrink-0"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {Object.keys(CATEGORY_COLORS).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  💬 Post Question
                </button>
                {posted && <span className="text-sm text-green-400">✅ Posted!</span>}
              </div>
            </form>
          </div>

          {/* Thread List */}
          <div className="space-y-3">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className="card hover:border-primary/30 transition-colors cursor-pointer group"
              >
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {thread.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium text-gray-300">{thread.author}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[thread.category]}`}>
                        {thread.category}
                      </span>
                      <span className="text-xs text-muted">{thread.time}</span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                      {thread.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                      <span>💬 {thread.replies} replies</span>
                      <span>❤️ {thread.likes} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Mentors + Member Highlights */}
        <div className="space-y-4">
          {/* Mentoring Sessions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">🎓 Mentoring Sessions</h2>
            <div className="space-y-3">
              {MENTORS.map((mentor) => (
                <div key={mentor.name} className="flex gap-3 p-3 rounded-xl bg-surface-hover border border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {mentor.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{mentor.name}</p>
                    <p className="text-xs text-muted">{mentor.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-yellow-400">⭐ {mentor.rating}</span>
                      <span className="text-xs text-muted">{mentor.sessions} sessions</span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 text-xs btn-secondary py-1 px-2 self-center">
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Member Highlights */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">🌟 Member Highlights</h2>
            <div className="space-y-2">
              {MEMBERS.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors">
                  <span className="text-xl">{m.badge}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <p className="text-xs text-muted">{m.followers} · {m.platform}</p>
                  </div>
                  <button className="text-xs text-primary hover:underline">Follow</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
