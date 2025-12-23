---
name: image_generator
description: Generates AI images for blog posts, social media, and custom prompts using the Nano Banana Pro API. Use when the user asks to create images, generate visuals for posts, or needs hero/social images for DefendreSolutions.com content.
---

# Image Generator Skill

## Purpose

Generate high-quality AI images for DefendreSolutions.com blog posts and social media content using the Nano Banana Pro API.

## Capabilities

- **Blog Images**: Generate hero (1200x630) and social images for blog posts
- **Social Media Images**: Create visuals optimized for X and LinkedIn
- **Custom Images**: Generate images from any text prompt
- **Topic Matching**: Find existing images that match content topics

## Usage

### Python API (Recommended for Integration)

```python
from generator import ImageGenerator

# Initialize
gen = ImageGenerator()

# Generate image from prompt
result = gen.generate("cybersecurity shield protecting data", "my-image")
# Returns: {"success": True, "path": "/path/to/my-image.jpg"}

# Generate for blog post
result = gen.generate_blog_images("claude-code")
# Returns: {"success": True, "images": ["claude-code-hero.jpg", "claude-code-social.jpg"]}

# Generate image for social post content (auto-detects topic)
result = gen.generate_for_post("AI is transforming small business automation...")
# Returns: {"success": True, "path": "/path/to/ai-automation-social.jpg"}

# Find existing image for topic
path = gen.find_existing_image("ai coding tools")
# Returns: "/path/to/ai-tools-social.jpg" or None
```

### Command Line

```bash
cd Skills/image_generator

# Generate for blog post
python3 generator.py blog claude-code

# Generate all blog images
python generator.py all

# Generate custom image
python generator.py custom "futuristic veteran coder with AI assistant"

# Generate image for post content
python generator.py post "Your competitors are using AI while you're still doing everything manually..."

# Find existing image for topic
python generator.py find "defense technology"

# List all available images
python generator.py list
```

## Available Blog Posts

| Post Name | Images Generated |
|-----------|-----------------|
| `last-economy` | hero + social |
| `claude-code` | hero + social |
| `tesla` | hero + social |
| `grok-5` | hero + social |
| `ai-tools` | hero + social |
| `defense-tech` | hero + social |
| `ai-ethics` | hero + social |
| `after-scarcity` | hero only |
| `dreamguard` | hero only |
| `pulsepod` | hero only |

## Image Types

### Hero Images (`*-hero.jpg`)
- Dimensions: 1200x630px (landscape)
- Use: Blog post headers on DefendreSolutions.com
- Style: Cinematic, photorealistic, professional

### Social Images (`*-social.jpg`)
- Dimensions: Optimized for social cards
- Use: X (Twitter) and LinkedIn posts
- Style: Clean, eye-catching, shareable

## Topic Keywords for Auto-Matching

The generator can automatically select or create images based on content keywords:

| Keywords | Matched Image |
|----------|---------------|
| claude, code, ai coding | claude-code-social.jpg |
| ai tools, copilot, cursor, dev tools | ai-tools-social.jpg |
| economy, future of work, automation | last-economy-social.jpg |
| grok, xai, agi | grok-5-social.jpg |
| tesla, optimus, robotaxi | tesla-master-plan-social.jpg |
| defense, military, veteran tech | defense-tech-social.jpg |
| ethics, responsible ai, safety | ai-ethics-social.jpg |

## Integration with Other Skills

### Called by x-post-creator
When creating social posts, the x-post-creator automatically calls this skill to:
1. Check for existing matching images
2. Generate new images if none exist
3. Return the image path for attachment

### Workflow Example
```
User: "Create a post about AI automation for small business"
    ↓
x-post-creator: Drafts engaging post content
    ↓
image-generator: Generates/finds matching social image
    ↓
typefully.py: Posts to X/LinkedIn with image attached
```

## Environment Variables

```bash
# Required
NANO_BANANA_API_KEY=your-api-key-here

# Optional
IMAGE_OUTPUT_DIR=/path/to/output  # Default: Content/SteveContentCreation/generated-images
```

## Output Directory

All generated images are saved to:
```
/Users/stevedefendre/Desktop/Agent Team /Content /SteveContentCreation/generated-images/
```

## Prompt Engineering Tips

For best results, include:
- **Style**: photorealistic, cinematic, minimalist, professional
- **Composition**: wide shot, centered, split composition
- **Lighting**: warm, cool blue, golden hour, ambient
- **Colors**: specific palette (navy blue, silver, cyan accents)
- **Mood**: professional, futuristic, hopeful, serious

## Error Handling

- If API fails, the skill returns `{"success": False, "error": "message"}`
- If no matching image exists, returns `None` and suggests generating one
- Rate limits are handled with automatic retry (max 3 attempts)
