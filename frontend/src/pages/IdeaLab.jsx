import React, { useState } from 'react';
import { ideaGenAPI } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const STYLES = ['Entertaining', 'Educational', 'Inspirational', 'Story-driven', 'Tutorial', 'Trending Challenge'];
const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts'];

const MOCK_CONCEPT = {
  title: 'The 5-Minute Productivity Hack That Changed My Life',
  hook: 'I wasted 3 years of my life until I discovered this one habit that top CEOs swear by...',
  storyboard: [
    'Open with you looking exhausted at a cluttered desk (relatable pain point)',
    'Flash forward to you looking energized and organized – "This was me 30 days ago..."',
    'Reveal the habit: the "2-minute rule" with a quick on-screen text animation',
    'Show 3 practical examples of applying it in daily life (B-roll montage)',
    'Close with your transformation story and a direct call to action',
  ],
  sounds: ['Upbeat Motivational Beat', 'Epic Background Music Vol. 7', 'Lo-fi Focus Mode'],
  hashtags: ['#productivity', '#lifehack', '#morningroutine', '#selfimprovement', '#mindset'],
  duration: '45-60 seconds',
};

export default function IdeaLab() {
  const [form, setForm] = useState({ niche: '', targetAudience: '', style: 'Educational', platform: 'TikTok' });
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setConcept(null);
    setSaved(false);
    try {
      const res = await ideaGenAPI.generateIdea(form);
      setConcept(res.data?.concept || MOCK_CONCEPT);
    } catch {
      setConcept(MOCK_CONCEPT);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('tikflow-ideas') || '[]');
    saved.push({ ...concept, savedAt: new Date().toISOString(), form });
    localStorage.setItem('tikflow-ideas', JSON.stringify(saved));
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">💡 IdeaLab</h1>
        <p className="text-muted mt-1">Generate AI-powered video concepts tailored to your niche and audience.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Generate Video Concept</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="label">Niche / Topic *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Productivity, Fitness, Personal Finance..."
                value={form.niche}
                onChange={(e) => setForm({ ...form, niche: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Target Audience</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. College students, busy parents, entrepreneurs..."
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Content Style</label>
              <select
                className="input"
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value })}
              >
                {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
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
            {error && <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : '✨'}
              {loading ? 'Generating...' : 'Generate Idea'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading && (
            <div className="card h-full flex items-center justify-center">
              <LoadingSpinner size="lg" text="AI is crafting your concept..." />
            </div>
          )}
          {!loading && concept && (
            <div className="card space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-white">{concept.title}</h2>
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-900/30 text-green-400 border border-green-800' : 'btn-secondary'}`}
                >
                  {saved ? '✅ Saved' : '💾 Save'}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs font-semibold text-primary mb-1">HOOK</p>
                <p className="text-sm text-gray-300 italic">"{concept.hook}"</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Storyboard</p>
                <ol className="space-y-2">
                  {concept.storyboard.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/30 text-secondary text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Recommended Sounds</p>
                  {concept.sounds.map((s) => (
                    <p key={s} className="text-sm text-gray-300">🎵 {s}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Duration</p>
                  <p className="text-sm text-gray-300">⏱️ {concept.duration}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Hashtags</p>
                <div className="flex flex-wrap gap-1.5">
                  {concept.hashtags.map((h) => (
                    <span key={h} className="text-xs bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-full">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!loading && !concept && (
            <div className="card h-full flex flex-col items-center justify-center text-center py-12">
              <span className="text-5xl mb-3">🤖</span>
              <p className="text-white font-semibold">Ready to create</p>
              <p className="text-muted text-sm mt-1">Fill in the form and hit Generate to get your AI-powered video concept.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
