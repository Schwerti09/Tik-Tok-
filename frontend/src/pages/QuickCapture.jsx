import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Video, Square, Pause, Play, Clock, FileText, Camera, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

const TELEPROMPTER_TEXT = `Willkommen zu meinem heutigen Video!

Heute zeige ich euch, wie ihr in nur 5 Minuten eure Morgenroutine optimieren könnt.

Das Wichtigste zuerst: Fangt euren Tag nicht mit dem Smartphone an.

Stattdessen: Wasser trinken, kurz strecken, drei tiefe Atemzüge.

Diese kleinen Änderungen haben bei mir alles verändert.

Probiert es aus und schreibt mir in die Kommentare!

Vergesst nicht zu folgen für mehr Tipps!`;

export default function QuickCapture() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [mode, setMode]         = useState('webcam'); // webcam | screen
  const [recording, setRecording] = useState(false);
  const [paused, setPaused]     = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [teleText, setTeleText] = useState(TELEPROMPTER_TEXT);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (recording && !paused) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [recording, paused]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const startRecording = useCallback(() => {
    if (!webcamRef.current?.stream) {
      toast.error('Kein Kamerazugriff. Bitte Kamera erlauben.');
      return;
    }
    chunksRef.current = [];
    const recorder = new MediaRecorder(webcamRef.current.stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tikflow-aufnahme-${Date.now()}.webm`;
      a.click();
      toast.success('Aufnahme gespeichert!');
    };
    recorder.start(100);
    mediaRecorderRef.current = recorder;
    setRecording(true);
    setPaused(false);
    setElapsed(0);
    toast.success('Aufnahme gestartet!');
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    if (paused) {
      mediaRecorderRef.current.resume();
      setPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setPaused(true);
    }
  }, [paused]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Video size={20} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Quick Capture</h1>
        </div>
        <p className="text-gray-400 text-sm">Direkt aus dem Browser aufnehmen</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Webcam */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-2">
            {[
              { value: 'webcam', icon: Camera,  label: 'Kamera' },
              { value: 'screen', icon: Monitor, label: 'Bildschirm' },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === value ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {/* Webcam preview */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-800 aspect-video">
            <Webcam
              ref={webcamRef}
              audio
              muted
              mirrored={mode === 'webcam'}
              videoConstraints={{ width: 1280, height: 720, facingMode: 'user' }}
              className="w-full h-full object-cover"
              onUserMediaError={() => toast.error('Kamerazugriff verweigert')}
            />

            {/* Recording indicator */}
            {recording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${paused ? 'bg-yellow-400' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-white text-sm font-mono">{formatTime(elapsed)}</span>
              </div>
            )}

            {/* Teleprompter overlay */}
            {showTeleprompter && (
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/70 backdrop-blur-sm p-4 overflow-hidden">
                <div
                  className="text-white text-sm leading-relaxed whitespace-pre-line"
                  style={{ animation: `scroll-up ${120 / scrollSpeed}s linear infinite` }}
                >
                  {teleText}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {!recording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/25"
              >
                <div className="w-3 h-3 rounded-full bg-white" />
                Aufnahme starten
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="flex items-center gap-2 btn-secondary px-5 py-2.5"
                >
                  {paused ? <Play size={16} /> : <Pause size={16} />}
                  {paused ? 'Fortsetzen' : 'Pause'}
                </button>
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium px-5 py-2.5 rounded-xl transition-all"
                >
                  <Square size={16} /> Stoppen & Speichern
                </button>
              </>
            )}
          </div>
        </div>

        {/* Teleprompter panel */}
        <div className="space-y-4">
          <div className="glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-violet-400" />
                <h3 className="text-sm font-semibold text-white">Teleprompter</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTeleprompter}
                  onChange={(e) => setShowTeleprompter(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/20 rounded-full peer peer-checked:bg-violet-600 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Scroll-Geschwindigkeit: {scrollSpeed}x</label>
              <input
                type="range"
                min="1" max="5"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            <textarea
              value={teleText}
              onChange={(e) => setTeleText(e.target.value)}
              rows={12}
              className="input-field text-sm resize-none leading-relaxed"
              placeholder="Skript hier eingeben..."
            />
          </div>

          {/* Timer */}
          <div className="glass-card p-4 text-center">
            <Clock size={18} className="text-violet-400 mx-auto mb-2" />
            <p className="text-3xl font-mono font-bold text-white">{formatTime(elapsed)}</p>
            <p className="text-xs text-gray-400 mt-1">{recording ? (paused ? 'Pausiert' : 'Aufnahme läuft') : 'Bereit'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
