import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { apiFetch } from '../api';

export default function VideosPage() {
  const { token } = useAuth();
  const [videos, setVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [options, setOptions] = useState({ captions: false, reframe: false, highlights: false });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  async function loadVideos() {
    setLoading(true);
    try {
      const res = await apiFetch('/api/videos', {}, token);
      if (res.ok) {
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : data.videos || []);
      }
    } catch {} finally { setLoading(false); }
  }

  async function processVideo(e) {
    e.preventDefault();
    setProcessing(true);
    setError('');
    setMsg('');
    try {
      const res = await apiFetch('/api/videos/process', {
        method: 'POST',
        body: JSON.stringify({ videoUrl, options }),
      }, token);
      if (!res.ok) throw new Error('Processing failed');
      setMsg('Video submitted for processing!');
      setVideoUrl('');
      loadVideos();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }

  useEffect(() => { loadVideos(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <h1>🎬 Videos</h1>
      <div className="section">
        <h2>Process a Video</h2>
        <form onSubmit={processVideo} className="form-col">
          <input
            type="url"
            placeholder="Video URL"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            required
          />
          <div className="checkbox-group">
            {['captions', 'reframe', 'highlights'].map(opt => (
              <label key={opt}>
                <input
                  type="checkbox"
                  checked={options[opt]}
                  onChange={e => setOptions(o => ({ ...o, [opt]: e.target.checked }))}
                />
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </label>
            ))}
          </div>
          <button type="submit" disabled={processing}>
            {processing ? 'Processing...' : 'Process Video'}
          </button>
        </form>
        {error && <div className="error-msg">{error}</div>}
        {msg && <div className="success-msg">{msg}</div>}
      </div>
      <div className="section">
        <h2>Your Videos</h2>
        {loading && <p>Loading...</p>}
        {videos.length === 0 && !loading && <p className="empty">No videos yet.</p>}
        {videos.map((v, i) => (
          <div key={i} className="list-item">
            <span>{v.title || v.url || v.videoUrl || `Video ${i + 1}`}</span>
            <span className={`status-badge ${v.status || ''}`}>{v.status || 'processed'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
