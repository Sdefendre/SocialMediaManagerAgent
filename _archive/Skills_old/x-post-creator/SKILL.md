---
name: x-post-creator
description: Creates engaging social media content for X, LinkedIn, and DefendreSolutions.com blog. Auto-generates images using the image-generator skill. Supports image attachments and multi-platform posting. Use when the user asks to write tweets, LinkedIn posts, social media content, or blog promotion for @sdefendre.
---

# X Post Creator

## Purpose

Create compelling social media content that drives engagement, builds authority, and grows your audience across X, LinkedIn, and DefendreSolutions.com.

## Workflow Integration

This skill automatically integrates with the **image-generator** skill to create visual content for every post.

### Complete Post Workflow

```bash
cd Skills/x-post-creator

# Create post with auto-generated image
python3 post_workflow.py "Your post content here"

# Create and publish immediately with image
python3 post_workflow.py "Your post content" -s now

# Create, generate image, and schedule to next slot
python3 post_workflow.py "Your post content" -s next-free-slot

# Post to X AND LinkedIn with image
python3 post_workflow.py "Your post content" -s now -l

# Force new image generation (don't use existing)
python3 post_workflow.py "Your post content" --new-image

# Use custom image prompt
python3 post_workflow.py "Your post content" --image-prompt "futuristic AI cityscape"
```

### Workflow Steps

1. **Image Generation**: Analyzes post content, finds existing matching image or generates new one
2. **Post Preparation**: Formats content for target platforms (X, LinkedIn)
3. **Publishing**: Sends to Typefully with image attached

### Python API

```python
from post_workflow import PostWorkflow

workflow = PostWorkflow()

# Single post with auto-image
result = workflow.create_post_with_image(
    content="AI is transforming small business...",
    schedule="next-free-slot",
    linkedin=True
)

# Thread with image on first tweet
result = workflow.create_thread_with_image(
    tweets=["First tweet", "Second tweet", "Third tweet"],
    schedule="now"
)

# Batch posts
results = workflow.batch_create_posts(
    posts=["Post 1 content", "Post 2 content"],
    schedule="next-free-slot"
)
```

## Supported Platforms

- **X (Twitter)** - @sdefendre - Short-form content, threads
- **LinkedIn** - Professional content, longer posts
- **DefendreSolutions.com** - Blog posts with hero images

## Post Formats That Perform

### 1. Hook + Value Thread
Start with a compelling hook, deliver value in a thread.

```
Hook: "I spent 100 hours studying [topic]. Here's what nobody tells you:"

Thread format:
1/ The hook
2-8/ Key insights (one per post)
9/ Summary + CTA
```

### 2. Contrarian Take
Challenge conventional wisdom with a fresh perspective.

```
"Unpopular opinion: [contrarian view]

Here's why: [reasoning]

[Supporting evidence]"
```

### 3. Story + Lesson
Personal stories that teach something valuable.

```
"[Year] ago, I [made a mistake/had a breakthrough].

[Brief story - 2-3 sentences]

The lesson: [actionable takeaway]"
```

### 4. List Post
Scannable, high-value lists.

```
"[Number] [things] that [benefit]:

1. [Item] - [why it matters]
2. [Item] - [why it matters]
...

Bookmark this for later."
```

### 5. Question/Poll
Drive engagement through interaction.

```
"[Thought-provoking question]?

I'll go first: [your answer]

Reply with yours 👇"
```

## Engagement Principles

### The Hook (First Line)
- Stop the scroll in under 2 seconds
- Use numbers, questions, or bold claims
- Create curiosity gaps
- Avoid clickbait - deliver on the promise

**Strong hooks:**
- "I was wrong about [topic]."
- "[Number] lessons from [experience]:"
- "The [thing] nobody talks about:"
- "Stop doing [common mistake]."
- "What I'd tell my younger self about [topic]:"

### Content That Gets Shared
- **Useful** - Solves a problem or teaches something
- **Relatable** - People see themselves in it
- **Surprising** - Challenges assumptions
- **Emotional** - Makes people feel something
- **Simple** - One clear idea per post

### Call to Actions (CTAs)
- "Follow @sdefendre for more [topic]"
- "Repost if this helped you"
- "Bookmark this for later"
- "Reply with your experience"
- "Like if you agree"

## Formatting Best Practices

- **Line breaks** - Use white space, one thought per line
- **Short sentences** - Easy to scan on mobile
- **280 characters** - Single posts should be punchy
- **Threads** - For complex ideas, use 5-10 posts max
- **No hashtags** - They look spammy (1 max if needed)
- **Emojis** - Use sparingly for visual breaks

## Posting Strategy

### Best Times to Post
- Weekdays: 8-10 AM, 12-1 PM, 5-7 PM
- Weekends: 9-11 AM
- Adjust based on your audience's timezone

### Engagement Tactics
- Reply to comments within the first hour
- Quote tweet others with added value
- Engage with accounts in your niche daily
- Repost your best content after 3+ months

## Content Pillars for @sdefendre

When creating posts, align with these themes:
1. **Expertise** - Share knowledge in your field
2. **Behind the scenes** - Show your process/journey
3. **Opinions** - Take stances on industry topics
4. **Wins & lessons** - Celebrate and teach from experience
5. **Community** - Engage and uplift others

## About DefendreSolutions.com

**Defendre Solutions** is a veteran-owned software development firm founded by Steve (@sdefendre). The company combines military precision with modern AI technology.

### Services
- **Quick Wins** - Fast website launches, landing pages
- **AI Solutions** - Custom AI chatbots, business process automation
- **Modernization** - Code updates, tech stack consulting

### Industries Served
- Healthcare (medical services websites)
- Beauty/Personal Services (booking systems)
- E-commerce (full-stack platforms with payments)
- Startups (MVP development)
- Veterans (AI-powered education platforms)

### Tech Stack
React, PostgreSQL, AWS, Docker, Full-stack development

### Value Proposition
"Discipline, precision, and mission-first mentality" - production-ready applications that work today and scale for tomorrow.

### Blog Topics
- AI strategy for small businesses
- Veteran technology & transitions
- Software development best practices
- Economic trends in AI

### Target Audience
- Small business owners needing digital solutions
- Startups seeking MVPs
- Veterans in tech transitions
- Companies needing modernization

## Call to Actions (CTAs)

**Primary CTA:** Always drive traffic to DefendreSolutions.com

Use these CTA variations:
- "Learn more at DefendreSolutions.com"
- "Read the full breakdown → DefendreSolutions.com"
- "More AI insights at DefendreSolutions.com"
- "Building something? DefendreSolutions.com"
- "Free resources at DefendreSolutions.com/blog"
- "DM me or visit DefendreSolutions.com"

**Secondary CTAs:**
- "Follow @sdefendre for more [topic]"
- "Bookmark this for later"
- "Repost if this helped"

**CTA Placement:**
- Single posts: End with website CTA
- Threads: Final post includes website CTA
- Always make CTAs feel natural, not salesy

## Example Output

**Topic:** Learning to code

**Generated Post:**
```
I code daily.

Not because I'm talented.
Because I was mass broken.

The trick that changed everything:

Build projects, not tutorials.

Tutorials feel productive.
Projects make you productive.

Start with something embarrassingly small:
- A todo app
- A calculator
- A personal site

Ship it. Then improve it.

That's the loop that builds real skills.

More dev insights → DefendreSolutions.com
```

**Topic:** AI for small business

**Generated Post:**
```
Small businesses sleeping on AI will wake up behind.

Here's what's working right now:

→ AI chatbots handling 80% of customer questions
→ Automated scheduling saving 10+ hrs/week
→ Content generation at 10x the speed

You don't need a tech team.
You need the right tools + strategy.

The businesses winning aren't bigger.
They're faster.

Building an AI strategy?
DefendreSolutions.com
```

## Typefully Integration

This skill integrates with Typefully to draft and schedule posts to X and LinkedIn with image support.

### Basic Posting

```bash
# Save as draft
python typefully.py "Your content here"

# Publish immediately
python typefully.py "Your content here" --schedule now

# Schedule to next free slot
python typefully.py "Your content here" --schedule next-free-slot

# Schedule for specific time
python typefully.py "Your content here" --schedule "2025-01-20T14:00:00Z"
```

### Post with Images

```bash
# Post with image to X
python typefully.py "Your content" --image /path/to/image.jpg

# Post with image to X AND LinkedIn
python typefully.py "Your content" --image /path/to/image.jpg --linkedin

# List available images
python typefully.py --list-images
```

### Multi-Platform Posting

```bash
# Post to X only (default)
python typefully.py "Your content"

# Post to X AND LinkedIn
python typefully.py "Your content" --linkedin

# Post with image to both platforms
python typefully.py "Your content" --image image.jpg --linkedin --schedule now
```

### Thread Format

For threads, separate posts with 4 newlines (`\n\n\n\n`):

```bash
python typefully.py "First tweet\n\n\n\nSecond tweet\n\n\n\nThird tweet"
```

## Available Images

Images are stored at:
`/Users/stevedefendre/Desktop/Agent Team /Content /SteveContentCreation/generated-images`

### Social Images (for X/LinkedIn)
- `claude-code-social.jpg` - Claude Code, AI coding
- `ai-tools-social.jpg` - AI dev tools, Copilot, Cursor
- `last-economy-social.jpg` - AI economy, future of work
- `grok-5-social.jpg` - Grok, xAI, AGI
- `tesla-master-plan-social.jpg` - Tesla, Optimus, Robotaxi
- `defense-tech-social.jpg` - Defense tech, military AI
- `ai-ethics-social.jpg` - AI ethics, responsible AI

### Hero Images (for blog)
- `claude-code-hero.jpg`
- `ai-tools-hero.jpg`
- `last-economy-hero.jpg`
- `grok-5-hero.jpg`
- `tesla-master-plan-hero.jpg`
- `defense-tech-hero.jpg`
- `after-scarcity-hero.jpg`
- `dreamguard-hero.jpg`
- `pulsepod-hero.jpg`

## Blog Image Pairing

Pair hero images with DefendreSolutions.com blog posts:

```bash
# Pair all images with matching blog posts
python blog_images.py

# List unpaired images and posts
python blog_images.py --list

# Find social image for a topic
python blog_images.py --find-social "ai chatbots"
```

### Image Mappings
| Image | Blog Post |
|-------|-----------|
| claude-code-hero.jpg | claude-code-game-changer.mdx |
| ai-tools-hero.jpg | beyond-claude-code-ai-tools.mdx |
| last-economy-hero.jpg | the-last-economy.mdx |
| grok-5-hero.jpg | grok-5-agi-horizon-developer-perspective.mdx |
| tesla-master-plan-hero.jpg | tesla-master-plan-part-4.mdx |
| defense-tech-hero.jpg | agentic-ai-defense-veteran-perspective.mdx |

## Workflow

### For Social Posts (X/LinkedIn)
1. Generate engaging content
2. Select appropriate social image (if available)
3. Post via Typefully with `--image` flag
4. Add `--linkedin` for cross-posting

### For Blog Promotion
1. Write blog post on DefendreSolutions.com
2. Run `blog_images.py` to pair hero image
3. Create social post promoting the blog
4. Use matching social image
5. Include link to DefendreSolutions.com/blog/[slug]

## Requirements

```bash
pip install requests
```

## Instructions

When asked to create social content:

1. **Identify the platform(s)** - X, LinkedIn, or both
2. **Ask about the topic** if not provided
3. **Choose the best format** for the platform
4. **Write a scroll-stopping hook**
5. **Deliver clear value**
6. **End with DefendreSolutions.com CTA**
7. **Suggest appropriate image** from available library
8. **Offer posting options** - draft, schedule, or publish now
9. **Confirm platforms** - X only or X + LinkedIn
