import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Upload as UploadIcon, Film, Globe, Tag, FileText } from 'lucide-react'
import { VideoUpload } from '@/components/VideoUpload/VideoUpload'
import { Button } from '@/components/ui/Button'
import { useCreateVideo } from '@/hooks/useVideos'
import { useAppStore } from '@/stores/appStore'
import type { Platform } from '@/types'

const uploadSchema = Yup.object({
  title: Yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
  description: Yup.string().max(2200, 'Description too long'),
  platform: Yup.string().oneOf(['tiktok', 'instagram', 'youtube']).required('Platform is required'),
  tags: Yup.string(),
})

export const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { mutateAsync: createVideo } = useCreateVideo()
  const { addNotification } = useAppStore()

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      platform: 'tiktok' as Platform,
      tags: '',
    },
    validationSchema: uploadSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!selectedFile) {
        addNotification({ type: 'error', message: 'Please select a video file' })
        return
      }

      setIsUploading(true)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      try {
        // In a real app, upload to S3 here and get URL
        const videoUrl = URL.createObjectURL(selectedFile) // placeholder

        await createVideo({
          title: values.title,
          description: values.description,
          platform: values.platform,
          video_url: videoUrl,
          status: 'draft',
        })

        setUploadProgress(100)
        addNotification({ type: 'success', message: 'Video uploaded successfully!' })
        resetForm()
        setSelectedFile(null)
        setUploadProgress(0)
      } catch (error) {
        addNotification({
          type: 'error',
          message: error instanceof Error ? error.message : 'Upload failed',
        })
      } finally {
        setIsUploading(false)
        clearInterval(progressInterval)
      }
    },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Video</h1>
        <p className="text-neutral-400 mt-1">Share your content across platforms</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Video upload dropzone */}
        <div className="card p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Film size={18} className="text-pink-400" />
            Video File
          </h2>
          <VideoUpload
            onFileSelected={setSelectedFile}
            selectedFile={selectedFile}
            onClear={() => setSelectedFile(null)}
          />

          {/* Upload progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-neutral-400 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="card p-6 space-y-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <FileText size={18} className="text-pink-400" />
            Video Details
          </h2>

          {/* Title */}
          <div>
            <label className="text-sm text-neutral-300 font-medium mb-2 block">
              Title <span className="text-pink-400">*</span>
            </label>
            <input
              name="title"
              type="text"
              placeholder="Give your video a catchy title..."
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-neutral-900 border rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-pink-500/50 transition-colors text-sm ${
                formik.errors.title && formik.touched.title
                  ? 'border-red-500/50'
                  : 'border-neutral-800'
              }`}
            />
            {formik.errors.title && formik.touched.title && (
              <p className="text-red-400 text-xs mt-1.5">{formik.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-neutral-300 font-medium mb-2 block">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Add a description, hashtags, and mentions..."
              value={formik.values.description}
              onChange={formik.handleChange}
              rows={4}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-pink-500/50 transition-colors text-sm resize-none"
            />
            <p className="text-neutral-600 text-xs mt-1">
              {formik.values.description.length}/2200
            </p>
          </div>

          {/* Platform */}
          <div>
            <label className="text-sm text-neutral-300 font-medium mb-2 block flex items-center gap-2">
              <Globe size={14} />
              Platform <span className="text-pink-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['tiktok', 'instagram', 'youtube'] as const).map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => formik.setFieldValue('platform', platform)}
                  className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                    formik.values.platform === platform
                      ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                      : 'border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm text-neutral-300 font-medium mb-2 block flex items-center gap-2">
              <Tag size={14} />
              Tags
            </label>
            <input
              name="tags"
              type="text"
              placeholder="dance, comedy, tutorial (comma separated)"
              value={formik.values.tags}
              onChange={formik.handleChange}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-pink-500/50 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              formik.resetForm()
              setSelectedFile(null)
            }}
          >
            Discard
          </Button>
          <Button
            type="submit"
            leftIcon={<UploadIcon size={16} />}
            isLoading={formik.isSubmitting || isUploading}
            disabled={!selectedFile}
          >
            Upload Video
          </Button>
        </div>
      </form>
    </div>
  )
}
