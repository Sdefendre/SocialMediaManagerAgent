#!/usr/bin/env python3
"""
X Post Creator Workflow
Chains: Generate Image → Create Post → Post to Typefully

This is the main entry point for creating social media posts with auto-generated images.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path for skill imports
SKILLS_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(SKILLS_DIR))

from image_generator.generator import ImageGenerator
from typefully import post_to_typefully, find_social_image, IMAGES_DIR


class PostWorkflow:
    """
    Orchestrates the complete post creation workflow:
    1. Generate or find appropriate image
    2. Create post content
    3. Post to Typefully (X and/or LinkedIn)
    """

    def __init__(self):
        self.image_gen = ImageGenerator()

    def create_post_with_image(
        self,
        content: str,
        schedule: str = None,
        linkedin: bool = False,
        force_new_image: bool = False,
        custom_image_prompt: str = None
    ) -> dict:
        """
        Create a complete social media post with auto-generated image.

        Args:
            content: The post text content
            schedule: 'now', 'next-free-slot', ISO datetime, or None for draft
            linkedin: If True, also post to LinkedIn
            force_new_image: If True, generate new image even if match exists
            custom_image_prompt: Optional custom prompt for image generation

        Returns:
            {
                "success": True/False,
                "post_result": "Typefully response...",
                "image_path": "/path/to/image.jpg",
                "image_generated": True/False
            }
        """
        print("=" * 50)
        print("  X Post Creator Workflow")
        print("=" * 50)

        # Step 1: Get or generate image
        print("\n[Step 1/3] Finding or generating image...")

        image_path = None
        image_generated = False

        if custom_image_prompt:
            # Generate custom image from prompt
            result = self.image_gen.generate(
                custom_image_prompt,
                f"post-{hash(content) % 10000}"
            )
            if result['success']:
                image_path = result['path']
                image_generated = True
        else:
            # Auto-detect topic and find/generate image
            result = self.image_gen.generate_for_post(content, force_generate=force_new_image)
            if result['success']:
                image_path = result['path']
                image_generated = result.get('generated', False)

        if image_path:
            print(f"  Image: {image_path}")
            print(f"  Generated: {image_generated}")
        else:
            print("  Warning: No image available, posting without image")

        # Step 2: Prepare platforms
        print("\n[Step 2/3] Preparing post...")
        platforms = {"x": True, "linkedin": linkedin}
        platform_str = "X" + (" + LinkedIn" if linkedin else "")
        print(f"  Platforms: {platform_str}")
        print(f"  Schedule: {schedule or 'draft'}")

        # Step 3: Post to Typefully
        print("\n[Step 3/3] Posting to Typefully...")

        try:
            post_result = post_to_typefully(
                content=content,
                schedule=schedule,
                image_path=image_path,
                platforms=platforms
            )
            print(f"  {post_result}")

            return {
                "success": True,
                "post_result": post_result,
                "image_path": image_path,
                "image_generated": image_generated
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "image_path": image_path,
                "image_generated": image_generated
            }

    def create_thread_with_image(
        self,
        tweets: list,
        schedule: str = None,
        linkedin: bool = False
    ) -> dict:
        """
        Create a thread with auto-generated image on the first tweet.

        Args:
            tweets: List of tweet strings
            schedule: Scheduling option
            linkedin: If True, also post to LinkedIn

        Returns:
            Workflow result dict
        """
        # Join tweets with thread separator
        content = "\n\n\n\n".join(tweets)

        # Use first tweet content for image generation
        return self.create_post_with_image(
            content=content,
            schedule=schedule,
            linkedin=linkedin
        )

    def batch_create_posts(
        self,
        posts: list,
        schedule: str = "next-free-slot",
        linkedin: bool = False
    ) -> list:
        """
        Create multiple posts, each with auto-generated images.

        Args:
            posts: List of post content strings
            schedule: Scheduling option (all will be queued)
            linkedin: If True, also post to LinkedIn

        Returns:
            List of workflow result dicts
        """
        results = []
        for i, content in enumerate(posts):
            print(f"\n{'='*50}")
            print(f"  Post {i+1}/{len(posts)}")
            print(f"{'='*50}")

            result = self.create_post_with_image(
                content=content,
                schedule=schedule,
                linkedin=linkedin
            )
            results.append(result)

        return results


def show_usage():
    """Show usage information"""
    print("X Post Creator Workflow")
    print()
    print("Usage: python post_workflow.py <content> [options]")
    print()
    print("Options:")
    print("  --schedule, -s    Schedule: 'now', 'next-free-slot', or ISO datetime")
    print("  --linkedin, -l    Also post to LinkedIn")
    print("  --new-image       Force generate new image (don't use existing)")
    print("  --image-prompt    Custom image prompt instead of auto-detect")
    print()
    print("Examples:")
    print('  python post_workflow.py "Your post content here"')
    print('  python post_workflow.py "Post content" -s next-free-slot')
    print('  python post_workflow.py "Post content" -s now -l')
    print('  python post_workflow.py "Post content" --image-prompt "futuristic city"')
    print()
    print("Thread format (separate with \\n\\n\\n\\n):")
    print('  python post_workflow.py "First tweet\\n\\n\\n\\nSecond tweet"')


def main():
    import argparse

    parser = argparse.ArgumentParser(description="X Post Creator Workflow")
    parser.add_argument("content", nargs="?", help="Post content")
    parser.add_argument("--schedule", "-s", help="Schedule: 'now', 'next-free-slot', or ISO datetime")
    parser.add_argument("--linkedin", "-l", action="store_true", help="Also post to LinkedIn")
    parser.add_argument("--new-image", action="store_true", help="Force generate new image")
    parser.add_argument("--image-prompt", help="Custom image prompt")

    args = parser.parse_args()

    if not args.content:
        show_usage()
        return 0

    workflow = PostWorkflow()
    result = workflow.create_post_with_image(
        content=args.content,
        schedule=args.schedule,
        linkedin=args.linkedin,
        force_new_image=args.new_image,
        custom_image_prompt=args.image_prompt
    )

    if result['success']:
        print("\n" + "=" * 50)
        print("  Workflow Complete!")
        print("=" * 50)
        return 0
    else:
        print(f"\nError: {result.get('error', 'Unknown error')}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
