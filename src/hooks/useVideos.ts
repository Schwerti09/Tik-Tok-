import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Video } from '@/types'

export const useVideos = (projectId?: string) => {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['videos', user?.id, projectId],
    queryFn: async (): Promise<Video[]> => {
      let query = supabase
        .from('videos')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!user?.id,
  })
}

export const useVideo = (videoId: string) => {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: async (): Promise<Video> => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!videoId,
  })
}

export const useCreateVideo = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (video: Partial<Video>) => {
      const { data, error } = await supabase
        .from('videos')
        .insert({ ...video, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export const useUpdateVideo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Video> & { id: string }) => {
      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      queryClient.invalidateQueries({ queryKey: ['video', data.id] })
    },
  })
}

export const useDeleteVideo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase.from('videos').delete().eq('id', videoId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}
