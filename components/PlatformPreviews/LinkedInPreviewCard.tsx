'use client'

interface LinkedInPreviewCardProps {
  content: string
  profileName?: string
  profileTitle?: string
  profileImage?: string
  timestamp?: string
}

export default function LinkedInPreviewCard({
  content,
  profileName = 'Your Name',
  profileTitle = 'Your Professional Title',
  profileImage,
  timestamp = '2h'
}: LinkedInPreviewCardProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Profile Image */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700
            flex items-center justify-center text-white font-semibold shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={profileName} className="w-full h-full rounded-full object-cover" />
            ) : (
              profileName[0]?.toUpperCase() || 'Y'
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-[14px] hover:underline hover:text-blue-700 cursor-pointer">
                  {profileName}
                </h3>
                <p className="text-gray-600 text-[12px] leading-tight">{profileTitle}</p>
                <div className="flex items-center gap-1 mt-1 text-gray-500 text-[12px]">
                  <span>{timestamp}</span>
                  <span>•</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a7 7 0 1 0 7 7 7 7 0 0 0-7-7zM3 8a5 5 0 0 1 5-5v5h5a5 5 0 1 1-10 0z"/>
                  </svg>
                </div>
              </div>

              {/* More menu */}
              <button className="text-gray-600 hover:bg-gray-100 rounded p-1 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-3 text-gray-800 text-[14px] leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>

      {/* Engagement Bar */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-gray-600 text-[12px]">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-blue-600 border border-white flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
              </div>
              <div className="w-4 h-4 rounded-full bg-green-600 border border-white flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
              </div>
              <div className="w-4 h-4 rounded-full bg-yellow-500 border border-white flex items-center justify-center">
                <span className="text-[8px]">💡</span>
              </div>
            </div>
            <span className="ml-1 hover:text-blue-700 hover:underline cursor-pointer">127</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:text-blue-700 hover:underline cursor-pointer">23 comments</span>
            <span>•</span>
            <span className="hover:text-blue-700 hover:underline cursor-pointer">8 reposts</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 border-t border-gray-200 flex items-center justify-around">
        {/* Like */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span className="text-[13px] font-semibold">Like</span>
        </button>

        {/* Comment */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[13px] font-semibold">Comment</span>
        </button>

        {/* Repost */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-[13px] font-semibold">Repost</span>
        </button>

        {/* Send */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span className="text-[13px] font-semibold">Send</span>
        </button>
      </div>
    </div>
  )
}
