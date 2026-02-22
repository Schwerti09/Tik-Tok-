import { useState, useEffect } from 'react'
import './App.css'

function VideoCard({ video }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(video.likes)

  const handleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  return (
    <div className="video-card">
      <div className="video-wrapper">
        <video
          src={video.url}
          poster={video.thumbnail}
          loop
          playsInline
          onClick={(e) => (e.target.paused ? e.target.play() : e.target.pause())}
        />
      </div>
      <div className="video-info">
        <div className="author">
          <img src={video.author.avatar} alt={video.author.username} className="avatar" />
          <span className="username">@{video.author.username}</span>
        </div>
        <p className="description">{video.description}</p>
      </div>
      <div className="video-actions">
        <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
          ❤️ {likes}
        </button>
        <button className="action-btn">💬 {video.comments}</button>
        <button className="action-btn">↗️ Share</button>
      </div>
    </div>
  )
}

function App() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/videos')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch videos')
        return res.json()
      })
      .then((data) => {
        setVideos(data.videos)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="status">Loading videos…</div>
  if (error) return <div className="status error">Error: {error}</div>

  return (
    <div className="app">
      <header className="app-header">
        <h1>TikTok Clone</h1>
      </header>
      <main className="feed">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </main>
    </div>
  )
}

export default App
