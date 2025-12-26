# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Agent Team is a social media content pipeline for DefendreSolutions.com. It creates complete content packages from a single topic: blog post, X post, LinkedIn post, and AI-generated image.

## Workflow

```
User: "Write about [topic]"
         │
         ▼
    1. Research (web search)
         │
         ▼
    2. Write Blog Post (800-1500 words)
       └── Save to Content/YYYY-MM/topic-slug/blog-post.md
       └── Copy to DefendreSolutions/blog_posts/topic-slug.md
         │
         ▼
    3. Generate AI Image (Nano Banana Pro)
       └── Save to Content/YYYY-MM/topic-slug/image.jpg
         │
         ▼
    4. Adapt for X → x-post.txt
         │
         ▼
    5. Adapt for LinkedIn → linkedin-post.txt
         │
         ▼
    6. Publish (python3 publish.py)
```

## Key Paths

| Purpose | Path |
|---------|------|
| Content Archive | `/Users/stevedefendre/Desktop/Agent Team/Content/YYYY-MM/topic-slug/` |
| Blog Production | `/Users/stevedefendre/Desktop/Code/Active Projects/code/DefendreSolutions/blog_posts/` |

**IMPORTANT**: Blog posts must be saved to BOTH locations.

## File Structure

```
Agent Team/
├── config.py              # API keys and settings
├── publish.py             # Publishing to X + LinkedIn via Typefully
├── SKILL.md               # Master reference (formats, APIs, troubleshooting)
├── .claude/agents/
│   └── social-media-manager.md
└── Content/
    └── YYYY-MM/
        └── topic-slug/
            ├── blog-post.md
            ├── x-post.txt
            ├── linkedin-post.txt
            └── image.jpg
```

## Commands

```bash
# Publish content to X and LinkedIn
python3 publish.py Content/2024-12/topic-slug/ -s next-free-slot

# Publish immediately
python3 publish.py Content/2024-12/topic-slug/ -s now

# List recent content folders
python3 publish.py --list-recent
```

## Content Formats

### X (Twitter)
- Hook first, short sentences, line breaks
- Thread: separate tweets with `\n\n\n\n`
- CTA: "→ DefendreSolutions.com"
- No hashtags (1-2 max)

### LinkedIn
- Professional storytelling
- 1000-1500 chars
- End with question
- 3-5 hashtags at bottom

### Blog
- 800-1500 words
- SEO title, meta description
- H2/H3 structure
- Frontmatter with title, date, keywords, heroImage

## APIs

- **Nano Banana Pro**: Image generation via Google endpoint
- **Typefully**: Social media publishing

See `SKILL.md` for full API documentation.
