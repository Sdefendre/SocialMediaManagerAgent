'use client'

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0f]">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-slate-950 to-[#0a0a0f]" />

        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-violet-600/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-cyan-600/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-gradient-to-r from-indigo-600/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-2xl border-b border-violet-500/20 sticky top-0 z-50 shadow-lg shadow-black/10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">SM</span>
              </div>
              <span className="text-lg font-bold text-white hidden sm:block">Social Media Manager</span>
            </a>

            {/* Back to Home */}
            <a
              href="/"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-glass p-8">
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Changelog
              </h1>
              <p className="text-slate-400">
                Track our journey of continuous improvement
              </p>
            </div>

            {/* Changelog Items */}
            <div className="space-y-8">
              {/* v2.0 */}
              <div className="border-l-4 border-violet-500 pl-6 pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-violet-400">v2.0</span>
                  <span className="text-xs text-slate-500">December 28, 2025</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI-Powered Topic Suggestions</h3>
                <p className="text-slate-300 mb-3">
                  Claude Opus 4.5 now recommends relevant, cutting-edge topics for DefendreSolutions.com based on latest AI trends and industry developments.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-300">New Feature</span>
                  <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-lg text-xs text-violet-300">AI Integration</span>
                </div>
              </div>

              {/* v1.9 */}
              <div className="border-l-4 border-cyan-500 pl-6 pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-cyan-400">v1.9</span>
                  <span className="text-xs text-slate-500">December 28, 2025</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Web Research Integration</h3>
                <p className="text-slate-300 mb-3">
                  Brave Search API integration ensures content accuracy with real-time research before writing. Every blog post is now backed by current, verified information.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300">Enhancement</span>
                  <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-lg text-xs text-violet-300">API Integration</span>
                </div>
              </div>

              {/* v1.8 */}
              <div className="border-l-4 border-indigo-500 pl-6 pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-indigo-400">v1.8</span>
                  <span className="text-xs text-slate-500">December 28, 2025</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Image Generation</h3>
                <p className="text-slate-300 mb-3">
                  Google Imagen (Nano Banana Pro) creates professional, contextual hero images for every post. No more stock photos - every image is unique and on-brand.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-300">New Feature</span>
                  <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-lg text-xs text-violet-300">AI Integration</span>
                </div>
              </div>

              {/* v1.7 */}
              <div className="border-l-4 border-violet-500 pl-6 pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-violet-400">v1.7</span>
                  <span className="text-xs text-slate-500">December 27, 2025</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Claude Opus 4.5 Integration</h3>
                <p className="text-slate-300 mb-3">
                  Upgraded to Claude Opus 4.5 for superior content quality and best-in-class AI writing capabilities. Content is now more engaging, accurate, and professional.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300">Enhancement</span>
                  <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-lg text-xs text-violet-300">AI Upgrade</span>
                </div>
              </div>

              {/* v1.6 */}
              <div className="border-l-4 border-cyan-500 pl-6 pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-cyan-400">v1.6</span>
                  <span className="text-xs text-slate-500">December 27, 2025</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Enhanced UI/UX</h3>
                <p className="text-slate-300 mb-3">
                  Complete visual overhaul with pixel-perfect platform previews, gradient buttons, animated backgrounds, and glass morphism design. Modern, bold, and professional.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300">Enhancement</span>
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-lg text-xs text-purple-300">UI/UX</span>
                </div>
              </div>

              {/* v1.5 */}
              <div className="border-l-4 border-slate-500 pl-6 pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-slate-400">v1.5</span>
                  <span className="text-xs text-slate-500">December 26, 2025</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Platform Publishing</h3>
                <p className="text-slate-300 mb-3">
                  Direct publishing to X, LinkedIn, and blog with Typefully integration. One-click publishing with confirmation modals for safety.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-300">New Feature</span>
                  <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-lg text-xs text-violet-300">Integration</span>
                </div>
              </div>

              {/* v1.0 */}
              <div className="border-l-4 border-slate-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-slate-400">v1.0</span>
                  <span className="text-xs text-slate-500">December 25, 2025</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Initial Launch</h3>
                <p className="text-slate-300 mb-3">
                  Social Media Manager launched with core features: multi-platform content generation, history tracking, settings management, and preview system.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-300">Launch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-slate-500">
            Built by{' '}
            <a
              href="https://defendresolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline transition-colors"
            >
              DefendreSolutions.com
            </a>
            <span className="mx-2">•</span>
            <span className="text-slate-600">Powered by Claude Opus 4.5 & Google Imagen</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
