'use client'

import { useStore } from '@/store/useStore'
import { useState, useEffect } from 'react'

// Get settings from localStorage
function getSettings() {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem('smm-agent-settings')
  if (!stored) return {}
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export default function CreateView() {
  const {
    topic,
    setTopic,
    platforms,
    togglePlatform,
    startGeneration,
    setError,
    error,
    clearError,
  } = useStore()

  const [isGenerating, setIsGenerating] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  useEffect(() => {
    const settings = getSettings()
    if (settings.anthropicApiKey) {
      setHasApiKey(true)
      return
    }
    fetch('/api/settings')
      .then((res) => res.json())
      .then((envSettings) => {
        if (envSettings.anthropicApiKey) setHasApiKey(true)
      })
      .catch(() => { })
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) return

    const settings = getSettings()
    const anthropicApiKey = settings.anthropicApiKey || undefined
    const googleApiKey = settings.googleApiKey || undefined
    const braveSearchApiKey = settings.braveSearchApiKey || undefined

    clearError()
    startGeneration()
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platforms, anthropicApiKey, googleApiKey, braveSearchApiKey }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to generate content')
      }

      // Read SSE stream
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'step') {
                useStore.getState().updateStep(data.step, data.status)
              } else if (data.type === 'complete') {
                useStore.getState().setResults(data.results, data.contentId)
              } else if (data.type === 'error') {
                throw new Error(data.error)
              }
            } catch (parseErr: any) {
              if (parseErr.message !== 'Unexpected end of JSON input') {
                console.error('Parse error:', parseErr)
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGetSuggestions = async () => {
    const settings = getSettings()
    const anthropicApiKey = settings.anthropicApiKey || undefined

    setIsLoadingSuggestions(true)
    try {
      const response = await fetch('/api/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anthropicApiKey }),
      })

      if (!response.ok) {
        throw new Error('Failed to get suggestions')
      }

      const data = await response.json()
      setSuggestedTopics(data.topics || [])
    } catch (err: any) {
      setError(err.message || 'Failed to get topic suggestions')
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const canGenerate = topic.trim() && platforms.length > 0 && !isGenerating

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* API Key Warning */}
      {!hasApiKey && (
        <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 backdrop-blur-lg">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-sm text-amber-300 font-medium">No API key configured</p>
            <p className="text-xs text-amber-300/70 mt-1">Go to Settings to add your Anthropic API key for Claude</p>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 backdrop-blur-lg">
          <span className="text-xl">❌</span>
          <p className="flex-1 text-sm text-red-300">{error}</p>
          <button onClick={clearError} className="text-red-400 hover:text-red-300 text-lg">×</button>
        </div>
      )}

      {/* Main Card */}
      <div className="card-glass p-6 sm:p-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Create Content
          </h1>
          <p className="text-slate-400">
            Turn any topic into blog posts & social media content
          </p>
        </div>

        {/* Topic Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">
              What's your topic?
            </label>
            <button
              onClick={handleGetSuggestions}
              disabled={isLoadingSuggestions || !hasApiKey}
              className="text-xs text-violet-400 hover:text-violet-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
            >
              {isLoadingSuggestions ? (
                <>
                  <div className="w-3 h-3 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Get Topic Ideas
                </>
              )}
            </button>
          </div>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., AI automation for small businesses..."
            className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 rounded-xl
              text-white placeholder-slate-500
              focus:border-transparent focus:ring-2 focus:ring-violet-500
              focus:shadow-lg focus:shadow-violet-500/20
              transition-all duration-300 resize-none h-28"
          />

          {/* Topic Suggestions */}
          {suggestedTopics.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-slate-400">Suggested topics:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestedTopic, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setTopic(suggestedTopic)
                      setSuggestedTopics([])
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 hover:border-violet-500/60 rounded-lg text-xs text-violet-300 hover:text-violet-200 transition-all duration-200 hover:scale-[1.02]"
                  >
                    {suggestedTopic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Platform Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Select platforms
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => togglePlatform('x')}
              className={`group relative py-4 rounded-xl font-medium transition-all duration-300 ${platforms.includes('x')
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-sky-500 text-white shadow-xl shadow-sky-500/30 scale-[1.02]'
                : 'bg-slate-800/50 border-2 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white hover:scale-[1.01]'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">𝕏</span>
                <span>Twitter</span>
              </div>
            </button>
            <button
              onClick={() => togglePlatform('linkedin')}
              className={`group relative py-4 rounded-xl font-medium transition-all duration-300 ${platforms.includes('linkedin')
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-blue-500 text-white shadow-xl shadow-blue-500/30 scale-[1.02]'
                : 'bg-slate-800/50 border-2 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white hover:scale-[1.01]'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">💼</span>
                <span>LinkedIn</span>
              </div>
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${canGenerate
            ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 active:scale-[0.98]'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <span>✨</span>
              Generate Content
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span>📝</span> Blog Post
            </span>
            <span className="flex items-center gap-1.5">
              <span>🖼️</span> AI Generated Image
            </span>
            <span className="flex items-center gap-1.5">
              <span>📱</span> Social Posts
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
