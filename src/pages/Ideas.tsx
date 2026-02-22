import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Lightbulb, Sparkles, Plus, Tag, Copy, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAppStore } from '@/stores/appStore'
import type { Idea, Platform } from '@/types'

export const Ideas: React.FC = () => {
  const { user } = useAuthStore()
  const { addNotification } = useAppStore()
  const queryClient = useQueryClient()
  const [prompt, setPrompt] = useState('')
  const [platform, setPlatform] = useState<Platform>('tiktok')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { data: ideas, isLoading } = useQuery({
    queryKey: ['ideas', user?.id],
    queryFn: async (): Promise<Idea[]> => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    enabled: !!user?.id,
  })

  const generateMutation = useMutation({
    mutationFn: async ({ prompt, platform }: { prompt: string; platform: Platform }) => {
      const res = await fetch('/.netlify/functions/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, userId: user?.id }),
      })
      if (!res.ok) throw new Error('Failed to generate ideas')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      addNotification({ type: 'success', message: 'New ideas generated!' })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to generate ideas',
      })
    },
  })

  const handleCopy = (idea: Idea) => {
    navigator.clipboard.writeText(`${idea.title}\n\n${idea.description}`)
    setCopiedId(idea.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Ideas Generator</h1>
        <p className="text-neutral-400 mt-1">
          Generate viral content ideas powered by GPT-4
        </p>
      </div>

      {/* Generator card */}
      <div className="card p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-cyan-400" />
          Generate New Ideas
        </h2>

        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your niche or topic (e.g., 'fitness tips for beginners', 'cooking hacks', 'motivational content')..."
            rows={3}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-pink-500/50 transition-colors text-sm resize-none"
          />

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex gap-2">
              {(['tiktok', 'instagram', 'youtube'] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    platform === p
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <Button
              onClick={() => generateMutation.mutate({ prompt, platform })}
              isLoading={generateMutation.isPending}
              disabled={!prompt.trim()}
              leftIcon={<Sparkles size={16} />}
              className="ml-auto"
            >
              Generate Ideas
            </Button>
          </div>
        </div>
      </div>

      {/* Ideas list */}
      <div>
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Lightbulb size={18} className="text-yellow-400" />
          Your Ideas ({ideas?.length ?? 0})
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : !ideas || ideas.length === 0 ? (
          <div className="card p-12 text-center">
            <Lightbulb size={40} className="text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 font-medium">No ideas yet</p>
            <p className="text-neutral-600 text-sm mt-1">
              Use the generator above to create your first ideas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea) => (
              <div key={idea.id} className="card p-5 hover:border-neutral-700 transition-all group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-white font-semibold leading-tight">{idea.title}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {idea.ai_generated && (
                      <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                        AI
                      </span>
                    )}
                    <button
                      onClick={() => handleCopy(idea)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                      title="Copy idea"
                    >
                      {copiedId === idea.id ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-neutral-400 text-sm mb-3 leading-relaxed">
                  {idea.description}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-pink-400 capitalize bg-pink-500/10 px-2 py-0.5 rounded-full">
                    {idea.platform}
                  </span>
                  {idea.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-neutral-500 flex items-center gap-1"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
