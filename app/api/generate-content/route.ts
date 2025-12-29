import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

/**
 * Research topic using Brave Search API
 * Returns current, accurate information about the topic
 */
async function researchTopic(topic: string, braveApiKey: string): Promise<string> {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(topic)}&count=5`

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'X-Subscription-Token': braveApiKey
    }
  })

  if (!response.ok) {
    throw new Error(`Brave Search API error: ${response.statusText}`)
  }

  const data = await response.json()

  // Extract relevant information from search results
  const results = data.web?.results || []
  let research = `Research findings for "${topic}":\n\n`

  results.slice(0, 5).forEach((result: any, index: number) => {
    research += `${index + 1}. ${result.title}\n`
    research += `   ${result.description}\n`
    research += `   Source: ${result.url}\n\n`
  })

  return research
}

/**
 * Call Claude Opus 4.5 to generate content
 * Uses the Claude AI SDK with streaming for optimal performance
 */
async function callClaude(prompt: string, apiKey: string): Promise<string> {
  const anthropic = new Anthropic({ apiKey })

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 8192,
    temperature: 0.7,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })

  // Extract text from the response
  const textContent = response.content.find(block => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response')
  }

  return textContent.text
}

/**
 * Generate image with Nano Banana Pro (Google Imagen)
 * Returns base64 image data
 */
async function generateImage(topic: string, blogTitle: string, googleApiKey: string): Promise<string> {
  const prompt = `Create a professional, engaging hero image for a blog post titled "${blogTitle}" about ${topic}.
Style: Modern, clean, professional.
Make it visually appealing and relevant to the topic.
No text overlays.`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages?key=${googleApiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: prompt,
      number_of_images: 1,
      aspect_ratio: '16:9',
      safety_filter_level: 'block_some',
      person_generation: 'allow_adult'
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Image generation failed: ${error}`)
  }

  const data = await response.json()

  // Return base64 image data
  if (data.generatedImages && data.generatedImages[0]) {
    return `data:image/png;base64,${data.generatedImages[0].imageBytes}`
  }

  throw new Error('No image generated')
}

/**
 * Generate blog post content with Claude Opus 4.5
 * Claude excels at long-form content with nuanced understanding
 */
async function generateBlogPost(topic: string, research: string, apiKey: string): Promise<string> {
  const prompt = `Write a professional blog post about "${topic}".

IMPORTANT - Use this current research data to ensure accuracy:
${research}

Requirements:
- 800-1500 words
- SEO-optimized with clear structure
- Include frontmatter with: title, description, date, author
- Use H2 and H3 headings
- Professional tone but accessible
- Include actionable insights
- Base the content on the research findings above to ensure accuracy and current information

Format:
---
title: "Your SEO Title"
description: "150-160 character description"
date: "${new Date().toISOString().split('T')[0]}"
author: "Author"
---

[Full blog post content in markdown]

Write the complete blog post now:`

  return await callClaude(prompt, apiKey)
}

/**
 * Generate X (Twitter) post with Claude Opus 4.5
 * Claude's concise writing style is perfect for social media
 */
async function generateXPost(topic: string, blogSummary: string, apiKey: string): Promise<string> {
  const prompt = `Create an X (Twitter) post about "${topic}".

Context: ${blogSummary.substring(0, 500)}

Requirements:
- Maximum 280 characters
- Hook first sentence
- Short, punchy sentences
- End with CTA: "→ DefendreSolutions.com" or "Learn more: DefendreSolutions.com"
- NO hashtags (or max 1-2)

Write the X post now:`

  return await callClaude(prompt, apiKey)
}

/**
 * Generate LinkedIn post with Claude Opus 4.5
 * Claude excels at professional storytelling and engagement
 */
async function generateLinkedInPost(topic: string, blogSummary: string, apiKey: string): Promise<string> {
  const prompt = `Create a professional LinkedIn post about "${topic}".

Context: ${blogSummary.substring(0, 500)}

Requirements:
- 1000-1500 characters
- Professional storytelling
- Start with a hook
- Include CTA to DefendreSolutions.com before the closing question
- End with an engaging question
- Add 3-5 relevant hashtags at the bottom

Write the LinkedIn post now:`

  return await callClaude(prompt, apiKey)
}

/**
 * POST /api/generate-content
 * Generate content with Claude Opus 4.5 via SSE streaming
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { topic, platforms, anthropicApiKey, googleApiKey, braveSearchApiKey } = body

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      // Helper to send SSE events
      const sendEvent = (type: string, data: any) => {
        const message = `data: ${JSON.stringify({ type, ...data })}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      try {
        // Validate inputs
        if (!topic) {
          sendEvent('error', { error: 'Topic is required' })
          controller.close()
          return
        }

        const claudeApiKey = anthropicApiKey || process.env.ANTHROPIC_API_KEY
        const googleKey = googleApiKey || process.env.GOOGLE_API_KEY
        const braveKey = braveSearchApiKey || process.env.BRAVE_SEARCH_API_KEY

        if (!claudeApiKey) {
          sendEvent('error', { error: 'Anthropic API key is required. Add it in Settings.' })
          controller.close()
          return
        }

        if (!googleKey) {
          sendEvent('error', { error: 'Google API key is required for image generation. Add it in Settings.' })
          controller.close()
          return
        }

        if (!braveKey) {
          sendEvent('error', { error: 'Brave Search API key is required for research. Add it in Settings.' })
          controller.close()
          return
        }

        // Step 0: Research topic
        sendEvent('step', { step: 'research', status: 'in_progress' })
        let research: string
        try {
          research = await researchTopic(topic, braveKey)
          sendEvent('step', { step: 'research', status: 'complete' })
        } catch (err: any) {
          sendEvent('step', { step: 'research', status: 'error' })
          throw new Error(`Research failed: ${err.message}`)
        }

        // Step 1: Generate blog post with research
        sendEvent('step', { step: 'blog', status: 'in_progress' })
        let blogPost: string
        try {
          blogPost = await generateBlogPost(topic, research, claudeApiKey)
          sendEvent('step', { step: 'blog', status: 'complete' })
        } catch (err: any) {
          sendEvent('step', { step: 'blog', status: 'error' })
          throw new Error(`Blog generation failed: ${err.message}`)
        }

        // Extract summary and title for other content
        const blogParts = blogPost.split('---')
        const frontmatter = blogParts[1] || ''
        const blogBody = blogParts.slice(2).join('---').trim()
        const blogSummary = blogBody.substring(0, 500)

        // Extract title from frontmatter
        const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\n/)
        const blogTitle = titleMatch ? titleMatch[1] : topic

        // Step 2: Generate X post
        let xPost: string | null = null
        if (platforms.includes('x')) {
          sendEvent('step', { step: 'x', status: 'in_progress' })
          try {
            xPost = await generateXPost(topic, blogSummary, claudeApiKey)
            sendEvent('step', { step: 'x', status: 'complete' })
          } catch (err: any) {
            sendEvent('step', { step: 'x', status: 'error' })
            throw new Error(`X post generation failed: ${err.message}`)
          }
        } else {
          sendEvent('step', { step: 'x', status: 'complete' })
        }

        // Step 3: Generate LinkedIn post
        let linkedinPost: string | null = null
        if (platforms.includes('linkedin')) {
          sendEvent('step', { step: 'linkedin', status: 'in_progress' })
          try {
            linkedinPost = await generateLinkedInPost(topic, blogSummary, claudeApiKey)
            sendEvent('step', { step: 'linkedin', status: 'complete' })
          } catch (err: any) {
            sendEvent('step', { step: 'linkedin', status: 'error' })
            throw new Error(`LinkedIn post generation failed: ${err.message}`)
          }
        } else {
          sendEvent('step', { step: 'linkedin', status: 'complete' })
        }

        // Step 4: Generate image with Nano Banana Pro
        sendEvent('step', { step: 'image', status: 'in_progress' })
        let imageUrl: string
        try {
          imageUrl = await generateImage(topic, blogTitle, googleKey)
          sendEvent('step', { step: 'image', status: 'complete' })
        } catch (err: any) {
          sendEvent('step', { step: 'image', status: 'error' })
          throw new Error(`Image generation failed: ${err.message}`)
        }

        // Send final results
        sendEvent('complete', {
          success: true,
          contentId: `content_${Date.now()}`,
          results: {
            blog: blogPost,
            x: xPost || undefined,
            linkedin: linkedinPost || undefined,
            image: imageUrl,
          },
        })

      } catch (error: any) {
        console.error('Content generation error:', error)
        sendEvent('error', { error: error.message || 'Failed to generate content' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
