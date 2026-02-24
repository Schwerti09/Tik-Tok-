import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { apiClient } from '../services/api'

export default function TrendsPage() {
  const { token } = useAuth()
  const [trends, setTrends] = useState([])
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch trends for a given niche filter (all state updates are in async callbacks)
  const fetchTrends = (nicheFilter = '') => {
    const path = nicheFilter ? `/api/trends?niche=${encodeURIComponent(nicheFilter)}` : '/api/trends'
    return apiClient(token)
      .get(path)
      .then((data) => setTrends(Array.isArray(data) ? data : []))
      .catch(() => setTrends([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTrends()
  }, [token])  // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setLoading(true)
    fetchTrends(niche)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>📈 Trend Scanner</h1>
        <p className="page-sub">Discover what&apos;s going viral before it peaks</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter by niche (e.g. fitness, finance…)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="filter-input"
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading trends…</div>
      ) : trends.length === 0 ? (
        <div className="empty-state">No trends found. Try a different niche.</div>
      ) : (
        <div className="list">
          {trends.map((t) => (
            <div key={t.id} className="list-card">
              <div className="list-card-title">{t.title || t.name || `Trend #${t.id}`}</div>
              {t.niche && <span className="badge">{t.niche}</span>}
              {t.description && <p className="list-card-desc">{t.description}</p>}
              {t.hashtags && (
                <div className="hashtags">
                  {(Array.isArray(t.hashtags) ? t.hashtags : t.hashtags.split(',')).map((h) => (
                    <span key={h} className="hashtag">{h.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
