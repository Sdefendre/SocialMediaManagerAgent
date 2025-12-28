"""
Blog Publisher Module
Publishes blog posts to DefendreSolutions.com using the Blog Publishing API
"""
import requests
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, Tuple
import config

class BlogPublisher:
    """Handles blog post publishing to DefendreSolutions.com"""

    def __init__(self, api_key: Optional[str] = None, api_url: Optional[str] = None):
        """
        Initialize the blog publisher

        Args:
            api_key: Blog API key (defaults to config.BLOG_API_KEY)
            api_url: Blog API URL (defaults to config.BLOG_API_URL)
        """
        self.api_key = api_key or config.BLOG_API_KEY
        self.api_url = api_url or config.BLOG_API_URL

        if not self.api_key:
            raise ValueError("Blog API key is required. Set BLOG_API_KEY in .env.local")

    def parse_markdown_frontmatter(self, content: str) -> Tuple[Dict, str]:
        """
        Parse frontmatter from markdown content

        Args:
            content: Markdown content with optional frontmatter

        Returns:
            Tuple of (frontmatter dict, content without frontmatter)
        """
        frontmatter = {}
        body = content

        # Check if content starts with frontmatter (---)
        if content.strip().startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                # Parse frontmatter
                frontmatter_text = parts[1].strip()
                body = parts[2].strip()

                # Extract frontmatter fields
                for line in frontmatter_text.split('\n'):
                    if ':' in line:
                        key, value = line.split(':', 1)
                        key = key.strip()
                        value = value.strip().strip('"').strip("'")

                        # Handle arrays (tags)
                        if value.startswith('[') and value.endswith(']'):
                            # Parse array
                            value = [v.strip().strip('"').strip("'") for v in value[1:-1].split(',')]

                        frontmatter[key] = value

        return frontmatter, body

    def extract_title_from_content(self, content: str) -> Optional[str]:
        """
        Extract title from markdown content (first H1)

        Args:
            content: Markdown content

        Returns:
            Title string or None
        """
        lines = content.split('\n')
        for line in lines:
            if line.strip().startswith('# '):
                return line.strip()[2:].strip()
        return None

    def extract_excerpt_from_content(self, content: str) -> str:
        """
        Generate excerpt from content (first paragraph after title)

        Args:
            content: Markdown content

        Returns:
            Excerpt string (max 160 characters)
        """
        lines = content.split('\n')
        for i, line in enumerate(lines):
            # Skip title
            if line.strip().startswith('# '):
                continue
            # Find first non-empty paragraph
            if line.strip() and not line.strip().startswith('#'):
                excerpt = line.strip()
                # Limit to 160 characters
                if len(excerpt) > 160:
                    excerpt = excerpt[:157] + '...'
                return excerpt

        return "Read this article to learn more."

    def publish_from_file(self, blog_file: Path) -> Dict:
        """
        Publish blog post from markdown file

        Args:
            blog_file: Path to blog post markdown file

        Returns:
            API response dict
        """
        if not blog_file.exists():
            raise FileNotFoundError(f"Blog file not found: {blog_file}")

        # Read blog content
        content = blog_file.read_text(encoding='utf-8')

        # Parse frontmatter and content
        frontmatter, body = self.parse_markdown_frontmatter(content)

        # Extract or use frontmatter values
        title = frontmatter.get('title') or self.extract_title_from_content(body)
        if not title:
            raise ValueError("Could not extract title from blog post")

        excerpt = frontmatter.get('excerpt') or frontmatter.get('description') or self.extract_excerpt_from_content(body)
        author = frontmatter.get('author', config.DEFAULT_AUTHOR)
        date = frontmatter.get('date', datetime.now().strftime('%Y-%m-%d'))
        tags = frontmatter.get('tags', config.DEFAULT_TAGS)
        read_time = frontmatter.get('readTime') or config.calculate_read_time(body)
        slug = frontmatter.get('slug')

        # Prepare payload
        payload = {
            "title": title,
            "excerpt": excerpt,
            "author": author,
            "date": date,
            "readTime": read_time,
            "tags": tags if isinstance(tags, list) else [tags],
            "content": body
        }

        if slug:
            payload["slug"] = slug

        return self.publish(payload)

    def publish(self, post_data: Dict) -> Dict:
        """
        Publish blog post to API

        Args:
            post_data: Blog post data (title, excerpt, author, date, readTime, tags, content)

        Returns:
            API response dict
        """
        # Validate required fields
        required_fields = ['title', 'excerpt', 'author', 'date', 'readTime', 'tags', 'content']
        missing_fields = [field for field in required_fields if field not in post_data]

        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

        # Prepare headers
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': self.api_key
        }

        # Make API request
        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=post_data,
                timeout=30
            )

            # Parse response
            result = response.json()

            # Handle response
            if response.status_code == 201:
                return {
                    'success': True,
                    'message': 'Blog post published successfully',
                    'post': result.get('post', {}),
                    'url': f"https://defendre-solutions.vercel.app{result.get('post', {}).get('url', '')}"
                }
            else:
                return {
                    'success': False,
                    'message': result.get('message', 'Unknown error'),
                    'errors': result.get('errors', []),
                    'status_code': response.status_code
                }

        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'message': f'API request failed: {str(e)}',
                'error': str(e)
            }

def publish_blog_from_content_dir(content_dir: Path) -> Dict:
    """
    Publish blog post from a content directory structure
    Expects: content_dir/blog-post.md

    Args:
        content_dir: Path to content directory

    Returns:
        API response dict
    """
    blog_file = content_dir / 'blog-post.md'

    if not blog_file.exists():
        raise FileNotFoundError(f"Blog post file not found: {blog_file}")

    publisher = BlogPublisher()
    return publisher.publish_from_file(blog_file)

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python blog_publisher.py <blog-post.md>")
        print("   or: python blog_publisher.py <content-directory>")
        sys.exit(1)

    path = Path(sys.argv[1])

    try:
        publisher = BlogPublisher()

        if path.is_file():
            result = publisher.publish_from_file(path)
        elif path.is_dir():
            result = publish_blog_from_content_dir(path)
        else:
            print(f"❌ Error: Path not found: {path}")
            sys.exit(1)

        # Print result
        if result['success']:
            print(f"✅ Blog post published successfully!")
            print(f"   Title: {result['post']['title']}")
            print(f"   URL: {result['url']}")
        else:
            print(f"❌ Failed to publish blog post")
            print(f"   Error: {result['message']}")
            if 'errors' in result:
                for error in result['errors']:
                    print(f"   - {error}")

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)
