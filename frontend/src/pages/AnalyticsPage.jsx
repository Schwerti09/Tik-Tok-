import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { apiClient } from '../services/api'

export default function AnalyticsPage() {
  const { token } = useAuth()
  const [overview, setOverview] = useState(null)
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const api = apiClient(token)
    Promise.all([
      api.get('/api/analytics/overview').catch(() => null),
      api.get('/api/analytics/sales').catch(() => []),
    ])
      .then(([ov, sl]) => {
        setOverview(ov)
        setSales(Array.isArray(sl) ? sl : [])
      })
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <div className="page"><div className="loading">Loading analytics…</div></div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 Analytics</h1>
        <p className="page-sub">Track your views, videos, and revenue</p>
      </div>

      {overview ? (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{overview.total_views?.toLocaleString() ?? '—'}</div>
            <div className="stat-label">Total Views</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{overview.total_videos ?? '—'}</div>
            <div className="stat-label">Videos Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {overview.total_revenue != null ? `$${overview.total_revenue}` : '—'}
            </div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{overview.subscribers?.toLocaleString() ?? '—'}</div>
            <div className="stat-label">Followers</div>
          </div>
        </div>
      ) : (
        <div className="empty-state">No overview data yet.</div>
      )}

      {sales.length > 0 && (
        <div className="section">
          <h2>Sales</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td>{new Date(s.created_at).toLocaleDateString()}</td>
                  <td>${s.amount}</td>
                  <td>{s.utm_source || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
