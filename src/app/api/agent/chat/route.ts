import { NextRequest, NextResponse } from 'next/server';
import { LunarCrushService } from '@/lib/lunarcrush';
import { GeminiService } from '@/lib/gemini';
import { getDatabase } from '@/lib/get-database';
import { generateAgentResponse } from '@/lib/prediction-engine';

interface ChatRequest {
  message: string;
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest;
    const { message, userId } = body;
    
    // Extract crypto symbol from message (simple approach)
    const cryptoRegex = /\b(bitcoin|btc|ethereum|eth|solana|sol|cardano|ada|xrp|ripple|dogecoin|doge)\b/i;
    const match = message.match(cryptoRegex);
    const cryptoSymbol = match ? match[1].toLowerCase() : undefined;
    
    // Initialize services
    const lunarCrush = new LunarCrushService(process.env.LUNARCRUSH_API_KEY!);
    const gemini = new GeminiService(process.env.GEMINI_API_KEY!);
    const database = getDatabase();
    
    // Generate intelligent agent response
    const responseText = await generateAgentResponse(message, lunarCrush, gemini, database, cryptoSymbol);
    
    const response = {
      message: responseText,
      confidence: 85,
      emoji: '🔮',
      timestamp: new Date()
    };
    
    // Store interaction
    await database.storeAgentInteraction(userId, message, response.message, response.confidence);
    
    // Cleanup
    await lunarCrush.close();
    
    return NextResponse.json({ success: true, data: response });
  } catch (error: unknown) {
    console.error('Error processing agent chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process chat',
        message: errorMessage
      },
      { status: 500 }
    );
  }
}
