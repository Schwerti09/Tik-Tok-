import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Heart, MessageCircle, Send, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAppStore } from '@/stores/appStore'
import type { CommunityPost } from '@/types'

export const Community: React.FC = () => {
  const { user } = useAuthStore()
  const { addNotification } = useAppStore()
  const queryClient = useQueryClient()
  const [newPost, setNewPost] = useState('')

  const { data: posts, isLoading } = useQuery({
    queryKey: ['community_posts'],
    queryFn: async (): Promise<CommunityPost[]> => {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*, user:users(id, full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data ?? []
    },
  })

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({ content, user_id: user!.id })
        .select('*, user:users(id, full_name, avatar_url)')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_posts'] })
      setNewPost('')
      addNotification({ type: 'success', message: 'Post shared!' })
    },
    onError: () => {
      addNotification({ type: 'error', message: 'Failed to share post' })
    },
  })

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const post = posts?.find((p) => p.id === postId)
      if (!post) return
      const { error } = await supabase
        .from('community_posts')
        .update({ likes: post.likes + 1 })
        .eq('id', postId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_posts'] })
    },
  })

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Community</h1>
        <p className="text-neutral-400 mt-1">Connect with other creators</p>
      </div>

      {/* New post */}
      <div className="card p-5">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts, tips, or wins with the community..."
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-pink-500/50 transition-colors text-sm resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                leftIcon={<Send size={14} />}
                isLoading={createPostMutation.isPending}
                disabled={!newPost.trim()}
                onClick={() => createPostMutation.mutate(newPost)}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts feed */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={40} className="text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 font-medium">No posts yet</p>
          <p className="text-neutral-600 text-sm mt-1">Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  {post.user?.full_name?.[0] || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium text-sm">
                      {post.user?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-neutral-600 text-xs">{timeAgo(post.created_at)}</span>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => likeMutation.mutate(post.id)}
                      className="flex items-center gap-1.5 text-neutral-500 hover:text-pink-400 transition-colors text-sm"
                    >
                      <Heart size={15} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-neutral-500 hover:text-blue-400 transition-colors text-sm">
                      <MessageCircle size={15} />
                      {post.comments_count}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
