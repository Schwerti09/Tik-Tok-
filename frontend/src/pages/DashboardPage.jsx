import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { apiClient } from '../services/api'

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient(token)
      .get('/api/analytics/overview')
      .then((data) => setOverview(data))
      .catch(() => setOverview(null))
      .finally(() => setLoading(false))
  }, [token])

  const stats = overview
    ? [
        { label: 'Total Views', value: overview.total_views?.toLocaleString() ?? '—' },
        { label: 'Total Videos', value: overview.total_videos ?? '—' },
        { label: 'Total Revenue', value: overview.total_revenue ? `$${overview.total_revenue}` : '—' },
        { label: 'Subscribers', value: overview.subscribers?.toLocaleString() ?? '—' },
      ]
    : null

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-sub">Welcome back, {user?.email}</p>
      </div>

      {loading ? (
        <div className="loading">Loading stats…</div>
      ) : stats ? (
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No analytics data yet. Start by uploading your first recording.</p>
        </div>
      )}

      <div className="quick-actions">
        <h2>Quick actions</h2>
        <div className="quick-grid">
          <Link to="/ideas" className="quick-card">
            <span>💡</span>
            <strong>Generate Ideas</strong>
            <p>Get AI-powered video concepts</p>
          </Link>
          <Link to="/trends" className="quick-card">
            <span>📈</span>
            <strong>Browse Trends</strong>
            <p>See what&apos;s going viral now</p>
          </Link>
          <Link to="/recordings" className="quick-card">
            <span>🎬</span>
            <strong>Upload Recording</strong>
            <p>Process and publish your video</p>
          </Link>
          <Link to="/analytics" className="quick-card">
            <span>📊</span>
            <strong>View Analytics</strong>
            <p>Track your growth and revenue</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
