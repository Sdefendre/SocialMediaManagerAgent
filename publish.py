#!/usr/bin/env python3
"""
Social Media Publishing Script
Publishes content to X (Twitter), LinkedIn, and Blog from content directories

Usage:
    python publish.py Content/2025-12/topic-slug/ -s next-free-slot
    python publish.py Content/2025-12/topic-slug/ -s now --skip-blog
    python publish.py --list-recent
"""
import argparse
import json
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
import config
from blog_publisher import BlogPublisher

class SocialMediaPublisher:
    """Handles publishing to X, LinkedIn, and Blog"""

    def __init__(self):
        """Initialize the publisher with API credentials"""
        self.typefully_api_key = config.TYPEFULLY_API_KEY
        self.typefully_api_url = config.TYPEFULLY_API_URL
        self.typefully_social_set_id = config.TYPEFULLY_SOCIAL_SET_ID
        self.blog_publisher = BlogPublisher()

    def read_content_file(self, file_path: Path) -> str:
        """Read content from a file"""
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        return file_path.read_text(encoding='utf-8').strip()

    def publish_to_typefully(
        self,
        content: str,
        platform: str,
        schedule: str = "next-free-slot"
    ) -> Dict:
        """
        Publish content to X or LinkedIn via Typefully

        Args:
            content: Post content
            platform: "twitter" or "linkedin"
            schedule: "now", "next-free-slot", or ISO datetime string

        Returns:
            API response dict
        """
        if not self.typefully_api_key:
            raise ValueError("Typefully API key not configured")

        headers = {
            'X-API-KEY': self.typefully_api_key,
            'Content-Type': 'application/json'
        }

        # Prepare payload
        payload = {
            'content': content,
            'share': platform,
            'schedule-date': schedule
        }

        # Add social set ID if configured
        if self.typefully_social_set_id:
            payload['social-account-set-id'] = self.typefully_social_set_id

        try:
            response = requests.post(
                self.typefully_api_url,
                headers=headers,
                json=payload,
                timeout=30
            )

            result = response.json()

            if response.status_code in [200, 201]:
                return {
                    'success': True,
                    'platform': platform,
                    'message': f'Successfully published to {platform}',
                    'data': result
                }
            else:
                return {
                    'success': False,
                    'platform': platform,
                    'message': result.get('message', 'Unknown error'),
                    'status_code': response.status_code
                }

        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'platform': platform,
                'message': f'API request failed: {str(e)}',
                'error': str(e)
            }

    def publish_all(
        self,
        content_dir: Path,
        schedule: str = "next-free-slot",
        skip_x: bool = False,
        skip_linkedin: bool = False,
        skip_blog: bool = False
    ) -> Dict[str, Dict]:
        """
        Publish all content from a content directory

        Args:
            content_dir: Path to content directory
            schedule: Scheduling option for social posts
            skip_x: Skip X publishing
            skip_linkedin: Skip LinkedIn publishing
            skip_blog: Skip blog publishing

        Returns:
            Dict with results for each platform
        """
        if not content_dir.exists():
            raise FileNotFoundError(f"Content directory not found: {content_dir}")

        results = {}

        # Publish to X (Twitter)
        if not skip_x:
            x_file = content_dir / 'x-post.txt'
            if x_file.exists():
                print(f"📤 Publishing to X...")
                x_content = self.read_content_file(x_file)
                results['x'] = self.publish_to_typefully(x_content, 'twitter', schedule)

                if results['x']['success']:
                    print(f"   ✅ X post published successfully")
                else:
                    print(f"   ❌ X publishing failed: {results['x']['message']}")
            else:
                print(f"   ⚠️  X post file not found: {x_file}")
                results['x'] = {'success': False, 'message': 'File not found'}

        # Publish to LinkedIn
        if not skip_linkedin:
            linkedin_file = content_dir / 'linkedin-post.txt'
            if linkedin_file.exists():
                print(f"📤 Publishing to LinkedIn...")
                linkedin_content = self.read_content_file(linkedin_file)
                results['linkedin'] = self.publish_to_typefully(linkedin_content, 'linkedin', schedule)

                if results['linkedin']['success']:
                    print(f"   ✅ LinkedIn post published successfully")
                else:
                    print(f"   ❌ LinkedIn publishing failed: {results['linkedin']['message']}")
            else:
                print(f"   ⚠️  LinkedIn post file not found: {linkedin_file}")
                results['linkedin'] = {'success': False, 'message': 'File not found'}

        # Publish to Blog
        if not skip_blog:
            blog_file = content_dir / 'blog-post.md'
            if blog_file.exists():
                print(f"📤 Publishing to Blog...")
                try:
                    results['blog'] = self.blog_publisher.publish_from_file(blog_file)

                    if results['blog']['success']:
                        print(f"   ✅ Blog post published successfully")
                        print(f"   🔗 URL: {results['blog']['url']}")
                    else:
                        print(f"   ❌ Blog publishing failed: {results['blog']['message']}")
                except Exception as e:
                    print(f"   ❌ Blog publishing error: {str(e)}")
                    results['blog'] = {'success': False, 'message': str(e)}
            else:
                print(f"   ⚠️  Blog post file not found: {blog_file}")
                results['blog'] = {'success': False, 'message': 'File not found'}

        return results

def list_recent_content(limit: int = 10) -> List[Path]:
    """
    List recent content directories

    Args:
        limit: Number of recent directories to show

    Returns:
        List of content directory paths
    """
    content_root = config.CONTENT_DIR

    if not content_root.exists():
        print(f"⚠️  Content directory not found: {content_root}")
        return []

    # Find all content directories (YYYY-MM/topic-slug/)
    content_dirs = []

    for year_month_dir in sorted(content_root.glob('*'), reverse=True):
        if year_month_dir.is_dir():
            for topic_dir in sorted(year_month_dir.glob('*'), reverse=True):
                if topic_dir.is_dir():
                    content_dirs.append(topic_dir)

    return content_dirs[:limit]

def print_recent_content(limit: int = 10):
    """Print recent content directories"""
    content_dirs = list_recent_content(limit)

    if not content_dirs:
        print("No content directories found")
        return

    print(f"\n📁 Recent content ({len(content_dirs)}):\n")

    for i, content_dir in enumerate(content_dirs, 1):
        # Check which files exist
        has_blog = (content_dir / 'blog-post.md').exists()
        has_x = (content_dir / 'x-post.txt').exists()
        has_linkedin = (content_dir / 'linkedin-post.txt').exists()
        has_image = (content_dir / 'image.jpg').exists() or (content_dir / 'image.png').exists()

        files = []
        if has_blog:
            files.append('Blog')
        if has_x:
            files.append('X')
        if has_linkedin:
            files.append('LinkedIn')
        if has_image:
            files.append('Image')

        files_str = ', '.join(files) if files else 'No files'

        print(f"   {i}. {content_dir.relative_to(config.CONTENT_DIR)}")
        print(f"      Files: {files_str}")
        print()

def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description='Publish content to X, LinkedIn, and Blog',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Publish all content with next free slot scheduling
  python publish.py Content/2025-12/ai-trends/

  # Publish immediately
  python publish.py Content/2025-12/ai-trends/ -s now

  # Skip blog publishing
  python publish.py Content/2025-12/ai-trends/ --skip-blog

  # List recent content directories
  python publish.py --list-recent
        """
    )

    parser.add_argument(
        'content_dir',
        nargs='?',
        type=Path,
        help='Path to content directory (e.g., Content/2025-12/topic-slug/)'
    )

    parser.add_argument(
        '-s', '--schedule',
        choices=['now', 'next-free-slot'],
        default='next-free-slot',
        help='Scheduling option for social posts (default: next-free-slot)'
    )

    parser.add_argument(
        '--skip-x',
        action='store_true',
        help='Skip X (Twitter) publishing'
    )

    parser.add_argument(
        '--skip-linkedin',
        action='store_true',
        help='Skip LinkedIn publishing'
    )

    parser.add_argument(
        '--skip-blog',
        action='store_true',
        help='Skip blog publishing'
    )

    parser.add_argument(
        '--list-recent',
        action='store_true',
        help='List recent content directories'
    )

    args = parser.parse_args()

    # Handle list recent
    if args.list_recent:
        print_recent_content()
        return

    # Validate content directory
    if not args.content_dir:
        parser.error("content_dir is required (unless using --list-recent)")

    content_dir = args.content_dir.resolve()

    print(f"\n🚀 Publishing content from: {content_dir}\n")

    # Validate configuration
    if not config.validate_config():
        print("\n⚠️  Some API keys are missing. Publishing may fail.")
        print("Set API keys in .env.local file\n")

    # Create publisher and publish
    publisher = SocialMediaPublisher()

    try:
        results = publisher.publish_all(
            content_dir,
            schedule=args.schedule,
            skip_x=args.skip_x,
            skip_linkedin=args.skip_linkedin,
            skip_blog=args.skip_blog
        )

        # Print summary
        print("\n" + "="*50)
        print("📊 Publishing Summary")
        print("="*50)

        total = len(results)
        successful = sum(1 for r in results.values() if r.get('success'))

        for platform, result in results.items():
            status = "✅ Success" if result.get('success') else "❌ Failed"
            print(f"{platform.upper()}: {status}")
            if not result.get('success') and 'message' in result:
                print(f"  Error: {result['message']}")

        print(f"\nTotal: {successful}/{total} successful")
        print("="*50 + "\n")

    except Exception as e:
        print(f"\n❌ Error: {str(e)}\n")
        exit(1)

if __name__ == "__main__":
    main()
