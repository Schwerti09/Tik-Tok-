import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import { apiClient } from '../services/api'

export default function IdeasPage() {
  const { token } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [niche, setNiche] = useState('')
  const [ideas, setIdeas] = useState([])
  const [savedIdeas, setSavedIdeas] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    apiClient(token)
      .get('/api/ideas')
      .then((data) => setSavedIdeas(Array.isArray(data) ? data : []))
      .catch(() => setSavedIdeas([]))
  }, [token])

  const generate = async () => {
    setLoading(true)
    try {
      const data = await apiClient(token).post('/api/ideas/generate', { keyword, niche })
      setIdeas(Array.isArray(data) ? data : [])
    } catch {
      setIdeas([])
    } finally {
      setLoading(false)
    }
  }

  const saveIdea = async (idea) => {
    setSaving(idea.id)
    try {
      const saved = await apiClient(token).post('/api/ideas/save', {
        title: idea.title,
        description: idea.description,
        hashtags: idea.hashtags,
      })
      setSavedIdeas((prev) => [saved, ...prev])
    } catch {
      // ignore
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>💡 Idea Generator</h1>
        <p className="page-sub">Generate AI-powered video concepts for any niche</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Keyword (e.g. morning routine)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Niche (e.g. fitness)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="filter-input"
        />
        <button className="btn btn-primary" onClick={generate} disabled={loading || !keyword}>
          {loading ? 'Generating…' : 'Generate Ideas'}
        </button>
      </div>

      {ideas.length > 0 && (
        <div className="section">
          <h2>Generated Ideas</h2>
          <div className="list">
            {ideas.map((idea) => (
              <div key={idea.id} className="list-card">
                <div className="list-card-title">{idea.title}</div>
                <p className="list-card-desc">{idea.description}</p>
                <div className="hashtags">
                  {idea.hashtags.map((h) => (
                    <span key={h} className="hashtag">{h}</span>
                  ))}
                </div>
                <div className="list-card-meta">
                  Est. {idea.estimatedViews?.toLocaleString()} views
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => saveIdea(idea)}
                  disabled={saving === idea.id}
                >
                  {saving === idea.id ? 'Saving…' : '+ Save idea'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedIdeas.length > 0 && (
        <div className="section">
          <h2>Saved Ideas</h2>
          <div className="list">
            {savedIdeas.map((idea) => (
              <div key={idea.id} className="list-card">
                <div className="list-card-title">{idea.title}</div>
                {idea.description && <p className="list-card-desc">{idea.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {ideas.length === 0 && savedIdeas.length === 0 && (
        <div className="empty-state">
          Enter a keyword and niche above to generate video ideas.
        </div>
      )}
    </div>
  )
}
