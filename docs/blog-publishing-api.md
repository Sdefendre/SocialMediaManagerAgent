# Blog Publishing API Instructions for Social Media Manager

## Overview
This document provides complete instructions for publishing blog posts to the DefendreSolutions website programmatically using the Blog Publishing API.

## API Endpoint

**Production URL:** `https://defendre-solutions.vercel.app/api/admin/publish-blog`
**Method:** POST
**Content-Type:** application/json

## Authentication

**API Key:** `74L5vT6xyPT5l1yf/keqAQktVeYffBxWtI8e34RTZzs=`

Include this key in the request headers using one of these methods:
- Header: `X-API-Key: 74L5vT6xyPT5l1yf/keqAQktVeYffBxWtI8e34RTZzs=`
- OR Header: `Authorization: Bearer 74L5vT6xyPT5l1yf/keqAQktVeYffBxWtI8e34RTZzs=`

## Request Format

### Required Fields

```json
{
  "title": "Your Blog Post Title",
  "excerpt": "A brief 1-2 sentence description of the post (shown in listings)",
  "author": "Steve Defendre",
  "date": "2025-12-28",
  "readTime": "5 min read",
  "tags": ["Technology", "AI", "Innovation"],
  "content": "Full blog post content in Markdown format"
}
```

### Field Requirements

1. **title** (required)
   - String, minimum 1 character
   - Will be used to generate the URL slug if not provided
   - Example: `"The Future of AI in 2025"`

2. **excerpt** (required)
   - String, minimum 1 character
   - Brief description shown in blog listings and search results
   - Keep it concise (1-2 sentences, 120-160 characters ideal)
   - Example: `"Exploring the latest trends and innovations shaping artificial intelligence in 2025."`

3. **author** (required)
   - String, minimum 1 character
   - Default: `"Steve Defendre"`
   - Example: `"Steve Defendre"` or `"Guest Author Name"`

4. **date** (required)
   - String in YYYY-MM-DD format
   - Typically today's date
   - Example: `"2025-12-28"`

5. **readTime** (required)
   - String indicating estimated reading time
   - Format: `"X min read"` where X is a number
   - Example: `"5 min read"`, `"10 min read"`

6. **tags** (required)
   - Array of strings, minimum 1 tag
   - Used for categorization and filtering
   - Recommended tags: Technology, AI, Innovation, Web Development, Cloud Computing, Cybersecurity, Digital Transformation, Machine Learning, Business Strategy, Case Study
   - Example: `["Technology", "AI", "Innovation"]`

7. **content** (required)
   - String, minimum 1 character
   - Full blog post content in Markdown/MDX format
   - Use proper Markdown syntax (see Content Formatting section below)

### Optional Fields

8. **slug** (optional)
   - Custom URL slug for the post
   - If not provided, will be auto-generated from title
   - Must be URL-friendly (lowercase, hyphens, no special characters)
   - Example: `"future-of-ai-2025"`

9. **lastUpdated** (optional)
   - String in YYYY-MM-DD format
   - Use when updating an existing post (requires different slug)
   - Example: `"2025-12-30"`

## Content Formatting

The `content` field should use Markdown syntax. Here are common formatting options:

### Headings
```markdown
# Main Heading (H1)
## Section Heading (H2)
### Subsection Heading (H3)
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
`inline code`
[Link text](https://example.com)
```

### Lists
```markdown
- Bullet point 1
- Bullet point 2
  - Nested bullet

1. Numbered item 1
2. Numbered item 2
```

### Code Blocks
````markdown
```javascript
const example = "code block";
console.log(example);
```
````

### Quotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Images
```markdown
![Alt text](https://example.com/image.jpg)
```

## Complete Example Request

### Using cURL

```bash
curl -X POST https://defendre-solutions.vercel.app/api/admin/publish-blog \
  -H "Content-Type: application/json" \
  -H "X-API-Key: 74L5vT6xyPT5l1yf/keqAQktVeYffBxWtI8e34RTZzs=" \
  -d '{
    "title": "5 Ways AI is Transforming Business in 2025",
    "excerpt": "Discover how artificial intelligence is revolutionizing business operations, customer service, and decision-making in 2025.",
    "author": "Steve Defendre",
    "date": "2025-12-28",
    "readTime": "7 min read",
    "tags": ["AI", "Technology", "Business Strategy"],
    "content": "# 5 Ways AI is Transforming Business in 2025\n\nArtificial intelligence continues to reshape the business landscape. Here are five key trends:\n\n## 1. Intelligent Automation\n\nBusinesses are leveraging AI to automate complex workflows...\n\n## 2. Enhanced Customer Experience\n\nAI-powered chatbots and personalization engines are creating more engaging customer experiences...\n\n## 3. Data-Driven Decision Making\n\nMachine learning models help executives make better decisions by analyzing vast amounts of data...\n\n## 4. Predictive Maintenance\n\nAI systems can predict equipment failures before they happen...\n\n## 5. Natural Language Processing\n\nNLP technologies are breaking down communication barriers...\n\n## Conclusion\n\nAs we move through 2025, AI will continue to be a critical competitive advantage for forward-thinking businesses."
  }'
```

### Using JavaScript/TypeScript

```javascript
async function publishBlogPost() {
  const response = await fetch('https://defendre-solutions.vercel.app/api/admin/publish-blog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': '74L5vT6xyPT5l1yf/keqAQktVeYffBxWtI8e34RTZzs='
    },
    body: JSON.stringify({
      title: "5 Ways AI is Transforming Business in 2025",
      excerpt: "Discover how artificial intelligence is revolutionizing business operations, customer service, and decision-making in 2025.",
      author: "Steve Defendre",
      date: "2025-12-28",
      readTime: "7 min read",
      tags: ["AI", "Technology", "Business Strategy"],
      content: `# 5 Ways AI is Transforming Business in 2025

Artificial intelligence continues to reshape the business landscape. Here are five key trends:

## 1. Intelligent Automation

Businesses are leveraging AI to automate complex workflows...

## 2. Enhanced Customer Experience

AI-powered chatbots and personalization engines are creating more engaging customer experiences...

## 3. Data-Driven Decision Making

Machine learning models help executives make better decisions by analyzing vast amounts of data...

## 4. Predictive Maintenance

AI systems can predict equipment failures before they happen...

## 5. Natural Language Processing

NLP technologies are breaking down communication barriers...

## Conclusion

As we move through 2025, AI will continue to be a critical competitive advantage for forward-thinking businesses.`
    })
  });

  const result = await response.json();
  console.log('Result:', result);
  return result;
}

publishBlogPost();
```

### Using Python

```python
import requests
import json

def publish_blog_post():
    url = "https://defendre-solutions.vercel.app/api/admin/publish-blog"

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": "74L5vT6xyPT5l1yf/keqAQktVeYffBxWtI8e34RTZzs="
    }

    payload = {
        "title": "5 Ways AI is Transforming Business in 2025",
        "excerpt": "Discover how artificial intelligence is revolutionizing business operations, customer service, and decision-making in 2025.",
        "author": "Steve Defendre",
        "date": "2025-12-28",
        "readTime": "7 min read",
        "tags": ["AI", "Technology", "Business Strategy"],
        "content": """# 5 Ways AI is Transforming Business in 2025

Artificial intelligence continues to reshape the business landscape. Here are five key trends:

## 1. Intelligent Automation

Businesses are leveraging AI to automate complex workflows...

## 2. Enhanced Customer Experience

AI-powered chatbots and personalization engines are creating more engaging customer experiences...

## 3. Data-Driven Decision Making

Machine learning models help executives make better decisions by analyzing vast amounts of data...

## 4. Predictive Maintenance

AI systems can predict equipment failures before they happen...

## 5. Natural Language Processing

NLP technologies are breaking down communication barriers...

## Conclusion

As we move through 2025, AI will continue to be a critical competitive advantage for forward-thinking businesses."""
    }

    response = requests.post(url, headers=headers, json=payload)
    result = response.json()
    print("Result:", result)
    return result

publish_blog_post()
```

## Response Examples

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Blog post published successfully",
  "post": {
    "slug": "5-ways-ai-is-transforming-business-in-2025",
    "url": "/blog/5-ways-ai-is-transforming-business-in-2025",
    "title": "5 Ways AI is Transforming Business in 2025"
  }
}
```

The post is now live at: `https://defendre-solutions.vercel.app/blog/5-ways-ai-is-transforming-business-in-2025`

### Error Responses

**401 Unauthorized - Invalid API Key**
```json
{
  "success": false,
  "message": "Unauthorized. Invalid API key."
}
```

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "path": ["title"],
      "message": "Title is required"
    }
  ]
}
```

**409 Conflict - Post Already Exists**
```json
{
  "success": false,
  "message": "A post with slug \"5-ways-ai-is-transforming-business-in-2025\" already exists. Use a different title or provide a custom slug."
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to publish blog post",
  "error": "Error details here"
}
```

## Best Practices

### Content Guidelines

1. **Title**:
   - Keep it concise (40-60 characters ideal)
   - Use title case
   - Make it compelling and descriptive
   - Include relevant keywords

2. **Excerpt**:
   - 120-160 characters is optimal for SEO
   - Should entice readers to click
   - Summarize the main value proposition

3. **Tags**:
   - Use 2-5 tags per post
   - Be consistent with existing tags
   - Choose tags that represent the main topics

4. **Content**:
   - Use proper Markdown formatting
   - Include headings (H2, H3) to break up content
   - Aim for 500-2000 words for substantial posts
   - Use bullet points and numbered lists for readability
   - Include code examples when relevant
   - Add images with descriptive alt text

5. **Read Time**:
   - Calculate approximately 200-250 words per minute
   - Round to nearest minute
   - Format as "X min read"

### Date Formatting

Always use YYYY-MM-DD format:
- ✅ Correct: `"2025-12-28"`
- ❌ Wrong: `"12/28/2025"`, `"28-12-2025"`, `"Dec 28, 2025"`

### Slug Best Practices

If providing a custom slug:
- Use lowercase letters only
- Replace spaces with hyphens
- Remove special characters
- Keep it short but descriptive
- Examples: `"ai-trends-2025"`, `"web-dev-best-practices"`

### Testing

Before publishing, you can test the API with a simple post:

```bash
curl -X POST https://defendre-solutions.vercel.app/api/admin/publish-blog \
  -H "Content-Type: application/json" \
  -H "X-API-Key: 74L5vT6xyPT5l1yf/keqAQktVeYffBxWtI8e34RTZzs=" \
  -d '{
    "title": "Test Post - DELETE ME",
    "excerpt": "This is a test post",
    "author": "Steve Defendre",
    "date": "2025-12-28",
    "readTime": "1 min read",
    "tags": ["Test"],
    "content": "# Test\n\nThis is a test post."
  }'
```

## Troubleshooting

### Common Issues

1. **"Unauthorized. Invalid API key"**
   - Double-check the API key in the header
   - Ensure there are no extra spaces or characters
   - Verify you're using the correct header name: `X-API-Key` or `Authorization: Bearer`

2. **"Validation failed"**
   - Check that all required fields are present
   - Verify date format is YYYY-MM-DD
   - Ensure tags is an array with at least one item
   - Make sure all strings have at least 1 character

3. **"Post already exists"**
   - The slug (generated from title or provided) is already used
   - Either change the title or provide a different custom slug

4. **Content formatting issues**
   - Escape special characters in JSON (quotes, backslashes, newlines)
   - Use `\n` for newlines in JSON strings
   - For multi-line content in code, use template literals or proper JSON escaping

### Getting Help

If you encounter issues:
1. Check the error message in the response
2. Verify all required fields are present and correctly formatted
3. Test with a minimal example first
4. Contact the development team with the full error response

## Security Notes

- **Never share the API key publicly** or commit it to version control
- **Keep the key secure** - treat it like a password
- **Use HTTPS** - the production URL already uses HTTPS
- If the key is compromised, contact the development team immediately to rotate it

## Workflow Recommendations

### For Social Media Manager Agent

1. **Content Creation**: Write the blog post content in Markdown
2. **Metadata**: Determine title, excerpt, tags, and read time
3. **Date**: Use today's date in YYYY-MM-DD format
4. **API Call**: Make the POST request with all required fields
5. **Verification**: Check the response for success/errors
6. **Confirmation**: On success, note the returned URL
7. **Promotion**: The post is immediately live and ready to share

### Example Workflow

```
1. Create content → "5 Ways AI is Transforming Business"
2. Write excerpt → "Discover how AI is revolutionizing..."
3. Choose tags → ["AI", "Technology", "Business Strategy"]
4. Calculate read time → "7 min read"
5. Format date → "2025-12-28"
6. Make API request → POST to endpoint
7. Get response → {"success": true, "url": "/blog/..."}
8. Share URL → https://defendre-solutions.vercel.app/blog/5-ways-ai...
```

## Additional Resources

- **Live Blog**: https://defendre-solutions.vercel.app/blog
- **Example Posts**: Visit the blog to see formatting examples
- **Markdown Guide**: https://www.markdownguide.org/basic-syntax/

---

**Last Updated**: December 28, 2025
**API Version**: 1.0
**Support Contact**: steve.defendre12@gmail.com
