import React, { useCallback, useState } from 'react'
import { useUploadVideo } from '@/hooks/useVideos'
import { Button } from '@/components/ui/Button'

// Drag-and-Drop-Zone für Video-Uploads
export const UploadZone: React.FC = () => {
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { mutate: upload, isPending, isSuccess, isError, error } = useUploadVideo()

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleUpload = () => {
    if (selectedFile) {
      upload(selectedFile)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer
          ${dragging
            ? 'border-brand-500 bg-brand-500/10'
            : 'border-gray-700 hover:border-brand-600 hover:bg-gray-800/50'}`}
        onClick={() => document.getElementById('file-input')?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-input')?.click()}
        aria-label="Video auswählen oder hierher ziehen"
      >
        <input
          id="file-input"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="text-4xl mb-3">🎬</div>
        {selectedFile ? (
          <p className="text-gray-200 font-medium">{selectedFile.name}</p>
        ) : (
          <>
            <p className="text-gray-300 font-medium">Video hier ablegen</p>
            <p className="text-gray-500 text-sm mt-1">oder klicken zum Auswählen</p>
            <p className="text-gray-600 text-xs mt-2">MP4, MOV, AVI – max. 500 MB</p>
          </>
        )}
      </div>

      {isError && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">
          {error instanceof Error ? error.message : 'Upload fehlgeschlagen'}
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 text-sm px-4 py-3 rounded-lg">
          Video erfolgreich hochgeladen! Die Verarbeitung startet in Kürze.
        </div>
      )}

      {selectedFile && !isSuccess && (
        <Button
          variant="primary"
          size="lg"
          loading={isPending}
          onClick={handleUpload}
          className="w-full"
        >
          Video hochladen
        </Button>
      )}
    </div>
  )
}
