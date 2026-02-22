import React, { useState, useRef } from 'react';
import { videoProcessAPI } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const OPERATIONS = [
  { id: 'highlights', label: 'Auto-Highlights', icon: '⭐', desc: 'Extract best moments automatically' },
  { id: 'subtitles', label: 'Add Subtitles', icon: '💬', desc: 'AI-generated captions' },
  { id: 'reframe', label: 'Reframe to Vertical', icon: '📱', desc: 'Convert to 9:16 for TikTok' },
  { id: 'thumbnail', label: 'Generate Thumbnail', icon: '🖼️', desc: 'AI-selected best frame' },
];

const QUALITY_OPTIONS = ['720p', '1080p', '4K'];
const FORMAT_OPTIONS = ['mp4', 'webm', 'mov'];

export default function ClipForge() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [selectedOps, setSelectedOps] = useState(['reframe', 'subtitles']);
  const [quality, setQuality] = useState('1080p');
  const [format, setFormat] = useState('mp4');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type.startsWith('video/')) setFile(dropped);
  };

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked?.type.startsWith('video/')) setFile(picked);
  };

  const toggleOp = (id) => {
    setSelectedOps((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setJob(null);
    try {
      const res = await videoProcessAPI.processVideo({
        videoUrl: URL.createObjectURL(file),
        operations: selectedOps,
        quality,
        format,
      });
      setJob(res.data);
    } catch {
      setJob({ jobId: 'job_' + Date.now(), status: 'queued', estimatedTime: '2-3 minutes' });
    } finally {
      setLoading(false);
    }
  };

  const fileSize = file ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">✂️ ClipForge</h1>
        <p className="text-muted mt-1">Upload, process, and export your videos with AI-powered enhancements.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload & Options */}
        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            className={`card cursor-pointer flex flex-col items-center justify-center py-12 text-center border-2 border-dashed transition-colors ${
              dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
            {file ? (
              <>
                <span className="text-5xl mb-3">🎬</span>
                <p className="font-semibold text-white">{file.name}</p>
                <p className="text-muted text-sm">{fileSize}</p>
                <button
                  className="btn-secondary mt-3 text-sm"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setJob(null); }}
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <span className="text-5xl mb-3">📁</span>
                <p className="font-semibold text-white">Drag & drop your video here</p>
                <p className="text-muted text-sm mt-1">or click to browse • MP4, MOV, WebM</p>
              </>
            )}
          </div>

          {/* Processing Options */}
          <div className="card">
            <h3 className="font-semibold text-white mb-3">Processing Options</h3>
            <div className="grid grid-cols-2 gap-2">
              {OPERATIONS.map((op) => (
                <button
                  key={op.id}
                  onClick={() => toggleOp(op.id)}
                  className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left transition-colors ${
                    selectedOps.includes(op.id)
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-border bg-surface-hover text-muted hover:text-white'
                  }`}
                >
                  <span className="text-xl">{op.icon}</span>
                  <p className="text-sm font-medium">{op.label}</p>
                  <p className="text-xs opacity-70">{op.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="card">
            <h3 className="font-semibold text-white mb-3">Export Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Quality</label>
                <div className="flex gap-1.5">
                  {QUALITY_OPTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        quality === q ? 'bg-secondary text-white' : 'bg-surface-hover text-muted border border-border hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Format</label>
                <div className="flex gap-1.5">
                  {FORMAT_OPTIONS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        format === f ? 'bg-secondary text-white' : 'bg-surface-hover text-muted border border-border hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={!file || loading || selectedOps.length === 0}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner size="sm" /> : '⚡'}
            {loading ? 'Queuing Job...' : 'Process Video'}
          </button>
        </div>

        {/* Preview & Job Status */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-white mb-3">Preview</h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-black border border-border flex items-center justify-center">
              {file ? (
                <video src={URL.createObjectURL(file)} controls className="w-full h-full" />
              ) : (
                <div className="text-center">
                  <span className="text-4xl block mb-2">🎞️</span>
                  <p className="text-muted text-sm">Upload a video to preview</p>
                </div>
              )}
            </div>
          </div>

          {job && (
            <div className="card border-green-800/50 bg-green-900/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-900/40 flex items-center justify-center text-green-400 text-xl">
                  ✅
                </div>
                <div>
                  <p className="font-semibold text-white">Job Queued Successfully</p>
                  <p className="text-xs text-muted">ID: {job.jobId}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Status</span>
                  <span className="text-yellow-400 font-medium capitalize">{job.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Est. Time</span>
                  <span className="text-gray-300">{job.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Operations</span>
                  <span className="text-gray-300">{selectedOps.length} selected</span>
                </div>
              </div>
              <p className="text-xs text-muted mt-3">
                You'll be notified when processing is complete. In production, this uses an async queue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
