#!/usr/bin/env python3
"""
Content Manager - Central path and content management for Agent Team
Handles file locations and production deployment
"""

import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List

# Base paths
AGENT_TEAM_ROOT = Path("/Users/stevedefendre/Desktop/Agent Team ")
CONTENT_ROOT = AGENT_TEAM_ROOT / "Content " / "SteveContentCreation"
SKILLS_ROOT = AGENT_TEAM_ROOT / "Skills"

# Content output paths
PATHS = {
    "images": CONTENT_ROOT / "generated-images",
    "blog_posts": CONTENT_ROOT / "blog-posts",
    "content_calendar": CONTENT_ROOT,
}

# Production deployment path
PRODUCTION_BLOG_PATH = Path("/Users/stevedefendre/Desktop/Code/Active Projects/code/DefendreSolutions/blog_posts")


class ContentManager:
    """Manages content paths and production deployment"""

    def __init__(self):
        # Ensure all directories exist
        for path in PATHS.values():
            path.mkdir(parents=True, exist_ok=True)

    @property
    def images_dir(self) -> Path:
        return PATHS["images"]

    @property
    def blog_posts_dir(self) -> Path:
        return PATHS["blog_posts"]

    @property
    def content_calendar_dir(self) -> Path:
        return PATHS["content_calendar"]

    def save_blog_post(
        self,
        content: str,
        title: str,
        slug: Optional[str] = None,
        deploy_to_production: bool = True
    ) -> Dict[str, str]:
        """
        Save a blog post to the Content folder and optionally deploy to production.

        Args:
            content: The markdown content of the blog post
            title: The title of the blog post
            slug: URL slug (auto-generated from title if not provided)
            deploy_to_production: If True, also copy to DefendreSolutions folder

        Returns:
            {"content_path": "/path/to/post.md", "production_path": "/path/or/None"}
        """
        if not slug:
            slug = self._slugify(title)

        filename = f"{slug}.md"

        # Save to Content folder
        content_path = self.blog_posts_dir / filename
        content_path.write_text(content)
        print(f"Saved blog post: {content_path}")

        result = {"content_path": str(content_path), "production_path": None}

        # Deploy to production if requested
        if deploy_to_production:
            production_path = self.deploy_blog_post(content_path)
            if production_path:
                result["production_path"] = str(production_path)

        return result

    def deploy_blog_post(self, source_path: Path) -> Optional[Path]:
        """
        Copy a blog post to the DefendreSolutions production folder.

        Args:
            source_path: Path to the blog post in Content folder

        Returns:
            Path to the deployed file, or None if deployment failed
        """
        source_path = Path(source_path)

        if not source_path.exists():
            print(f"Error: Source file not found: {source_path}")
            return None

        # Ensure production directory exists
        if not PRODUCTION_BLOG_PATH.exists():
            print(f"Warning: Production path does not exist: {PRODUCTION_BLOG_PATH}")
            print("Creating directory...")
            PRODUCTION_BLOG_PATH.mkdir(parents=True, exist_ok=True)

        dest_path = PRODUCTION_BLOG_PATH / source_path.name
        shutil.copy2(source_path, dest_path)
        print(f"Deployed to production: {dest_path}")

        return dest_path

    def deploy_all_blog_posts(self) -> List[Path]:
        """Deploy all blog posts from Content to production"""
        deployed = []

        for md_file in self.blog_posts_dir.glob("*.md"):
            result = self.deploy_blog_post(md_file)
            if result:
                deployed.append(result)

        return deployed

    def list_blog_posts(self) -> Dict[str, List[str]]:
        """List all blog posts in Content and production"""
        return {
            "content": [f.name for f in sorted(self.blog_posts_dir.glob("*.md"))],
            "production": [f.name for f in sorted(PRODUCTION_BLOG_PATH.glob("*.md"))]
            if PRODUCTION_BLOG_PATH.exists() else []
        }

    def list_images(self) -> Dict[str, List[str]]:
        """List all images organized by type"""
        images = {"hero": [], "social": [], "other": []}

        for ext in ["*.jpg", "*.png", "*.jpeg"]:
            for file in sorted(self.images_dir.glob(ext)):
                if "-hero" in file.stem:
                    images["hero"].append(file.name)
                elif "-social" in file.stem:
                    images["social"].append(file.name)
                else:
                    images["other"].append(file.name)

        return images

    def create_blog_post_template(
        self,
        title: str,
        description: str,
        keywords: List[str],
        hero_image: Optional[str] = None
    ) -> str:
        """
        Create a blog post markdown template with frontmatter.

        Args:
            title: Blog post title
            description: Meta description for SEO
            keywords: List of target keywords
            hero_image: Optional hero image filename

        Returns:
            Markdown template string
        """
        date = datetime.now().strftime("%Y-%m-%d")
        slug = self._slugify(title)

        frontmatter = f"""---
title: "{title}"
description: "{description}"
date: "{date}"
author: "Steve Defendre"
keywords: {keywords}
slug: "{slug}"
"""
        if hero_image:
            frontmatter += f'heroImage: "/blog/{hero_image}"\n'

        frontmatter += """---

## Introduction

[Opening hook - grab attention in first 2 sentences]

## [Main Section 1]

[Content]

## [Main Section 2]

[Content]

## [Main Section 3]

[Content]

## Conclusion

[Summary and call to action]

---

*Ready to [benefit]? Visit [DefendreSolutions.com](https://defendresolutions.com) to learn more.*
"""
        return frontmatter

    def _slugify(self, text: str) -> str:
        """Convert text to URL-friendly slug"""
        import re
        slug = text.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_]+', '-', slug)
        slug = re.sub(r'-+', '-', slug)
        return slug.strip('-')


def show_usage():
    print("Content Manager - Central content management for Agent Team")
    print()
    print("Usage: python content_manager.py <command> [options]")
    print()
    print("Commands:")
    print("  list-posts       List all blog posts (Content and Production)")
    print("  list-images      List all generated images")
    print("  deploy-all       Deploy all blog posts to production")
    print("  deploy <file>    Deploy specific blog post to production")
    print("  template <title> Create a new blog post template")
    print()
    print("Paths:")
    print(f"  Content:    {CONTENT_ROOT}")
    print(f"  Images:     {PATHS['images']}")
    print(f"  Blog Posts: {PATHS['blog_posts']}")
    print(f"  Production: {PRODUCTION_BLOG_PATH}")


def main():
    import sys

    cm = ContentManager()

    if len(sys.argv) < 2:
        show_usage()
        return 0

    command = sys.argv[1]

    if command == "list-posts":
        posts = cm.list_blog_posts()
        print("Blog Posts in Content folder:")
        for post in posts["content"]:
            print(f"  - {post}")
        print(f"\nBlog Posts in Production:")
        for post in posts["production"]:
            print(f"  - {post}")

    elif command == "list-images":
        images = cm.list_images()
        print("Hero Images:")
        for img in images["hero"]:
            print(f"  - {img}")
        print("\nSocial Images:")
        for img in images["social"]:
            print(f"  - {img}")
        if images["other"]:
            print("\nOther Images:")
            for img in images["other"]:
                print(f"  - {img}")

    elif command == "deploy-all":
        deployed = cm.deploy_all_blog_posts()
        print(f"\nDeployed {len(deployed)} blog posts to production")

    elif command == "deploy":
        if len(sys.argv) < 3:
            print("Error: Please specify file to deploy")
            return 1
        filepath = Path(sys.argv[2])
        if not filepath.is_absolute():
            filepath = cm.blog_posts_dir / filepath
        cm.deploy_blog_post(filepath)

    elif command == "template":
        if len(sys.argv) < 3:
            print("Error: Please specify title")
            return 1
        title = " ".join(sys.argv[2:])
        template = cm.create_blog_post_template(
            title=title,
            description=f"[Description for {title}]",
            keywords=["keyword1", "keyword2"]
        )
        print(template)

    else:
        print(f"Unknown command: {command}")
        show_usage()
        return 1

    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
