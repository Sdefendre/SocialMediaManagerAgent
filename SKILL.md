# DefendreSolutions Social Media Manager

Master reference document for the content creation and publishing workflow.

## Overview

This system creates complete content packages from a single topic:
- Blog post (800-1500 words)
- X post (adapted for Twitter format)
- LinkedIn post (adapted for professional audience)
- AI-generated image

## Quick Start

```
User: "Write about [topic]"
→ System researches, writes, generates image, adapts for each platform, publishes
```

## File Structure

```
Agent Team/
├── config.py              # API keys and settings
├── publish.py             # Publishing script
├── SKILL.md               # This file
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

## Key Paths

| Purpose | Path |
|---------|------|
| Content Archive | `/Users/stevedefendre/Desktop/Agent Team/Content/` |
| Blog Production | `/Users/stevedefendre/Desktop/Code/Active Projects/code/DefendreSolutions/blog_posts/` |

**IMPORTANT**: Blog posts must be saved to BOTH locations.

---

## Content Workflow

### Step 1: Research
- Use web search to gather current information on the topic
- Find statistics, trends, expert opinions
- Note recent developments

### Step 2: Write Blog Post
- 800-1500 words
- SEO-optimized title with primary keyword
- Meta description (150-160 chars)
- H2/H3 heading structure
- End with call-to-action

**Save to**:
1. `Content/YYYY-MM/topic-slug/blog-post.md`
2. `/Users/stevedefendre/Desktop/Code/Active Projects/code/DefendreSolutions/blog_posts/topic-slug.md`

### Step 3: Generate AI Image
- Use Nano Banana Pro API
- Prompt should describe a professional, tech-focused image
- Landscape orientation (1200x630)
- Save to `Content/YYYY-MM/topic-slug/image.jpg`

### Step 4: Adapt for X
- Transform blog into X-optimized format
- Save to `Content/YYYY-MM/topic-slug/x-post.txt`

### Step 5: Adapt for LinkedIn
- Transform blog into LinkedIn-optimized format
- Save to `Content/YYYY-MM/topic-slug/linkedin-post.txt`

### Step 6: Publish
```bash
python3 publish.py Content/YYYY-MM/topic-slug/ -s next-free-slot
```

---

## Content Format Specifications

### X (Twitter) Format

**Characteristics**:
- Hook first line (bold claim or curiosity)
- Short sentences, punchy delivery
- Line breaks for readability
- Max 280 chars for single post, or thread format
- No hashtags (or 1-2 max if highly relevant)
- Direct, confident tone

**Thread Format**: Separate tweets with `\n\n\n\n` (four newlines)

**Structure**:
```
[Bold claim or hook]

[Supporting point 1]

[Supporting point 2]

[CTA or question]
```

**Example**:
```
Small businesses not using AI are falling behind.

Here's what AI handles now:

→ Customer support (24/7)
→ Appointment scheduling
→ Lead qualification

What YOU should focus on:

→ Strategy
→ Relationships

Work smarter, not harder.

AI solutions → DefendreSolutions.com
```

### LinkedIn Format

**Characteristics**:
- Professional storytelling tone
- First line is critical (appears before "see more")
- 1000-1500 characters ideal
- Paragraph breaks for readability
- End with engaging question
- 3-5 hashtags at the bottom
- Authoritative but approachable

**Structure**:
```
[Hook - bold statement or question]

[Context/story - 2-3 paragraphs]

[Key insight or takeaway]

[Question to drive comments]

#Hashtag1 #Hashtag2 #Hashtag3
```

**Example**:
```
Small businesses have a new superpower: AI automation.

I've watched companies with 5 employees outpace competitors 10x their size. Not because they worked harder—because they worked smarter.

Here's what these businesses are automating:

• Customer support running 24/7 without burnout
• Appointment scheduling that never misses a beat
• Lead qualification happening while they sleep

The competitive advantage used to be resources. Now it's adaptability.

What's one task eating up your time that AI could handle?

Learn more at DefendreSolutions.com

#SmallBusiness #AI #Automation #BusinessGrowth #Entrepreneurship
```

### Blog Format

**Characteristics**:
- SEO-friendly title with primary keyword
- Meta description: 150-160 characters
- 800-1500 words
- H2 sections for main points
- H3 subsections where needed
- Internal links to other DefendreSolutions content
- Conclusion with CTA

**Frontmatter**:
```markdown
---
title: "SEO Optimized Title Here"
description: "Meta description for search engines"
date: "2025-01-15"
author: "Steve Defendre"
keywords: ["primary keyword", "secondary keyword"]
heroImage: "/blog/image.jpg"
---
```

**Structure**:
```markdown
## Introduction
[Hook + what reader will learn]

## Main Section 1
[Content with depth]

## Main Section 2
[Content with examples]

## Main Section 3
[Actionable insights]

## Conclusion
[Summary + CTA]

---
*Ready to [benefit]? Visit [DefendreSolutions.com](https://defendresolutions.com) to get started.*
```

---

## API Reference

### Nano Banana Pro (Image Generation)

**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent`

**Request**:
```python
payload = {
    "contents": [{
        "parts": [{"text": "Generate an image: [your prompt]. Style: professional, modern, tech-focused"}]
    }],
    "generationConfig": {
        "responseModalities": ["TEXT", "IMAGE"]
    }
}

response = requests.post(
    f"{endpoint}?key={API_KEY}",
    headers={"Content-Type": "application/json"},
    json=payload
)
```

**Response**: Image data in `response['candidates'][0]['content']['parts'][0]['inlineData']['data']` (base64 encoded)

### Typefully API (Publishing)

**Base URL**: `https://api.typefully.com/v2`

**Headers**:
```python
headers = {
    "Authorization": "Bearer {API_KEY}",
    "Content-Type": "application/json"
}
```

**Create Draft**:
```python
POST /social-sets/{social_set_id}/drafts
{
    "platforms": {
        "x": {
            "enabled": true,
            "posts": [{"text": "Content here", "media_ids": ["id1"]}]
        },
        "linkedin": {
            "enabled": true,
            "posts": [{"text": "Content here", "media_ids": ["id1"]}]
        }
    },
    "publish_at": "now" | "next-free-slot" | "ISO datetime"
}
```

**Upload Image**:
1. `POST /social-sets/{id}/media/upload` → get `upload_url` and `media_id`
2. `PUT {upload_url}` with file data
3. Poll `GET /social-sets/{id}/media/{media_id}` until `status: "ready"`

---

## Commands Reference

### Publish Content
```bash
# Publish to both platforms, scheduled to next free slot
python3 publish.py Content/2024-12/topic-slug/ -s next-free-slot

# Publish immediately
python3 publish.py Content/2024-12/topic-slug/ -s now

# Publish to X only
python3 publish.py Content/2024-12/topic-slug/ -p x

# List recent content folders
python3 publish.py --list-recent
```

---

## Brand Guidelines

### Voice
- Authoritative but accessible
- Forward-thinking
- Positions DefendreSolutions as AI expertise source

### Topics
- AI tools and automation
- Business applications of AI
- Software development
- Veteran entrepreneurship
- Small business technology

### CTAs
- Always include a call-to-action
- Primary: Drive to DefendreSolutions.com
- X: Brief ("→ DefendreSolutions.com")
- LinkedIn: Professional invitation
- Blog: Multiple CTAs throughout

---

## Troubleshooting

### Image Generation Fails
- Check API key in config.py
- Simplify the prompt
- Retry (API has occasional timeouts)

### Publishing Fails
- Verify Typefully API key
- Check that content files exist in topic folder
- Ensure image was generated successfully

### Blog Not in Production
- Verify both save paths were written
- Check that production folder exists
- Manually copy if needed

---

## Quality Checklist

Before considering content complete:

- [ ] Blog post is 800-1500 words
- [ ] Blog saved to BOTH archive and production paths
- [ ] AI image generated (image.jpg exists)
- [ ] X post has hook, line breaks, CTA
- [ ] LinkedIn post has story, question, hashtags
- [ ] All 4 files present in topic folder
- [ ] publish.py executed successfully
