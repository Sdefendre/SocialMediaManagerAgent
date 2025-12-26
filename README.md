# Agent Team Web App

A Next.js web application for creating and publishing social media content for **DefendreSolutions.com** and **@sdefendre**.

One topic → Blog post + X post + LinkedIn post + AI image → Published to all platforms.

## Features

- **Single Codebase**: Everything in TypeScript/Next.js
- **Web-Based**: No desktop app build process needed
- **AI Content Generation**: Gemini AI for blog, X, and LinkedIn content
- **Stock Images**: Unsplash integration for professional images
- **Multi-Platform Publishing**: Blog, X (Twitter), and LinkedIn
- **Modern UI**: Clean, responsive interface with real-time progress
- **In-Memory Storage**: No database required (optional Supabase support)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` file in the `web-app` directory:

```bash
# Content & Image Generation (Google AI)
GEMINI_API_KEY=your_google_api_key

# Social Media Publishing (Typefully)
TYPEFULLY_API_KEY=your_typefully_api_key
TYPEFULLY_SOCIAL_SET_ID=273516

# Blog Publishing (DefendreSolutions.com)
BLOG_API_KEY=your_blog_api_key
BLOG_API_URL=https://defendresolutions.com/api/admin/publish-blog

# Optional: App URL (for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: Supabase is optional. The app works without it using in-memory storage. Data will persist only while the server is running.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
web-app/
├── app/
│   ├── api/              # API routes
│   │   ├── content/      # Content CRUD operations (in-memory)
│   │   ├── publish/      # Publishing to X & LinkedIn
│   │   ├── publish-blog/ # Publishing to blog
│   │   ├── generate-image/ # Stock image fetching
│   │   └── generate-content/ # AI content generation (Gemini)
│   ├── page.tsx          # Main app page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── CreateView.tsx    # Content creation form
│   ├── ProgressView.tsx  # Generation progress
│   └── PreviewView.tsx   # Content preview & publishing
├── lib/                  # Utility functions
│   ├── config.ts         # Configuration
│   ├── storage.ts        # In-memory storage (no database)
│   └── utils.ts          # Helper functions
└── store/                # State management
    └── useStore.ts       # Zustand store
```

## Storage

The app currently uses **in-memory storage** - no database required! This means:

- ✅ Works immediately without setup
- ✅ No database configuration needed
- ⚠️ Data is lost when server restarts
- ⚠️ Data is not shared between server instances

For production use, you can:
- Add Supabase (see `supabase/schema.sql`)
- Use a different database
- Add file-based storage
- Use localStorage for client-side persistence

## API Routes

### POST /api/generate-content
Generate blog post, X post, LinkedIn post using Gemini AI

### POST /api/generate-image
Fetch relevant stock image from Unsplash

### POST /api/content
Create new content entry (stored in memory)

### GET /api/content
List all content (with optional filters)

### PUT /api/content
Update existing content

### POST /api/publish
Publish content to X and/or LinkedIn via Typefully

### POST /api/publish-blog
Publish blog post to DefendreSolutions.com

## Content Generation

The system uses **Gemini 2.0 Flash** to generate:

### Blog Posts
- 800-1500 words
- SEO-optimized with frontmatter
- H2/H3 structure
- Professional, business-focused

### X (Twitter) Posts
- 280 characters max
- Hook-first approach
- Call-to-action
- Minimal hashtags

### LinkedIn Posts
- 1000-1500 characters
- Professional storytelling
- Engaging questions
- 3-5 hashtags

### Images
- Stock photos from Unsplash
- Topic-relevant
- 1200x630 social media format

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The app will automatically deploy on every push to main.

**Note**: With in-memory storage, each server instance has its own data. For production, consider adding a database.

## Differences from Python Pipeline

- **No Electron**: Runs in browser instead
- **No Python**: All logic in TypeScript
- **No File System**: Uses in-memory storage (can add database later)
- **No CLI Spawning**: Direct API calls
- **Simpler Deployment**: Just deploy to Vercel

## Troubleshooting

### Image Generation Issues
- Using Unsplash stock images (free, no API key needed)
- Images are automatically fetched based on topic keywords

### Content Generation Fails
- Verify `GEMINI_API_KEY` is set correctly
- Check API quota/limits
- Review error logs in browser console

### Publishing Fails
- **Blog**: Verify `BLOG_API_KEY` is correct
- **Social**: Verify `TYPEFULLY_API_KEY` is correct
- Check `TYPEFULLY_SOCIAL_SET_ID` matches your account
- Ensure content is properly formatted

### Data Lost After Restart
- This is expected with in-memory storage
- Add a database (Supabase, PostgreSQL, etc.) for persistence
- Or use file-based storage for simple persistence
