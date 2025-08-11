import { NextRequest, NextResponse } from 'next/server';
import { createPredictionEngine } from '@/lib/prediction-engine';

interface PredictionRequest {
  cryptoSymbol: string;
  timeframe?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();
    const { cryptoSymbol, timeframe } = body;

    if (!cryptoSymbol) {
      return NextResponse.json(
        { error: 'cryptoSymbol is required' },
        { status: 400 }
      );
    }

    console.log(`Predict route called for ${cryptoSymbol}`);

    // Create prediction engine and generate prediction
    const predictionEngine = createPredictionEngine();
    const prediction = await predictionEngine.generatePrediction({
      cryptoSymbol,
      timeframe: timeframe || 24
    });

    return NextResponse.json({
      success: true,
      prediction,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Predict route error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate prediction',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
