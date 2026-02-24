import React from 'react'
import type { Video } from '@/hooks/useVideos'

interface ProcessingStatusProps {
  videos: Video[]
}

// Statusfarben und -beschriftungen für Video-Verarbeitungsstatus
const statusConfig: Record<Video['status'], { color: string; label: string; dot: string }> = {
  pending:    { color: 'text-yellow-400', label: 'Ausstehend', dot: 'bg-yellow-400' },
  processing: { color: 'text-blue-400',   label: 'In Bearbeitung', dot: 'bg-blue-400 animate-pulse' },
  done:       { color: 'text-green-400',  label: 'Abgeschlossen', dot: 'bg-green-400' },
  failed:     { color: 'text-red-400',    label: 'Fehlgeschlagen', dot: 'bg-red-400' },
}

// Zeigt den Verarbeitungsstatus aller Videos an
export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ videos }) => {
  if (videos.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        Noch keine Videos hochgeladen.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {videos.map((video) => {
        const cfg = statusConfig[video.status]
        return (
          <li
            key={video.id}
            className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3"
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate">
                {video.original_url
                  ? decodeURIComponent(video.original_url.split('/').pop() ?? 'Unbekannte Datei')
                  : 'Unbekannte Datei'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(video.created_at).toLocaleString('de-DE')}
              </p>
            </div>
            <span className={`text-xs font-medium flex-shrink-0 ${cfg.color}`}>
              {cfg.label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
