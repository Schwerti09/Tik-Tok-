import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { apiClient } from '../services/api'

export default function CommunityPage() {
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [mentors, setMentors] = useState([])
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [tab, setTab] = useState('posts')

  useEffect(() => {
    const api = apiClient(token)
    api.get('/api/community/posts').then((d) => setPosts(Array.isArray(d) ? d : [])).catch(() => {})
    api.get('/api/community/mentors').then((d) => setMentors(Array.isArray(d) ? d : [])).catch(() => {})
  }, [token])

  const submitPost = async (e) => {
    e.preventDefault()
    if (!newPost.trim()) return
    setPosting(true)
    try {
      const post = await apiClient(token).post('/api/community/posts', { content: newPost })
      setPosts((prev) => [post, ...prev])
      setNewPost('')
    } catch {
      // ignore
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>👥 Community</h1>
        <p className="page-sub">Connect with creators and find mentors</p>
      </div>

      <div className="tabs">
        <button
          className={'tab' + (tab === 'posts' ? ' tab--active' : '')}
          onClick={() => setTab('posts')}
        >
          Posts
        </button>
        <button
          className={'tab' + (tab === 'mentors' ? ' tab--active' : '')}
          onClick={() => setTab('mentors')}
        >
          Mentors
        </button>
      </div>

      {tab === 'posts' && (
        <div>
          <form onSubmit={submitPost} className="post-form">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with the community…"
              rows={3}
            />
            <button type="submit" className="btn btn-primary" disabled={posting || !newPost.trim()}>
              {posting ? 'Posting…' : 'Post'}
            </button>
          </form>
          {posts.length === 0 ? (
            <div className="empty-state">No posts yet. Be the first to share!</div>
          ) : (
            <div className="list">
              {posts.map((p) => (
                <div key={p.id} className="list-card">
                  <p>{p.content}</p>
                  <div className="list-card-meta">
                    {p.created_at && new Date(p.created_at).toLocaleDateString()}
                  {/* Supabase returns comments(count) as [{ count: N }] */}
                  {p.comments?.length > 0 && ` · ${p.comments[0].count ?? 0} comments`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'mentors' && (
        <div>
          {mentors.length === 0 ? (
            <div className="empty-state">No mentors available right now.</div>
          ) : (
            <div className="mentors-grid">
              {mentors.map((m) => (
                <div key={m.id} className="mentor-card">
                  <div className="mentor-avatar">{(m.name || 'M')[0].toUpperCase()}</div>
                  <div className="mentor-info">
                    <strong>{m.name}</strong>
                    {m.bio && <p>{m.bio}</p>}
                    {m.niche && <span className="badge">{m.niche}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
