import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  thumbnail?: string
  title?: string
  autoPlay?: boolean
  className?: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  thumbnail,
  title,
  autoPlay = false,
  className,
}) => {
  const [playing, setPlaying] = useState(autoPlay)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={`relative bg-black rounded-2xl overflow-hidden group ${className ?? ''}`}
    >
      {title && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      )}

      <ReactPlayer
        url={url}
        playing={playing}
        muted={muted}
        width="100%"
        height="100%"
        light={thumbnail || false}
        onProgress={({ played }) => setPlayed(played)}
        onDuration={setDuration}
        style={{ aspectRatio: '9/16', maxHeight: '500px' }}
        config={{
          youtube: { playerVars: { showinfo: 0, rel: 0, modestbranding: 1 } },
        }}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {/* Progress bar */}
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={played}
            onChange={(e) => setPlayed(parseFloat(e.target.value))}
            className="w-full h-1 accent-pink-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-neutral-400 mt-1">
            <span>{formatTime(played * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying(!playing)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="flex-1" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <ExternalLink size={16} />
          </a>
          <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
