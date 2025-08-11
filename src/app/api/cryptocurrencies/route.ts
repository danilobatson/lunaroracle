import { NextRequest, NextResponse } from 'next/server';
import { createLunarCrushService } from '@/lib/lunarcrush';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const sort = searchParams.get('sort') || 'market_cap';

    console.log(`Cryptocurrencies route called with limit: ${limit}, sort: ${sort}`);

    const lunarCrush = createLunarCrushService();
    const result = await lunarCrush.getCryptocurrencies({ limit, sort });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Cryptocurrencies route error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cryptocurrencies',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
