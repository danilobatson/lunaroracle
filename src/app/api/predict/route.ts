import { NextRequest, NextResponse } from 'next/server';
import { LunarCrushService } from '@/lib/lunarcrush';
import { GeminiService } from '@/lib/gemini';
import { getDatabase } from '@/lib/get-database';
import { generatePrediction } from '@/lib/prediction-engine';

interface PredictRequest {
  cryptoSymbol: string;
  timeframe: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PredictRequest;
    const { cryptoSymbol, timeframe } = body;
    
    // Initialize services
    const lunarCrush = new LunarCrushService(process.env.LUNARCRUSH_API_KEY!);
    const gemini = new GeminiService(process.env.GEMINI_API_KEY!);
    const database = getDatabase();
    
    // Generate prediction using LLM-powered analysis
    const prediction = await generatePrediction(cryptoSymbol, timeframe, lunarCrush, gemini, database);
    
    // Cleanup
    await lunarCrush.close();
    
    return NextResponse.json({ success: true, data: prediction });
  } catch (error: unknown) {
    console.error('Error generating prediction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate prediction',
        message: errorMessage
      },
      { status: 500 }
    );
  }
}
