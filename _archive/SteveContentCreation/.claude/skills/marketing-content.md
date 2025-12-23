# Marketing Content Generator Skill

## Description
Generate engaging marketing content for X (Twitter) posts and LinkedIn posts for defendresolutions.com using the Google Gemini API.

## Usage
```
/marketing-content [platform] [topic]
```

**Platforms:**
- `x` or `twitter` - Generate X/Twitter posts (280 character limit)
- `linkedin` - Generate LinkedIn posts (longer form, professional tone)
- `both` - Generate content for both platforms

**Examples:**
```
/marketing-content x cybersecurity tips
/marketing-content linkedin new product launch
/marketing-content both holiday promotion
```

## Instructions

When this skill is invoked, follow these steps:

### 1. Parse the Arguments
- Identify the target platform(s): x, linkedin, or both
- Extract the topic/theme for the content
- If no platform specified, default to "both"
- If no topic specified, ask the user what they'd like to promote

### 2. Generate Content Using Gemini API

Use the following curl command to call the Gemini API:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "YOUR_PROMPT_HERE"
      }]
    }],
    "generationConfig": {
      "temperature": 0.9,
      "maxOutputTokens": 1024
    }
  }'
```

### 3. Content Guidelines for defendresolutions.com

**Brand Voice:**
- Professional yet approachable
- Focus on cybersecurity, IT solutions, and digital defense
- Emphasize trust, reliability, and expertise
- Use action-oriented language

**X/Twitter Posts Should:**
- Be under 280 characters
- Include relevant hashtags (2-3 max)
- Have a clear call-to-action
- Be punchy and attention-grabbing
- Consider thread format for complex topics

**LinkedIn Posts Should:**
- Be 150-300 words for optimal engagement
- Start with a hook in the first line
- Include relevant industry insights
- End with a question or call-to-action
- Use professional tone with personality
- Include 3-5 relevant hashtags at the end

### 4. Prompts to Use

**For X/Twitter:**
```
Create 3 engaging X/Twitter posts for defendresolutions.com about [TOPIC].

Requirements:
- Each post must be under 280 characters
- Include 2-3 relevant hashtags
- Focus on cybersecurity and IT solutions
- Include a call-to-action where appropriate
- Make them attention-grabbing and shareable
- Vary the tone: one informative, one engaging question, one promotional

Brand: defendresolutions.com - Professional cybersecurity and IT solutions provider
```

**For LinkedIn:**
```
Create a compelling LinkedIn post for defendresolutions.com about [TOPIC].

Requirements:
- 150-300 words
- Start with an attention-grabbing hook
- Provide valuable insights or tips
- Professional but personable tone
- End with a call-to-action or engaging question
- Include 3-5 relevant hashtags at the end
- Focus on cybersecurity, IT solutions, and digital defense

Brand: defendresolutions.com - Professional cybersecurity and IT solutions provider
```

### 5. Output Format

Present the generated content in a clear, copy-paste friendly format:

```
## X/Twitter Posts

**Post 1:**
[Content]

**Post 2:**
[Content]

**Post 3:**
[Content]

---

## LinkedIn Post

[Content]

---

**Tips for posting:**
- Best times to post on X: 8-10 AM, 12 PM, 5-6 PM
- Best times for LinkedIn: Tuesday-Thursday, 8-10 AM
- Engage with comments within the first hour for better reach
```

### 6. API Key Configuration

The Gemini API key should be set as an environment variable:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

Or create a `.env` file in the project root:
```
GEMINI_API_KEY=your-api-key-here
```

## Error Handling

- If the API call fails, retry once with a simplified prompt
- If no topic is provided, prompt the user for input
- If the generated content exceeds platform limits, regenerate with stricter constraints
