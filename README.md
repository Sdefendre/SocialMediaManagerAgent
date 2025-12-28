# Social Media Manager Agent

A modern web app that generates social media content from any topic using AI. Built with Next.js 16 and powered by Google Gemini.

**Input:** A topic  
**Output:** Blog post + X post + LinkedIn post + Stock image

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Setup

1. Go to **Settings** in the app
2. Add your **Gemini API Key** (required)
3. Optionally add Typefully API key for X/LinkedIn publishing
4. Optionally add Blog API key for blog publishing

### Getting API Keys

| Service | Purpose | Get It |
|---------|---------|--------|
| Gemini | AI content generation | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| Typefully | X & LinkedIn publishing | [Typefully Settings](https://typefully.com/settings) |
| Blog API | Blog publishing | Your blog's admin panel |

## Features

### Content Generation
- **AI-Powered Content**: Uses Gemini to create optimized blog posts, X posts, and LinkedIn posts
- **Stock Images**: Automatically fetches relevant images from free stock photo APIs
- **Real-time Progress**: Live SSE streaming shows generation progress for each content type

### Content Preview
- **Tabbed Interface**: Switch between Blog, X, LinkedIn, and Image previews
- **Rendered/Raw Toggle**: View content as formatted markdown or raw source
- **Copy as Markdown**: One-click copy of blog content in markdown format
- **Styled Markdown Rendering**: Custom typography for headings, lists, code blocks, blockquotes, and links
- **Blog Frontmatter Parsing**: Automatic extraction and display of title, description, and tags

### Publishing
- **X (Twitter)**: Publish directly via Typefully API
- **LinkedIn**: Publish directly via Typefully API
- **Blog**: Publish to your custom blog endpoint

### History & Persistence
- **Post History**: View and reload up to 50 previous generations
- **Browser Storage**: API keys and history saved in localStorage
- **Session Persistence**: Resume previous work across browser sessions

### User Experience
- **Mobile Responsive**: Optimized layouts for all device sizes
- **Real-time Validation**: API key warnings and error handling
- **Premium Dark UI**: Modern glassmorphism design with gradient accents

## Project Structure

```
├── app/
│   ├── page.tsx              # Main page with view routing
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Global styles
│   └── api/
│       ├── generate-content/ # AI content generation (SSE)
│       ├── publish/          # X & LinkedIn publishing
│       ├── publish-blog/     # Blog publishing
│       └── settings/         # Environment variable fallbacks
├── components/
│   ├── CreateView.tsx        # Topic input & platform selection
│   ├── ProgressView.tsx      # Real-time generation progress
│   ├── PreviewView.tsx       # Tabbed content preview & publishing
│   ├── HistoryView.tsx       # Post history management
│   └── SettingsView.tsx      # API key configuration
├── store/
│   └── useStore.ts           # Zustand global state
├── lib/
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework with App Router |
| React | 19.2.3 | UI library |
| Tailwind CSS | 4.x | Utility-first styling |
| Zustand | 5.0.9 | Lightweight state management |
| react-markdown | 10.1.0 | Markdown rendering |
| Google Gemini | Latest | AI content generation |
| Typefully API | - | Social media publishing |

## Environment Variables

Create a `.env.local` file for server-side API keys (optional, can use Settings UI instead):

```env
GEMINI_API_KEY=your_gemini_api_key
TYPEFULLY_API_KEY=your_typefully_api_key
BLOG_API_KEY=your_blog_api_key
BLOG_API_URL=https://your-blog.com/api
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## License

MIT
