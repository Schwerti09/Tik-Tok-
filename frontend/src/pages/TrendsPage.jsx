import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { apiFetch } from '../api';

export default function TrendsPage() {
  const { token } = useAuth();
  const [niche, setNiche] = useState('');
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchTrends() {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/api/trends${niche ? `?niche=${encodeURIComponent(niche)}` : ''}`, {}, token);
      if (!res.ok) throw new Error('Failed to fetch trends');
      const data = await res.json();
      setTrends(Array.isArray(data) ? data : data.trends || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTrends(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <h1>🔥 Trending Topics</h1>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter by niche (e.g. fitness, cooking)"
          value={niche}
          onChange={e => setNiche(e.target.value)}
        />
        <button onClick={fetchTrends} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>
      {error && <div className="error-msg">{error}</div>}
      <div className="list">
        {trends.length === 0 && !loading && <p className="empty">No trends found.</p>}
        {trends.map((t, i) => (
          <div key={i} className="list-item">
            <span className="trend-tag">#{t.tag || t.name || t}</span>
            {t.views && <span className="trend-views">{t.views} views</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
