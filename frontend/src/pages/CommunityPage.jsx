import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { apiFetch } from '../api';

export default function CommunityPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    try {
      const [postsRes, mentorsRes] = await Promise.all([
        apiFetch('/api/community/posts', {}, token),
        apiFetch('/api/community/mentors', {}, token),
      ]);
      if (postsRes.ok) {
        const d = await postsRes.json();
        setPosts(Array.isArray(d) ? d : d.posts || []);
      }
      if (mentorsRes.ok) {
        const d = await mentorsRes.json();
        setMentors(Array.isArray(d) ? d : d.mentors || []);
      }
    } catch {} finally { setLoading(false); }
  }

  async function submitPost(e) {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await apiFetch('/api/community/posts', {
        method: 'POST',
        body: JSON.stringify({ content: newPost }),
      }, token);
      if (res.ok) {
        setNewPost('');
        loadData();
      } else {
        setError('Failed to post');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <h1>👥 Community</h1>
      <div className="two-col">
        <div className="section">
          <h2>Posts</h2>
          <form onSubmit={submitPost} className="form-col">
            <textarea
              placeholder="Share something with the community..."
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              rows={3}
              required
            />
            <button type="submit" disabled={posting}>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </form>
          {error && <div className="error-msg">{error}</div>}
          {loading && <p>Loading...</p>}
          {posts.map((p, i) => (
            <div key={i} className="list-item post-item">
              <strong>{p.author || p.user?.email || 'Anonymous'}</strong>
              <p>{p.content || p.text}</p>
            </div>
          ))}
        </div>
        <div className="section">
          <h2>Mentors</h2>
          {mentors.map((m, i) => (
            <div key={i} className="list-item mentor-item">
              <strong>{m.name || m.email}</strong>
              {m.niche && <span className="niche-badge">{m.niche}</span>}
              {m.bio && <p>{m.bio}</p>}
            </div>
          ))}
          {mentors.length === 0 && !loading && <p className="empty">No mentors available.</p>}
        </div>
      </div>
    </div>
  );
}
