import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface FeedbackRequest {
  transcript: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();
    const { transcript } = body;

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty transcript' },
        { status: 400 }
      );
    }

    // Build the prompt with the transcript
    const prompt = DEFAULT_SCENARIO.feedbackSystemPrompt.replace('{transcript}', transcript);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find((block) => block.type === 'text');
    const text = textContent && 'text' in textContent ? textContent.text : '';

    // Parse JSON response
    try {
      // Clean the response - remove any potential markdown code blocks
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7);
      }
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();

      const feedback = JSON.parse(cleanedText);
      return NextResponse.json(feedback);
    } catch {
      console.error('Failed to parse feedback JSON:', text);
      return NextResponse.json(
        { error: 'Failed to parse feedback response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
}
