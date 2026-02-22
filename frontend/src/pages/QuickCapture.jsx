import React, { useState, useRef, useEffect } from 'react';

export default function QuickCapture() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [mode, setMode] = useState('camera');
  const [status, setStatus] = useState('idle'); // idle | previewing | recording | paused | stopped
  const [elapsed, setElapsed] = useState(0);
  const [teleprompterText, setTeleprompterText] = useState('');
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [error, setError] = useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopStream();
      clearInterval(timerRef.current);
    };
  }, []);

  function stopStream() {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  }

  async function startPreview() {
    setError('');
    try {
      const constraints =
        mode === 'camera'
          ? { video: true, audio: true }
          : { video: { displaySurface: 'monitor' }, audio: true };
      const stream =
        mode === 'camera'
          ? await navigator.mediaDevices.getUserMedia(constraints)
          : await navigator.mediaDevices.getDisplayMedia(constraints);
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      await videoRef.current.play();
      setStatus('previewing');
    } catch (err) {
      setError('Could not access camera/screen: ' + err.message);
    }
  }

  function startRecording() {
    chunksRef.current = [];
    const stream = videoRef.current.srcObject;
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedUrl(URL.createObjectURL(blob));
      setStatus('stopped');
    };
    recorder.start(100);
    mediaRecorderRef.current = recorder;
    setStatus('recording');
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }

  function pauseRecording() {
    mediaRecorderRef.current?.pause();
    clearInterval(timerRef.current);
    setStatus('paused');
  }

  function resumeRecording() {
    mediaRecorderRef.current?.resume();
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    setStatus('recording');
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    clearInterval(timerRef.current);
    stopStream();
  }

  function reset() {
    setStatus('idle');
    setElapsed(0);
    setRecordedUrl(null);
    chunksRef.current = [];
  }

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🎥 QuickCapture</h1>
        <p className="text-muted mt-1">Record directly in the browser with your camera or screen.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Preview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mode toggle */}
          {status === 'idle' && (
            <div className="flex gap-2">
              {['camera', 'screen'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    mode === m ? 'bg-primary text-white' : 'bg-surface-hover text-muted border border-border hover:text-white'
                  }`}
                >
                  {m === 'camera' ? '📷 Camera' : '🖥️ Screen'}
                </button>
              ))}
            </div>
          )}

          {/* Video Preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-border">
            {status === 'stopped' && recordedUrl ? (
              <video src={recordedUrl} controls className="w-full h-full" />
            ) : (
              <video ref={videoRef} className="w-full h-full object-cover" />
            )}

            {status === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
                <span className="text-5xl">🎥</span>
                <p className="text-white font-semibold">Ready to record</p>
                <p className="text-muted text-sm">Click "Start Preview" to begin</p>
              </div>
            )}

            {status === 'recording' && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 rounded-full px-3 py-1">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-mono font-bold">{formatTime(elapsed)}</span>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}

          {/* Controls */}
          <div className="flex gap-3 flex-wrap">
            {status === 'idle' && (
              <button onClick={startPreview} className="btn-primary flex items-center gap-2">
                ▶️ Start Preview
              </button>
            )}
            {status === 'previewing' && (
              <button onClick={startRecording} className="btn-primary flex items-center gap-2">
                🔴 Record
              </button>
            )}
            {status === 'recording' && (
              <>
                <button onClick={pauseRecording} className="btn-secondary flex items-center gap-2">
                  ⏸️ Pause
                </button>
                <button onClick={stopRecording} className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                  ⏹️ Stop
                </button>
              </>
            )}
            {status === 'paused' && (
              <>
                <button onClick={resumeRecording} className="btn-primary flex items-center gap-2">
                  ▶️ Resume
                </button>
                <button onClick={stopRecording} className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                  ⏹️ Stop
                </button>
              </>
            )}
            {status === 'stopped' && (
              <>
                {recordedUrl && (
                  <a
                    href={recordedUrl}
                    download="tikflow-recording.webm"
                    className="btn-primary flex items-center gap-2"
                  >
                    ⬇️ Download
                  </a>
                )}
                <button onClick={reset} className="btn-secondary flex items-center gap-2">
                  🔄 New Recording
                </button>
              </>
            )}
          </div>
        </div>

        {/* Teleprompter */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white">📜 Teleprompter</h2>
          <div>
            <label className="label">Script</label>
            <textarea
              className="input resize-none h-40"
              placeholder="Type your script here. It will scroll automatically while you record..."
              value={teleprompterText}
              onChange={(e) => setTeleprompterText(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Scroll Speed: {scrollSpeed}x</label>
            <input
              type="range"
              min={1}
              max={5}
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Scrolling preview */}
          {teleprompterText && (
            <div className="h-32 overflow-hidden rounded-lg bg-black border border-border p-3 relative">
              <div
                className="text-white text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  animation: status === 'recording' ? `scroll ${60 / scrollSpeed}s linear infinite` : 'none',
                }}
              >
                {teleprompterText}
              </div>
              <style>{`
                @keyframes scroll {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-100%); }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
