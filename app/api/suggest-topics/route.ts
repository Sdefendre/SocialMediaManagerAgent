import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

/**
 * POST /api/suggest-topics
 * Uses Claude to suggest relevant blog topics based on DefendreSolutions.com
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { anthropicApiKey } = body

    const claudeApiKey = anthropicApiKey || process.env.ANTHROPIC_API_KEY

    if (!claudeApiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key is required' },
        { status: 400 }
      )
    }

    const anthropic = new Anthropic({ apiKey: claudeApiKey })

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 1024,
      temperature: 0.8,
      messages: [{
        role: 'user',
        content: `You are an AI content strategist for DefendreSolutions.com, a company that specializes in AI automation, cybersecurity solutions, and technology consulting.

Based on DefendreSolutions' focus areas (AI automation, cybersecurity, cloud solutions, digital transformation), suggest 5 timely and relevant blog post topics that would resonate with their audience.

Requirements:
- Topics MUST be current and trending in tech/AI/cybersecurity (consider latest AI developments, models, tools, and industry trends)
- Focus on breakthrough AI technologies and latest developments in the AI landscape
- Each topic should be actionable and valuable to business decision-makers
- Mix of educational, thought leadership, and practical how-to content
- Topics should align with DefendreSolutions' expertise
- Prioritize cutting-edge AI topics that are making headlines or represent significant industry shifts

Return ONLY a JSON array of 5 topic strings, nothing else. Format:
["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]`
      }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response')
    }

    // Parse the JSON array from Claude's response
    const topics = JSON.parse(textContent.text)

    return NextResponse.json({ topics })

  } catch (error: any) {
    console.error('Topic suggestion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate topic suggestions' },
      { status: 500 }
    )
  }
}
