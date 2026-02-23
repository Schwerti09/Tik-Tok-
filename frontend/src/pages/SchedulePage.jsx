import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { apiFetch } from '../api';

export default function SchedulePage() {
  const { token } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ title: '', scheduledAt: '', platform: 'TikTok' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  async function loadSchedules() {
    setLoading(true);
    try {
      const res = await apiFetch('/api/schedules', {}, token);
      if (res.ok) {
        const data = await res.json();
        setSchedules(Array.isArray(data) ? data : data.schedules || []);
      }
    } catch {} finally { setLoading(false); }
  }

  async function createSchedule(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await apiFetch('/api/schedule', {
        method: 'POST',
        body: JSON.stringify(form),
      }, token);
      if (!res.ok) throw new Error('Failed to create schedule');
      setMsg('Schedule created!');
      setForm({ title: '', scheduledAt: '', platform: 'TikTok' });
      loadSchedules();
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => { loadSchedules(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <h1>📅 Schedule</h1>
      <div className="section">
        <h2>Create Schedule</h2>
        <form onSubmit={createSchedule} className="form-col">
          <input
            type="text"
            placeholder="Content title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
            required
          />
          <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
            <option>TikTok</option>
            <option>Instagram</option>
            <option>YouTube</option>
          </select>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Scheduling...' : 'Schedule Post'}
          </button>
        </form>
        {error && <div className="error-msg">{error}</div>}
        {msg && <div className="success-msg">{msg}</div>}
      </div>
      <div className="section">
        <h2>Upcoming Schedules</h2>
        {loading && <p>Loading...</p>}
        {schedules.length === 0 && !loading && <p className="empty">No schedules yet.</p>}
        {schedules.map((s, i) => (
          <div key={i} className="list-item">
            <span>{s.title || `Post ${i + 1}`}</span>
            <span className="schedule-time">{s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : ''}</span>
            <span className="platform-badge">{s.platform || 'TikTok'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
