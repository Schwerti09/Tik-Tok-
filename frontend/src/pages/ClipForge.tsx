import React from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { UploadZone } from '@/components/clipforge/UploadZone'
import { ProcessingStatus } from '@/components/clipforge/ProcessingStatus'
import { useVideos } from '@/hooks/useVideos'

// ClipForge-Seite: Video-Upload und Verarbeitungsstatus
const ClipForge: React.FC = () => {
  const { data: videos, isLoading } = useVideos()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">ClipForge 🎬</h1>
        <p className="text-gray-400 mt-1">
          Lade dein Roh-Video hoch – die KI erstellt automatisch kurze Clips.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload-Bereich */}
        <Card>
          <CardHeader title="Video hochladen" subtitle="Unterstützte Formate: MP4, MOV, AVI" />
          <UploadZone />
        </Card>

        {/* Verarbeitungsstatus */}
        <Card>
          <CardHeader
            title="Meine Videos"
            subtitle={isLoading ? 'Lade…' : `${videos?.length ?? 0} Videos`}
          />
          {isLoading ? (
            <div className="text-gray-500 text-sm text-center py-8">Lade Videos…</div>
          ) : (
            <ProcessingStatus videos={videos ?? []} />
          )}
        </Card>
      </div>

      {/* Feature-Hinweise */}
      <Card>
        <CardHeader title="Wie funktioniert ClipForge?" />
        <ol className="space-y-3">
          {[
            'Video hochladen – bis zu 500 MB, MP4/MOV/AVI',
            'KI analysiert das Video und wählt die besten Szenen aus',
            'Automatischer Schnitt in kurze Clips (15–60 Sekunden)',
            'Clips werden mit Untertiteln und Effekten versehen',
            'Fertiger Clip kann direkt geplant oder heruntergeladen werden',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-600/20 text-brand-400 rounded-full
                flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

export default ClipForge
