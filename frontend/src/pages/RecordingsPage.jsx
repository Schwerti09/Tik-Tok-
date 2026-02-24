import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { apiClient } from '../services/api'

export default function RecordingsPage() {
  const { token } = useAuth()
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    apiClient(token)
      .get('/api/recordings')
      .then((data) => setRecordings(Array.isArray(data) ? data : []))
      .catch(() => setRecordings([]))
      .finally(() => setLoading(false))
  }, [token])

  const refetchRecordings = () => {
    apiClient(token)
      .get('/api/recordings')
      .then((data) => setRecordings(Array.isArray(data) ? data : []))
      .catch(() => setRecordings([]))
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const file = fileRef.current?.files[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }
      fileRef.current.value = ''
      refetchRecordings()
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const deleteRecording = async (id) => {
    if (!window.confirm('Delete this recording?')) return
    await apiClient(token).delete(`/api/recordings/${id}`).catch(() => {})
    setRecordings((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🎬 Recordings</h1>
        <p className="page-sub">Upload and manage your raw recordings</p>
      </div>

      <div className="upload-box">
        <form onSubmit={handleUpload} className="upload-form">
          <input type="file" ref={fileRef} accept="video/*,audio/*" required />
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </form>
        {uploadError && <div className="alert alert-error">{uploadError}</div>}
      </div>

      {loading ? (
        <div className="loading">Loading recordings…</div>
      ) : recordings.length === 0 ? (
        <div className="empty-state">No recordings yet. Upload your first video above.</div>
      ) : (
        <div className="list">
          {recordings.map((r) => (
            <div key={r.id} className="list-card list-card--row">
              <div>
                <div className="list-card-title">{r.original_name}</div>
                <div className="list-card-meta">
                  {r.mime_type} · {r.size ? `${(r.size / 1024 / 1024).toFixed(1)} MB` : ''}
                  {r.created_at && ` · ${new Date(r.created_at).toLocaleDateString()}`}
                </div>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteRecording(r.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
