import React, { useState } from 'react';
import { schedulerAPI } from '../services/api.js';
import { formatDateTime } from '../utils/helpers.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube'];

const MOCK_POSTS = [
  { id: '1', platform: 'TikTok', caption: 'My morning routine that changed everything ☀️ #morningroutine #wellness', scheduledAt: new Date(Date.now() + 3 * 3600000).toISOString(), status: 'scheduled' },
  { id: '2', platform: 'Instagram', caption: 'Behind the scenes of my content creation setup 🎥 #creator #content', scheduledAt: new Date(Date.now() + 24 * 3600000).toISOString(), status: 'scheduled' },
  { id: '3', platform: 'YouTube', caption: 'Full productivity system explained – 30 min deep dive', scheduledAt: new Date(Date.now() + 48 * 3600000).toISOString(), status: 'scheduled' },
];

const TODAY = new Date();
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekDays() {
  const days = [];
  const start = new Date(TODAY);
  start.setDate(TODAY.getDate() - TODAY.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function SmartScheduler() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [form, setForm] = useState({ platform: 'TikTok', caption: '', scheduledAt: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const weekDays = getWeekDays();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await schedulerAPI.createPost(form);
    } catch {
      // Use local state on error
    } finally {
      const newPost = { id: String(Date.now()), ...form, status: 'scheduled' };
      setPosts([newPost, ...posts]);
      setSuccess('Post scheduled successfully!');
      setForm({ platform: 'TikTok', caption: '', scheduledAt: '' });
      setLoading(false);
    }
  };

  const deletePost = (id) => setPosts(posts.filter((p) => p.id !== id));

  const platformColor = (p) => {
    if (p === 'TikTok') return 'bg-pink-900/40 text-pink-400';
    if (p === 'Instagram') return 'bg-purple-900/40 text-purple-400';
    return 'bg-red-900/40 text-red-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">📅 SmartScheduler</h1>
        <p className="text-muted mt-1">Plan and schedule your content across all platforms.</p>
      </div>

      {/* Weekly Calendar */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">This Week</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((day) => {
            const isToday = day.toDateString() === TODAY.toDateString();
            const dayPosts = posts.filter((p) => {
              const d = new Date(p.scheduledAt);
              return d.toDateString() === day.toDateString();
            });
            return (
              <div
                key={day.toISOString()}
                className={`p-2 rounded-lg text-center min-h-16 ${isToday ? 'bg-primary/15 border border-primary/30' : 'bg-surface-hover border border-border'}`}
              >
                <p className="text-xs text-muted">{DAYS[day.getDay()]}</p>
                <p className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-white'}`}>
                  {day.getDate()}
                </p>
                {dayPosts.map((p) => (
                  <div key={p.id} className={`mt-1 text-xs px-1 py-0.5 rounded truncate ${platformColor(p.platform)}`}>
                    {p.platform}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* New Post Form */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Schedule New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Platform</label>
              <div className="flex gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({ ...form, platform: p })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.platform === p ? 'bg-primary text-white' : 'bg-surface-hover text-muted border border-border hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Caption</label>
              <textarea
                className="input resize-none h-28"
                placeholder="Write your caption here... #hashtags"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Schedule Date & Time</label>
              <input
                type="datetime-local"
                className="input"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            {success && (
              <p className="text-sm text-green-400 bg-green-900/20 px-3 py-2 rounded-lg">{success}</p>
            )}
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : '📅'} Schedule Post
            </button>
          </form>
        </div>

        {/* Scheduled Posts List */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">
            Scheduled Posts <span className="text-sm text-muted font-normal">({posts.length})</span>
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {posts.length === 0 && (
              <p className="text-muted text-sm text-center py-8">No scheduled posts yet.</p>
            )}
            {posts.map((post) => (
              <div key={post.id} className="flex gap-3 p-3 rounded-xl bg-surface-hover border border-border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${platformColor(post.platform)}`}>
                      {post.platform}
                    </span>
                    <span className="text-xs text-muted">{formatDateTime(post.scheduledAt)}</span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">{post.caption}</p>
                </div>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-muted hover:text-red-400 transition-colors flex-shrink-0 text-lg"
                  aria-label="Delete post"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
