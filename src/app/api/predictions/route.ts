import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For now, return empty array
    // TODO: Implement actual database queries
    const predictions = [];

    return NextResponse.json({
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
