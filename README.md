# Social Media Manager Agent

A web app that generates social media content from a topic using AI.

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

- **AI Content Generation**: Uses Gemini to create blog posts, X posts, LinkedIn posts
- **Stock Images**: Automatically fetches relevant images
- **Publishing**: Publish directly to X, LinkedIn, and your blog
- **History**: View and reload previous generated posts
- **Settings**: Save API keys in browser (localStorage)
- **Mobile Responsive**: Works on all devices

## Project Structure

```
├── app/
│   ├── page.tsx              # Main page
│   └── api/
│       ├── generate-content/ # AI content generation
│       ├── publish/          # X & LinkedIn publishing
│       ├── publish-blog/     # Blog publishing
│       └── settings/         # Get env vars for pre-population
├── components/
│   ├── CreateView.tsx        # Topic input form
│   ├── ProgressView.tsx      # Generation progress
│   ├── PreviewView.tsx       # Content preview & publish
│   ├── HistoryView.tsx       # Previous posts
│   └── SettingsView.tsx      # API key management
├── store/
│   └── useStore.ts           # Zustand state
└── lib/
    └── utils.ts              # Helpers
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React + Tailwind CSS
- **State**: Zustand
- **AI**: Google Gemini
- **Publishing**: Typefully API

## License

MIT
