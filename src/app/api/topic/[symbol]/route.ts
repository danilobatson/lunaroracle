import { NextRequest, NextResponse } from 'next/server';
import { createLunarCrushService } from '@/lib/lunarcrush';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;

    console.log(`Topic route called for symbol: ${symbol}`);

    // Create LunarCrush service with API key from environment
    const lunarCrush = createLunarCrushService();

    // Get topic data using the SDK
    const result = await lunarCrush.getTopic(symbol);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Topic route error:', error);

    // Return detailed error information
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch topic data',
        message: error instanceof Error ? error.message : 'Unknown error',
        symbol: params.symbol,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
