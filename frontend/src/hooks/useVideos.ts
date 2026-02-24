import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

// Typ für ein Video
export interface Video {
  id: string
  user_id: string
  original_url: string | null
  processed_urls: string[] | null
  status: 'pending' | 'processing' | 'done' | 'failed'
  duration_seconds: number | null
  created_at: string
}

// Alle Videos des angemeldeten Benutzers laden
export function useVideos() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['videos', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Video[]> => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Video[]
    },
  })
}

// Upload-Mutation: Datei in Supabase Storage hochladen und Video-Eintrag anlegen
export function useUploadVideo() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Nicht angemeldet')

      // Datei in Supabase Storage hochladen
      const filePath = `${user.id}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(filePath, file, { upsert: false })

      if (uploadError) throw uploadError

      // Öffentliche URL abrufen
      const { data: urlData } = supabase.storage
        .from('recordings')
        .getPublicUrl(filePath)

      // Video-Eintrag in der Datenbank anlegen
      const { data, error: dbError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          original_url: urlData.publicUrl,
          status: 'pending',
        })
        .select()
        .single()

      if (dbError) throw dbError
      return data as Video
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos', user?.id] })
    },
  })
}
