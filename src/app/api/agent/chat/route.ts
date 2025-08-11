import { NextRequest, NextResponse } from 'next/server';
import { createGeminiService } from '@/lib/gemini';
import { createLunarCrushService } from '@/lib/lunarcrush';

interface ChatRequest {
  message: string;
  userId?: string;
}

interface ChatResponse {
  response: string;
  userId: string;
  timestamp: string;
  source: 'ai_agent';
  contextUsed?: any;
}

export async function POST(request: NextRequest) {
  let requestBody: ChatRequest | null = null;

  try {
    requestBody = await request.json();

    // Add null check before destructuring
    if (!requestBody) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { message, userId } = requestBody;

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      );
    }

    console.log(`💬 Agent chat request from ${userId || 'anonymous'}: ${message}`);

    // Create AI services
    const gemini = createGeminiService();
    const lunarCrush = createLunarCrushService();

    // Try to get some crypto context for better responses
    let cryptoContext = null;
    try {
      // Get top cryptocurrencies for context
      const cryptoData = await lunarCrush.getCryptocurrencies({ limit: 5 });
      if (cryptoData.success && cryptoData.data && Array.isArray(cryptoData.data)) {
        // Filter out null values and ensure we have valid crypto objects
        const validCryptos = cryptoData.data
          .filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined && !!c.name && !!c.symbol)
          .map(c => `${c.name} (${c.symbol})`)
          .join(', ');

        if (validCryptos.length > 0) {
          cryptoContext = {
            topCryptos: validCryptos,
            marketSentiment: 'based on current data'
          };
        }
      }
    } catch (contextError) {
      console.warn('Could not fetch crypto context for chat:', contextError);
    }

    // Generate AI response using Gemini
    const aiResponse = await gemini.generateChatResponse(message, cryptoContext);

    console.log(`🤖 AI response generated for user message`);

    const response: ChatResponse = {
      response: aiResponse,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      source: 'ai_agent',
      contextUsed: cryptoContext ? 'crypto_market_data' : 'general_knowledge'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Agent chat route error:', error);

    // Fallback response if AI fails
    const fallbackResponse: ChatResponse = {
      response: `I apologize, but I'm experiencing technical difficulties right now. I'm LunarOracle, your crypto analysis AI, and I'd love to help you with cryptocurrency insights. Please try your question again in a moment.`,
      userId: requestBody?.userId || 'anonymous',
      timestamp: new Date().toISOString(),
      source: 'ai_agent'
    };

    return NextResponse.json(fallbackResponse);
  }
}
