# Social Media Manager Agent

AI-powered content generation for DefendreSolutions.com. Enter a topic, get a complete content package.

```
Topic  -->  Blog Post + X Post + LinkedIn Post + Hero Image
```

## Quick Start

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000) and add your API keys in Settings.

## API Keys

| Service | Purpose | Link |
|---------|---------|------|
| Google Gemini | Content + image generation | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| Typefully | X & LinkedIn publishing | [Typefully Settings](https://typefully.com/settings) |
| Blog API | Blog publishing | Your blog admin |

## Features

**Content Generation**
- AI-generated blog posts, X posts, and LinkedIn posts
- AI-generated hero images via Google Imagen
- Real-time streaming progress

**Content Calendar**
- Drag-and-drop scheduling
- Visual status indicators (draft/scheduled/published)
- Month navigation

**Publishing**
- One-click publish to X, LinkedIn, and blog
- Typefully integration for social scheduling

**History**
- Up to 50 previous generations saved
- Reload and re-publish past content

**Theme**
- Light/dark mode with system preference detection
- Persisted to localStorage

## Project Structure

```
app/
  page.tsx                 # Main UI
  layout.tsx               # Theme initialization
  globals.css              # CSS variables + theme
  api/
    generate-content/      # AI generation (SSE)
    publish/               # Social publishing
    publish-blog/          # Blog publishing

components/
  CreateView.tsx           # Topic input
  ProgressView.tsx         # Generation progress
  PreviewView.tsx          # Content preview + publish
  CalendarView.tsx         # Drag-and-drop scheduler
  HistoryView.tsx          # Past generations
  SettingsView.tsx         # API key config

store/
  useStore.ts              # Zustand state
```

## Tech Stack

- **Next.js 16** - App Router
- **React 19** - UI
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **@dnd-kit** - Drag and drop
- **date-fns** - Date utilities
- **Google Gemini** - AI content + images
- **Typefully API** - Social publishing

## Environment Variables

Optional `.env.local` (can also configure in Settings UI):

```env
GEMINI_API_KEY=your_key
TYPEFULLY_API_KEY=your_key
BLOG_API_KEY=your_key
BLOG_API_URL=https://your-blog.com/api
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint
```

## License

MIT
