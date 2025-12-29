'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useStore } from '@/store/useStore'
import XPreviewCard from '@/components/PlatformPreviews/XPreviewCard'
import LinkedInPreviewCard from '@/components/PlatformPreviews/LinkedInPreviewCard'

// Parse blog frontmatter
function parseBlogFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: content }
  const meta: Record<string, string> = {}
  match[1].split('\n').forEach((line) => {
    const [key, ...vals] = line.split(':')
    if (key && vals.length) {
      meta[key.trim()] = vals.join(':').trim().replace(/^["']|["']$/g, '')
    }
  })
  return { meta, body: match[2] }
}

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

const TABS = [
  { id: 'blog', label: 'Blog' },
  { id: 'x', label: 'X' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'image', label: 'Image' },
]

export default function PreviewView() {
  const { topic, results, previewTab, setPreviewTab, reset, showMarkdown, toggleMarkdown } = useStore()

  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingPublish, setPendingPublish] = useState<'x' | 'linkedin' | 'blog' | null>(null)

  const blogContent = results?.blog || ''
  const xContent = results?.x || ''
  const linkedinContent = results?.linkedin || ''
  const imageUrl = results?.image || ''

  const confirmPublish = (platform: 'x' | 'linkedin' | 'blog') => {
    setPendingPublish(platform)
    setShowConfirm(true)
  }

  const handlePublish = async (platform: 'x' | 'linkedin' | 'blog') => {
    setShowConfirm(false)
    setPendingPublish(null)

    let content: string | undefined
    if (platform === 'x') content = xContent
    else if (platform === 'linkedin') content = linkedinContent
    else if (platform === 'blog') content = blogContent

    if (!content) return

    const settings = getSettings()
    setIsPublishing(true)
    setPublishResult(null)

    try {
      let response

      if (platform === 'blog') {
        response = await fetch('/api/publish-blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blogContent: content,
            blogApiKey: settings.blogApiKey,
            blogApiUrl: settings.blogApiUrl,
          }),
        })
      } else {
        response = await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [platform === 'x' ? 'xContent' : 'linkedinContent']: content,
            imageUrl,
            schedule: 'next-free-slot',
            typefullyApiKey: settings.typefullyApiKey,
            typefullySocialSetId: settings.typefullySocialSetId,
          }),
        })
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to publish')
      }

      setPublishResult({ success: true, message: 'Published successfully!' })
    } catch (error: any) {
      setPublishResult({ success: false, message: error.message })
    } finally {
      setIsPublishing(false)
    }
  }

  const { meta: blogMeta, body: blogBody } = parseBlogFrontmatter(blogContent)

  const renderTabContent = () => {
    switch (previewTab) {
      case 'blog':
        return (
          <div className="space-y-4">
            {/* Toggle and Copy */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  if (blogContent) {
                    navigator.clipboard.writeText(blogContent)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }
                }}
                className="text-sm text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                disabled={!blogContent}
              >
                {copied ? (
                  <>
                    <span className="text-green-400">✓</span>
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    Copy as Markdown
                  </>
                )}
              </button>
              <button
                onClick={toggleMarkdown}
                className="text-sm text-slate-400 hover:text-white"
              >
                {showMarkdown ? 'View Rendered' : 'View Markdown'}
              </button>
            </div>

            {showMarkdown ? (
              /* Raw Markdown View */
              <div className="bg-slate-800 rounded-lg p-4 overflow-auto max-h-[400px]">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                  {blogContent || 'No blog content'}
                </pre>
              </div>
            ) : (
              /* Rendered Blog Preview */
              <div className="bg-white rounded-lg p-6 overflow-auto max-h-[400px]">
                {blogMeta.title && (
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">{blogMeta.title}</h1>
                    {blogMeta.description && (
                      <p className="text-gray-600 mt-2">{blogMeta.description}</p>
                    )}
                    {blogMeta.date && (
                      <p className="text-sm text-gray-500 mt-2">{blogMeta.date}</p>
                    )}
                  </div>
                )}
                <div className="text-gray-800 text-sm leading-relaxed">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mt-5 mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h3>,
                      p: ({ children }) => <p className="mb-3 text-gray-700">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      code: ({ children }) => <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                      pre: ({ children }) => <pre className="bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-auto my-3 text-xs">{children}</pre>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-3">{children}</blockquote>,
                      a: ({ href, children }) => <a href={href} className="text-blue-600 hover:underline">{children}</a>,
                    }}
                  >{blogBody || 'No blog content'}</ReactMarkdown>
                </div>
              </div>
            )}

            {blogContent && (
              <div className="flex justify-end">
                <button
                  onClick={() => confirmPublish('blog')}
                  disabled={isPublishing}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 active:scale-[0.98] transition-all duration-300 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      📝 Publish to Blog
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )

      case 'x':
        return (
          <div className="space-y-4">
            {/* Toggle */}
            <div className="flex justify-end">
              <button
                onClick={toggleMarkdown}
                className="text-sm text-slate-400 hover:text-white"
              >
                {showMarkdown ? 'View Rendered' : 'View Markdown'}
              </button>
            </div>

            {showMarkdown ? (
              <div className="bg-slate-800 rounded-lg p-4">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                  {xContent || 'No X content'}
                </pre>
              </div>
            ) : (
              /* X/Twitter Preview */
              <XPreviewCard
                content={xContent || 'No X content'}
                profileName="Your Name"
                profileHandle="yourhandle"
                timestamp="2h"
              />
            )}

            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${(xContent?.length || 0) > 280 ? 'text-red-400' : 'text-green-400'
                  }`}
              >
                {xContent?.length || 0} / 280
              </span>
              {xContent && (
                <button
                  onClick={() => confirmPublish('x')}
                  disabled={isPublishing}
                  className="px-6 py-3 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 hover:from-sky-500 hover:via-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 active:scale-[0.98] transition-all duration-300 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      𝕏 Publish to X
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )

      case 'linkedin':
        return (
          <div className="space-y-4">
            {/* Toggle */}
            <div className="flex justify-end">
              <button
                onClick={toggleMarkdown}
                className="text-sm text-slate-400 hover:text-white"
              >
                {showMarkdown ? 'View Rendered' : 'View Markdown'}
              </button>
            </div>

            {showMarkdown ? (
              <div className="bg-slate-800 rounded-lg p-4">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                  {linkedinContent || 'No LinkedIn content'}
                </pre>
              </div>
            ) : (
              /* LinkedIn Preview */
              <LinkedInPreviewCard
                content={linkedinContent || 'No LinkedIn content'}
                profileName="Your Name"
                profileTitle="Your Professional Title"
                timestamp="2h"
              />
            )}

            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${(linkedinContent?.length || 0) > 3000 ? 'text-red-400' : 'text-green-400'
                  }`}
              >
                {linkedinContent?.length || 0} / 3000
              </span>
              {linkedinContent && (
                <button
                  onClick={() => confirmPublish('linkedin')}
                  disabled={isPublishing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-300 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      💼 Publish to LinkedIn
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="flex flex-col items-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated"
                className="max-w-full max-h-[350px] rounded-lg"
                onError={(e) => {
                  // Fallback to placeholder on error
                  (e.target as HTMLImageElement).src = `https://placehold.co/1200x630/1e293b/64748b?text=${encodeURIComponent(topic || 'Image')}`
                }}
              />
            ) : (
              <div className="w-full h-48 bg-slate-800 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">No image</p>
              </div>
            )}
            {imageUrl && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm text-blue-400 hover:underline"
              >
                Open image in new tab
              </a>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success Message */}
      <div className="mb-4 p-3 bg-green-900/30 border border-green-800/50 rounded-lg">
        <span className="text-green-300 text-sm">Content generated for "{topic}"</span>
      </div>

      {/* Publish Result */}
      {publishResult && (
        <div
          className={`mb-4 p-3 rounded-lg ${publishResult.success
            ? 'bg-green-900/30 border border-green-800/50'
            : 'bg-red-900/30 border border-red-800/50'
            }`}
        >
          <span className={`text-sm ${publishResult.success ? 'text-green-300' : 'text-red-300'}`}>
            {publishResult.success ? publishResult.message : `Error: ${publishResult.message}`}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 p-1 rounded-lg mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPreviewTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${previewTab === tab.id
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-4">
        {renderTabContent()}
      </div>

      {/* Actions */}
      <button
        onClick={reset}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
      >
        Create New
      </button>

      {/* Confirmation Modal */}
      {showConfirm && pendingPublish && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-red-900/90 to-red-800/90 border-2 border-red-500 rounded-2xl p-8 max-w-md mx-4 shadow-2xl shadow-red-500/50 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Confirm Publishing</h2>
              <p className="text-red-100">
                Are you sure you want to publish this content to{' '}
                <span className="font-bold">
                  {pendingPublish === 'x' ? 'X (Twitter)' : pendingPublish === 'linkedin' ? 'LinkedIn' : 'Blog'}
                </span>
                ?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setPendingPublish(null)
                }}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => pendingPublish && handlePublish(pendingPublish)}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-500/30"
              >
                Yes, Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
