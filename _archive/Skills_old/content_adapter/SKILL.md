---
name: content_adapter
description: Automatically adapts content for different platforms. Transforms a single piece of content into platform-optimized versions for X (Twitter), LinkedIn, and DefendreSolutions.com blog with appropriate formatting, length, and tone.
---

# Content Adapter Skill

## Purpose

Transform content into platform-optimized versions. Write once, publish everywhere with the right format for each platform.

## Supported Platforms

1. **X (Twitter)** - Short, punchy, threads for longer content
2. **LinkedIn** - Professional thought leadership
3. **Blog** - Long-form SEO-optimized articles for DefendreSolutions.com

## Platform Differences

| Aspect | X (Twitter) | LinkedIn | Blog |
|--------|-------------|----------|------|
| **Length** | 280 chars / threads | 150-300 words | 1000-2000 words |
| **Tone** | Casual, punchy | Professional | Authoritative, educational |
| **Format** | Short lines, hooks | Paragraphs | Headers, sections, SEO |
| **Hashtags** | 0-1 max | 3-5 at end | None (use keywords) |
| **CTA** | Brief link | Professional invite | Multiple CTAs |
| **Images** | Social image | Social image | Hero image |

## Usage

### Command Line

```bash
cd Skills/content_adapter

# Adapt content for ALL platforms (X, LinkedIn, Blog)
python3 adapter.py "Your original content here"

# Adapt for specific platform
python3 adapter.py "Your content" --platform x
python3 adapter.py "Your content" --platform linkedin
python3 adapter.py "Your content" --platform blog

# Adapt for multiple specific platforms
python3 adapter.py "Your content" --platform x --platform linkedin

# Output as JSON (for integration)
python3 adapter.py "Your content" --json

# Save blog post to file
python3 adapter.py "Your content" --platform blog --save
```

### Python API

```python
from adapter import ContentAdapter

adapter = ContentAdapter()

# Adapt for all platforms
result = adapter.adapt("Your original content here")
# Returns: {
#   "x": "Punchy X version...",
#   "linkedin": "Professional LinkedIn version...",
#   "blog": {"title": "...", "content": "...", "meta": {...}},
#   "original": "Your original content here"
# }

# Adapt for specific platform
x_version = adapter.adapt_for_x("Your content")
linkedin_version = adapter.adapt_for_linkedin("Your content")
blog_version = adapter.adapt_for_blog("Your content", title="My Blog Title")

# Get all three from one topic
result = adapter.adapt_topic(
    topic="AI automation for small business",
    key_points=["Point 1", "Point 2", "Point 3"]
)
```

## Adaptation Rules

### X (Twitter) Adaptations

1. **Length Check**: If > 280 chars, convert to thread
2. **Hook First**: Move most compelling point to first line
3. **Line Breaks**: Add breaks for scanability
4. **Trim Fluff**: Remove unnecessary words
5. **CTA**: Shorten to "→ DefendreSolutions.com"
6. **Hashtags**: Remove or limit to 1
7. **Arrows**: Use → for bullet points

### LinkedIn Adaptations

1. **Expand**: Add context and professional insights
2. **Hook Line**: Strong opening that appears in preview
3. **Paragraphs**: Structure with clear sections
4. **Add Value**: Include actionable takeaways
5. **CTA**: Professional invitation to engage
6. **Hashtags**: Add 3-5 relevant hashtags at end
7. **Bullets**: Use • for lists

### Blog Adaptations

1. **Title**: SEO-optimized headline with primary keyword
2. **Meta Description**: 150-160 char summary for search
3. **Introduction**: Hook + preview of value
4. **Headers**: H2/H3 structure for scanning
5. **Sections**: 3-5 main sections with depth
6. **Examples**: Add real-world applications
7. **Conclusion**: Summary + strong CTA
8. **Keywords**: Naturally integrate target keywords
9. **Word Count**: Expand to 1000-2000 words
10. **Internal Links**: Suggest related content

## Blog Output Format

```markdown
---
title: "SEO Optimized Title Here"
description: "Meta description for search engines (150-160 chars)"
date: "2025-01-15"
author: "Steve Defendre"
keywords: ["primary keyword", "secondary keyword"]
heroImage: "/blog/suggested-hero-image.jpg"
---

## Introduction

[Engaging hook and overview]

## Section 1

[Content with depth]

## Section 2

[Content with examples]

## Section 3

[Content with actionable insights]

## Conclusion

[Summary and call to action]

---

*Ready to [benefit]? Visit [DefendreSolutions.com](https://defendresolutions.com) to get started.*
```

## Integration with Workflow

The content adapter integrates with the full publishing workflow:

```bash
# Create adapted content for all platforms and publish
cd Skills/x-post-creator
python3 post_workflow.py "Your content" -s next-free-slot -l --adapt

# Or use the adapter directly, then post
cd Skills/content_adapter
python3 adapter.py "Your content" --json > /tmp/adapted.json
```

## Examples

### Input (Topic/Idea)
```
AI automation helps small businesses compete with larger companies by handling routine tasks
```

### X Output
```
Small businesses are outcompeting giants with AI.

Not because they have bigger budgets.

Because they're faster to adopt.

What AI handles:
→ Customer support (24/7)
→ Scheduling
→ Lead follow-ups
→ Content drafts

The advantage isn't size anymore.

It's speed.

→ DefendreSolutions.com
```

### LinkedIn Output
```
Small businesses have a new superpower: AI automation.

I've watched companies with 5 employees outpace competitors 10x their size. Not because they worked harder—because they worked smarter.

Here's what these businesses are automating:

• Customer support running 24/7 without burnout
• Appointment scheduling that never misses a beat
• Lead qualification happening while they sleep
• First drafts of content ready each morning

The result? Founders focusing on strategy and relationships instead of repetitive tasks.

The competitive advantage used to be resources. Now it's adaptability.

What's one task eating up your time that AI could handle?

Learn how to get started at DefendreSolutions.com

#SmallBusiness #AI #Automation #BusinessGrowth #Entrepreneurship
```

### Blog Output
```markdown
---
title: "How Small Businesses Are Using AI to Outcompete Industry Giants"
description: "Discover how AI automation helps small businesses compete with larger companies by handling routine tasks efficiently."
date: "2025-01-15"
keywords: ["AI automation", "small business", "business automation"]
heroImage: "/blog/ai-automation-social.jpg"
---

## The New Small Business Advantage

For decades, small businesses faced an uphill battle against larger competitors with deeper pockets and bigger teams. But artificial intelligence is changing that equation...

[Continues for 1000-2000 words with sections, examples, and CTAs]
```

## Content Flow

```
Original Idea/Content
         │
         ▼
   ContentAdapter
         │
    ┌────┴────┬────────┐
    ▼         ▼        ▼
   X       LinkedIn   Blog
 (thread)  (post)    (.md file)
    │         │        │
    ▼         ▼        ▼
Typefully  Typefully  DefendreSolutions.com
```
