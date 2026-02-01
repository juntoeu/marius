import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  systemPrompt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, systemPrompt } = body;

    if (!messages || !systemPrompt) {
      return NextResponse.json(
        { error: 'Missing messages or systemPrompt' },
        { status: 400 }
      );
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      temperature: 0.7,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    // Extract text from response
    const textContent = response.content.find((block) => block.type === 'text');
    const text = textContent && 'text' in textContent ? textContent.text : '';

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
