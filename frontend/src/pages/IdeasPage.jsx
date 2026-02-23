import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { apiFetch } from '../api';

export default function IdeasPage() {
  const { token } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [niche, setNiche] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  async function generateIdeas(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIdeas([]);
    try {
      const res = await apiFetch('/api/ideas/generate', {
        method: 'POST',
        body: JSON.stringify({ keyword, niche }),
      }, token);
      if (!res.ok) throw new Error('Failed to generate ideas');
      const data = await res.json();
      setIdeas(Array.isArray(data) ? data : data.ideas || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveIdea(idea) {
    try {
      await apiFetch('/api/ideas/save', { method: 'POST', body: JSON.stringify({ idea }) }, token);
      setSaveMsg('Idea saved!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (err) {
      setSaveMsg(`Failed to save: ${err.message}`);
    }
  }

  async function loadSaved() {
    try {
      const res = await apiFetch('/api/ideas', {}, token);
      if (res.ok) {
        const data = await res.json();
        setSavedIdeas(Array.isArray(data) ? data : data.ideas || []);
      }
    } catch (e) { console.error('Failed to load saved ideas:', e); }
  }

  useEffect(() => { loadSaved(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <h1>💡 Content Ideas</h1>
      <form onSubmit={generateIdeas} className="form-row">
        <input
          type="text"
          placeholder="Keyword"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Niche"
          value={niche}
          onChange={e => setNiche(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Ideas'}
        </button>
      </form>
      {error && <div className="error-msg">{error}</div>}
      {saveMsg && <div className="success-msg">{saveMsg}</div>}
      {ideas.length > 0 && (
        <div className="section">
          <h2>Generated Ideas</h2>
          {ideas.map((idea, i) => (
            <div key={i} className="list-item idea-item">
              <span>{idea.title || idea.text || idea}</span>
              <button className="btn-small" onClick={() => saveIdea(idea)}>Save</button>
            </div>
          ))}
        </div>
      )}
      {savedIdeas.length > 0 && (
        <div className="section">
          <h2>Saved Ideas</h2>
          {savedIdeas.map((idea, i) => (
            <div key={i} className="list-item">
              <span>{idea.title || idea.text || idea}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
