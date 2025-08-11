import { NextRequest, NextResponse } from 'next/server';

interface Prediction {
  id: string;
  symbol: string;
  prediction: string;
  confidence: number;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  try {
    // For now, return empty array with proper typing
    // TODO: Implement actual database queries when database is set up
    const predictions: Prediction[] = [];

    return NextResponse.json({
      success: true,
      predictions,
      count: predictions.length,
      timestamp: new Date().toISOString(),
      status: 'mock_data'
    });

  } catch (error) {
    console.error('Predictions route error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch predictions',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
