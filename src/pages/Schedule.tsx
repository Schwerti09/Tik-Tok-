import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Plus, Clock, Check, X, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useVideos } from '@/hooks/useVideos'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAppStore } from '@/stores/appStore'
import type { Schedule as ScheduleType, Platform } from '@/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  published: 'bg-green-500/10 text-green-400 border-green-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  cancelled: 'bg-neutral-800 text-neutral-400',
}

export const Schedule: React.FC = () => {
  const { user } = useAuthStore()
  const { addNotification } = useAppStore()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    video_id: '',
    scheduled_at: '',
    platform: 'tiktok' as Platform,
  })

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules', user?.id],
    queryFn: async (): Promise<ScheduleType[]> => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*, video:videos(*)')
        .eq('user_id', user!.id)
        .order('scheduled_at', { ascending: true })
      if (error) throw error
      return data ?? []
    },
    enabled: !!user?.id,
  })

  const { data: videos } = useVideos()

  const createMutation = useMutation({
    mutationFn: async (schedule: typeof newSchedule) => {
      const { data, error } = await supabase
        .from('schedules')
        .insert({
          ...schedule,
          user_id: user!.id,
          status: 'pending',
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      addNotification({ type: 'success', message: 'Video scheduled successfully!' })
      setIsModalOpen(false)
      setNewSchedule({ video_id: '', scheduled_at: '', platform: 'tiktok' })
    },
    onError: () => {
      addNotification({ type: 'error', message: 'Failed to schedule video' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const { error } = await supabase.from('schedules').delete().eq('id', scheduleId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      addNotification({ type: 'success', message: 'Schedule cancelled' })
    },
  })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Schedule</h1>
          <p className="text-neutral-400 mt-1">Plan and automate your posting schedule</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          Schedule Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : !schedules || schedules.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar size={40} className="text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 font-medium">No scheduled posts</p>
          <p className="text-neutral-600 text-sm mt-1 mb-4">
            Schedule your first post to get started
          </p>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            Schedule Now
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="card p-4 flex items-center gap-4 hover:border-neutral-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-neutral-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {schedule.video?.title ?? 'Unknown video'}
                </p>
                <p className="text-neutral-500 text-sm">{formatDate(schedule.scheduled_at)}</p>
              </div>

              <span className="text-xs capitalize px-2 py-1 rounded-full border font-medium">
                {schedule.platform}
              </span>

              <span
                className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${
                  statusColors[schedule.status] ?? statusColors.cancelled
                }`}
              >
                {schedule.status === 'published' && <Check size={10} className="inline mr-1" />}
                {schedule.status}
              </span>

              {schedule.status === 'pending' && (
                <button
                  onClick={() => deleteMutation.mutate(schedule.id)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Schedule modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule a Post"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-neutral-300 font-medium mb-2 block">
              Select Video *
            </label>
            <select
              value={newSchedule.video_id}
              onChange={(e) => setNewSchedule((s) => ({ ...s, video_id: e.target.value }))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500/50 text-sm"
            >
              <option value="">Choose a video...</option>
              {videos?.filter((v) => v.status === 'draft' || v.status === 'published').map((v) => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-neutral-300 font-medium mb-2 block">
              Schedule Date & Time *
            </label>
            <input
              type="datetime-local"
              value={newSchedule.scheduled_at}
              onChange={(e) => setNewSchedule((s) => ({ ...s, scheduled_at: e.target.value }))}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500/50 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300 font-medium mb-2 block">Platform *</label>
            <div className="grid grid-cols-3 gap-2">
              {(['tiktok', 'instagram', 'youtube'] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewSchedule((s) => ({ ...s, platform: p }))}
                  className={`py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                    newSchedule.platform === p
                      ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                      : 'border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              isLoading={createMutation.isPending}
              disabled={!newSchedule.video_id || !newSchedule.scheduled_at}
              onClick={() => createMutation.mutate(newSchedule)}
            >
              Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
