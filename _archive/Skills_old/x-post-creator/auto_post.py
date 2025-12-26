#!/usr/bin/env python3
"""
Automated Daily X Post Generator for @sdefendre
Generates unique posts and publishes to Typefully
"""

import requests
import json
import random
import os
from datetime import datetime
from pathlib import Path

# Typefully Config
API_KEY = "VxYijn54dDnw5QulI5CAuLeUk29OflHZ"
BASE_URL = "https://api.typefully.com"
SOCIAL_SET_ID = "273516"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Track posted content to avoid duplicates
HISTORY_FILE = Path(__file__).parent / "post_history.json"


def load_history():
    """Load posting history"""
    if HISTORY_FILE.exists():
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return {"posted_indices": [], "last_post": None}


def save_history(history):
    """Save posting history"""
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)


# =============================================================================
# POST TEMPLATES - Add more to expand variety
# =============================================================================

POSTS = [
    # AI & Automation
    """Your competitors are using AI while you're still doing everything manually.

The gap is growing daily.

What AI handles now:
→ Customer support (24/7)
→ Appointment scheduling
→ Lead qualification
→ Content first drafts

What you should handle:
→ Strategy
→ Relationships
→ Final decisions

Work smarter, not harder.

AI automation solutions → DefendreSolutions.com""",

    # Small Business Tech
    """Small business owners:

You don't need a $50k website.
You don't need a full dev team.
You don't need enterprise software.

You need:
→ A site that loads fast
→ A system that books clients
→ Tools that save you time

Start simple. Scale later.

That's the playbook.

Simple, powerful solutions → DefendreSolutions.com""",

    # Veteran Entrepreneurship
    """Military to tech wasn't easy.

But the skills transferred:
→ Discipline = shipping code daily
→ Adaptability = learning new stacks
→ Mission focus = solving real problems
→ Attention to detail = fewer bugs

Veterans bring something different to tech.

We build things that work.

Veteran-owned development → DefendreSolutions.com""",

    # Website ROI
    """Your website isn't a brochure.

It's your hardest-working employee.

A good website:
→ Generates leads while you sleep
→ Answers FAQs automatically
→ Books appointments 24/7
→ Builds trust before the first call

Bad website = leaving money on the table.

Is yours working for you?

Websites that convert → DefendreSolutions.com""",

    # AI Chatbots
    """I built an AI chatbot for a client last month.

Results after 30 days:
→ 73% of questions answered automatically
→ 12 hours/week saved on support
→ 24/7 availability (finally)
→ Zero missed leads overnight

Cost: Less than a part-time hire.

The ROI on AI is real.

Custom chatbots → DefendreSolutions.com""",

    # Tech Modernization
    """Legacy code is expensive.

Not because it's old.
Because it's slow to change.

Signs you need modernization:
→ Simple changes take weeks
→ Nobody wants to touch "that file"
→ New hires can't understand it
→ It breaks when you update anything

Old code isn't technical debt.
It's a business risk.

Modernization services → DefendreSolutions.com""",

    # MVP Development
    """Stop planning. Start building.

The best MVPs I've built:
→ 4-6 weeks to launch
→ One core feature done well
→ Real user feedback fast
→ Iterate from there

Perfection is the enemy of progress.

Ship something. Learn. Improve.

That's how startups win.

MVP development → DefendreSolutions.com""",

    # AI Strategy
    """AI won't replace your business.

But it will change how you compete.

Where to start:
1. Identify repetitive tasks
2. Find your biggest time drains
3. Automate one thing this month
4. Measure the results
5. Repeat

Small wins compound.

Start your AI strategy → DefendreSolutions.com""",

    # E-commerce
    """E-commerce in 2024 is brutal.

What separates winners:
→ Site speed (every second costs sales)
→ Mobile experience (60%+ of traffic)
→ Checkout friction (fewer steps = more sales)
→ Trust signals (reviews, security, guarantees)

Your platform matters less than your execution.

Need an e-commerce edge?

DefendreSolutions.com""",

    # Healthcare Tech
    """Healthcare practices are drowning in admin work.

What we've automated for clients:
→ Appointment reminders (no more no-shows)
→ Patient intake forms (paperless)
→ FAQ responses (instant answers)
→ Follow-up scheduling (automatic)

Better patient experience.
Less staff burnout.

Healthcare solutions → DefendreSolutions.com""",

    # Developer Insights
    """The best code I write:

→ Solves one problem well
→ Someone else can understand it
→ Works today, scales tomorrow
→ Has zero clever tricks

Complexity isn't impressive.
Simplicity is.

Build things that last.

DefendreSolutions.com""",

    # Business Automation
    """You're not too small for automation.

Things any business can automate today:
→ Email responses
→ Social media scheduling
→ Invoice reminders
→ Lead follow-ups
→ Appointment booking

Start with one.

The hours add up fast.

Automation solutions → DefendreSolutions.com""",

    # Startup Advice
    """Startup founders:

Don't build features. Solve problems.

Before writing code, answer:
→ Who has this problem?
→ How painful is it?
→ Will they pay to fix it?
→ Can you reach them?

Code is easy.
Finding the right problem is hard.

Start there.

Startup development → DefendreSolutions.com""",

    # React Development
    """Why I build with React:

→ Component reusability (faster development)
→ Huge ecosystem (solved problems)
→ Great performance (happy users)
→ Easy to maintain (future you says thanks)

The tool matters less than the outcome.

But good tools help.

Full-stack development → DefendreSolutions.com""",

    # Client Results
    """Client came to me with a "simple" website request.

We built:
→ Custom booking system
→ Automated email sequences
→ Mobile-first design
→ Payment processing

6 months later:
→ 3x more bookings
→ 50% less admin time
→ Clients book at midnight

"Simple" done right changes everything.

DefendreSolutions.com""",

    # AI for Veterans
    """Built an AI tool helping veterans navigate VA benefits.

The problem:
→ Complex system
→ Confusing paperwork
→ Long wait times

The solution:
→ AI that answers questions instantly
→ Guides through applications
→ Available 24/7

Tech should serve those who served.

Veteran-focused tech → DefendreSolutions.com""",

    # Speed Matters
    """Your website is slow.

I can tell because most are.

What slow costs you:
→ 1 second delay = 7% fewer conversions
→ 40% leave if it takes 3+ seconds
→ Google ranks slow sites lower

Speed isn't a feature.
It's a requirement.

Is your site fast enough?

Performance optimization → DefendreSolutions.com""",

    # Building in Public
    """Building in public taught me:

→ Ship before you're ready
→ Feedback is fuel
→ Perfect is a trap
→ Consistency beats intensity

Your first version will be embarrassing.

That's the point.

You can't improve what doesn't exist.

Build something today.

DefendreSolutions.com""",

    # AI Myths
    """AI myths I hear from small business owners:

"It's too expensive" → Many tools are free
"It's too complicated" → No-code options exist
"It'll replace my staff" → It helps them do more
"It's not for my industry" → Every industry benefits

The only mistake is waiting.

Start exploring AI → DefendreSolutions.com""",

    # Process Automation
    """Automated a client's entire onboarding last week:

Before:
→ 6 manual emails
→ 3 phone calls
→ Paper forms
→ 2 hours per client

After:
→ Auto email sequence
→ Digital intake forms
→ Self-scheduling
→ 15 minutes per client

Time saved = money earned.

Process automation → DefendreSolutions.com""",
]


def get_unique_post(history):
    """Get a post that hasn't been used recently"""
    posted = set(history.get("posted_indices", []))
    available = [i for i in range(len(POSTS)) if i not in posted]

    # Reset if we've used all posts
    if not available:
        history["posted_indices"] = []
        available = list(range(len(POSTS)))

    # Pick random from available
    index = random.choice(available)
    history["posted_indices"].append(index)

    return POSTS[index], index


def post_to_typefully(content: str, schedule: str = None):
    """Post content to Typefully"""
    payload = {
        "platforms": {
            "x": {
                "enabled": True,
                "posts": [{"text": content.strip()}],
                "settings": {}
            }
        }
    }

    if schedule:
        payload["publish_at"] = schedule

    response = requests.post(
        f"{BASE_URL}/v2/social-sets/{SOCIAL_SET_ID}/drafts",
        headers=HEADERS,
        json=payload
    )
    response.raise_for_status()
    return response.json()


def main():
    """Main function - generates and posts unique content"""
    print(f"[{datetime.now().isoformat()}] Starting auto-post...")

    # Load history
    history = load_history()

    # Get unique post
    content, index = get_unique_post(history)
    print(f"Selected post index: {index}")

    # Post to Typefully (schedule to next free slot)
    try:
        result = post_to_typefully(content, "next-free-slot")
        draft_id = result.get("id", "unknown")

        # Update history
        history["last_post"] = {
            "date": datetime.now().isoformat(),
            "draft_id": draft_id,
            "post_index": index
        }
        save_history(history)

        print(f"Success! Draft ID: {draft_id}")
        print(f"View at: https://typefully.com/drafts")

    except requests.exceptions.HTTPError as e:
        print(f"API Error: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == "__main__":
    main()
