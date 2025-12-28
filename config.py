"""
Configuration for Social Media Manager Agent
Loads API keys and settings from environment variables
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env.local
env_path = Path(__file__).parent / '.env.local'
load_dotenv(env_path)

# API Keys
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
TYPEFULLY_API_KEY = os.getenv('TYPEFULLY_API_KEY', '')
BLOG_API_KEY = os.getenv('BLOG_API_KEY', '')

# API URLs
TYPEFULLY_API_URL = 'https://api.typefully.com/v1/drafts/'
BLOG_API_URL = os.getenv('BLOG_API_URL', 'https://defendre-solutions.vercel.app/api/admin/publish-blog')

# Typefully Settings
TYPEFULLY_SOCIAL_SET_ID = os.getenv('TYPEFULLY_SOCIAL_SET_ID', '')

# Content Settings
DEFAULT_AUTHOR = "Steve Defendre"
DEFAULT_TAGS = ["Technology", "AI", "Innovation"]

# Read time calculation (words per minute)
WORDS_PER_MINUTE = 225

# File paths
CONTENT_DIR = Path(__file__).parent / 'Content'
DEFENDRE_BLOG_DIR = Path.home() / 'Desktop' / 'Code' / 'Active Projects' / 'code' / 'DefendreSolutions' / 'blog_posts'

def validate_config():
    """Validate that required API keys are set"""
    errors = []

    if not TYPEFULLY_API_KEY:
        errors.append("TYPEFULLY_API_KEY is not set")

    if not BLOG_API_KEY:
        errors.append("BLOG_API_KEY is not set")

    if not GEMINI_API_KEY:
        errors.append("GEMINI_API_KEY is not set")

    if errors:
        print("⚠️  Configuration warnings:")
        for error in errors:
            print(f"   - {error}")
        print("\nSet these in .env.local file")
        return False

    return True

def calculate_read_time(content: str) -> str:
    """Calculate estimated reading time from content"""
    words = len(content.split())
    minutes = max(1, round(words / WORDS_PER_MINUTE))
    return f"{minutes} min read"

if __name__ == "__main__":
    print("Configuration Status:")
    print(f"✓ Gemini API Key: {'Set' if GEMINI_API_KEY else 'Missing'}")
    print(f"✓ Typefully API Key: {'Set' if TYPEFULLY_API_KEY else 'Missing'}")
    print(f"✓ Blog API Key: {'Set' if BLOG_API_KEY else 'Missing'}")
    print(f"✓ Blog API URL: {BLOG_API_URL}")
    print(f"✓ Content Directory: {CONTENT_DIR}")
    print(f"✓ DefendreSolutions Blog Directory: {DEFENDRE_BLOG_DIR}")
