'use client'

import { useStore } from '@/store/useStore'

const STEPS = [
  { id: 'research', label: 'Researching Topic', icon: '🔍' },
  { id: 'blog', label: 'Writing Blog Post', icon: '📝' },
  { id: 'x', label: 'Creating X Post', icon: '𝕏' },
  { id: 'linkedin', label: 'Creating LinkedIn Post', icon: '💼' },
  { id: 'image', label: 'Generating Image', icon: '🖼️' },
]

export default function ProgressView() {
  const { topic, progress, stepStatuses, reset } = useStore()

  const getStepStatus = (stepId: string) => {
    return stepStatuses[stepId] || 'pending'
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
          <svg className="w-24 h-24 transform -rotate-90">
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle
              cx="48"
              cy="48"
              r="40"
              className="stroke-slate-700"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#progress-gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.51} 251`}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <span className="absolute text-2xl font-bold text-white">{progress}%</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Generating Content</h2>
        <p className="text-slate-400">
          Creating content for <span className="text-violet-400">"{topic}"</span>
        </p>
      </div>

      {/* Steps */}
      <div className="card-glass p-4 sm:p-6 mb-6">
        <div className="space-y-3">
          {STEPS.map((step, index) => {
            const status = getStepStatus(step.id)
            return (
              <div
                key={step.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 animate-slide-up ${status === 'in_progress'
                    ? 'bg-violet-500/10 border border-violet-500/30'
                    : status === 'complete'
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : status === 'error'
                        ? 'bg-red-500/10 border border-red-500/20'
                        : 'bg-slate-800/30 border border-transparent'
                  }`}
              >
                {/* Status Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'complete'
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                      : status === 'in_progress'
                        ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                        : status === 'error'
                          ? 'bg-gradient-to-br from-red-500 to-rose-600'
                          : 'bg-slate-700'
                    }`}
                >
                  {status === 'complete' && <span className="text-white text-lg">✓</span>}
                  {status === 'in_progress' && (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {status === 'error' && <span className="text-white">✕</span>}
                  {status === 'pending' && <span className="text-lg opacity-50">{step.icon}</span>}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <p
                    className={`font-medium ${status === 'complete'
                        ? 'text-emerald-400'
                        : status === 'in_progress'
                          ? 'text-white'
                          : status === 'error'
                            ? 'text-red-400'
                            : 'text-slate-500'
                      }`}
                  >
                    {step.label}
                    {status === 'in_progress' && '...'}
                  </p>
                </div>

                {/* Status Badge */}
                {status === 'complete' && (
                  <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
                    Done
                  </span>
                )}
                {status === 'in_progress' && (
                  <span className="text-xs text-violet-400 font-medium bg-violet-500/10 px-2 py-1 rounded-full animate-pulse">
                    Working
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Cancel Button */}
      <button
        onClick={reset}
        className="btn-secondary w-full py-3"
      >
        Cancel
      </button>
    </div>
  )
}
