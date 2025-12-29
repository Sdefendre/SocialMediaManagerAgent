'use client'

interface XPreviewCardProps {
  content: string
  profileName?: string
  profileHandle?: string
  profileImage?: string
  timestamp?: string
}

export default function XPreviewCard({
  content,
  profileName = 'Your Name',
  profileHandle = 'yourhandle',
  profileImage,
  timestamp = '2h'
}: XPreviewCardProps) {
  return (
    <div className="max-w-xl mx-auto bg-black rounded-2xl border border-slate-800 p-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Profile Image */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600
          flex items-center justify-center text-white font-bold shrink-0">
          {profileImage ? (
            <img src={profileImage} alt={profileName} className="w-full h-full rounded-full object-cover" />
          ) : (
            profileName[0]?.toUpperCase() || 'Y'
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-[15px] hover:underline cursor-pointer">
              {profileName}
            </span>
            {/* Verified badge */}
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
            </svg>
            <span className="text-slate-500 text-[15px]">@{profileHandle}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-500 text-[15px] hover:underline cursor-pointer">{timestamp}</span>
          </div>
        </div>

        {/* More menu */}
        <button className="text-slate-500 hover:bg-sky-500/10 hover:text-sky-500 rounded-full p-1.5 -mr-1.5 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
          </svg>
        </button>
      </div>

      {/* Tweet Content */}
      <div className="text-white text-[15px] leading-normal whitespace-pre-wrap mb-3 pl-[60px]">
        {content}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pl-[60px] max-w-md pt-2">
        {/* Reply */}
        <button className="group flex items-center gap-2 text-slate-500 hover:text-sky-500 transition-colors">
          <div className="rounded-full p-2 group-hover:bg-sky-500/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-[13px]">42</span>
        </button>

        {/* Retweet */}
        <button className="group flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors">
          <div className="rounded-full p-2 group-hover:bg-green-500/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <span className="text-[13px]">17</span>
        </button>

        {/* Like */}
        <button className="group flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors">
          <div className="rounded-full p-2 group-hover:bg-pink-500/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-[13px]">234</span>
        </button>

        {/* Views */}
        <button className="group flex items-center gap-2 text-slate-500 hover:text-sky-500 transition-colors">
          <div className="rounded-full p-2 group-hover:bg-sky-500/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-[13px]">1.2K</span>
        </button>

        {/* Share */}
        <button className="group text-slate-500 hover:text-sky-500 transition-colors">
          <div className="rounded-full p-2 group-hover:bg-sky-500/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}
