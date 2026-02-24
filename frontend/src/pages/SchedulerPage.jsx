import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { apiClient } from '../services/api'

const PLATFORMS = ['tiktok', 'instagram', 'youtube']

export default function SchedulerPage() {
  const { token } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    platform: 'tiktok',
    video_url: '',
    caption: '',
    scheduled_time: '',
  })

  const fetchSchedules = () =>
    apiClient(token)
      .get('/api/schedules')
      .then((data) => setSchedules(Array.isArray(data) ? data : []))
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false))

  useEffect(() => {
    fetchSchedules()
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.platform || !form.scheduled_time) return
    setSubmitting(true)
    setError('')
    try {
      const created = await apiClient(token).post('/api/schedules', {
        platform: form.platform,
        video_url: form.video_url,
        caption: form.caption,
        scheduled_time: form.scheduled_time,
      })
      setSchedules((prev) => [created, ...prev])
      setForm({ platform: 'tiktok', video_url: '', caption: '', scheduled_time: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteSchedule = async (id) => {
    if (!window.confirm('Delete this scheduled post?')) return
    await apiClient(token).delete(`/api/schedules/${id}`).catch(() => {})
    setSchedules((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>📅 Scheduler</h1>
        <p className="page-sub">Plan and schedule your posts for peak engagement</p>
      </div>

      <div className="upload-box">
        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-row">
            <div className="form-group" style={{ flex: '0 0 auto' }}>
              <label htmlFor="platform">Platform</label>
              <select
                id="platform"
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="filter-input"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label htmlFor="video_url">Video URL (optional)</label>
              <input
                id="video_url"
                name="video_url"
                type="url"
                placeholder="https://…"
                value={form.video_url}
                onChange={handleChange}
                className="filter-input"
              />
            </div>

            <div className="form-group" style={{ flex: '0 0 auto' }}>
              <label htmlFor="scheduled_time">Schedule time</label>
              <input
                id="scheduled_time"
                name="scheduled_time"
                type="datetime-local"
                required
                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .slice(0, 16)}
                value={form.scheduled_time}
                onChange={handleChange}
                className="filter-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              name="caption"
              rows={2}
              placeholder="Write your caption…"
              value={form.caption}
              onChange={handleChange}
              className="filter-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Scheduling…' : 'Schedule post'}
          </button>
        </form>
      </div>

      <div className="section">
        <h2>Upcoming posts</h2>
        {loading ? (
          <div className="loading">Loading schedule…</div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">No scheduled posts yet. Create one above.</div>
        ) : (
          <div className="list">
            {schedules.map((s) => (
              <div key={s.id} className="list-card list-card--row">
                <div>
                  <div className="list-card-title">
                    <span className="badge">{s.platform}</span>{' '}
                    {s.caption || <em style={{ color: 'var(--text-muted)' }}>No caption</em>}
                  </div>
                  <div className="list-card-meta">
                    {s.scheduled_time
                      ? new Date(s.scheduled_time).toLocaleString()
                      : '—'}
                    {' · '}
                    <span
                      style={{
                        color:
                          s.status === 'posted'
                            ? 'var(--success)'
                            : s.status === 'failed'
                            ? '#f87171'
                            : 'var(--text-muted)',
                      }}
                    >
                      {s.status || 'pending'}
                    </span>
                  </div>
                  {s.video_url && (
                    <div className="list-card-meta">
                      <a
                        href={s.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent)' }}
                      >
                        {s.video_url}
                      </a>
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteSchedule(s.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
