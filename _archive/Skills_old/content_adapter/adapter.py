#!/usr/bin/env python3
"""
Content Adapter Skill
Transforms content for X, LinkedIn, and Blog platforms
"""

import re
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List, Any

# Add parent for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from content_manager import ContentManager, PRODUCTION_BLOG_PATH


class ContentAdapter:
    """Adapts content for different social media platforms and blog"""

    # Platform-specific hashtags by topic
    LINKEDIN_HASHTAGS = {
        "ai": ["#AI", "#ArtificialIntelligence", "#MachineLearning"],
        "automation": ["#Automation", "#BusinessAutomation", "#Productivity"],
        "small business": ["#SmallBusiness", "#SMB", "#Entrepreneurship"],
        "veteran": ["#Veteran", "#VeteranOwned", "#MilitaryTransition"],
        "tech": ["#Technology", "#TechInnovation", "#DigitalTransformation"],
        "cybersecurity": ["#Cybersecurity", "#InfoSec", "#DataSecurity"],
        "default": ["#BusinessGrowth", "#Innovation", "#TechTrends"]
    }

    # Image suggestions by topic
    IMAGE_SUGGESTIONS = {
        "ai": "ai-tools-social.jpg",
        "automation": "last-economy-social.jpg",
        "veteran": "defense-tech-social.jpg",
        "code": "claude-code-social.jpg",
        "business": "last-economy-social.jpg",
        "default": "ai-tools-social.jpg"
    }

    def __init__(self):
        self.content_manager = ContentManager()

    def adapt(self, content: str, title: Optional[str] = None) -> Dict[str, Any]:
        """
        Adapt content for all platforms.

        Args:
            content: Original content to adapt
            title: Optional title for blog post

        Returns:
            Dict with x, linkedin, blog, and original keys
        """
        return {
            "x": self.adapt_for_x(content),
            "linkedin": self.adapt_for_linkedin(content),
            "blog": self.adapt_for_blog(content, title),
            "original": content
        }

    def adapt_for_x(self, content: str) -> str:
        """
        Adapt content for X (Twitter).

        - Converts to thread if > 280 chars
        - Adds line breaks for readability
        - Converts bullet points to arrows
        - Shortens CTA
        """
        # Clean up content
        text = self._clean_content(content)

        # Convert bullet points to arrows
        text = re.sub(r'^[\s]*[-•]\s*', '→ ', text, flags=re.MULTILINE)
        text = re.sub(r'^\s*\d+\.\s*', '→ ', text, flags=re.MULTILINE)

        # Shorten CTA
        text = re.sub(
            r'(?:Visit|Learn more at|Check out)\s+(?:https?://)?(?:www\.)?DefendreSolutions\.com[^\s]*',
            '→ DefendreSolutions.com',
            text,
            flags=re.IGNORECASE
        )

        # Remove hashtags (or keep max 1)
        text = re.sub(r'\s*#\w+', '', text)

        # Add line breaks after sentences for readability
        text = self._add_line_breaks(text)

        # Check if needs thread
        if len(text) > 280:
            text = self._create_thread(text)

        return text.strip()

    def adapt_for_linkedin(self, content: str) -> str:
        """
        Adapt content for LinkedIn.

        - Expands with professional context
        - Adds engaging question
        - Converts bullets to professional format
        - Adds relevant hashtags
        """
        text = self._clean_content(content)

        # Convert arrows back to bullets
        text = re.sub(r'^→\s*', '• ', text, flags=re.MULTILINE)

        # Ensure proper paragraphing
        text = self._format_paragraphs(text)

        # Add engaging question if not present
        if '?' not in text:
            text = self._add_engaging_question(text)

        # Fix CTA to be more professional
        text = re.sub(
            r'→\s*DefendreSolutions\.com',
            'Learn more at DefendreSolutions.com',
            text
        )

        # Add hashtags
        hashtags = self._get_linkedin_hashtags(text)
        if hashtags and '#' not in text:
            text = text.rstrip() + '\n\n' + ' '.join(hashtags)

        return text.strip()

    def adapt_for_blog(
        self,
        content: str,
        title: Optional[str] = None,
        keywords: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Adapt content for blog post.

        Returns dict with title, content, and meta information.
        """
        text = self._clean_content(content)

        # Generate title if not provided
        if not title:
            title = self._generate_title(text)

        # Generate meta description
        meta_description = self._generate_meta_description(text)

        # Detect keywords
        if not keywords:
            keywords = self._detect_keywords(text)

        # Suggest hero image
        hero_image = self._suggest_hero_image(text)

        # Create blog structure
        blog_content = self._expand_to_blog(text, title)

        # Create frontmatter
        date = datetime.now().strftime("%Y-%m-%d")
        slug = self._slugify(title)

        frontmatter = f'''---
title: "{title}"
description: "{meta_description}"
date: "{date}"
author: "Steve Defendre"
keywords: {json.dumps(keywords)}
slug: "{slug}"
heroImage: "/blog/{hero_image}"
---

'''
        full_content = frontmatter + blog_content

        return {
            "title": title,
            "slug": slug,
            "meta_description": meta_description,
            "keywords": keywords,
            "hero_image": hero_image,
            "content": full_content,
            "word_count": len(blog_content.split())
        }

    def adapt_topic(
        self,
        topic: str,
        key_points: Optional[List[str]] = None,
        title: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create content for all platforms from a topic and key points.

        Args:
            topic: Main topic/idea
            key_points: List of key points to cover
            title: Optional title for blog

        Returns:
            Dict with adapted content for each platform
        """
        # Build base content from topic and points
        content = topic
        if key_points:
            content += "\n\nKey points:\n"
            for point in key_points:
                content += f"- {point}\n"

        return self.adapt(content, title)

    def needs_thread(self, content: str) -> bool:
        """Check if content needs to be a thread for X"""
        clean = self._clean_content(content)
        return len(clean) > 280

    def save_blog_post(self, blog_result: Dict[str, Any], deploy: bool = True) -> Dict[str, str]:
        """
        Save blog post to Content folder and optionally deploy to production.

        Args:
            blog_result: Result from adapt_for_blog()
            deploy: If True, also deploy to DefendreSolutions folder

        Returns:
            Dict with file paths
        """
        return self.content_manager.save_blog_post(
            content=blog_result["content"],
            title=blog_result["title"],
            slug=blog_result["slug"],
            deploy_to_production=deploy
        )

    # === Private Helper Methods ===

    def _clean_content(self, content: str) -> str:
        """Clean and normalize content"""
        text = content.strip()
        # Normalize whitespace
        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r' {2,}', ' ', text)
        return text

    def _add_line_breaks(self, text: str) -> str:
        """Add line breaks for X readability"""
        # Add break after sentences if line is long
        lines = []
        for line in text.split('\n'):
            if len(line) > 100:
                # Split on sentence boundaries
                sentences = re.split(r'(?<=[.!?])\s+', line)
                lines.extend(sentences)
            else:
                lines.append(line)
        return '\n\n'.join(lines)

    def _create_thread(self, text: str) -> str:
        """Convert long content into a thread format"""
        # Split into logical chunks
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]

        tweets = []
        current_tweet = ""

        for para in paragraphs:
            # If paragraph fits in current tweet
            if len(current_tweet + '\n\n' + para) <= 280:
                current_tweet = (current_tweet + '\n\n' + para).strip()
            else:
                # Save current and start new
                if current_tweet:
                    tweets.append(current_tweet)
                # If para itself is too long, split it
                if len(para) > 280:
                    words = para.split()
                    current_tweet = ""
                    for word in words:
                        if len(current_tweet + ' ' + word) <= 275:
                            current_tweet = (current_tweet + ' ' + word).strip()
                        else:
                            if current_tweet:
                                tweets.append(current_tweet)
                            current_tweet = word
                else:
                    current_tweet = para

        if current_tweet:
            tweets.append(current_tweet)

        # Format as thread with separators
        if len(tweets) > 1:
            # Add numbering if > 3 tweets
            if len(tweets) > 3:
                tweets = [f"{i+1}/ {t}" for i, t in enumerate(tweets)]
            return '\n\n\n\n'.join(tweets)

        return text[:280]

    def _format_paragraphs(self, text: str) -> str:
        """Format text into proper paragraphs for LinkedIn"""
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        return '\n\n'.join(paragraphs)

    def _add_engaging_question(self, text: str) -> str:
        """Add an engaging question for LinkedIn"""
        questions = [
            "What's your take on this?",
            "Have you experienced this in your business?",
            "What would you add to this list?",
            "What's been your experience?",
            "How are you approaching this challenge?"
        ]
        # Pick based on content hash for consistency
        idx = hash(text) % len(questions)
        return text.rstrip() + '\n\n' + questions[idx]

    def _get_linkedin_hashtags(self, text: str) -> List[str]:
        """Get relevant LinkedIn hashtags based on content"""
        text_lower = text.lower()
        hashtags = set()

        for keyword, tags in self.LINKEDIN_HASHTAGS.items():
            if keyword in text_lower:
                hashtags.update(tags[:2])  # Max 2 per category

        if not hashtags:
            hashtags.update(self.LINKEDIN_HASHTAGS["default"])

        return list(hashtags)[:5]  # Max 5 total

    def _generate_title(self, text: str) -> str:
        """Generate a blog title from content"""
        # Take first sentence or line
        first_line = text.split('\n')[0].split('.')[0]

        # Clean it up
        title = first_line.strip()
        if len(title) > 60:
            title = title[:57] + "..."

        # Make it title case
        title = title.title()

        # Remove leading articles for punchier titles
        title = re.sub(r'^(The|A|An)\s+', '', title)

        return title

    def _generate_meta_description(self, text: str) -> str:
        """Generate SEO meta description (150-160 chars)"""
        # Take first 2 sentences
        sentences = re.split(r'[.!?]\s+', text)
        desc = '. '.join(sentences[:2]) + '.'

        if len(desc) > 160:
            desc = desc[:157] + "..."

        return desc

    def _detect_keywords(self, text: str) -> List[str]:
        """Detect keywords from content"""
        text_lower = text.lower()
        keywords = []

        keyword_map = {
            "ai": ["AI", "artificial intelligence"],
            "automation": ["automation", "automate"],
            "small business": ["small business", "SMB"],
            "veteran": ["veteran", "military"],
            "cybersecurity": ["cybersecurity", "security"],
            "development": ["development", "software", "code"]
        }

        for key, variants in keyword_map.items():
            for variant in variants:
                if variant.lower() in text_lower:
                    keywords.append(key)
                    break

        return keywords or ["technology", "business"]

    def _suggest_hero_image(self, text: str) -> str:
        """Suggest a hero image based on content"""
        text_lower = text.lower()

        for keyword, image in self.IMAGE_SUGGESTIONS.items():
            if keyword in text_lower:
                return image

        return self.IMAGE_SUGGESTIONS["default"]

    def _expand_to_blog(self, text: str, title: str) -> str:
        """Expand content into blog format with sections"""

        # Create introduction
        intro = f"""## Introduction

{text.split('.')[0]}. In this post, we'll explore this topic in depth and provide actionable insights you can apply immediately.

"""

        # Create main sections based on content
        sections = self._create_blog_sections(text)

        # Create conclusion
        conclusion = """## Conclusion

The key takeaway is clear: taking action today puts you ahead of those who wait. Whether you're just getting started or looking to optimize your current approach, the principles we've covered provide a solid foundation.

---

*Ready to take the next step? Visit [DefendreSolutions.com](https://defendresolutions.com) to learn how we can help you achieve your goals.*
"""

        return intro + sections + conclusion

    def _create_blog_sections(self, text: str) -> str:
        """Create blog sections from content"""
        # Split content into key points
        points = []

        # Extract bullet points
        bullet_matches = re.findall(r'[→•-]\s*(.+?)(?=\n|$)', text)
        points.extend(bullet_matches)

        # If no bullets, split by sentences
        if not points:
            sentences = re.split(r'[.!?]\s+', text)
            points = [s for s in sentences if len(s) > 20][:5]

        # Create sections
        sections = ""
        section_titles = [
            "The Current Landscape",
            "Key Strategies",
            "Implementation Tips",
            "Real-World Applications",
            "Looking Ahead"
        ]

        for i, (title, point) in enumerate(zip(section_titles, points)):
            if i >= len(points):
                break
            sections += f"""## {title}

{point}

This is particularly important because it directly impacts your ability to compete effectively in today's market. Consider how this applies to your specific situation and what steps you can take immediately.

"""

        return sections

    def _slugify(self, text: str) -> str:
        """Convert text to URL-friendly slug"""
        slug = text.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_]+', '-', slug)
        slug = re.sub(r'-+', '-', slug)
        return slug.strip('-')


def show_usage():
    print("Content Adapter - Transform content for X, LinkedIn, and Blog")
    print()
    print("Usage: python3 adapter.py <content> [options]")
    print()
    print("Options:")
    print("  --platform, -p   Platform(s): x, linkedin, blog (can repeat)")
    print("  --json           Output as JSON")
    print("  --save           Save blog post to file")
    print("  --title          Title for blog post")
    print()
    print("Examples:")
    print('  python3 adapter.py "Your content here"')
    print('  python3 adapter.py "Content" --platform x')
    print('  python3 adapter.py "Content" --platform blog --save')
    print('  python3 adapter.py "Content" --json')


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Content Adapter")
    parser.add_argument("content", nargs="?", help="Content to adapt")
    parser.add_argument("--platform", "-p", action="append", help="Platform(s) to adapt for")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--save", action="store_true", help="Save blog post to file")
    parser.add_argument("--title", help="Title for blog post")

    args = parser.parse_args()

    if not args.content:
        show_usage()
        return 0

    adapter = ContentAdapter()

    # Determine platforms
    platforms = args.platform or ["x", "linkedin", "blog"]

    results = {}

    if "x" in platforms:
        results["x"] = adapter.adapt_for_x(args.content)

    if "linkedin" in platforms:
        results["linkedin"] = adapter.adapt_for_linkedin(args.content)

    if "blog" in platforms:
        results["blog"] = adapter.adapt_for_blog(args.content, args.title)

        if args.save:
            paths = adapter.save_blog_post(results["blog"])
            results["blog"]["saved_to"] = paths

    # Output
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        for platform, content in results.items():
            print(f"\n{'='*50}")
            print(f"  {platform.upper()}")
            print(f"{'='*50}\n")

            if isinstance(content, dict):
                if "content" in content:
                    print(f"Title: {content.get('title', 'N/A')}")
                    print(f"Slug: {content.get('slug', 'N/A')}")
                    print(f"Keywords: {content.get('keywords', [])}")
                    print(f"Word Count: {content.get('word_count', 0)}")
                    print(f"\n{content['content'][:500]}...")
                else:
                    print(json.dumps(content, indent=2))
            else:
                print(content)

    return 0


if __name__ == "__main__":
    sys.exit(main())
