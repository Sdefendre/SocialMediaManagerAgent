#!/usr/bin/env python3
"""
DefendreSolutions Content Publisher
Publishes content to X and LinkedIn via Typefully API with image support
"""

import argparse
import json
import sys
import time
import requests
from pathlib import Path

# Import config
from config import (
    TYPEFULLY_API_KEY,
    TYPEFULLY_BASE_URL,
    TYPEFULLY_SOCIAL_SET_ID,
    NANO_BANANA_API_KEY,
    IMAGE_API_URL,
    DEFAULT_IMAGE_STYLE,
    get_content_folder,
    get_blog_production_path,
    BLOG_PRODUCTION,
    CONTENT_ARCHIVE,
)

# API Headers
HEADERS = {
    "Authorization": f"Bearer {TYPEFULLY_API_KEY}",
    "Content-Type": "application/json"
}


class Publisher:
    """Handles publishing content to social platforms via Typefully"""

    def __init__(self):
        self.base_url = TYPEFULLY_BASE_URL
        self.social_set_id = TYPEFULLY_SOCIAL_SET_ID

    def upload_image(self, image_path: Path) -> str:
        """
        Upload an image to Typefully and return the media_id.

        Args:
            image_path: Path to the image file

        Returns:
            media_id string for attaching to posts
        """
        if not image_path.exists():
            raise FileNotFoundError(f"Image not found: {image_path}")

        print(f"Uploading image: {image_path.name}")

        # Step 1: Request upload URL
        response = requests.post(
            f"{self.base_url}/v2/social-sets/{self.social_set_id}/media/upload",
            headers=HEADERS,
            json={"file_name": image_path.name}
        )
        response.raise_for_status()
        upload_data = response.json()

        media_id = upload_data["media_id"]
        upload_url = upload_data["upload_url"]

        # Step 2: Upload file to S3
        with open(image_path, "rb") as f:
            file_data = f.read()

        upload_response = requests.put(upload_url, data=file_data)
        upload_response.raise_for_status()

        # Step 3: Wait for processing
        for _ in range(30):
            status_response = requests.get(
                f"{self.base_url}/v2/social-sets/{self.social_set_id}/media/{media_id}",
                headers=HEADERS
            )
            status_response.raise_for_status()
            status = status_response.json()

            if status.get("status") == "ready":
                print(f"Image uploaded: {media_id}")
                return media_id
            elif status.get("status") == "failed":
                raise Exception(f"Image processing failed: {status}")

            time.sleep(1)

        raise Exception("Image processing timed out")

    def publish(
        self,
        x_content: str = None,
        linkedin_content: str = None,
        image_path: Path = None,
        schedule: str = None
    ) -> dict:
        """
        Publish content to X and/or LinkedIn with optional image.

        Args:
            x_content: Content for X (Twitter)
            linkedin_content: Content for LinkedIn
            image_path: Path to image file
            schedule: "now", "next-free-slot", or ISO datetime

        Returns:
            Dict with results for each platform
        """
        results = {}
        media_ids = []

        # Upload image if provided
        if image_path and image_path.exists():
            try:
                media_id = self.upload_image(image_path)
                media_ids.append(media_id)
            except Exception as e:
                print(f"Warning: Image upload failed: {e}")

        # Publish to X
        if x_content:
            result = self._post_to_platform(
                content=x_content,
                platform="x",
                media_ids=media_ids,
                schedule=schedule
            )
            results["x"] = result

        # Publish to LinkedIn
        if linkedin_content:
            result = self._post_to_platform(
                content=linkedin_content,
                platform="linkedin",
                media_ids=media_ids,
                schedule=schedule
            )
            results["linkedin"] = result

        return results

    def _post_to_platform(
        self,
        content: str,
        platform: str,
        media_ids: list = None,
        schedule: str = None
    ) -> dict:
        """Post content to a single platform."""

        # Handle thread format for X (split on 4 newlines)
        if platform == "x" and "\n\n\n\n" in content:
            posts = [{"text": p.strip()} for p in content.split("\n\n\n\n") if p.strip()]
            # Attach image to first post only
            if media_ids and posts:
                posts[0]["media_ids"] = media_ids
        else:
            posts = [{"text": content.strip()}]
            if media_ids:
                posts[0]["media_ids"] = media_ids

        payload = {
            "platforms": {
                platform: {
                    "enabled": True,
                    "posts": posts,
                    "settings": {}
                }
            }
        }

        if schedule:
            payload["publish_at"] = schedule

        response = requests.post(
            f"{self.base_url}/v2/social-sets/{self.social_set_id}/drafts",
            headers=HEADERS,
            json=payload
        )
        response.raise_for_status()
        result = response.json()

        status = "scheduled" if schedule else "saved as draft"
        print(f"✓ {platform.upper()}: {status} (ID: {result.get('id', 'unknown')})")

        return {
            "success": True,
            "draft_id": result.get("id"),
            "status": status,
            "url": "https://typefully.com/drafts"
        }


class ImageGenerator:
    """Generates AI images using Nano Banana Pro API"""

    def generate(self, prompt: str, output_path: Path) -> bool:
        """
        Generate an image from a prompt and save to file.

        Args:
            prompt: Text description of the image
            output_path: Path to save the generated image

        Returns:
            True if successful, False otherwise
        """
        import base64

        full_prompt = f"Generate an image: {prompt}. Style: {DEFAULT_IMAGE_STYLE}"
        print(f"Generating image: {output_path.name}")

        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }],
            "generationConfig": {
                "responseModalities": ["TEXT", "IMAGE"]
            }
        }

        try:
            response = requests.post(
                f"{IMAGE_API_URL}?key={NANO_BANANA_API_KEY}",
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=120
            )
            data = response.json()

            if 'error' in data:
                print(f"Error: {data['error'].get('message', 'Unknown error')}")
                return False

            if 'candidates' not in data or len(data['candidates']) == 0:
                print("Error: No image generated")
                return False

            # Extract image data
            for part in data['candidates'][0].get('content', {}).get('parts', []):
                if 'inlineData' in part:
                    img_data = base64.b64decode(part['inlineData']['data'])
                    output_path.parent.mkdir(parents=True, exist_ok=True)
                    with open(output_path, 'wb') as f:
                        f.write(img_data)
                    print(f"✓ Image saved: {output_path}")
                    return True

            print("Error: No image in response")
            return False

        except Exception as e:
            print(f"Error generating image: {e}")
            return False


def publish_content(
    topic_folder: Path,
    schedule: str = "next-free-slot",
    platforms: list = None
) -> dict:
    """
    Publish content from a topic folder to specified platforms.

    Args:
        topic_folder: Path to the topic folder containing content files
        schedule: "now", "next-free-slot", or ISO datetime
        platforms: List of platforms ["x", "linkedin"], defaults to both

    Returns:
        Dict with results for each platform
    """
    if platforms is None:
        platforms = ["x", "linkedin"]

    topic_folder = Path(topic_folder)

    # Read content files
    x_content = None
    linkedin_content = None
    image_path = None

    x_file = topic_folder / "x-post.txt"
    linkedin_file = topic_folder / "linkedin-post.txt"
    image_file = topic_folder / "image.jpg"

    if "x" in platforms and x_file.exists():
        x_content = x_file.read_text().strip()
        print(f"Loaded X content: {len(x_content)} chars")

    if "linkedin" in platforms and linkedin_file.exists():
        linkedin_content = linkedin_file.read_text().strip()
        print(f"Loaded LinkedIn content: {len(linkedin_content)} chars")

    if image_file.exists():
        image_path = image_file
        print(f"Found image: {image_file.name}")
    else:
        # Try PNG
        image_file = topic_folder / "image.png"
        if image_file.exists():
            image_path = image_file

    if not x_content and not linkedin_content:
        raise ValueError(f"No content files found in {topic_folder}")

    # Publish
    publisher = Publisher()
    results = publisher.publish(
        x_content=x_content,
        linkedin_content=linkedin_content,
        image_path=image_path,
        schedule=schedule
    )

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Publish content to X and LinkedIn via Typefully"
    )
    parser.add_argument(
        "folder",
        nargs="?",
        help="Path to topic folder containing x-post.txt, linkedin-post.txt, image.jpg"
    )
    parser.add_argument(
        "--schedule", "-s",
        default="next-free-slot",
        help="Schedule: 'now', 'next-free-slot', or ISO datetime"
    )
    parser.add_argument(
        "--platform", "-p",
        action="append",
        help="Platform to publish to (can repeat). Default: both x and linkedin"
    )
    parser.add_argument(
        "--list-recent",
        action="store_true",
        help="List recent content folders"
    )

    args = parser.parse_args()

    if args.list_recent:
        # List recent content folders
        print("Recent content folders:")
        for month_folder in sorted(CONTENT_ARCHIVE.glob("*-*"), reverse=True)[:3]:
            print(f"\n{month_folder.name}/")
            for topic_folder in sorted(month_folder.iterdir(), reverse=True)[:5]:
                if topic_folder.is_dir():
                    files = [f.name for f in topic_folder.iterdir()]
                    print(f"  {topic_folder.name}/ [{', '.join(files)}]")
        return 0

    if not args.folder:
        parser.print_help()
        return 1

    folder = Path(args.folder)
    if not folder.exists():
        print(f"Error: Folder not found: {folder}")
        return 1

    platforms = args.platform or ["x", "linkedin"]

    print(f"\n{'='*50}")
    print(f"  Publishing: {folder.name}")
    print(f"  Platforms: {', '.join(platforms)}")
    print(f"  Schedule: {args.schedule}")
    print(f"{'='*50}\n")

    try:
        results = publish_content(
            topic_folder=folder,
            schedule=args.schedule,
            platforms=platforms
        )

        print(f"\n{'='*50}")
        print("  Publication Complete!")
        print(f"{'='*50}")
        print(f"\nView drafts: https://typefully.com/drafts")

        return 0

    except Exception as e:
        print(f"\nError: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
