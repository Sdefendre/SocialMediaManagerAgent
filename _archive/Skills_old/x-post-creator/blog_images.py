#!/usr/bin/env python3
"""
Blog Image Pairing Script
Pairs generated images with DefendreSolutions blog posts
"""

import shutil
from pathlib import Path

# Paths
IMAGES_DIR = Path("/Users/stevedefendre/Desktop/Agent Team /Content /SteveContentCreation/generated-images")
BLOG_DIR = Path("/Users/stevedefendre/Desktop/Code/Active Projects/code/DefendreSolutions/content/blog")
PUBLIC_DIR = Path("/Users/stevedefendre/Desktop/Code/Active Projects/code/DefendreSolutions/public/blog")
TYPES_FILE = Path("/Users/stevedefendre/Desktop/Code/Active Projects/code/DefendreSolutions/types/blog.ts")

# Image to blog post mappings
IMAGE_MAPPINGS = {
    # Hero images -> Blog posts (for website)
    "claude-code-hero.jpg": "claude-code-game-changer.mdx",
    "ai-tools-hero.jpg": "beyond-claude-code-ai-tools.mdx",
    "last-economy-hero.jpg": "the-last-economy.mdx",
    "grok-5-hero.jpg": "grok-5-agi-horizon-developer-perspective.mdx",
    "tesla-master-plan-hero.jpg": "tesla-master-plan-part-4-ai-powered-sustainable-abundance.mdx",
    "defense-tech-hero.jpg": "agentic-ai-defense-veteran-perspective.mdx",
    "after-scarcity-hero.jpg": None,  # No matching MDX yet
    "ai-ethics-hero.jpg": None,  # No matching MDX yet
    "dreamguard-hero.jpg": None,  # No matching MDX yet
    "pulsepod-hero.jpg": None,  # No matching MDX yet
}

# Social images -> Topics (for X/LinkedIn posts)
SOCIAL_IMAGE_TOPICS = {
    "claude-code-social.jpg": ["claude code", "ai coding", "development tools"],
    "ai-tools-social.jpg": ["ai tools", "developer tools", "copilot", "cursor"],
    "last-economy-social.jpg": ["ai economy", "future of work", "automation"],
    "grok-5-social.jpg": ["grok", "xai", "agi", "artificial general intelligence"],
    "tesla-master-plan-social.jpg": ["tesla", "optimus", "robotaxi", "sustainable"],
    "defense-tech-social.jpg": ["defense tech", "military ai", "veteran tech"],
    "ai-ethics-social.jpg": ["ai ethics", "responsible ai", "ai safety"],
}


def setup_blog_images_directory():
    """Create public/blog directory if it doesn't exist"""
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Created directory: {PUBLIC_DIR}")


def copy_hero_images():
    """Copy hero images to public/blog directory"""
    setup_blog_images_directory()

    copied = []
    for image_name, blog_file in IMAGE_MAPPINGS.items():
        src = IMAGES_DIR / image_name
        if src.exists():
            dst = PUBLIC_DIR / image_name
            shutil.copy2(src, dst)
            copied.append(image_name)
            print(f"Copied: {image_name} -> {dst}")

    return copied


def update_mdx_frontmatter(mdx_file: Path, image_name: str):
    """Add image field to MDX frontmatter"""
    content = mdx_file.read_text()

    # Check if image field already exists
    if "image:" in content or "heroImage:" in content:
        print(f"  Image field already exists in {mdx_file.name}")
        return False

    # Find the end of frontmatter (second ---)
    parts = content.split("---", 2)
    if len(parts) < 3:
        print(f"  Invalid frontmatter in {mdx_file.name}")
        return False

    # Add image field before closing ---
    frontmatter = parts[1].rstrip()
    frontmatter += f'\nheroImage: "/blog/{image_name}"'

    new_content = f"---{frontmatter}\n---{parts[2]}"
    mdx_file.write_text(new_content)
    print(f"  Updated frontmatter: {mdx_file.name}")
    return True


def pair_images_with_posts():
    """Main function to pair all images with blog posts"""
    print("=" * 50)
    print("Blog Image Pairing")
    print("=" * 50)

    # Copy images to public directory
    print("\n1. Copying hero images to public/blog...")
    copied = copy_hero_images()
    print(f"   Copied {len(copied)} images")

    # Update MDX frontmatter
    print("\n2. Updating MDX frontmatter...")
    updated = 0
    for image_name, blog_file in IMAGE_MAPPINGS.items():
        if blog_file:
            mdx_path = BLOG_DIR / blog_file
            if mdx_path.exists():
                if update_mdx_frontmatter(mdx_path, image_name):
                    updated += 1
            else:
                print(f"  Blog file not found: {blog_file}")

    print(f"   Updated {updated} blog posts")

    # Summary
    print("\n" + "=" * 50)
    print("Image Pairings:")
    print("=" * 50)
    for image_name, blog_file in IMAGE_MAPPINGS.items():
        status = "✓" if blog_file else "○ (no blog post)"
        blog_name = blog_file or "unassigned"
        print(f"  {status} {image_name} -> {blog_name}")

    return {"copied": len(copied), "updated": updated}


def list_unpaired():
    """List images without blog posts and blog posts without images"""
    print("\nUnpaired Images (hero):")
    for image_name, blog_file in IMAGE_MAPPINGS.items():
        if not blog_file and "-hero" in image_name:
            print(f"  - {image_name}")

    print("\nBlog Posts Without Images:")
    for mdx_file in BLOG_DIR.glob("*.mdx"):
        has_image = False
        for image_name, blog_file in IMAGE_MAPPINGS.items():
            if blog_file == mdx_file.name:
                has_image = True
                break
        if not has_image:
            print(f"  - {mdx_file.name}")


def find_social_image_for_topic(topic: str) -> str:
    """Find the best social image for a given topic"""
    topic_lower = topic.lower()

    for image_name, topics in SOCIAL_IMAGE_TOPICS.items():
        for t in topics:
            if t in topic_lower or topic_lower in t:
                image_path = IMAGES_DIR / image_name
                if image_path.exists():
                    return str(image_path)

    return None


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--list":
        list_unpaired()
    elif len(sys.argv) > 1 and sys.argv[1] == "--find-social":
        topic = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else ""
        if topic:
            image = find_social_image_for_topic(topic)
            if image:
                print(f"Found: {image}")
            else:
                print("No matching social image found")
        else:
            print("Usage: python blog_images.py --find-social <topic>")
    else:
        result = pair_images_with_posts()
        print(f"\nDone! Copied {result['copied']} images, updated {result['updated']} posts.")
