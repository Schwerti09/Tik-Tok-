import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Film, X, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoUploadProps {
  onFileSelected: (file: File) => void
  accept?: Record<string, string[]>
  maxSize?: number
  className?: string
  selectedFile?: File | null
  onClear?: () => void
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  onFileSelected,
  accept = { 'video/*': ['.mp4', '.mov', '.avi', '.webm', '.mkv'] },
  maxSize = 500 * 1024 * 1024, // 500MB
  className,
  selectedFile,
  onClear,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0])
      }
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    })

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  if (selectedFile) {
    return (
      <div
        className={cn(
          'relative rounded-2xl border-2 border-green-500/50 bg-green-500/5 p-6',
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Film size={24} className="text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{selectedFile.name}</p>
            <p className="text-neutral-400 text-sm">{formatSize(selectedFile.size)}</p>
          </div>
          <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
          {onClear && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200',
        isDragActive && !isDragReject
          ? 'border-pink-500 bg-pink-500/5'
          : isDragReject
          ? 'border-red-500 bg-red-500/5'
          : 'border-neutral-700 hover:border-pink-500/50 hover:bg-pink-500/5',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
            isDragActive ? 'bg-pink-500/20' : 'bg-neutral-800'
          )}
        >
          <Upload size={32} className={isDragActive ? 'text-pink-400' : 'text-neutral-500'} />
        </div>
        <div>
          <p className="text-white font-semibold mb-1">
            {isDragActive ? 'Drop your video here' : 'Upload your video'}
          </p>
          <p className="text-neutral-400 text-sm">
            Drag & drop or click to browse · MP4, MOV, AVI, WebM up to{' '}
            {formatSize(maxSize)}
          </p>
        </div>
        {fileRejections.length > 0 && (
          <p className="text-red-400 text-sm">
            {fileRejections[0].errors[0].message}
          </p>
        )}
      </div>
    </div>
  )
}
