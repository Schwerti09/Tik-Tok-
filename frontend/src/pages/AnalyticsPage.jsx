import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { apiFetch } from '../api';

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/analytics/overview', {}, token)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to load'))
      .then(data => setStats(data))
      .catch(err => setError(String(err)))
      .finally(() => setLoading(false));
  }, [token]);

  const statCards = stats ? [
    { label: 'Total Views', value: stats.totalViews ?? stats.views ?? '—' },
    { label: 'Followers', value: stats.followers ?? '—' },
    { label: 'Likes', value: stats.likes ?? stats.totalLikes ?? '—' },
    { label: 'Comments', value: stats.comments ?? stats.totalComments ?? '—' },
    { label: 'Shares', value: stats.shares ?? stats.totalShares ?? '—' },
    { label: 'Engagement Rate', value: stats.engagementRate ? `${stats.engagementRate}%` : '—' },
  ] : [];

  return (
    <div className="page">
      <h1>📊 Analytics Overview</h1>
      {loading && <p>Loading analytics...</p>}
      {error && <div className="error-msg">{error}</div>}
      {stats && (
        <div className="card-grid">
          {statCards.map(card => (
            <div key={card.label} className="stat-card">
              <h3>{card.label}</h3>
              <div className="stat-value">{card.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
